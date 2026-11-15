/*
 * Música e efeitos procedurais com Web Audio API.
 * Nenhum arquivo de áudio de terceiros: tudo é sintetizado em tempo real.
 *
 * Arquitetura:
 *   vozes (osciladores e ruído com envelope) -> entrada da música -> [filtro lo-fi] -> fade
 *     -> barramento de música -> compressor -> master -> limitador -> saída
 *   fade -> envio de reverb -> convolver (impulso gerado) -> barramento de música
 *   efeitos -> barramento de efeitos -> compressor
 *
 * As notas são agendadas no relógio do AudioContext por um agendador com
 * antecipação (lookahead). O temporizador só acorda o agendador; nenhuma nota
 * depende da precisão dele.
 */

type CtorAudio = typeof AudioContext;

const FADE = 1.5; // segundos de crossfade
const ANTECIPACAO = 0.15; // janela de agendamento com a aba visível
const ANTECIPACAO_OCULTA = 1.2; // timers são estrangulados com a aba oculta
const ACORDA_MS = 25;
const BASE_MUSICA = 0.3; // música baixa o bastante para leitura
const BASE_EFEITOS = 0.7;

const midiHz = (n: number): number => 440 * Math.pow(2, (n - 69) / 12);

/* ---------- aleatoriedade determinística (para frases que se repetem) ---------- */

function rngDe(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(...partes: (number | string)[]): number {
  let h = 2166136261;
  for (const p of partes) {
    const s = String(p);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= 0x9e;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ---------- teoria: acordes e escalas ---------- */

interface Acorde {
  raiz: number; // classe de altura 0..11
  int: number[];
  baixo: number;
}

const NOTAS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const QUAL: Record<string, number[]> = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '7': [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  dim: [0, 3, 6],
  sus4: [0, 5, 7],
  '9': [0, 4, 7, 10, 14],
  m9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  '13': [0, 4, 10, 14, 21],
  m6: [0, 3, 7, 9],
  '6': [0, 4, 7, 9],
};

const cacheAcordes = new Map<string, Acorde>();

function acorde(nome: string): Acorde {
  const c = cacheAcordes.get(nome);
  if (c) return c;
  const m = /^([A-G])([#b]?)([^/]*)(?:\/([A-G])([#b]?))?$/.exec(nome);
  if (!m) throw new Error('acorde inválido: ' + nome);
  const pc = (l: string, ac: string | undefined): number =>
    (NOTAS[l] + (ac === '#' ? 1 : ac === 'b' ? -1 : 0) + 12) % 12;
  const int = QUAL[m[3]];
  if (!int) throw new Error('qualidade de acorde desconhecida: ' + nome);
  const raiz = pc(m[1], m[2]);
  const a: Acorde = { raiz, int, baixo: m[4] ? pc(m[4], m[5]) : raiz };
  cacheAcordes.set(nome, a);
  return a;
}

/** acorde em posição fechada a partir de `base` (midi) */
function voz(a: Acorde, base: number): number[] {
  const r = base + (((a.raiz - base) % 12) + 12) % 12;
  return a.int.map((i) => r + i);
}

/** nota do baixo do acorde a partir de `base` */
function bx(a: Acorde, base: number): number {
  return base + (((a.baixo - base) % 12) + 12) % 12;
}

const MAIOR = [0, 2, 4, 5, 7, 9, 11];
const MENOR = [0, 2, 3, 5, 7, 8, 10];
const MIXO = [0, 2, 4, 5, 7, 9, 10];
const DORICO = [0, 2, 3, 5, 7, 9, 10];
const HUNGARA = [0, 2, 3, 6, 7, 8, 11];

function escala(tonica: number, int: number[], lo: number, hi: number): number[] {
  const r: number[] = [];
  for (let n = lo; n <= hi; n++) if (int.includes((((n - tonica) % 12) + 12) % 12)) r.push(n);
  return r;
}

/* ---------- envelopes ---------- */

/** ataque curto e decaimento exponencial; devolve o instante de parada */
function perc(p: AudioParam, t: number, v: number, dec: number, ataque = 0.004): number {
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(v, t + ataque);
  p.exponentialRampToValueAtTime(0.0001, t + ataque + dec);
  p.linearRampToValueAtTime(0, t + ataque + dec + 0.01);
  return t + ataque + dec + 0.02;
}

/** ataque, sustentação e soltura com rampas; devolve o instante de parada */
function sust(p: AudioParam, t: number, v: number, ataque: number, nivel: number, dur: number, rel: number): number {
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(v, t + ataque);
  const tf = Math.max(t + ataque + 0.01, t + dur);
  if (nivel !== 1) p.setTargetAtTime(v * nivel, t + ataque, Math.max(0.02, (tf - t - ataque) / 3));
  p.setTargetAtTime(0, tf, rel / 6);
  return tf + rel;
}

/* ---------- síntese ---------- */

class Sintese {
  /** destino das vozes criadas a seguir (trocado pelo agendador e pelos efeitos) */
  dest: AudioNode;
  /** notas agendadas desde o início (instrumentação) */
  notas = 0;
  /** fontes ainda vivas (instrumentação de vazamento) */
  vivos = 0;
  private readonly ruidoBuf: AudioBuffer;
  private readonly temPan: boolean;

  constructor(readonly ctx: AudioContext) {
    this.dest = ctx.destination;
    const n = Math.floor(ctx.sampleRate * 2);
    this.ruidoBuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = this.ruidoBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    this.temPan = typeof ctx.createStereoPanner === 'function';
  }

  /** ao fim da última fonte, desconecta todos os nós da voz */
  private liga(fontes: AudioScheduledSourceNode[], nos: AudioNode[]): void {
    let resta = fontes.length;
    this.vivos += fontes.length;
    this.notas++;
    for (const f of fontes) {
      f.onended = () => {
        f.onended = null;
        f.disconnect();
        this.vivos--;
        if (--resta === 0) for (const n of nos) n.disconnect();
      };
    }
  }

  private saida(no: AudioNode, pan: number, nos: AudioNode[]): void {
    if (pan && this.temPan) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      no.connect(p);
      p.connect(this.dest);
      nos.push(p);
    } else no.connect(this.dest);
  }

  private ganho(nos: AudioNode[]): GainNode {
    const g = this.ctx.createGain();
    g.gain.value = 0;
    nos.push(g);
    return g;
  }

  private filtro(nos: AudioNode[], tipo: BiquadFilterType, f: number, q = 0.7): BiquadFilterNode {
    const b = this.ctx.createBiquadFilter();
    b.type = tipo;
    b.frequency.value = f;
    b.Q.value = q;
    nos.push(b);
    return b;
  }

  private osc(tipo: OscillatorType, f: number, t: number, fim: number, destino: AudioNode | AudioParam, detune = 0): OscillatorNode {
    const o = this.ctx.createOscillator();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t);
    if (detune) o.detune.setValueAtTime(detune, t);
    o.connect(destino as AudioNode);
    o.start(t);
    o.stop(fim);
    return o;
  }

  private ruido(t: number, fim: number, destino: AudioNode): AudioBufferSourceNode {
    const s = this.ctx.createBufferSource();
    s.buffer = this.ruidoBuf;
    s.loop = true;
    s.connect(destino);
    s.start(t, Math.random() * 1.8);
    s.stop(fim);
    return s;
  }

  /* --- instrumentos melódicos --- */

  /** corda dedilhada (violão, viola) */
  pluck(t: number, n: number, dur: number, v: number, brilho = 2500, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', brilho, 1.2);
    lp.frequency.setValueAtTime(brilho, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(180, f * 1.5), t + 0.35);
    lp.connect(g);
    this.saida(g, pan, nos);
    const fim = perc(g.gain, t, v, Math.min(2.2, 0.3 + dur), 0.003);
    this.liga([this.osc('sawtooth', f, t, fim, lp), this.osc('triangle', f, t, fim, lp, 7)], nos);
  }

  /** caixinha de música */
  caixinha(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const g2 = this.ganho(nos);
    this.saida(g, pan, nos);
    g2.connect(g);
    const fim = perc(g.gain, t, v, Math.min(1.6, 0.6 + dur), 0.002);
    perc(g2.gain, t, 0.35, 0.18, 0.002);
    this.liga([this.osc('sine', f, t, fim, g), this.osc('sine', f * 3, t, fim, g2)], nos);
  }

  piano(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', 3200, 0.5);
    lp.frequency.setValueAtTime(3200, t);
    lp.frequency.setTargetAtTime(Math.max(400, f * 2.5), t, 0.4);
    lp.connect(g);
    this.saida(g, pan, nos);
    const tau = 0.45 + Math.max(0, 84 - n) / 50;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.005);
    g.gain.setTargetAtTime(0, t + 0.005, tau);
    const tf = t + Math.max(0.05, dur);
    g.gain.setTargetAtTime(0, tf, 0.09);
    const fim = tf + 0.6;
    this.liga([this.osc('sine', f, t, fim, lp), this.osc('triangle', f, t, fim, lp, 3)], nos);
  }

  /** sanfona: duas palhetas levemente desafinadas (musette) */
  sanfona(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', 2200, 0.8);
    lp.connect(g);
    this.saida(g, pan, nos);
    const fim = sust(g.gain, t, v, 0.03, 0.85, dur, 0.08);
    this.liga([this.osc('sawtooth', f, t, fim, lp, -9), this.osc('sawtooth', f, t, fim, lp, 9), this.osc('square', f / 2, t, fim, lp)], nos);
  }

  pad(t: number, n: number, dur: number, v: number, corte = 900, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', corte, 0.5);
    lp.connect(g);
    this.saida(g, pan, nos);
    const fim = sust(g.gain, t, v, Math.min(0.5, dur * 0.4), 1, dur, 1.0);
    this.liga([this.osc('sawtooth', f, t, fim, lp, -12), this.osc('sawtooth', f, t, fim, lp, 12)], nos);
  }

  baixo(t: number, n: number, dur: number, v: number): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', 650, 0.7);
    lp.connect(g);
    this.saida(g, 0, nos);
    const fim = sust(g.gain, t, v, 0.006, 0.6, dur, 0.07);
    this.liga([this.osc('triangle', f, t, fim, lp), this.osc('sine', f, t, fim, lp)], nos);
  }

  baixoSynth(t: number, n: number, dur: number, v: number, corte = 900): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', corte, 4);
    lp.frequency.setValueAtTime(corte, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(120, corte * 0.25), t + Math.max(0.08, dur));
    lp.connect(g);
    this.saida(g, 0, nos);
    const fim = sust(g.gain, t, v, 0.005, 0.7, dur, 0.05);
    this.liga([this.osc('sawtooth', f, t, fim, lp), this.osc('sine', f / 2, t, fim, g)], nos);
  }

  lead(t: number, n: number, dur: number, v: number, tipo: OscillatorType = 'square', pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', 2600, 1);
    lp.connect(g);
    this.saida(g, pan, nos);
    const fim = sust(g.gain, t, v, 0.008, 0.7, dur, 0.08);
    this.liga([this.osc(tipo, f, t, fim, lp)], nos);
  }

  metais(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', 300, 1.5);
    lp.frequency.setValueAtTime(300, t);
    lp.frequency.linearRampToValueAtTime(2600, t + 0.06);
    lp.frequency.setTargetAtTime(1500, t + 0.06, 0.15);
    lp.connect(g);
    this.saida(g, pan, nos);
    const fim = sust(g.gain, t, v, 0.04, 0.8, dur, 0.12);
    this.liga([this.osc('sawtooth', f, t, fim, lp, -6), this.osc('sawtooth', f, t, fim, lp, 6)], nos);
  }

  /** piano elétrico por FM */
  eletrico(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    this.saida(g, pan, nos);
    const mg = this.ctx.createGain();
    nos.push(mg);
    mg.gain.setValueAtTime(f * 2.2, t);
    mg.gain.setTargetAtTime(f * 0.25, t, 0.25);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.005);
    g.gain.setTargetAtTime(v * 0.25, t + 0.005, 0.6);
    const tf = t + Math.max(0.05, dur);
    g.gain.setTargetAtTime(0, tf, 0.1);
    const fim = tf + 0.65;
    const car = this.osc('sine', f, t, fim, g);
    const mod = this.osc('sine', f, t, fim, mg);
    mg.connect(car.frequency);
    this.liga([car, mod], nos);
  }

  /** sino FM, inarmônico */
  sino(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    this.saida(g, pan, nos);
    const mg = this.ctx.createGain();
    nos.push(mg);
    mg.gain.setValueAtTime(f * 3, t);
    mg.gain.setTargetAtTime(f * 0.2, t, 0.7);
    const fim = perc(g.gain, t, v, Math.min(3.5, 1.8 + dur), 0.003);
    const car = this.osc('sine', f, t, fim, g);
    const mod = this.osc('sine', f * 3.5, t, fim, mg);
    mg.connect(car.frequency);
    this.liga([car, mod], nos);
  }

  /** flauta ou assobio, com vibrato que entra devagar */
  flauta(t: number, n: number, dur: number, v: number, pan = 0): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    this.saida(g, pan, nos);
    const lg = this.ctx.createGain();
    nos.push(lg);
    lg.gain.setValueAtTime(0, t);
    lg.gain.linearRampToValueAtTime(f * 0.008, t + 0.3);
    const fim = sust(g.gain, t, v, 0.06, 0.9, dur, 0.12);
    const o = this.osc('sine', f, t, fim, g);
    const lfo = this.osc('sine', 5.2, t, fim, lg);
    lg.connect(o.frequency);
    this.liga([o, lfo], nos);
  }

  /* --- percussão --- */

  bumbo(t: number, v: number, grave = 1): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    this.saida(g, 0, nos);
    const fim = perc(g.gain, t, v, 0.35, 0.002);
    const o = this.osc('sine', 160 * grave, t, fim, g);
    o.frequency.exponentialRampToValueAtTime(42 * grave, t + 0.12);
    this.liga([o], nos);
  }

  caixa(t: number, v: number, abafada = false): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const g2 = this.ganho(nos);
    const hp = this.filtro(nos, 'highpass', abafada ? 1200 : 1800, 0.7);
    hp.connect(g);
    this.saida(g, 0, nos);
    this.saida(g2, 0, nos);
    const fim = perc(g.gain, t, v, abafada ? 0.09 : 0.16, 0.002);
    perc(g2.gain, t, v * 0.6, 0.07, 0.002);
    const o = this.osc('triangle', 200, t, fim, g2);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.07);
    this.liga([this.ruido(t, fim, hp), o], nos);
  }

  chimbal(t: number, v: number, aberto = false, pan = 0.2): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const hp = this.filtro(nos, 'highpass', 7500, 0.8);
    hp.connect(g);
    this.saida(g, pan, nos);
    const fim = perc(g.gain, t, v, aberto ? 0.25 : 0.035, 0.001);
    this.liga([this.ruido(t, fim, hp)], nos);
  }

  zabumba(t: number, v: number): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const g2 = this.ganho(nos);
    const lp = this.filtro(nos, 'lowpass', 700, 0.7);
    lp.connect(g2);
    this.saida(g, 0, nos);
    this.saida(g2, 0, nos);
    const fim = perc(g.gain, t, v, 0.42, 0.002);
    perc(g2.gain, t, v * 0.35, 0.05, 0.001);
    const o = this.osc('sine', 115, t, fim, g);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.15);
    this.liga([o, this.ruido(t, fim, lp)], nos);
  }

  /** baqueta fina no aro da zabumba */
  bacalhau(t: number, v: number): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const bp = this.filtro(nos, 'bandpass', 3500, 1.5);
    bp.connect(g);
    this.saida(g, -0.15, nos);
    const fim = perc(g.gain, t, v, 0.035, 0.001);
    this.liga([this.ruido(t, fim, bp), this.osc('triangle', 900, t, fim, g)], nos);
  }

  triangulo(t: number, v: number, aberto = false): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    this.saida(g, 0.35, nos);
    const fim = perc(g.gain, t, v, aberto ? 0.5 : 0.08, 0.001);
    this.liga([this.osc('sine', 1250, t, fim, g), this.osc('sine', 3375, t, fim, g), this.osc('sine', 6375, t, fim, g)], nos);
  }

  chocalho(t: number, v: number): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const hp = this.filtro(nos, 'highpass', 5000, 0.7);
    hp.connect(g);
    this.saida(g, -0.3, nos);
    const fim = perc(g.gain, t, v, 0.06, 0.012);
    this.liga([this.ruido(t, fim, hp)], nos);
  }

  palma(t: number, v: number): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const bp = this.filtro(nos, 'bandpass', 1300, 1.1);
    bp.connect(g);
    this.saida(g, 0, nos);
    g.gain.setValueAtTime(0, t);
    for (let i = 0; i < 3; i++) {
      g.gain.linearRampToValueAtTime(v, t + i * 0.011 + 0.002);
      g.gain.linearRampToValueAtTime(v * 0.2, t + i * 0.011 + 0.009);
    }
    g.gain.linearRampToValueAtTime(v * 0.8, t + 0.036);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    g.gain.linearRampToValueAtTime(0, t + 0.17);
    this.liga([this.ruido(t, t + 0.18, bp)], nos);
  }

  tom(t: number, n: number, v: number): void {
    const nos: AudioNode[] = [];
    const f = midiHz(n);
    const g = this.ganho(nos);
    this.saida(g, 0, nos);
    const fim = perc(g.gain, t, v, 0.45, 0.002);
    const o = this.osc('sine', f * 1.5, t, fim, g);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.1);
    this.liga([o], nos);
  }

  /** estalo de vinil */
  estalo(t: number, v: number): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const hp = this.filtro(nos, 'highpass', 2500, 0.7);
    hp.connect(g);
    this.saida(g, Math.random() - 0.5, nos);
    const fim = perc(g.gain, t, v, 0.004, 0.0005);
    this.liga([this.ruido(t, fim, hp)], nos);
  }

  /* --- primitivas para efeitos --- */

  bip(t: number, f: number, dur: number, v: number, tipo: OscillatorType = 'sine', f2 = 0, ataque = 0.004, corte = 0, pan = 0): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    this.saida(g, pan, nos);
    let alvo: AudioNode = g;
    if (corte) {
      const lp = this.filtro(nos, 'lowpass', corte, 0.7);
      lp.connect(g);
      alvo = lp;
    }
    const fim = perc(g.gain, t, v, dur, ataque);
    const o = this.osc(tipo, f, t, fim, alvo);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + ataque + dur);
    this.liga([o], nos);
  }

  chiado(t: number, dur: number, v: number, tipo: BiquadFilterType, f: number, f2 = 0, q = 0.8): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    const fl = this.filtro(nos, tipo, f, q);
    if (f2) {
      fl.frequency.setValueAtTime(f, t);
      fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    }
    fl.connect(g);
    this.saida(g, 0, nos);
    const fim = sust(g.gain, t, v, Math.min(0.02, dur / 3), 0.6, dur, Math.min(0.08, dur / 2));
    this.liga([this.ruido(t, fim, fl)], nos);
  }

  /** tom com curva de frequência arbitrária, envelope sustentado */
  varredura(t: number, tipo: OscillatorType, valores: number[], dur: number, v: number, fTipo?: BiquadFilterType, ff = 1000, q = 1): void {
    const nos: AudioNode[] = [];
    const g = this.ganho(nos);
    this.saida(g, 0, nos);
    let alvo: AudioNode = g;
    if (fTipo) {
      const fl = this.filtro(nos, fTipo, ff, q);
      fl.connect(g);
      alvo = fl;
    }
    const fim = sust(g.gain, t, v, 0.01, 1, dur, 0.04);
    const o = this.ctx.createOscillator();
    o.type = tipo;
    o.frequency.setValueAtTime(valores[0], t);
    if (valores.length > 1) o.frequency.setValueCurveAtTime(new Float32Array(valores), t, dur);
    o.connect(alvo);
    o.start(t);
    o.stop(fim + 0.01);
    this.liga([o], nos);
  }
}

/* ---------- motor de composição ---------- */

interface Nota {
  s: number;
  n: number;
  len: number;
}

interface MemFrase {
  c: number;
  volta: number;
  notas: Nota[];
  ult: number;
}

interface Passo {
  t: number; // instante da nota (com swing)
  s: number; // passo dentro do compasso
  c: number; // compasso dentro do loop
  volta: number; // quantas vezes o loop já repetiu
  d: number; // duração de um passo (s)
  a: Acorde; // acorde do compasso
  fr: number; // compasso dentro da frase de 4
  secao: number; // índice da frase
  tipo: number; // 0 = parte A, 1 = parte B, 2 = parte C
  passos: number;
  mem: Record<string, MemFrase>;
  r: () => number;
}

interface Def {
  nome: string;
  bpm: number;
  compassos: number;
  prog: string[];
  passos?: number; // 16 (4/4 em semicolcheias) por padrão; 12 = 3/4
  swing?: number;
  reverb: number;
  ganho: number;
  corte?: number; // filtro lo-fi
  passo(x: Sintese, p: Passo): void;
}

/** gera as notas de um compasso a partir de semente, ritmo e acorde */
function frase(seed: number, ritmo: number[], passos: number, a: Acorde, pool: number[], ult: number, final: boolean): Nota[] {
  const r = rngDe(seed);
  const pcs = a.int.map((i) => (a.raiz + i) % 12);
  const meio = pool[pool.length >> 1];
  const out: Nota[] = [];
  let cur = ult;
  for (let k = 0; k < ritmo.length; k++) {
    const s = ritmo[k];
    const len = (k + 1 < ritmo.length ? ritmo[k + 1] : passos) - s;
    const ultima = final && k === ritmo.length - 1;
    let n: number;
    if (s % 4 === 0 || ultima || r() < 0.35) {
      const alvo = cur + Math.round((r() - 0.5) * 7) + (meio - cur) * 0.25;
      let cand = pool.filter((p) => (ultima ? p % 12 === a.raiz : pcs.includes(p % 12)));
      if (!cand.length) cand = pool;
      n = cand[0];
      for (const p of cand) if (Math.abs(p - alvo) < Math.abs(n - alvo)) n = p;
    } else {
      let i = 0;
      for (let j = 0; j < pool.length; j++) if (Math.abs(pool[j] - cur) < Math.abs(pool[i] - cur)) i = j;
      const desce = r() < (cur > meio ? 0.65 : 0.35);
      i += (r() < 0.65 ? 1 : 2) * (desce ? -1 : 1);
      n = pool[Math.max(0, Math.min(pool.length - 1, i))];
    }
    out.push({ s, n, len });
    cur = n;
  }
  return out;
}

/**
 * Melodia com forma: as frases A se repetem (identidade), a segunda A muda o
 * final, a B é outra ideia, e voltas ímpares do loop variam finais e a B.
 */
function mel(p: Passo, id: string, pool: number[], ritmos: number[][]): Nota | undefined {
  let m = p.mem[id];
  if (!m || m.c !== p.c || m.volta !== p.volta) {
    const ult = p.fr === 0 || !m ? pool[pool.length >> 1] : m.ult;
    const final = p.fr === 3;
    const variacao = (p.secao % 4 === 1 && p.fr >= 2 ? 1 : 0) + (p.volta % 2 === 1 && (p.fr === 3 || p.tipo === 1) ? 2 : 0);
    const seed = hash(id, p.tipo, p.fr, variacao);
    const rr = rngDe(seed ^ 0x5bd1e995);
    let ritmo = ritmos[Math.floor(rr() * ritmos.length)];
    if (final) ritmo = ritmo.slice(0, Math.max(1, Math.ceil(ritmo.length / 2)));
    const notas = frase(seed, ritmo, p.passos, p.a, pool, ult, final);
    m = { c: p.c, volta: p.volta, notas, ult: notas.length ? notas[notas.length - 1].n : ult };
    p.mem[id] = m;
  }
  return m.notas.find((x) => x.s === p.s);
}

/* ritmos de melodia (inícios de nota em semicolcheias) */
const RIT3 = [[0, 4, 8], [0, 6, 8, 10], [0, 4, 6, 8], [0, 8], [0, 2, 4, 8]];
const RIT_LENTO = [[0, 8], [0, 12], [0, 4, 8], [0, 6, 8], [0, 8, 12], [0]];
const RIT_MEDIO = [[0, 4, 8, 12], [0, 6, 8, 12], [0, 4, 6, 8], [0, 3, 4, 8, 12], [0, 8, 10, 12]];
const RIT_VIVO = [[0, 2, 4, 8, 10, 12], [0, 3, 6, 8, 12, 14], [0, 4, 6, 8, 12], [0, 2, 4, 6, 8], [0, 6, 8, 10, 12]];
const RIT_FORRO = [[0, 3, 4, 6, 8, 12], [0, 2, 4, 6, 8, 11, 12], [0, 3, 6, 8, 10, 12], [0, 4, 6, 8, 12, 14]];
const RIT_ESPARSO = [[0], [4], [0, 6], [8, 12], [2, 8]];
const RIT_FANFARRA = [[0, 3, 4, 8], [0, 4, 6, 8, 12], [0, 8, 12], [0, 2, 4, 6, 8]];

const POOL_INF = escala(0, MAIOR, 72, 91);
const POOL_INT = escala(7, MIXO, 62, 81);
const POOL_TEN = escala(2, MENOR, 74, 89);
const POOL_MIS = escala(4, HUNGARA, 64, 88);
const POOL_TRI = escala(9, MENOR, 64, 84);
const POOL_ALE = escala(2, MAIOR, 74, 93);
const POOL_ROM = escala(5, MAIOR, 65, 84);
const POOL_CID = escala(2, DORICO, 67, 84);
const POOL_TRA = escala(3, MAIOR, 67, 82);
const POOL_HAC = escala(9, MENOR, 69, 88);
const POOL_FES = escala(0, MIXO, 67, 86);
const POOL_VIT = escala(0, MAIOR, 67, 86);
const POOL_BOM = escala(7, MAIOR, 74, 91);
const POOL_RUI = escala(0, MENOR, 60, 79);
const POOL_MEN = escala(9, DORICO, 69, 88);

/** padrão de baião em meio compasso de 8 semicolcheias: 0, 3 e 6 */
const baiao = (s: number): number => {
  const h = s % 8;
  return h === 0 ? 0 : h === 3 ? 1 : h === 6 ? 2 : -1;
};

/** triângulo de forró: tin tin TIN tin */
function trianguloForro(x: Sintese, p: Passo, v: number): void {
  const k = p.s % 4;
  x.triangulo(p.t, k === 2 ? v * 1.4 : k === 0 ? v : v * 0.7, k === 2);
}

const DEFS: Record<string, Def> = {
  infancia: {
    nome: 'Infância',
    bpm: 88,
    passos: 12,
    compassos: 16,
    reverb: 0.35,
    ganho: 1,
    prog: ['C', 'Am', 'F', 'G', 'C', 'Em', 'F', 'G7', 'Am', 'Em', 'F', 'C', 'F', 'G7', 'C', 'C'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s === 0) x.pluck(t, bx(a, 40), d * 12, 0.3, 1200, -0.1);
      else if (s % 2 === 0) {
        const v = voz(a, 55);
        const arp = [0, v[0], v[1], v[2], v[0] + 12, v[2]];
        x.pluck(t, arp[s / 2], d * 4, 0.13, 2200, (s / 2) % 2 ? -0.25 : 0.2);
      }
      const m = mel(p, 'inf', POOL_INF, RIT3);
      if (m) {
        if (p.tipo === 1) x.flauta(t, m.n - 12, m.len * d * 0.95, 0.1, 0.1);
        else x.caixinha(t, m.n, m.len * d, 0.18, 0.15);
      }
      if (p.volta % 2 === 1 && p.tipo === 0 && s === 6) x.caixinha(t, voz(a, 79)[0], d * 6, 0.07, -0.3);
    },
  },

  interior: {
    nome: 'Interior',
    bpm: 92,
    compassos: 16,
    reverb: 0.22,
    ganho: 1,
    prog: ['G', 'G', 'C', 'D', 'G', 'Em', 'C', 'D7', 'G', 'F', 'G', 'D', 'C', 'D7', 'G', 'G'],
    passo(x, p) {
      const { t, s, d, a } = p;
      const b = baiao(s);
      if (b >= 0) {
        x.baixo(t, b === 2 ? bx(a, 38) + 7 : bx(a, 38), d * 2.5, 0.32);
        x.zabumba(t, b === 0 ? 0.28 : 0.18);
      }
      if (s % 4 === 2) x.bacalhau(t, 0.05);
      if (p.tipo === 1) trianguloForro(x, p, 0.035);
      // viola caipira em terças paralelas (dupla)
      const m = mel(p, p.tipo === 1 ? 'int-b' : 'int', POOL_INT, RIT_MEDIO);
      if (m) {
        const i = POOL_INT.indexOf(m.n);
        const terca = i >= 2 ? POOL_INT[i - 2] : m.n - 12;
        if (p.tipo === 1) {
          x.sanfona(t, m.n, m.len * d * 0.9, 0.06, 0.1);
          x.sanfona(t, terca, m.len * d * 0.9, 0.035, -0.1);
        } else {
          x.pluck(t, m.n, m.len * d, 0.15, 3400, 0.15);
          x.pluck(t + 0.012, terca, m.len * d, 0.1, 3000, -0.15);
        }
      }
      if (p.tipo !== 1 && (s === 4 || s === 12)) for (const n of voz(a, 55)) x.sanfona(t, n, d * 3, 0.022);
    },
  },

  tensao: {
    nome: 'Tensão',
    bpm: 100,
    compassos: 16,
    reverb: 0.3,
    ganho: 1,
    prog: ['Dm', 'Dm', 'Bb', 'A', 'Dm', 'Dm', 'Gm', 'A', 'Bb', 'Bb', 'Gm', 'Gm', 'Eb', 'Eb', 'A', 'A'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s % 2 === 0) x.baixoSynth(t, bx(a, 38) + (s % 8 === 6 ? 12 : 0), d * 1.6, 0.26, 420 + p.secao * 90);
      if (s === 0 || s === 3) x.bumbo(t, s === 0 ? 0.45 : 0.3, 0.8);
      if (p.tipo === 1 && (s === 8 || s === 11)) x.bumbo(t, 0.3, 0.8);
      if (s === 0) for (const n of voz(a, 50)) x.pad(t, n, d * 16, 0.04, 600);
      if (p.secao >= 2 && s % 2 === 1) x.chimbal(t, 0.025);
      if (p.tipo === 1 && s % 4 === 0) {
        const n = a.raiz + 74;
        x.lead(t, n, d * 2, 0.018, 'sawtooth', -0.3);
        x.lead(t + d * 2, n + 1, d * 2, 0.018, 'sawtooth', 0.3);
      }
      if (p.tipo !== 1) {
        const m = mel(p, 'ten', POOL_TEN, RIT_ESPARSO);
        if (m) x.sino(t, m.n, m.len * d, 0.05, 0.3);
      }
      if (p.fr === 3 && (s === 12 || s === 14)) x.tom(t, s === 12 ? 45 : 41, 0.3);
    },
  },

  misterio: {
    nome: 'Mistério',
    bpm: 70,
    compassos: 16,
    reverb: 0.55,
    ganho: 1,
    prog: ['Em', 'Em', 'Cmaj7', 'Cmaj7', 'Am6', 'B7', 'Em', 'Em', 'Cmaj7', 'Am6', 'B7', 'B7', 'Em', 'Cmaj7', 'B7', 'Em'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s === 0 && p.c % 2 === 0) {
        x.pad(t, 40, d * 32, 0.05, 300);
        for (const n of voz(a, 52)) x.pad(t, n, d * 32, 0.03, 550);
      } else if (s === 0) for (const n of voz(a, 52)) x.pad(t, n, d * 16, 0.02, 500);
      const m = mel(p, 'mis', POOL_MIS, RIT_ESPARSO);
      if (m) {
        const pan = (p.r() - 0.5) * 0.8;
        x.sino(t, m.n, m.len * d, 0.09, pan);
        if (p.tipo === 1) x.caixinha(t + d * 3, m.n + 12, d * 4, 0.035, -pan);
      }
      if (p.c % 4 === 3 && s === 12) x.tom(t, 33, 0.18);
      if (p.secao >= 2 && s === 8 && p.c % 2 === 1) x.chimbal(t, 0.02, true, -0.4);
    },
  },

  triste: {
    nome: 'Triste',
    bpm: 62,
    compassos: 16,
    reverb: 0.4,
    ganho: 1,
    prog: ['Am', 'F', 'C', 'G', 'Dm', 'Am', 'E7', 'Am', 'F', 'G', 'Em', 'Am', 'Dm', 'E7', 'Am', 'Am'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s % 4 === 0) {
        const v = voz(a, 52);
        const n = s === 0 ? bx(a, 40) : v[s / 4 - 1];
        x.piano(t, n, d * 8, s === 0 ? 0.22 : 0.12, s === 0 ? -0.15 : 0);
      }
      const m = mel(p, 'tri', POOL_TRI, RIT_LENTO);
      if (m) x.piano(t, m.n, m.len * d * 0.95, 0.2, 0.15);
      if (p.tipo === 1 && s === 0) for (const n of voz(a, 57)) x.pad(t, n, d * 16, 0.025, 800);
    },
  },

  alegre: {
    nome: 'Alegre',
    bpm: 112,
    compassos: 16,
    reverb: 0.18,
    ganho: 1,
    prog: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'D', 'D'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s === 0 || s === 8) x.baixo(t, bx(a, 38), d * 3, 0.32);
      if (s === 6 || s === 12) x.baixo(t, bx(a, 38) + 7, d * 2, 0.24);
      if (s % 4 === 2) for (const n of voz(a, 59)) x.pluck(t, n, d * 1.5, 0.06, 2800, 0.2);
      if (s === 0 || s === 8) x.bumbo(t, 0.3);
      if (s === 4 || s === 12) x.palma(t, 0.12);
      if (s % 2 === 0) x.chocalho(t, s % 4 === 2 ? 0.05 : 0.03);
      const m = mel(p, 'ale', POOL_ALE, RIT_VIVO);
      if (m) {
        if (p.tipo === 1) x.caixinha(t, m.n + 12, m.len * d, 0.09, 0.2);
        else x.flauta(t, m.n, m.len * d * 0.9, 0.09, -0.1);
      }
    },
  },

  romance: {
    nome: 'Romance',
    bpm: 74,
    compassos: 16,
    reverb: 0.35,
    ganho: 1,
    prog: ['Fmaj7', 'Am7', 'Bbmaj7', 'C7', 'Fmaj7', 'Dm7', 'Gm7', 'C7', 'Bbmaj7', 'Am7', 'Gm7', 'C7', 'Fmaj7', 'Dm7', 'Gm7', 'C9'],
    passo(x, p) {
      const { t, s, d, a } = p;
      // violão de bossa: baixo em 1 e 3, acordes sincopados
      if (s === 0) x.pluck(t, bx(a, 41), d * 6, 0.22, 1400, -0.1);
      if (s === 8) x.pluck(t, bx(a, 41) + 7, d * 6, 0.18, 1400, -0.1);
      if (s === 3 || s === 6 || s === 10 || s === 13) {
        const v = voz(a, 57).slice(1, 4);
        for (const n of v) x.pluck(t, n, d * 2, 0.05, 1700, 0.15);
      }
      if (s % 2 === 1) x.chocalho(t, 0.02);
      if (s === 0) for (const n of voz(a, 60)) x.pad(t, n, d * 16, 0.018, 1000);
      const m = mel(p, 'rom', POOL_ROM, RIT_LENTO);
      if (m) {
        if (p.tipo === 1) x.flauta(t, m.n + 12, m.len * d * 0.95, 0.07, 0.15);
        else x.eletrico(t, m.n, m.len * d, 0.15, 0.15);
      }
    },
  },

  cidade: {
    nome: 'Cidade',
    bpm: 84,
    swing: 0.16,
    compassos: 16,
    reverb: 0.2,
    ganho: 1.05,
    corte: 3200,
    prog: ['Dm9', 'G13', 'Cmaj9', 'A7', 'Dm9', 'G13', 'Em7', 'A7'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s === 0) for (const n of voz(a, 53)) x.eletrico(t, n, d * 7, 0.055, -0.1);
      if (s === 10 && p.r() < 0.6) for (const n of voz(a, 53).slice(1)) x.eletrico(t, n, d * 4, 0.035, 0.1);
      if (s === 0 || s === 10 || (s === 7 && p.volta % 2 === 1)) x.bumbo(t, 0.42);
      if (s === 4 || s === 12) x.caixa(t, 0.2, true);
      if (s % 2 === 0) x.chimbal(t, s % 4 === 0 ? 0.06 : 0.04);
      else if (p.r() < 0.15) x.chimbal(t, 0.025);
      if (s === 0) x.baixo(t, bx(a, 38), d * 6, 0.34);
      if (s === 10) x.baixo(t, bx(a, 38), d * 3, 0.26);
      if (s === 14) x.baixo(t, bx(a, 38) + 7, d * 2, 0.2);
      if (p.r() < 0.06) x.estalo(t, 0.03);
      if (p.tipo === 1) {
        const m = mel(p, 'cid', POOL_CID, RIT_ESPARSO);
        if (m) x.eletrico(t, m.n, m.len * d, 0.09, 0.2);
      }
    },
  },

  trabalho: {
    nome: 'Trabalho',
    bpm: 72,
    swing: 0.12,
    compassos: 16,
    reverb: 0.25,
    ganho: 1.05,
    corte: 2400,
    prog: ['Ebmaj7', 'Cm7', 'Abmaj7', 'Bb7', 'Ebmaj7', 'Gm7', 'Abmaj7', 'Bbsus4'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s === 0) for (const n of voz(a, 55)) x.eletrico(t, n, d * 12, 0.045);
      if (s === 8) for (const n of voz(a, 60).slice(0, 3)) x.eletrico(t, n, d * 6, 0.025, 0.2);
      const pausa = p.volta % 2 === 1 && p.tipo === 1;
      if (!pausa) {
        if (s === 0 || s === 9) x.bumbo(t, 0.32);
        if (s === 8) x.caixa(t, 0.14, true);
        if (s % 2 === 0) x.chimbal(t, 0.03);
      }
      if (s === 0) x.baixo(t, bx(a, 39), d * 7, 0.28);
      if (s === 9) x.baixo(t, bx(a, 39), d * 5, 0.2);
      if (s === 0) for (const n of voz(a, 60)) x.pad(t, n, d * 16, 0.012, 900);
      if (p.r() < 0.04) x.estalo(t, 0.025);
      if (p.tipo === 1) {
        const m = mel(p, 'tra', POOL_TRA, RIT_ESPARSO);
        if (m) x.eletrico(t, m.n, m.len * d, 0.07, -0.2);
      }
    },
  },

  hacker: {
    nome: 'Hacker',
    bpm: 108,
    compassos: 16,
    reverb: 0.3,
    ganho: 0.95,
    prog: ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'G', 'F', 'G', 'Am', 'Am', 'Dm', 'F', 'G', 'E'],
    passo(x, p) {
      const { t, s, d, a } = p;
      const v = voz(a, 57);
      const arp = v[s % 3] + (s % 6 >= 3 ? 12 : 0);
      if (p.tipo === 1) x.pluck(t, arp, d * 0.9, 0.05, 3500, s % 2 ? 0.3 : -0.3);
      else x.lead(t, arp, d * 0.8, 0.035, 'sawtooth', s % 2 ? 0.3 : -0.3);
      if (s % 2 === 0) x.baixoSynth(t, bx(a, 33) + (s % 4 === 2 ? 12 : 0), d * 1.7, 0.24, 700);
      if (s % 4 === 0) x.bumbo(t, 0.42);
      if (s === 4 || s === 12) x.caixa(t, 0.2);
      if (s % 4 === 2) x.chimbal(t, 0.05);
      if (s === 0) for (const n of v) x.pad(t, n, d * 16, 0.022, 1500);
      if (p.tipo === 1) {
        const m = mel(p, 'hac', POOL_HAC, RIT_VIVO);
        if (m) x.lead(t, m.n, m.len * d * 0.9, 0.05, 'square', 0);
      }
      if (p.fr === 3 && s >= 12) x.tom(t, 52 - (s - 12) * 3, 0.25);
    },
  },

  festa: {
    nome: 'Festa',
    bpm: 128,
    compassos: 16,
    reverb: 0.15,
    ganho: 0.95,
    prog: ['C', 'C', 'F', 'G7', 'C', 'C', 'G7', 'C', 'F', 'F', 'C', 'C', 'G7', 'G7', 'C', 'C'],
    passo(x, p) {
      const { t, s, d, a } = p;
      const b = baiao(s);
      if (b >= 0) {
        x.zabumba(t, b === 0 ? 0.5 : b === 1 ? 0.38 : 0.2);
        x.baixo(t, b === 2 ? bx(a, 36) + 7 : bx(a, 36), d * 2.5, 0.3);
      }
      if (s % 8 === 2 || s % 8 === 4 || s % 8 === 7) x.bacalhau(t, s % 8 === 4 ? 0.08 : 0.05);
      trianguloForro(x, p, 0.05);
      const m = mel(p, p.tipo === 1 ? 'fes-b' : 'fes', POOL_FES, RIT_FORRO);
      if (m) {
        x.sanfona(t, m.n, m.len * d * 0.9, 0.07, 0.1);
        if (p.tipo === 1) {
          const i = POOL_FES.indexOf(m.n);
          if (i >= 2) x.sanfona(t, POOL_FES[i - 2], m.len * d * 0.9, 0.04, -0.1);
        }
      }
      if (s % 4 === 2) for (const n of voz(a, 55)) x.sanfona(t, n, d * 1.2, 0.015, -0.2);
    },
  },

  vitoria: {
    nome: 'Vitória',
    bpm: 112,
    compassos: 16,
    reverb: 0.3,
    ganho: 0.95,
    prog: ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'C', 'Ab', 'Bb', 'C', 'C', 'F', 'G', 'C', 'C'],
    passo(x, p) {
      const { t, s, d, a } = p;
      const v = voz(a, 55);
      if (s === 0 || s === 8) for (const n of v) x.metais(t, n, d * 6, 0.04);
      if (s === 6) for (const n of v) x.metais(t, n, d * 1.5, 0.03);
      const m = mel(p, 'vit', POOL_VIT, RIT_FANFARRA);
      if (m) x.metais(t, m.n, m.len * d * 0.9, 0.05, 0.1);
      if (s === 0) x.tom(t, bx(a, 36), 0.4);
      if (p.fr === 3 && s >= 12) x.tom(t, bx(a, 36) + 7, 0.15 + (s - 12) * 0.04);
      if (s % 2 === 0) x.caixa(t, s === 4 || s === 12 ? 0.14 : 0.04);
      if (s === 0 || s === 8) x.baixo(t, bx(a, 36), d * 6, 0.3);
    },
  },

  final_bom: {
    nome: 'Final bom',
    bpm: 84,
    compassos: 16,
    reverb: 0.4,
    ganho: 1,
    prog: ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D', 'Em', 'C', 'G', 'D', 'C', 'D', 'G', 'G'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s % 2 === 0) {
        const v = voz(a, 55);
        const arp = [bx(a, 43), v[0], v[1], v[2], v[0] + 12, v[2], v[1], v[0]];
        x.piano(t, arp[s / 2], d * 4, s === 0 ? 0.18 : 0.09, (s / 2) % 2 ? 0.2 : -0.2);
      }
      if (s === 0) for (const n of voz(a, 59)) x.pad(t, n, d * 16, 0.02, 1000);
      // lembra a melodia da infância
      const m = mel(p, p.tipo === 1 ? 'bom-b' : 'inf', POOL_BOM, RIT_MEDIO);
      if (m) {
        if (p.tipo === 1) x.flauta(t, m.n - 12, m.len * d * 0.95, 0.08);
        else x.caixinha(t, m.n, m.len * d, 0.16, 0.15);
      }
      if (p.tipo === 1 && s % 2 === 0) x.chocalho(t, 0.02);
    },
  },

  final_ruim: {
    nome: 'Final ruim',
    bpm: 58,
    compassos: 16,
    reverb: 0.5,
    ganho: 1,
    prog: ['Cm', 'Cm', 'Ab', 'Ab', 'Fm', 'Fm', 'G', 'G', 'Cm', 'Ab', 'Fm', 'G', 'Cm', 'Fm', 'G', 'Cm'],
    passo(x, p) {
      const { t, s, d, a } = p;
      if (s === 0 && p.c % 2 === 0) for (const n of voz(a, 48)) x.pad(t, n, d * 32, 0.035, 420);
      if (s === 0) x.baixo(t, bx(a, 36), d * 14, 0.26);
      const m = mel(p, 'rui', POOL_RUI, RIT_ESPARSO);
      if (m) {
        x.piano(t, m.n, m.len * d, 0.18, 0.1);
        if (p.tipo === 1) x.piano(t + d * 4, m.n - 12, d * 4, 0.06, -0.2);
      }
      if (p.fr === 3 && s === 8) x.sino(t, 73, d * 8, 0.035, 0.4);
    },
  },

  menu: {
    nome: 'Tema',
    bpm: 100,
    compassos: 16,
    reverb: 0.25,
    ganho: 0.95,
    prog: ['Am', 'D', 'Am', 'D', 'F', 'G', 'Am', 'Am', 'Am', 'D', 'Am', 'D', 'F', 'G', 'E7', 'E7'],
    passo(x, p) {
      const { t, s, d, a } = p;
      const b = baiao(s);
      if (b >= 0) {
        x.baixoSynth(t, b === 2 ? bx(a, 33) + 7 : bx(a, 33), d * 2.5, 0.26, 900);
        x.zabumba(t, b === 0 ? 0.3 : 0.2);
      }
      if (s === 0 || s === 8) x.bumbo(t, 0.25);
      trianguloForro(x, p, 0.03);
      if (s % 2 === 0) {
        const v = voz(a, 57);
        const k = s / 2;
        x.lead(t, v[k % 3] + (k % 4 === 3 ? 12 : 0), d * 1.2, 0.025, 'sawtooth', k % 2 ? 0.3 : -0.3);
      }
      if (p.secao >= 1 && (s === 4 || s === 12)) x.palma(t, 0.08);
      if (s === 0) for (const n of voz(a, 60)) x.pad(t, n, d * 16, 0.015, 1200);
      // o tema: sanfona na parte A, sintetizador na B, mesma semente
      const m = mel(p, 'men', POOL_MEN, RIT_FORRO);
      if (m) {
        if (p.tipo === 1) x.lead(t, m.n, m.len * d * 0.9, 0.045, 'square', 0.1);
        else x.sanfona(t, m.n, m.len * d * 0.9, 0.06, 0.1);
      }
    },
  },
};

/* ---------- efeitos ---------- */

const EFS: Record<string, (x: Sintese, t: number) => void> = {
  clique: (x, t) => {
    x.bip(t, 1800, 0.03, 0.12, 'sine', 900);
    x.chiado(t, 0.015, 0.03, 'highpass', 4000);
  },
  escolha: (x, t) => {
    x.bip(t, 660, 0.09, 0.13, 'triangle');
    x.bip(t + 0.07, 990, 0.16, 0.13, 'triangle');
  },
  especial: (x, t) => {
    const ns = [84, 88, 91, 96, 100, 103, 108];
    ns.forEach((n, i) => {
      x.bip(t + i * 0.045, midiHz(n), 0.5, 0.06, 'sine', 0, 0.003, 0, i % 2 ? 0.3 : -0.3);
      x.bip(t + i * 0.045 + 0.01, midiHz(n) * 2.01, 0.3, 0.015, 'sine');
    });
    x.chiado(t, 0.6, 0.015, 'highpass', 8000);
  },
  notificacao: (x, t) => {
    x.bip(t, 1046.5, 0.14, 0.13, 'sine');
    x.bip(t, 2093, 0.08, 0.03, 'triangle');
    x.bip(t + 0.13, 1568, 0.3, 0.13, 'sine');
    x.bip(t + 0.13, 3136, 0.12, 0.03, 'triangle');
  },
  mensagem: (x, t) => {
    x.bip(t, 520, 0.07, 0.16, 'sine', 980);
    x.bip(t + 0.09, 760, 0.1, 0.13, 'sine', 1300);
  },
  erro: (x, t) => {
    x.bip(t, 233, 0.14, 0.1, 'square', 0, 0.004, 1400);
    x.bip(t + 0.16, 165, 0.26, 0.1, 'square', 155, 0.004, 1200);
  },
  acerto: (x, t) => {
    [72, 76, 79, 84].forEach((n, i) => x.bip(t + i * 0.06, midiHz(n), i === 3 ? 0.45 : 0.15, 0.1, 'triangle'));
    x.bip(t + 0.18, midiHz(96), 0.3, 0.025, 'sine');
  },
  porta: (x, t) => {
    x.varredura(t, 'sawtooth', [70, 95, 82, 112, 88, 124, 96, 78], 0.7, 0.05, 'bandpass', 900, 5);
    x.bip(t + 0.72, 95, 0.3, 0.35, 'sine', 45);
    x.chiado(t + 0.72, 0.12, 0.12, 'lowpass', 350);
  },
  teclado: (x, t) => {
    let tt = t;
    for (let i = 0; i < 9; i++) {
      const fim = i === 8;
      x.chiado(tt, fim ? 0.05 : 0.025, 0.05 + Math.random() * 0.06, 'bandpass', fim ? 1500 : 2500 + Math.random() * 1500, 0, 3);
      x.bip(tt, fim ? 130 : 180 + Math.random() * 60, 0.02, 0.05, 'triangle');
      tt += 0.06 + Math.random() * 0.07;
    }
  },
  dinheiro: (x, t) => {
    for (let i = 0; i < 3; i++) {
      x.bip(t + i * 0.08, 2637, 0.25, 0.06, 'sine', 0, 0.002, 0, i % 2 ? 0.3 : -0.3);
      x.bip(t + i * 0.08, 3591, 0.18, 0.04, 'sine');
    }
    x.bip(t + 0.3, midiHz(88), 0.3, 0.09, 'triangle');
    x.bip(t + 0.38, midiHz(95), 0.5, 0.09, 'triangle');
  },
  alarme: (x, t) => {
    for (let i = 0; i < 6; i++) x.bip(t + i * 0.2, i % 2 ? 660 : 880, 0.18, 0.08, 'square', 0, 0.01, 2500);
  },
  modem_discado: (x, t) => {
    const dtmf = [[697, 1209], [770, 1336], [852, 1477], [941, 1336], [697, 1477]];
    dtmf.forEach(([a, b], i) => {
      const tt = t + i * 0.12;
      x.varredura(tt, 'sine', [a], 0.08, 0.05);
      x.varredura(tt, 'sine', [b], 0.08, 0.05);
    });
    x.varredura(t + 0.66, 'sine', [2100], 0.28, 0.05);
    const ch: number[] = [];
    for (let i = 0; i < 24; i++) ch.push(600 + Math.random() * 2000);
    x.varredura(t + 0.98, 'square', ch, 0.9, 0.035, 'bandpass', 1800, 0.7);
    x.chiado(t + 0.98, 0.9, 0.04, 'bandpass', 1500, 3000, 2);
    x.bip(t + 1.95, 440, 0.12, 0.07, 'triangle');
    x.bip(t + 2.08, 330, 0.25, 0.07, 'triangle');
  },
  pagina: (x, t) => {
    x.chiado(t, 0.28, 0.1, 'bandpass', 800, 3500, 1.2);
    x.chiado(t + 0.1, 0.18, 0.05, 'highpass', 3000);
  },
  capitulo: (x, t) => {
    x.bip(t, 70, 1.2, 0.3, 'sine', 40);
    x.chiado(t, 0.5, 0.05, 'lowpass', 400);
    [60, 67, 72, 76, 79].forEach((n, i) => x.bip(t + 0.05, midiHz(n), 1.6, 0.035, 'triangle', 0, 0.35, 0, (i - 2) * 0.2));
    [91, 96, 100, 103].forEach((n, i) => x.bip(t + 0.45 + i * 0.07, midiHz(n), 0.6, 0.03, 'sine'));
  },
};

/* ---------- API pública ---------- */

export const MUSICAS: Record<string, string> = Object.fromEntries(Object.entries(DEFS).map(([id, d]) => [id, d.nome]));

export const EFEITOS: Record<string, string> = {
  clique: 'Clique',
  escolha: 'Escolha',
  especial: 'Especial',
  notificacao: 'Notificação',
  mensagem: 'Mensagem',
  erro: 'Erro',
  acerto: 'Acerto',
  porta: 'Porta',
  teclado: 'Teclado',
  dinheiro: 'Dinheiro',
  alarme: 'Alarme',
  modem_discado: 'Modem discado',
  pagina: 'Página',
  capitulo: 'Capítulo',
};

interface Instancia {
  id: string;
  def: Def;
  acordes: Acorde[];
  entrada: GainNode;
  filtro: BiquadFilterNode | null;
  out: GainNode;
  rev: GainNode;
  prox: number; // instante do próximo passo
  k: number; // contador global de passos
  fim: number; // depois disso não agenda mais
  mem: Record<string, MemFrase>;
}

export interface EstatisticasSom {
  estado: string;
  atual: string;
  instancias: number;
  notasAgendadas: number;
  nosVivos: number;
}

export class Som {
  private ctx: AudioContext | null = null;
  private sint: Sintese | null = null;
  private busMusica: GainNode | null = null;
  private busEfeitos: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private vm = 0.7;
  private ve = 0.8;
  private pausado = false;
  private desejada = 'nenhuma';
  private atual: Instancia | null = null;
  private insts: Instancia[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // nada pesado aqui: o AudioContext só nasce em destravar()
  }

  /** precisa ser chamado num gesto do usuário (clique) para liberar o AudioContext */
  destravar(): void {
    if (this.ctx) {
      this.ajustarEstado();
      return;
    }
    const w = typeof window !== 'undefined' ? (window as unknown as { AudioContext?: CtorAudio; webkitAudioContext?: CtorAudio }) : undefined;
    const C = w ? w.AudioContext ?? w.webkitAudioContext : undefined;
    if (!C) return;
    try {
      const ctx = new C();
      this.ctx = ctx;
      this.sint = new Sintese(ctx);

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 12;
      comp.ratio.value = 3;
      comp.attack.value = 0.01;
      comp.release.value = 0.25;
      const master = ctx.createGain();
      master.gain.value = 0.9;
      const lim = ctx.createDynamicsCompressor();
      lim.threshold.value = -3;
      lim.knee.value = 0;
      lim.ratio.value = 20;
      lim.attack.value = 0.002;
      lim.release.value = 0.1;
      comp.connect(master);
      master.connect(lim);
      lim.connect(ctx.destination);

      this.busMusica = ctx.createGain();
      this.busMusica.gain.value = this.vm * this.vm * BASE_MUSICA;
      this.busMusica.connect(comp);
      this.busEfeitos = ctx.createGain();
      this.busEfeitos.gain.value = this.ve * this.ve * BASE_EFEITOS;
      this.busEfeitos.connect(comp);

      // reverb com impulso gerado (ruído com decaimento)
      const sr = ctx.sampleRate;
      const len = Math.floor(sr * 2.4);
      const ir = ctx.createBuffer(2, len, sr);
      for (let c = 0; c < 2; c++) {
        const dd = ir.getChannelData(c);
        for (let i = 0; i < len; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
      }
      this.reverb = ctx.createConvolver();
      this.reverb.buffer = ir;
      const retorno = ctx.createGain();
      retorno.gain.value = 0.45;
      this.reverb.connect(retorno);
      retorno.connect(this.busMusica);

      // buffer silencioso: destrava o áudio em navegadores móveis
      const b = ctx.createBufferSource();
      b.buffer = ctx.createBuffer(1, 1, sr);
      b.connect(ctx.destination);
      b.start();
      b.onended = () => b.disconnect();

      ctx.onstatechange = () => {
        if (ctx.state === 'running') this.agendar();
      };
    } catch (e) {
      console.warn('Som indisponível:', e);
      this.ctx = null;
      this.sint = null;
      return;
    }
    this.ajustarEstado();
    if (this.desejada !== 'nenhuma') this.trocar(this.desejada);
  }

  /** troca de música com crossfade; 'nenhuma' faz fade out; mesmo id não reinicia */
  tocar(id: string): void {
    if (id !== 'nenhuma' && !DEFS[id]) {
      console.warn('música desconhecida:', id);
      return;
    }
    if (id === this.desejada) return;
    this.desejada = id;
    if (this.ctx) this.trocar(id);
  }

  efeito(id: string): void {
    const f = EFS[id];
    const ctx = this.ctx;
    if (!f || !ctx || !this.sint || !this.busEfeitos || this.pausado || this.ve <= 0) return;
    if (ctx.state !== 'running') void ctx.resume().catch(() => undefined);
    this.sint.dest = this.busEfeitos;
    try {
      f(this.sint, ctx.currentTime + 0.01);
    } catch (e) {
      console.warn('efeito falhou:', id, e);
    }
  }

  volumeMusica(v: number): void {
    this.vm = Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
    if (this.ctx && this.busMusica) this.busMusica.gain.setTargetAtTime(this.vm * this.vm * BASE_MUSICA, this.ctx.currentTime, 0.05);
    this.ajustarEstado();
  }

  volumeEfeitos(v: number): void {
    this.ve = Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
    if (this.ctx && this.busEfeitos) this.busEfeitos.gain.setTargetAtTime(this.ve * this.ve * BASE_EFEITOS, this.ctx.currentTime, 0.05);
    this.ajustarEstado();
  }

  /** ao esconder a aba */
  pausar(): void {
    this.pausado = true;
    this.ajustarEstado();
  }

  retomar(): void {
    this.pausado = false;
    this.ajustarEstado();
  }

  /** instrumentação para testes e depuração */
  estatisticas(): EstatisticasSom {
    return {
      estado: this.ctx ? this.ctx.state : 'sem-contexto',
      atual: this.atual ? this.atual.id : 'nenhuma',
      instancias: this.insts.length,
      notasAgendadas: this.sint ? this.sint.notas : 0,
      nosVivos: this.sint ? this.sint.vivos : 0,
    };
  }

  /* --- interno --- */

  /** suspende o contexto quando pausado ou com tudo em volume 0 */
  private ajustarEstado(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const rodar = !this.pausado && (this.vm > 0 || this.ve > 0);
    if (rodar && ctx.state !== 'running' && ctx.state !== 'closed') {
      void ctx.resume().then(() => this.agendar(), () => undefined);
    } else if (!rodar && ctx.state === 'running') {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      void ctx.suspend().catch(() => undefined);
    } else this.agendar();
  }

  private trocar(id: string): void {
    const ctx = this.ctx;
    if (!ctx || !this.busMusica || !this.reverb) return;
    const agora = ctx.currentTime;
    const velha = this.atual;
    this.atual = null;
    // músicas que já estavam saindo param de agendar (trocas rápidas não acumulam carga)
    for (const i of this.insts) if (i !== velha && i.fim > agora) i.fim = agora;
    if (velha) {
      if (ctx.state !== 'running') this.descartar(velha);
      else {
        const g = velha.out.gain;
        g.cancelScheduledValues(agora);
        g.setValueAtTime(g.value, agora);
        g.linearRampToValueAtTime(0, agora + FADE);
        velha.fim = agora + FADE;
      }
    }
    if (id === 'nenhuma') {
      this.agendar();
      return;
    }
    const def = DEFS[id];
    const entrada = ctx.createGain();
    entrada.gain.value = def.ganho;
    const out = ctx.createGain();
    let filtro: BiquadFilterNode | null = null;
    if (def.corte) {
      filtro = ctx.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.value = def.corte;
      filtro.Q.value = 0.5;
      entrada.connect(filtro);
      filtro.connect(out);
    } else entrada.connect(out);
    out.gain.setValueAtTime(0, agora);
    out.gain.linearRampToValueAtTime(1, agora + (velha ? FADE : 0.4));
    const rev = ctx.createGain();
    rev.gain.value = def.reverb;
    out.connect(this.busMusica);
    out.connect(rev);
    rev.connect(this.reverb);
    const inst: Instancia = {
      id,
      def,
      acordes: def.prog.map(acorde),
      entrada,
      filtro,
      out,
      rev,
      prox: agora + 0.06,
      k: 0,
      fim: Infinity,
      mem: {},
    };
    this.insts.push(inst);
    this.atual = inst;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.tick();
  }

  private descartar(inst: Instancia): void {
    inst.out.disconnect();
    inst.rev.disconnect();
    inst.entrada.disconnect();
    if (inst.filtro) inst.filtro.disconnect();
    const i = this.insts.indexOf(inst);
    if (i >= 0) this.insts.splice(i, 1);
  }

  private agendar(): void {
    if (this.timer === null && this.ctx && this.ctx.state === 'running' && this.insts.length > 0) {
      this.timer = setTimeout(() => this.tick(), ACORDA_MS);
    }
  }

  /** agendador com antecipação: cria as notas que caem na próxima janela */
  private tick(): void {
    this.timer = null;
    const ctx = this.ctx;
    const sint = this.sint;
    if (!ctx || !sint || ctx.state !== 'running') return;
    const agora = ctx.currentTime;
    const oculta = typeof document !== 'undefined' && document.hidden;
    const ate = agora + (oculta ? ANTECIPACAO_OCULTA : ANTECIPACAO);
    const silencio = this.vm <= 0;
    for (const inst of this.insts.slice()) {
      if (agora > inst.fim + 4) {
        this.descartar(inst);
        continue;
      }
      const def = inst.def;
      const passos = def.passos ?? 16;
      const d = 60 / def.bpm / 4;
      // depois de suspensão ou travada longa, pula o que ficou para trás
      if (inst.prox < agora - 0.05) inst.prox = agora + 0.02;
      while (inst.prox < ate && inst.prox < inst.fim) {
        if (!silencio) {
          const s = inst.k % passos;
          const abs = Math.floor(inst.k / passos);
          const c = abs % def.compassos;
          const secao = Math.floor(c / 4);
          const tipos = def.compassos >= 32 ? [0, 0, 1, 0, 2, 2, 1, 0] : [0, 0, 1, 0];
          const p: Passo = {
            t: inst.prox + (s % 2 === 1 && def.swing ? def.swing * d : 0),
            s,
            c,
            volta: Math.floor(abs / def.compassos),
            d,
            a: inst.acordes[c % inst.acordes.length],
            fr: c % 4,
            secao,
            tipo: tipos[secao % tipos.length],
            passos,
            mem: inst.mem,
            r: Math.random,
          };
          sint.dest = inst.entrada;
          try {
            def.passo(sint, p);
          } catch (e) {
            console.warn('erro ao agendar', inst.id, e);
          }
        }
        inst.prox += d;
        inst.k++;
      }
    }
    this.agendar();
  }
}
