// Cenários de fundo ilustrados em SVG (1080x1920, retrato 9:16).
// Os personagens ficam no terço de baixo, então o chão é mais limpo
// e o topo e o fundo concentram os detalhes.

export interface Cenario {
  nome: string;
  svg: string;
  noite?: boolean;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

type Parada = [number, string, number?];

let semente = 1;
function semear(s: number): void {
  semente = s;
}
function rnd(): number {
  semente = (semente * 16807) % 2147483647;
  return (semente - 1) / 2147483646;
}
function entre(a: number, b: number): number {
  return a + rnd() * (b - a);
}
function escolhe<T>(lista: T[]): T {
  return lista[Math.floor(rnd() * lista.length)];
}

const SANS = 'font-family="Trebuchet MS, Verdana, Arial, sans-serif"';
const MAO = 'font-family="Comic Sans MS, Segoe Print, Chalkboard SE, cursive"';
const MONO = 'font-family="Consolas, Courier New, monospace"';

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function paradas(ps: Parada[]): string {
  return ps
    .map(([o, cor, op]) => `<stop offset="${o}" stop-color="${cor}"${op === undefined ? "" : ` stop-opacity="${op}"`}/>`)
    .join("");
}

class Cena {
  defs: string[] = [];
  private n = 0;
  private blurs = new Map<number, string>();
  constructor(public id: string) {}

  private novo(p: string): string {
    this.n += 1;
    return `${this.id}-${p}${this.n}`;
  }

  lin(ps: Parada[], x1 = 0, y1 = 0, x2 = 0, y2 = 1): string {
    const id = this.novo("g");
    this.defs.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${paradas(ps)}</linearGradient>`);
    return `url(#${id})`;
  }

  rad(ps: Parada[], cx = 0.5, cy = 0.5, r = 0.5): string {
    const id = this.novo("r");
    this.defs.push(`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${paradas(ps)}</radialGradient>`);
    return `url(#${id})`;
  }

  blur(d: number): string {
    let id = this.blurs.get(d);
    if (!id) {
      id = this.novo("f");
      this.blurs.set(d, id);
      this.defs.push(
        `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${d}"/></filter>`,
      );
    }
    return `filter="url(#${id})"`;
  }

  clip(forma: string): string {
    const id = this.novo("c");
    this.defs.push(`<clipPath id="${id}">${forma}</clipPath>`);
    return `clip-path="url(#${id})"`;
  }

  padrao(w: number, h: number, conteudo: string, transf = ""): string {
    const id = this.novo("p");
    this.defs.push(
      `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"${transf ? ` patternTransform="${transf}"` : ""}>${conteudo}</pattern>`,
    );
    return `url(#${id})`;
  }

  /** Halo de luz suave. */
  brilho(cx: number, cy: number, rx: number, cor: string, op = 0.6, ry = rx): string {
    const g = this.rad([
      [0, cor, op],
      [0.45, cor, op * 0.35],
      [1, cor, 0],
    ]);
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${g}"/>`;
  }

  fim(corpo: string, noite = false): string {
    const vin = this.rad(
      [
        [0, "#000", 0],
        [0.62, "#000", 0],
        [1, "#000", noite ? 0.6 : 0.32],
      ],
      0.5,
      0.42,
      0.75,
    );
    const baixo = this.lin([
      [0, "#000", 0],
      [1, "#000", noite ? 0.45 : 0.22],
    ]);
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">` +
      `<defs>${this.defs.join("")}</defs>` +
      corpo +
      `<rect x="0" y="1450" width="1080" height="470" fill="${baixo}"/>` +
      `<rect x="0" y="0" width="1080" height="1920" fill="${vin}"/>` +
      `</svg>`
    );
  }
}

// ---------------------------------------------------------------------------
// Primitivas
// ---------------------------------------------------------------------------

function ret(x: number, y: number, w: number, h: number, fill: string, extra = ""): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
}
function rr(x: number, y: number, w: number, h: number, r: number, fill: string, extra = ""): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
}
function circ(cx: number, cy: number, r: number, fill: string, extra = ""): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
}
function elip(cx: number, cy: number, rx: number, ry: number, fill: string, extra = ""): string {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
}
function cam(d: string, fill: string, extra = ""): string {
  return `<path d="${d}" fill="${fill}" ${extra}/>`;
}
function linha(x1: number, y1: number, x2: number, y2: number, cor: string, w = 2, extra = ""): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${cor}" stroke-width="${w}" ${extra}/>`;
}
function g(conteudo: string, extra = ""): string {
  return `<g ${extra}>${conteudo}</g>`;
}

interface OpTexto {
  ancora?: "start" | "middle" | "end";
  peso?: string;
  fonte?: string;
  rot?: number;
  op?: number;
  extra?: string;
}
function txt(x: number, y: number, s: string, tam: number, cor: string, o: OpTexto = {}): string {
  const rot = o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : "";
  return `<text x="${x}" y="${y}" font-size="${tam}" fill="${cor}" text-anchor="${o.ancora ?? "middle"}" font-weight="${o.peso ?? "normal"}" ${o.fonte ?? SANS}${o.op !== undefined ? ` opacity="${o.op}"` : ""}${rot} ${o.extra ?? ""}>${esc(s)}</text>`;
}

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------

/** Faixa de morros entre x0 e x1. */
function morro(x0: number, x1: number, yTopo: number, yBase: number, amp: number, n: number, cor: string, extra = ""): string {
  const passo = (x1 - x0) / n;
  let y = yTopo + entre(-amp, amp) * 0.4;
  let d = `M${x0},${yBase} L${x0},${y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const xa = x0 + passo * i;
    const yc = yTopo - amp * entre(0.3, 1.4);
    y = yTopo + entre(-amp, amp) * 0.4;
    d += ` Q${(xa + passo / 2).toFixed(1)},${yc.toFixed(1)} ${(xa + passo).toFixed(1)},${y.toFixed(1)}`;
  }
  d += ` L${x1},${yBase} Z`;
  return cam(d, cor, extra);
}

function nuvem(cx: number, cy: number, s: number, cor = "#fff", op = 0.9, extra = ""): string {
  return g(
    elip(cx, cy, 120 * s, 38 * s, cor) +
      circ(cx - 50 * s, cy - 20 * s, 45 * s, cor) +
      circ(cx + 15 * s, cy - 40 * s, 58 * s, cor) +
      circ(cx + 70 * s, cy - 12 * s, 40 * s, cor),
    `opacity="${op}" ${extra}`,
  );
}

function estrelas(n: number, x0: number, x1: number, y0: number, y1: number, cor = "#fff"): string {
  let s = "";
  for (let i = 0; i < n; i++) {
    const r = entre(0.8, 2.6);
    s += circ(+entre(x0, x1).toFixed(1), +entre(y0, y1).toFixed(1), +r.toFixed(2), cor, `opacity="${entre(0.35, 1).toFixed(2)}"`);
  }
  return s;
}

function arvore(c: Cena, x: number, y: number, s: number, cor1: string, cor2: string, extra = ""): string {
  const fol = c.rad([
    [0, cor2],
    [1, cor1],
  ], 0.4, 0.35, 0.7);
  let copa = "";
  const blocos: [number, number, number][] = [
    [0, -230, 110],
    [-80, -170, 85],
    [85, -175, 90],
    [-30, -290, 80],
    [50, -260, 75],
    [-110, -230, 60],
    [120, -235, 62],
  ];
  for (const [dx, dy, r] of blocos) copa += circ(x + dx * s, y + dy * s, r * s, fol);
  return g(
    cam(`M${x - 14 * s},${y} L${x - 9 * s},${y - 160 * s} L${x - 40 * s},${y - 200 * s} L${x - 4 * s},${y - 180 * s} L${x + 6 * s},${y - 230 * s} L${x + 12 * s},${y - 150 * s} L${x + 16 * s},${y} Z`, "#5a3d2b") +
      copa,
    extra,
  );
}

function predios(
  c: Cena,
  x0: number,
  x1: number,
  yBase: number,
  hMin: number,
  hMax: number,
  cor: string,
  luz: string,
  probLuz: number,
  extra = "",
): string {
  let s = "";
  let x = x0;
  while (x < x1) {
    const w = entre(70, 170);
    const h = entre(hMin, hMax);
    const topo = yBase - h;
    s += ret(x, topo, w, h + 2, cor);
    if (rnd() < 0.3) s += ret(x + w * 0.4, topo - 40, 4, 40, cor);
    const jw = 12;
    const jh = 16;
    for (let yy = topo + 18; yy < yBase - 20; yy += 32) {
      for (let xx = x + 12; xx < x + w - 18; xx += 26) {
        if (rnd() < probLuz) s += ret(xx, yy, jw, jh, luz, `opacity="${entre(0.5, 1).toFixed(2)}"`);
      }
    }
    x += w + entre(-10, 12);
  }
  void c;
  return g(s, extra);
}

/** Silhueta de pessoa: (x, y) é a base do tronco. */
function pessoa(x: number, y: number, s: number, cor: string, pele = "#8a5a3c", extra = ""): string {
  return g(
    cam(
      `M${x - 58 * s},${y} C${x - 60 * s},${y - 95 * s} ${x - 48 * s},${y - 130 * s} ${x},${y - 134 * s} C${x + 48 * s},${y - 130 * s} ${x + 60 * s},${y - 95 * s} ${x + 58 * s},${y} Z`,
      cor,
    ) +
      ret(x - 10 * s, y - 150 * s, 20 * s, 22 * s, pele) +
      elip(x, y - 178 * s, 25 * s, 30 * s, pele) +
      cam(`M${x - 26 * s},${y - 178 * s} C${x - 28 * s},${y - 215 * s} ${x + 28 * s},${y - 218 * s} ${x + 27 * s},${y - 182 * s} C${x + 10 * s},${y - 196 * s} ${x - 10 * s},${y - 196 * s} ${x - 26 * s},${y - 178 * s} Z`, "#2a1d17"),
    extra,
  );
}

function multidao(n: number, x0: number, x1: number, y: number, s: number, cores: string[], extra = ""): string {
  const peles = ["#8a5a3c", "#c48b63", "#5e3a26", "#e0b48c", "#a06d4a"];
  let out = "";
  for (let i = 0; i < n; i++) {
    const sx = s * entre(0.85, 1.15);
    out += pessoa(entre(x0, x1), y + entre(-20, 30) * s, sx, escolhe(cores), escolhe(peles));
  }
  return g(out, extra);
}

function janela(
  c: Cena,
  x: number,
  y: number,
  w: number,
  h: number,
  o: { ceu: Parada[]; paisagem?: string; moldura?: string; div?: number; grade?: boolean; cortina?: string; vidro?: boolean },
): string {
  const mold = o.moldura ?? "#f1ede4";
  const fundo = ret(x, y, w, h, c.lin(o.ceu));
  const dentro = g(fundo + (o.paisagem ?? ""), c.clip(`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`));
  let s = rr(x - 22, y - 22, w + 44, h + 44, 6, mold) + ret(x - 22, y + h + 10, w + 44, 26, mold, `opacity="0.9"`);
  s += ret(x - 6, y - 6, w + 12, h + 12, "#000", `opacity="0.18"`);
  s += dentro;
  if (o.vidro !== false) s += cam(`M${x},${y} L${x + w * 0.35},${y} L${x},${y + h * 0.45} Z`, "#fff", `opacity="0.12"`);
  const div = o.div ?? 2;
  for (let i = 1; i < div; i++) s += ret(x + (w / div) * i - 5, y, 10, h, mold);
  s += ret(x, y + h * 0.42, w, 8, mold);
  if (o.grade) {
    for (let xx = x + 30; xx < x + w; xx += 44) s += ret(xx, y, 6, h, "#3b3b3b", `opacity="0.85"`);
    s += ret(x, y + h * 0.72, w, 6, "#3b3b3b", `opacity="0.85"`);
  }
  s += ret(x - 30, y + h + 22, w + 60, 18, "#000", `opacity="0.12"`);
  if (o.cortina) {
    const cw = w * 0.32;
    s += linha(x - 60, y - 40, x + w + 60, y - 40, "#6b5a48", 8, `stroke-linecap="round"`);
    s += cortina(x - 50, y - 40, cw, h + 110, o.cortina, false);
    s += cortina(x + w + 50 - cw, y - 40, cw, h + 110, o.cortina, true);
  }
  return s;
}

function cortina(x: number, y: number, w: number, h: number, fill: string, dir: boolean): string {
  const a = dir ? x + w : x;
  const b = dir ? x : x + w;
  const meio = dir ? x + w * 0.35 : x + w * 0.65;
  const d = `M${a},${y} L${b},${y} Q${meio},${y + h * 0.55} ${b + (dir ? 30 : -30)},${y + h} L${a},${y + h} Z`;
  let dobras = "";
  for (let i = 1; i < 4; i++) {
    const xx = x + (w / 4) * i;
    dobras += linha(xx, y + 6, xx + (dir ? -8 : 8), y + h - 10, "#000", 6, `opacity="0.12"`);
  }
  return g(cam(d, fill) + dobras + cam(d, "none", `stroke="#000" stroke-opacity="0.2" stroke-width="3"`));
}

function chita(c: Cena): string {
  const flor = (cx: number, cy: number, r: number, p: string, m: string) => {
    let s = "";
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      s += circ(cx + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75, r * 0.5, p);
    }
    return s + circ(cx, cy, r * 0.45, m);
  };
  return c.padrao(
    120,
    120,
    ret(0, 0, 120, 120, "#d3263a") +
      elip(28, 70, 22, 9, "#2f8a4a", `transform="rotate(-35 28 70)"`) +
      elip(92, 30, 20, 8, "#2f8a4a", `transform="rotate(30 92 30)"`) +
      elip(80, 98, 16, 7, "#2f8a4a", `transform="rotate(-10 80 98)"`) +
      flor(40, 40, 22, "#f6c933", "#1c5fb0") +
      flor(95, 85, 18, "#ffffff", "#d3263a") +
      flor(10, 110, 12, "#1c5fb0", "#f6c933") +
      circ(70, 10, 5, "#fff") +
      circ(110, 55, 4, "#f6c933"),
  );
}

function azulejo(c: Cena, base = "#f4f1ea", motivo = "#3a6fb0", tam = 60): string {
  const m = tam / 2;
  return c.padrao(
    tam,
    tam,
    ret(0, 0, tam, tam, base) +
      circ(m, m, tam * 0.12, motivo) +
      circ(m, m - tam * 0.22, tam * 0.07, motivo, `opacity="0.8"`) +
      circ(m, m + tam * 0.22, tam * 0.07, motivo, `opacity="0.8"`) +
      circ(m - tam * 0.22, m, tam * 0.07, motivo, `opacity="0.8"`) +
      circ(m + tam * 0.22, m, tam * 0.07, motivo, `opacity="0.8"`) +
      circ(0, 0, tam * 0.12, motivo, `opacity="0.55"`) +
      circ(tam, 0, tam * 0.12, motivo, `opacity="0.55"`) +
      circ(0, tam, tam * 0.12, motivo, `opacity="0.55"`) +
      circ(tam, tam, tam * 0.12, motivo, `opacity="0.55"`) +
      `<rect x="0" y="0" width="${tam}" height="${tam}" fill="none" stroke="#c9c2b4" stroke-width="2"/>`,
  );
}

function ladrilho(c: Cena, a: string, b: string, tam = 80): string {
  return c.padrao(tam * 2, tam * 2, ret(0, 0, tam * 2, tam * 2, a) + ret(0, 0, tam, tam, b) + ret(tam, tam, tam, tam, b));
}

/** Piso com leve perspectiva e brilho. */
function piso(c: Cena, y: number, cor1: string, cor2: string, juntas?: string): string {
  let s = ret(0, y, 1080, 1920 - y, c.lin([
    [0, cor1],
    [1, cor2],
  ]));
  if (juntas) {
    for (let i = -6; i <= 6; i++) {
      s += linha(540 + i * 70, y, 540 + i * 260, 1920, juntas, 3, `opacity="0.35"`);
    }
    let yy = y + 30;
    let passo = 30;
    while (yy < 1920) {
      s += linha(0, yy, 1080, yy, juntas, 3, `opacity="0.3"`);
      passo *= 1.35;
      yy += passo;
    }
  }
  s += ret(0, y, 1080, 14, "#000", `opacity="0.18"`);
  return s;
}

function rodape(y: number, cor: string): string {
  return ret(0, y - 30, 1080, 30, cor) + ret(0, y - 30, 1080, 5, "#fff", `opacity="0.2"`);
}

function lampadaPendente(c: Cena, x: number, yTeto: number, yLamp: number, cor = "#ffd27a", forca = 0.55): string {
  return (
    c.brilho(x, yLamp + 30, 420, cor, forca * 0.55) +
    linha(x, yTeto, x, yLamp, "#2b2420", 3) +
    rr(x - 10, yLamp - 6, 20, 22, 3, "#3a332c") +
    circ(x, yLamp + 32, 22, "#fff6d8") +
    c.brilho(x, yLamp + 32, 80, "#fff3c4", 0.9)
  );
}

function fluorescente(c: Cena, x: number, y: number, w: number, forca = 0.5): string {
  return (
    c.brilho(x + w / 2, y + 40, w * 1.1, "#e8f4ff", forca * 0.6, 260) +
    rr(x - 8, y - 8, w + 16, 26, 4, "#cfd4d8") +
    rr(x, y, w, 12, 6, "#ffffff")
  );
}

function ventiladorTeto(c: Cena, x: number, y: number, s = 1): string {
  const pa = (rot: number) =>
    elip(x + 150 * s, y + 40 * s, 140 * s, 22 * s, "#e9e4d8", `transform="rotate(${rot} ${x} ${y + 40 * s})"`);
  return g(
    linha(x, 0, x, y + 30 * s, "#8f8a80", 8 * s) +
      g(pa(-8) + pa(112) + pa(232), c.blur(2)) +
      elip(x, y + 40 * s, 40 * s, 22 * s, "#d8d2c4") +
      elip(x, y + 50 * s, 22 * s, 12 * s, "#b9b2a3"),
  );
}

function ventiladorMesa(x: number, y: number, s = 1): string {
  // y é a base
  const cy = y - 230 * s;
  let grade = "";
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 6) * i;
    grade += linha(x, cy, x + Math.cos(a) * 90 * s, cy + Math.sin(a) * 90 * s, "#5e6a72", 2);
  }
  return g(
    elip(x, y, 80 * s, 18 * s, "#3d4a52") +
      ret(x - 8 * s, cy, 16 * s, 230 * s, "#6a7880") +
      circ(x, cy, 92 * s, "#cfe0ea", `opacity="0.55"`) +
      circ(x, cy, 92 * s, "none", `stroke="#5e6a72" stroke-width="${5 * s}"`) +
      circ(x, cy, 60 * s, "none", `stroke="#5e6a72" stroke-width="2"`) +
      grade +
      circ(x, cy, 18 * s, "#2c6fb5"),
  );
}

function calendario(x: number, y: number, w: number, titulo: string, sub: string, ano: string, cor = "#c7302d"): string {
  const h = w * 1.45;
  let dias = "";
  const cw = (w - 20) / 7;
  for (let l = 0; l < 5; l++) {
    for (let k = 0; k < 7; k++) {
      dias += ret(x + 10 + k * cw + 2, y + h * 0.62 + l * (h * 0.07), cw - 4, h * 0.05, k === 0 ? "#e8a3a0" : "#ddd6c8");
    }
  }
  return g(
    circ(x + w / 2, y - 18, 5, "#555") +
      linha(x + w / 2, y - 18, x + 10, y, "#555", 2) +
      linha(x + w / 2, y - 18, x + w - 10, y, "#555", 2) +
      ret(x + 6, y + 6, w, h, "#000", `opacity="0.18"`) +
      ret(x, y, w, h, "#fbf7ee") +
      ret(x, y, w, h * 0.12, cor) +
      txt(x + w / 2, y + h * 0.085, titulo, w * 0.085, "#fff", { peso: "bold" }) +
      ret(x + 10, y + h * 0.15, w - 20, h * 0.36, "#7fb3d5") +
      morro(x + 10, x + w - 10, y + h * 0.4, y + h * 0.51, h * 0.04, 3, "#5d9a4a") +
      circ(x + w * 0.72, y + h * 0.24, w * 0.07, "#ffe28a") +
      txt(x + w / 2, y + h * 0.575, sub, w * 0.07, "#333") +
      dias +
      txt(x + w / 2, y + h * 0.98, ano, w * 0.06, "#888"),
    `transform="rotate(2 ${x} ${y})"`,
  );
}

interface LinhaPlaca {
  t: string;
  tam: number;
  cor?: string;
  peso?: string;
}
function placa(x: number, y: number, w: number, h: number, fundo: string, linhas: LinhaPlaca[], o: { rot?: number; fonte?: string; borda?: string; cor?: string } = {}): string {
  const cor = o.cor ?? "#222";
  let s = ret(x + 5, y + 6, w, h, "#000", `opacity="0.2"`) + rr(x, y, w, h, 4, fundo, o.borda ? `stroke="${o.borda}" stroke-width="4"` : "");
  const total = linhas.reduce((a, l) => a + l.tam * 1.15, 0);
  let yy = y + (h - total) / 2 + linhas[0].tam * 0.95;
  for (const l of linhas) {
    s += txt(x + w / 2, yy, l.t, l.tam, l.cor ?? cor, { fonte: o.fonte ?? MAO, peso: l.peso ?? "bold" });
    yy += l.tam * 1.15;
  }
  return g(s, o.rot ? `transform="rotate(${o.rot} ${x + w / 2} ${y + h / 2})"` : "");
}

function fita(x: number, y: number, rot = -20): string {
  return ret(x - 22, y - 8, 44, 16, "#f2ecd0", `opacity="0.85" transform="rotate(${rot} ${x} ${y})"`);
}

function bilhete(x: number, y: number, w: number, h: number, linhas: string[], tam: number, rot = 0, fundo = "#fdf6b2", cor = "#2a2a8a"): string {
  let s = ret(x + 4, y + 5, w, h, "#000", `opacity="0.18"`) + ret(x, y, w, h, fundo);
  linhas.forEach((l, i) => {
    s += txt(x + w / 2, y + tam * 1.3 + i * tam * 1.25, l, tam, cor, { fonte: MAO });
  });
  s += fita(x + w / 2, y);
  return g(s, `transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"`);
}

function relogio(cx: number, cy: number, r: number, h: number, m: number, aro = "#2b2b2b"): string {
  const am = (m / 60) * Math.PI * 2 - Math.PI / 2;
  const ah = ((h % 12) / 12 + m / 720) * Math.PI * 2 - Math.PI / 2;
  let marcas = "";
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 6) * i;
    marcas += linha(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78, cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9, "#333", 3);
  }
  return g(
    circ(cx + 4, cy + 5, r + 6, "#000", `opacity="0.2"`) +
      circ(cx, cy, r + 6, aro) +
      circ(cx, cy, r, "#fbfaf5") +
      marcas +
      linha(cx, cy, cx + Math.cos(ah) * r * 0.5, cy + Math.sin(ah) * r * 0.5, "#222", 6, `stroke-linecap="round"`) +
      linha(cx, cy, cx + Math.cos(am) * r * 0.75, cy + Math.sin(am) * r * 0.75, "#222", 4, `stroke-linecap="round"`) +
      circ(cx, cy, 5, "#c0392b"),
  );
}

function estante(x: number, y: number, w: number, h: number, prateleiras: number, madeira = "#7a5235", cheia = 0.9): string {
  const cores = ["#b23a48", "#2e6f95", "#e0a43a", "#3f7d4e", "#6d4c8d", "#d9cfb8", "#8c4a2f", "#1f4e5f", "#c96f3b", "#5c6b73"];
  let s = ret(x + 8, y + 8, w, h, "#000", `opacity="0.2"`) + ret(x, y, w, h, madeira) + ret(x + 14, y + 14, w - 28, h - 28, "#3a2618");
  const ph = (h - 28) / prateleiras;
  for (let p = 0; p < prateleiras; p++) {
    const base = y + 14 + ph * (p + 1);
    let xx = x + 18;
    while (xx < x + w - 30) {
      const bw = entre(14, 30);
      if (rnd() < cheia) {
        const bh = entre(ph * 0.55, ph * 0.85);
        const inc = rnd() < 0.08 ? entre(-12, -6) : 0;
        s += ret(xx, base - bh - 10, bw, bh, escolhe(cores), inc ? `transform="rotate(${inc} ${xx} ${base - 10})"` : "");
        s += ret(xx + bw * 0.2, base - bh * 0.8, bw * 0.6, 3, "#fff", `opacity="0.35"`);
      }
      xx += bw + 1;
    }
    s += ret(x + 14, base - 10, w - 28, 12, madeira);
  }
  return s;
}

function vaso(x: number, y: number, s: number, folha = "#3e8a4f", pote = "#b5653e"): string {
  let f = "";
  const angs = [-60, -35, -15, 5, 25, 45, 65, -80, 80];
  for (const a of angs) {
    f += elip(x, y - 70 * s, 16 * s, 70 * s, a % 2 === 0 ? folha : "#2f6e3e", `transform="rotate(${a} ${x} ${y - 10 * s})"`);
  }
  return g(f + cam(`M${x - 40 * s},${y - 20 * s} L${x + 40 * s},${y - 20 * s} L${x + 30 * s},${y + 50 * s} L${x - 30 * s},${y + 50 * s} Z`, pote) + ret(x - 44 * s, y - 28 * s, 88 * s, 14 * s, pote));
}

/** Monitor de tubo bege. (x, y) = centro da base. */
function crt(c: Cena, x: number, y: number, s: number, tela: string, conteudo = "", ligado = true): string {
  const w = 230 * s;
  const h = 200 * s;
  const tx = x - w / 2 + 22 * s;
  const ty = y - h - 18 * s + 20 * s;
  const tw = w - 44 * s;
  const th = h - 60 * s;
  return g(
    (ligado ? c.brilho(x, ty + th / 2, 240 * s, tela, 0.35) : "") +
      cam(`M${x - 70 * s},${y} L${x + 70 * s},${y} L${x + 50 * s},${y - 22 * s} L${x - 50 * s},${y - 22 * s} Z`, "#bdb39c") +
      cam(`M${x - w / 2 + 20 * s},${y - h - 18 * s} L${x + w / 2 - 20 * s},${y - h - 18 * s} L${x + w / 2 - 40 * s},${y - h - 50 * s} L${x - w / 2 + 40 * s},${y - h - 50 * s} Z`, "#cbc2aa") +
      rr(x - w / 2, y - h - 18 * s, w, h, 14 * s, "#ddd4bd") +
      rr(tx - 4 * s, ty - 4 * s, tw + 8 * s, th + 8 * s, 10 * s, "#8c846f") +
      rr(tx, ty, tw, th, 12 * s, ligado ? tela : "#2a2d2e") +
      conteudo +
      rr(tx, ty, tw, th * 0.4, 12 * s, "#fff", `opacity="0.08"`) +
      circ(x + w / 2 - 26 * s, y - 34 * s, 4 * s, ligado ? "#4cff6a" : "#555") +
      ret(x - 40 * s, y - 38 * s, 50 * s, 6 * s, "#b4ab93"),
  );
}

function gabinete(x: number, y: number, s: number, aberto = false): string {
  // (x, y) = canto inferior esquerdo
  const w = 100 * s;
  const h = 220 * s;
  let s2 = ret(x, y - h, w, h, "#d9d0b8") + ret(x + w, y - h + 6 * s, 18 * s, h - 6 * s, "#b3a98f");
  for (let i = 0; i < 3; i++) s2 += ret(x + 10 * s, y - h + 16 * s + i * 26 * s, w - 20 * s, 20 * s, "#c8bfa6", `stroke="#a59c84" stroke-width="2"`);
  s2 += circ(x + w / 2, y - 60 * s, 10 * s, "#bfb69e", `stroke="#8f876f" stroke-width="2"`) + circ(x + w / 2 + 26 * s, y - 60 * s, 3 * s, "#ff4d3a");
  if (aberto) {
    s2 += ret(x + w, y - h + 6 * s, 18 * s, h - 6 * s, "#2b3a2f");
    s2 += ret(x + w + 2 * s, y - h + 40 * s, 14 * s, 60 * s, "#2f7a3e") + circ(x + w + 9 * s, y - 70 * s, 7 * s, "#777");
  }
  return s2;
}

function notebook(c: Cena, x: number, y: number, s: number, tela: string, conteudo = "", corpo = "#3a3f47"): string {
  // (x, y) = centro da base
  const w = 300 * s;
  const h = 190 * s;
  return g(
    c.brilho(x, y - h / 2, 220 * s, tela, 0.3) +
      cam(`M${x - w / 2 + 14 * s},${y - h} L${x + w / 2 - 14 * s},${y - h} L${x + w / 2 - 10 * s},${y - 10 * s} L${x - w / 2 + 10 * s},${y - 10 * s} Z`, corpo) +
      ret(x - w / 2 + 26 * s, y - h + 12 * s, w - 52 * s, h - 34 * s, tela) +
      conteudo +
      cam(`M${x - w / 2 - 20 * s},${y} L${x + w / 2 + 20 * s},${y} L${x + w / 2 - 4 * s},${y - 12 * s} L${x - w / 2 + 4 * s},${y - 12 * s} Z`, "#575d66"),
  );
}

function linhasCodigo(x: number, y: number, w: number, h: number, n: number, cores: string[], esp = 0): string {
  let s = "";
  const lh = h / n;
  for (let i = 0; i < n; i++) {
    let xx = x + (i % 3 === 0 ? 0 : entre(8, 24) + esp);
    const fim = x + entre(w * 0.35, w * 0.95);
    while (xx < fim) {
      const ww = entre(10, 40);
      s += ret(xx, y + i * lh, Math.min(ww, fim - xx), lh * 0.5, escolhe(cores), `opacity="0.9"`);
      xx += ww + 6;
    }
  }
  return s;
}

function cadeiraEscola(x: number, y: number, s: number): string {
  return g(
    ret(x - 6 * s, y - 220 * s, 8 * s, 220 * s, "#55606a") +
      ret(x + 90 * s, y - 220 * s, 8 * s, 220 * s, "#55606a") +
      rr(x - 10 * s, y - 230 * s, 112 * s, 60 * s, 8 * s, "#c58b4f") +
      rr(x - 14 * s, y - 120 * s, 120 * s, 18 * s, 6 * s, "#b07a43") +
      // tampo da carteira na frente
      ret(x - 40 * s, y - 150 * s, 8 * s, 150 * s, "#4a545c") +
      ret(x + 130 * s, y - 150 * s, 8 * s, 150 * s, "#4a545c") +
      rr(x - 50 * s, y - 168 * s, 196 * s, 26 * s, 6 * s, "#e2c08e") +
      ret(x - 50 * s, y - 146 * s, 196 * s, 6 * s, "#000", `opacity="0.2"`) +
      ret(x - 30 * s, y - 140 * s, 156 * s, 40 * s, "#5a646c"),
  );
}

function bandeirinhas(x1: number, x2: number, y: number, sag: number, n: number, cores: string[], tam = 1): string {
  const cx = (x1 + x2) / 2;
  let s = `<path d="M${x1},${y} Q${cx},${y + sag * 2} ${x2},${y}" stroke="#4a3a2a" stroke-width="2" fill="none"/>`;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y;
    const w = 22 * tam;
    s += cam(`M${px - w},${py} L${px + w},${py} L${px + w},${py + 40 * tam} L${px},${py + 28 * tam} L${px - w},${py + 40 * tam} Z`, cores[i % cores.length], `opacity="0.95"`);
  }
  return s;
}

function poste(c: Cena, x: number, yBase: number, h: number, aceso: boolean, cor = "#ffc766"): string {
  const topo = yBase - h;
  return g(
    (aceso ? c.brilho(x + 70, topo + 30, 340, cor, 0.5) + c.brilho(x + 70, yBase, 300, cor, 0.25, 80) : "") +
      ret(x - 8, topo, 16, h, "#4c4c4c") +
      cam(`M${x},${topo + 10} Q${x + 30},${topo - 20} ${x + 80},${topo + 10}`, "none", `stroke="#4c4c4c" stroke-width="8"`) +
      elip(x + 80, topo + 18, 24, 10, aceso ? "#fff1c0" : "#8a8a8a"),
  );
}

function fios(pontos: [number, number][], cor = "#222", w = 2.5): string {
  let s = "";
  for (let i = 0; i < pontos.length - 1; i++) {
    const [ax, ay] = pontos[i];
    const [bx, by] = pontos[i + 1];
    s += `<path d="M${ax},${ay} Q${(ax + bx) / 2},${Math.max(ay, by) + 40} ${bx},${by}" stroke="${cor}" stroke-width="${w}" fill="none"/>`;
  }
  return s;
}

function orelhao(x: number, y: number, s: number): string {
  return g(
    ret(x - 6 * s, y - 260 * s, 12 * s, 260 * s, "#555") +
      cam(`M${x - 70 * s},${y - 250 * s} Q${x},${y - 350 * s} ${x + 70 * s},${y - 250 * s} Q${x + 80 * s},${y - 180 * s} ${x + 55 * s},${y - 140 * s} L${x - 55 * s},${y - 140 * s} Q${x - 80 * s},${y - 180 * s} ${x - 70 * s},${y - 250 * s} Z`, "#f0a020") +
      cam(`M${x - 50 * s},${y - 245 * s} Q${x},${y - 315 * s} ${x + 50 * s},${y - 245 * s} L${x + 40 * s},${y - 150 * s} L${x - 40 * s},${y - 150 * s} Z`, "#c97d10") +
      rr(x - 18 * s, y - 235 * s, 36 * s, 60 * s, 4 * s, "#3c3c3c") +
      rr(x - 12 * s, y - 228 * s, 24 * s, 12 * s, 2 * s, "#9fd0c0"),
  );
}

function kombi(x: number, y: number, s: number, cor1: string, cor2 = "#f4f1e8"): string {
  // (x, y) = base, centro
  const w = 360 * s;
  const h = 200 * s;
  const x0 = x - w / 2;
  return g(
    elip(x, y, w * 0.55, 14 * s, "#000", `opacity="0.25"`) +
      cam(`M${x0},${y - 30 * s} L${x0},${y - h + 40 * s} Q${x0},${y - h} ${x0 + 50 * s},${y - h} L${x0 + w - 40 * s},${y - h} Q${x0 + w},${y - h} ${x0 + w},${y - h + 50 * s} L${x0 + w},${y - 30 * s} Z`, cor2) +
      cam(`M${x0},${y - 30 * s} L${x0},${y - h * 0.5} L${x0 + w},${y - h * 0.5} L${x0 + w},${y - 30 * s} Z`, cor1) +
      cam(`M${x0 + w - 8 * s},${y - h * 0.5} L${x0 + w - 60 * s},${y - h * 0.5 - 10 * s} L${x0 + w - 8 * s},${y - h * 0.5 - 50 * s} Z`, cor1) +
      ret(x0 + 30 * s, y - h + 22 * s, 70 * s, 60 * s, "#7fa6b8") +
      ret(x0 + 115 * s, y - h + 22 * s, 70 * s, 60 * s, "#7fa6b8") +
      ret(x0 + 200 * s, y - h + 22 * s, 70 * s, 60 * s, "#7fa6b8") +
      cam(`M${x0 + 285 * s},${y - h + 22 * s} L${x0 + w - 18 * s},${y - h + 22 * s} L${x0 + w - 12 * s},${y - h + 82 * s} L${x0 + 285 * s},${y - h + 82 * s} Z`, "#9cc3d4") +
      circ(x0 + 80 * s, y - 24 * s, 34 * s, "#222") +
      circ(x0 + 80 * s, y - 24 * s, 16 * s, "#bbb") +
      circ(x0 + w - 80 * s, y - 24 * s, 34 * s, "#222") +
      circ(x0 + w - 80 * s, y - 24 * s, 16 * s, "#bbb") +
      circ(x0 + w - 6 * s, y - 70 * s, 10 * s, "#ffe9a8"),
  );
}

function onibusLateral(x: number, y: number, s: number, cor: string, faixa: string, letreiro: string): string {
  const w = 760 * s;
  const h = 300 * s;
  const x0 = x - w / 2;
  let jan = "";
  for (let i = 0; i < 6; i++) jan += rr(x0 + 120 * s + i * 100 * s, y - h + 40 * s, 86 * s, 90 * s, 6 * s, "#24323c");
  return g(
    elip(x, y, w * 0.52, 16 * s, "#000", `opacity="0.3"`) +
      rr(x0, y - h, w, h - 20 * s, 26 * s, cor) +
      ret(x0, y - h * 0.45, w, 30 * s, faixa) +
      ret(x0, y - h * 0.32, w, 12 * s, faixa, `opacity="0.7"`) +
      jan +
      rr(x0 + 18 * s, y - h + 40 * s, 86 * s, 170 * s, 6 * s, "#2d3e4a") +
      rr(x0 + 150 * s, y - h + 6 * s, 300 * s, 28 * s, 4 * s, "#111") +
      txt(x0 + 300 * s, y - h + 28 * s, letreiro, 22 * s, "#ffb400", { fonte: MONO, peso: "bold" }) +
      circ(x0 + 140 * s, y - 20 * s, 44 * s, "#1d1d1d") +
      circ(x0 + 140 * s, y - 20 * s, 20 * s, "#9a9a9a") +
      circ(x0 + w - 140 * s, y - 20 * s, 44 * s, "#1d1d1d") +
      circ(x0 + w - 140 * s, y - 20 * s, 20 * s, "#9a9a9a"),
  );
}

function telaGrafico(x: number, y: number, w: number, h: number, cor: string, fundo = "#0b1a2a"): string {
  let d = `M${x + 10},${y + h - 20}`;
  const n = 14;
  for (let i = 1; i <= n; i++) d += ` L${(x + 10 + ((w - 20) / n) * i).toFixed(1)},${(y + h * entre(0.25, 0.85)).toFixed(1)}`;
  let barras = "";
  for (let i = 0; i < 8; i++) {
    const bh = entre(h * 0.1, h * 0.3);
    barras += ret(x + 14 + i * ((w - 28) / 8), y + h - 10 - bh, (w - 28) / 8 - 6, bh, cor, `opacity="0.35"`);
  }
  return ret(x, y, w, h, fundo) + barras + `<path d="${d}" stroke="${cor}" stroke-width="3" fill="none"/>` + ret(x, y, w, 18, "#ffffff", `opacity="0.06"`);
}

function lousa(x: number, y: number, w: number, h: number, cor = "#2f5d46"): string {
  return ret(x - 18, y - 18, w + 36, h + 36, "#8a5c3b") + ret(x, y, w, h, cor) + ret(x, y, w, h, "#fff", `opacity="0.04"`) + ret(x - 10, y + h + 18, w + 20, 14, "#7a5033");
}

function quadro(x: number, y: number, w: number, h: number, moldura: string, dentro: string): string {
  return ret(x + 6, y + 8, w, h, "#000", `opacity="0.2"`) + ret(x, y, w, h, moldura) + g(dentro);
}

function cadeiraPlastico(x: number, y: number, s: number, cor = "#e8e6e0"): string {
  return g(
    cam(`M${x - 50 * s},${y - 120 * s} L${x + 50 * s},${y - 120 * s} L${x + 46 * s},${y - 60 * s} L${x - 46 * s},${y - 60 * s} Z`, cor) +
      ret(x - 60 * s, y - 60 * s, 120 * s, 16 * s, cor) +
      linha(x - 54 * s, y - 44 * s, x - 66 * s, y, cor, 10 * s) +
      linha(x + 54 * s, y - 44 * s, x + 66 * s, y, cor, 10 * s),
  );
}

function headset(x: number, y: number, s: number): string {
  return g(
    `<path d="M${x - 22 * s},${y} Q${x},${y - 34 * s} ${x + 22 * s},${y}" stroke="#222" stroke-width="${5 * s}" fill="none"/>` +
      elip(x - 22 * s, y + 2 * s, 7 * s, 10 * s, "#333") +
      elip(x + 22 * s, y + 2 * s, 7 * s, 10 * s, "#333"),
  );
}

function holofote(c: Cena, xTopo: number, yTopo: number, xAlvo: number, yAlvo: number, larg: number, cor: string, op = 0.25): string {
  const grad = c.lin([
    [0, cor, op],
    [1, cor, 0],
  ], 0, 0, 0, 1);
  return cam(`M${xTopo - 14},${yTopo} L${xTopo + 14},${yTopo} L${xAlvo + larg},${yAlvo} L${xAlvo - larg},${yAlvo} Z`, grad, c.blur(10));
}

function confete(n: number, x0: number, x1: number, y0: number, y1: number, cores: string[]): string {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = entre(x0, x1);
    const y = entre(y0, y1);
    s += ret(x, y, entre(6, 14), entre(10, 22), escolhe(cores), `transform="rotate(${entre(0, 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" opacity="${entre(0.6, 1).toFixed(2)}"`);
  }
  return s;
}

function garoa(c: Cena, n: number, op = 0.35): string {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = entre(-50, 1100);
    const y = entre(0, 1900);
    const l = entre(30, 70);
    s += linha(x, y, x - l * 0.25, y + l, "#dfe8f0", entre(1, 2.5), `opacity="${entre(op * 0.4, op).toFixed(2)}"`);
  }
  return g(s, c.blur(0.6));
}

function guardaChuva(x: number, y: number, s: number, cor: string): string {
  return g(
    cam(`M${x - 90 * s},${y} Q${x},${y - 100 * s} ${x + 90 * s},${y} Q${x + 60 * s},${y - 14 * s} ${x + 30 * s},${y} Q${x},${y - 14 * s} ${x - 30 * s},${y} Q${x - 60 * s},${y - 14 * s} ${x - 90 * s},${y} Z`, cor) +
      linha(x, y - 50 * s, x, y + 110 * s, "#222", 4 * s),
  );
}

function carro(x: number, y: number, s: number, cor: string, farol = false): string {
  const w = 300 * s;
  return g(
    elip(x, y, w * 0.55, 12 * s, "#000", `opacity="0.3"`) +
      cam(`M${x - w / 2},${y - 20 * s} L${x - w / 2},${y - 70 * s} Q${x - w / 2 + 10 * s},${y - 90 * s} ${x - w / 2 + 50 * s},${y - 92 * s} L${x - 70 * s},${y - 96 * s} Q${x - 40 * s},${y - 150 * s} ${x + 20 * s},${y - 150 * s} L${x + 60 * s},${y - 150 * s} Q${x + 90 * s},${y - 140 * s} ${x + 110 * s},${y - 96 * s} L${x + w / 2 - 10 * s},${y - 88 * s} Q${x + w / 2},${y - 70 * s} ${x + w / 2},${y - 20 * s} Z`, cor) +
      cam(`M${x - 56 * s},${y - 98 * s} Q${x - 34 * s},${y - 138 * s} ${x + 10 * s},${y - 138 * s} L${x + 10 * s},${y - 98 * s} Z`, "#2c3a44") +
      cam(`M${x + 22 * s},${y - 98 * s} L${x + 22 * s},${y - 138 * s} L${x + 56 * s},${y - 138 * s} Q${x + 80 * s},${y - 126 * s} ${x + 94 * s},${y - 98 * s} Z`, "#2c3a44") +
      circ(x - w / 2 + 70 * s, y - 18 * s, 30 * s, "#1b1b1b") +
      circ(x + w / 2 - 70 * s, y - 18 * s, 30 * s, "#1b1b1b") +
      circ(x - w / 2 + 70 * s, y - 18 * s, 13 * s, "#999") +
      circ(x + w / 2 - 70 * s, y - 18 * s, 13 * s, "#999") +
      (farol ? elip(x + w / 2 - 6 * s, y - 60 * s, 10 * s, 7 * s, "#fff4c8") + elip(x - w / 2 + 6 * s, y - 60 * s, 8 * s, 6 * s, "#ff3b30") : ""),
  );
}

// ---------------------------------------------------------------------------
// Cenas
// ---------------------------------------------------------------------------

function casaCozinha(): string {
  const c = new Cena("casa_cozinha");
  semear(101);
  const paisagem =
    morro(300, 780, 560, 760, 30, 4, "#9cb87a", c.blur(3)) +
    morro(300, 780, 610, 760, 25, 5, "#6f9a4c") +
    arvore(c, 640, 650, 0.45, "#3f7a35", "#6aa64f") +
    ret(300, 640, 480, 4, "#8a6a4a") +
    ret(320, 612, 4, 40, "#8a6a4a") +
    ret(420, 612, 4, 40, "#8a6a4a") +
    ret(520, 612, 4, 40, "#8a6a4a") +
    nuvem(420, 360, 0.6, "#fff", 0.8, c.blur(2));
  const vapor = g(
    `<path d="M905,980 C880,930 940,900 905,850 C880,810 930,780 910,740" stroke="#fff" stroke-width="18" fill="none" opacity="0.35" stroke-linecap="round"/>` +
      `<path d="M940,975 C960,930 915,890 945,850 C965,820 930,790 950,760" stroke="#fff" stroke-width="12" fill="none" opacity="0.25" stroke-linecap="round"/>`,
    c.blur(6),
  );
  let panelas = "";
  [
    [80, 470, 60],
    [190, 460, 48],
    [280, 480, 36],
  ].forEach(([x, y, r]) => {
    panelas += circ(x, y - r - 18, 5, "#444") + linha(x, y - r - 18, x, y - r + 4, "#555", 3) + circ(x, y, r, c.rad([[0, "#f5f5f5"], [0.6, "#c8ccd0"], [1, "#8d9399"]], 0.35, 0.35, 0.7)) + circ(x, y, r * 0.65, "none", `stroke="#a7adb3" stroke-width="2"`);
  });
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f3d9a4"], [1, "#e6bf86"]])) +
    // telhado aparente
    ret(0, 0, 1080, 120, "#5b3b26") +
    (() => {
      let s = "";
      for (let x = 0; x < 1080; x += 54) s += ret(x, 0, 50, 92, "#a8553a") + ret(x, 70, 50, 8, "#7d3a27");
      for (let x = 30; x < 1080; x += 240) s += ret(x, 0, 26, 130, "#6b4a33");
      return s + ret(0, 112, 1080, 22, "#4a301f");
    })() +
    // azulejo
    ret(0, 780, 1080, 580, azulejo(c)) +
    ret(0, 770, 1080, 16, "#3a6fb0") +
    // janela
    janela(c, 320, 260, 440, 400, { ceu: [[0, "#7ec0ee"], [1, "#d9f0ff"]], paisagem, moldura: "#2f7f8a", cortina: chita(c) }) +
    c.brilho(540, 760, 420, "#fff3d0", 0.35, 260) +
    cam(`M330,700 L760,700 L980,1360 L120,1360 Z`, "#fff8e0", `opacity="0.12" ${c.blur(14)}`) +
    // panelas penduradas
    ret(30, 400, 300, 10, "#6b4a33") +
    panelas +
    // calendário
    calendario(830, 270, 190, "MERCADINHO", "Bom Preço", "2012  Deus é fiel") +
    // fio de gambiarra
    `<path d="M540,128 C700,140 760,200 800,240 C810,250 812,560 812,720 C812,760 760,790 700,800" stroke="#222" stroke-width="3" fill="none"/>` +
    rr(684, 790, 36, 40, 4, "#f2f2f2", `stroke="#999"`) +
    rr(668, 820, 30, 30, 4, "#fafafa", `stroke="#999" transform="rotate(-20 683 835)"`) +
    `<path d="M683,850 C670,900 620,880 600,910" stroke="#222" stroke-width="3" fill="none"/>` +
    // rádio
    rr(560, 892, 130, 74, 10, "#7b2d26") +
    circ(600, 930, 24, "#3a2a25") +
    ret(636, 908, 42, 10, "#e0c47a") +
    linha(670, 892, 720, 820, "#999", 3) +
    // pia
    ret(300, 960, 480, 50, "#8f9499") +
    ret(300, 960, 480, 10, "#b9bfc4") +
    ret(320, 1010, 440, 340, "#e8e1d2") +
    linha(540, 1010, 540, 1350, "#cfc6b4", 3) +
    `<path d="M520,960 L520,920 Q520,900 545,900 L560,900" stroke="#c0c6cc" stroke-width="10" fill="none"/>` +
    rr(380, 900, 90, 60, 6, "#d9dde0", `opacity="0.8"`) +
    circ(400, 905, 26, "#f0f0f0", `stroke="#ccc"`) +
    circ(440, 898, 22, "#f6e6d0", `stroke="#d9b88f"`) +
    // filtro de barro
    ret(60, 1060, 240, 20, "#7a5235") +
    ret(70, 1080, 14, 270, "#6b4a33") +
    ret(276, 1080, 14, 270, "#6b4a33") +
    elip(180, 1000, 76, 62, c.rad([[0, "#d98a5c"], [1, "#9c4d2c"]], 0.35, 0.3, 0.75)) +
    elip(180, 880, 66, 56, c.rad([[0, "#df9465"], [1, "#a3532f"]], 0.35, 0.3, 0.75)) +
    elip(180, 830, 50, 14, "#8a4224") +
    circ(180, 816, 12, "#8a4224") +
    ret(240, 1010, 26, 10, "#c9ccce") +
    ret(258, 1010, 8, 22, "#c9ccce") +
    ret(214, 1030, 30, 30, "#e9f3f6", `opacity="0.85" stroke="#b9c7cc"`) +
    // toalha de chita na pia? pano de prato
    ret(560, 1010, 60, 110, chita(c), `transform="rotate(4 590 1010)"`) +
    // fogão
    rr(780, 1000, 260, 360, 8, "#f1f1ef") +
    ret(780, 1000, 260, 30, "#d8d8d4") +
    ret(800, 1060, 220, 150, "#2a2a2a", `opacity="0.85"`) +
    ret(810, 1070, 200, 130, "#3a3a3a") +
    circ(820, 1240, 10, "#333") +
    circ(860, 1240, 10, "#333") +
    circ(900, 1240, 10, "#333") +
    circ(940, 1240, 10, "#333") +
    rr(860, 900, 110, 100, 18, c.lin([[0, "#d8dde2"], [1, "#9aa2aa"]], 0, 0, 1, 0)) +
    ret(845, 890, 140, 18, "#a3abb3") +
    circ(915, 870, 10, "#444") +
    linha(915, 870, 915, 845, "#444", 5) +
    vapor +
    // lâmpada
    lampadaPendente(c, 540, 130, 220, "#ffd88a", 0.4) +
    // piso vermelhão
    piso(c, 1350, "#b04a33", "#7a2e22") +
    elip(540, 1560, 520, 140, "#fff", `opacity="0.06"`);
  return c.fim(corpo);
}

function casaQuartoInfancia(): string {
  const c = new Cena("casa_quarto_infancia");
  semear(202);
  const paisagem =
    morro(620, 980, 520, 700, 22, 3, "#e6b98a", c.blur(3)) +
    morro(620, 980, 580, 700, 22, 4, "#b28a5a") +
    ret(620, 640, 360, 60, "#a07a4c") +
    circ(880, 420, 36, "#ffe7a8");
  const mancha = cam(`M70,140 C160,120 240,170 220,250 C210,320 120,300 90,360 C60,300 20,220 70,140 Z`, "#8f9a7a", `opacity="0.25" ${c.blur(10)}`);
  let estrelinhas = "";
  for (let i = 0; i < 9; i++) {
    const x = entre(280, 560);
    const y = entre(160, 360);
    estrelinhas += cam(`M${x},${y - 12} L${x + 4},${y - 3} L${x + 13},${y - 3} L${x + 6},${y + 3} L${x + 9},${y + 12} L${x},${y + 6} L${x - 9},${y + 12} L${x - 6},${y + 3} L${x - 13},${y - 3} L${x - 4},${y - 3} Z`, "#e9f59a", `opacity="0.75"`);
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#9ec3c9"], [1, "#7fa8b0"]])) +
    ret(0, 820, 1080, 540, "#6c949c") +
    ret(0, 812, 1080, 12, "#557c84") +
    mancha +
    estrelinhas +
    // janela com cortina de chita
    janela(c, 640, 300, 320, 380, { ceu: [[0, "#f6b26b"], [1, "#ffe1b0"]], paisagem, moldura: "#e9e4d6", cortina: chita(c) }) +
    c.brilho(800, 700, 380, "#ffcf8a", 0.35, 260) +
    // desenho infantil colado
    g(
      ret(300, 420, 200, 150, "#fdfbf4") +
        circ(350, 470, 22, "#f5c23a") +
        cam(`M320,560 L370,500 L410,540 L450,490 L490,560 Z`, "#5aa04a") +
        txt(400, 448, "eu e a mãe", 20, "#c0392b", { fonte: MAO }) +
        fita(400, 420),
      `transform="rotate(-4 400 495)"`,
    ) +
    // pôster de bichos / alfabeto
    quadro(300, 620, 200, 130, "#f6efe0", txt(400, 660, "A B C D", 30, "#1f6fb2", { fonte: MAO, peso: "bold" }) + txt(400, 705, "E F G H", 30, "#d2462e", { fonte: MAO, peso: "bold" }) + txt(400, 740, "I J K...", 24, "#2f8a4a", { fonte: MAO })) +
    // beliche
    ret(30, 520, 24, 840, "#8a5a36") +
    ret(250, 520, 24, 840, "#8a5a36") +
    ret(30, 640, 244, 70, "#9b6a42") +
    ret(42, 600, 220, 50, c.lin([[0, "#f4d36b"], [1, "#e2b74a"]])) +
    rr(52, 570, 90, 44, 18, "#fff", `opacity="0.92"`) +
    ret(30, 1060, 244, 70, "#9b6a42") +
    ret(42, 1010, 220, 56, chita(c)) +
    rr(150, 980, 96, 44, 18, "#f2efe6") +
    ret(30, 540, 244, 18, "#8a5a36") +
    // escada
    (() => {
      let s = "";
      for (let y = 760; y < 1060; y += 70) s += ret(254, y, 40, 12, "#7a4e2e");
      return s;
    })() +
    // urso e boneca no beliche
    circ(200, 590, 22, "#a8754c") +
    circ(186, 570, 9, "#a8754c") +
    circ(214, 570, 9, "#a8754c") +
    // cômoda com TV de tubo
    ret(640, 960, 340, 400, "#b07a4a") +
    ret(660, 990, 300, 100, "#9a6740") +
    ret(660, 1110, 300, 100, "#9a6740") +
    ret(660, 1230, 300, 100, "#9a6740") +
    circ(810, 1040, 8, "#e0c08a") +
    circ(810, 1160, 8, "#e0c08a") +
    circ(810, 1280, 8, "#e0c08a") +
    rr(690, 760, 240, 200, 16, "#3b3b3e") +
    rr(712, 780, 170, 150, 22, c.rad([[0, "#6aa1c0"], [1, "#1f3a4a"]])) +
    circ(906, 820, 8, "#777") +
    circ(906, 850, 8, "#777") +
    // antena com palha de aço
    linha(760, 760, 700, 640, "#777", 4) +
    linha(860, 760, 920, 630, "#777", 4) +
    circ(700, 636, 16, "#cfd2d4", `stroke="#999" stroke-dasharray="3 3"`) +
    circ(920, 626, 16, "#cfd2d4", `stroke="#999" stroke-dasharray="3 3"`) +
    // ventilador no banquinho
    ventiladorMesa(470, 1350, 0.75) +
    // lâmpada
    lampadaPendente(c, 540, 0, 90, "#ffe0a0", 0.3) +
    // piso de cimento queimado
    piso(c, 1350, "#9b8c7a", "#6e6152") +
    elip(520, 1520, 260, 70, "#c45a3a", `opacity="0.55"`) +
    elip(520, 1520, 200, 50, "#e0a03a", `opacity="0.45"`);
  return c.fim(corpo);
}

function quartoAdolescente(): string {
  const c = new Cena("quarto_adolescente");
  semear(303);
  const tela = linhasCodigo(372, 742, 186, 120, 9, ["#7CFC9A", "#5ad1ff", "#e8e8e8"]);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#5a4f7a"], [1, "#3e3658"]])) +
    // janela entardecer
    janela(c, 690, 220, 300, 340, {
      ceu: [[0, "#2f2a5a"], [0.6, "#c0577a"], [1, "#f4a259"]],
      paisagem: predios(c, 690, 990, 560, 40, 120, "#2a2440", "#ffd27a", 0.25) + circ(920, 300, 4, "#fff") + circ(760, 280, 3, "#fff"),
      moldura: "#ddd6c8",
      cortina: "#6b8fb3",
    }) +
    // pôsteres e bilhetes
    quadro(70, 170, 240, 320, "#111", txt(190, 260, "sudo", 54, "#7CFC9A", { fonte: MONO, peso: "bold" }) + txt(190, 320, "dormir", 54, "#7CFC9A", { fonte: MONO, peso: "bold" }) + txt(190, 400, "[sudo] senha:", 22, "#9ad", { fonte: MONO }) + txt(190, 440, "********", 22, "#9ad", { fonte: MONO })) +
    quadro(360, 200, 240, 180, "#f2e8d0", circ(480, 280, 60, "#1c3d5a") + cam(`M455,290 L455,265 Q480,235 505,265 L505,290`, "none", `stroke="#f5c542" stroke-width="10"`) + rr(445, 288, 70, 52, 6, "#f5c542") + txt(480, 362, "TRANCA TUDO", 22, "#1c3d5a", { peso: "bold" })) +
    bilhete(380, 430, 210, 120, ["Wi-Fi: CasaDaVó_2G", "senha: 12345678", "(não muda!!)"], 20, 3) +
    bilhete(110, 540, 170, 100, ["prova de", "mat. sexta"], 22, -6, "#bfe6ff") +
    // fios na parede (gambiarra)
    `<path d="M0,690 C200,700 300,660 420,700 C520,730 600,690 690,720" stroke="#1a1a1a" stroke-width="4" fill="none"/>` +
    `<path d="M0,710 C220,720 330,690 450,730" stroke="#c0392b" stroke-width="3" fill="none"/>` +
    ret(60, 690, 70, 16, "#cfcfcf") +
    // mesa
    ret(260, 960, 720, 40, "#7a5235") +
    ret(260, 1000, 720, 14, "#5c3d27") +
    ret(280, 1014, 22, 340, "#5c3d27") +
    ret(940, 1014, 22, 340, "#5c3d27") +
    // monitor e gabinete aberto
    crt(c, 465, 960, 1.25, "#0e2a1f", tela) +
    gabinete(720, 958, 1.2, true) +
    `<path d="M742,700 C760,660 820,650 860,700" stroke="#3b6" stroke-width="3" fill="none"/>` +
    // teclado de outra cor e mouse
    cam(`M330,958 L600,958 L590,935 L340,935 Z`, "#2c2c2c") +
    (() => {
      let s = "";
      for (let i = 0; i < 12; i++) s += ret(350 + i * 20, 940, 14, 6, "#555");
      return s;
    })() +
    elip(640, 950, 18, 10, "#e0e0e0") +
    // caixa de som remendada
    ret(880, 860, 60, 98, "#222") +
    circ(910, 900, 18, "#444") +
    ret(876, 880, 70, 14, "#c9c19a", `opacity="0.85" transform="rotate(-12 910 887)"`) +
    // extensão T com tudo plugado
    rr(820, 1100, 110, 36, 6, "#f2f2f2", `stroke="#aaa"`) +
    ret(830, 1080, 22, 24, "#222") +
    ret(862, 1080, 22, 24, "#2a5") +
    ret(894, 1080, 22, 24, "#d33") +
    rr(860, 1060, 30, 30, 4, "#fff", `stroke="#aaa" transform="rotate(15 875 1075)"`) +
    `<path d="M840,1080 C840,1040 760,1040 760,1000" stroke="#222" stroke-width="4" fill="none"/>` +
    `<path d="M873,1080 C900,1020 960,1060 990,990" stroke="#222" stroke-width="4" fill="none"/>` +
    `<path d="M930,1118 C990,1130 1040,1200 1080,1210" stroke="#222" stroke-width="5" fill="none"/>` +
    // copo e caderno
    rr(300, 900, 40, 58, 4, "#e9f3f6", `opacity="0.8"`) +
    ret(620, 948, 120, 10, "#d9534f") +
    // luminária
    linha(330, 960, 330, 760, "#333", 6) +
    cam(`M290,760 L370,760 L350,720 L310,720 Z`, "#c0392b") +
    c.brilho(330, 830, 340, "#ffd38a", 0.4) +
    // cama
    ret(0, 1120, 230, 240, "#33415c") +
    ret(0, 1100, 230, 40, chita(c)) +
    piso(c, 1350, "#8a7a68", "#5e5244");
  return c.fim(corpo);
}

function escolaSala(): string {
  const c = new Cena("escola_sala");
  semear(404);
  let carteiras = "";
  for (let r = 0; r < 2; r++) {
    for (let k = 0; k < 4; k++) {
      const s = 0.8 + r * 0.25;
      const x = 160 + k * 230 + (r ? -30 : 0);
      carteiras += cadeiraEscola(x, 1240 + r * 120, s);
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, "#f1e6c8") +
    ret(0, 860, 1080, 500, "#d9a85a") +
    ret(0, 850, 1080, 14, "#b9873e") +
    // lousa
    lousa(150, 300, 780, 400) +
    txt(540, 380, "Bom dia, 7º ano B!", 48, "#f3f3ea", { fonte: MAO }) +
    txt(270, 460, "Dever: pág. 47", 30, "#e9efe0", { fonte: MAO, ancora: "start" }) +
    txt(270, 520, "Senha forte = frase longa", 30, "#f7e39a", { fonte: MAO, ancora: "start" }) +
    txt(860, 660, "15/03", 28, "#f3f3ea", { fonte: MAO }) +
    cam(`M700,560 Q780,520 860,560`, "none", `stroke="#fff" stroke-width="3" opacity="0.5"`) +
    ret(260, 718, 60, 12, "#fff") +
    ret(340, 720, 40, 10, "#ffe07a") +
    // relógio e ventiladores
    relogio(540, 190, 46, 10, 25) +
    ventiladorTeto(c, 230, 60, 0.7) +
    ventiladorTeto(c, 850, 60, 0.7) +
    // mural feira de ciências
    quadro(30, 380, 100, 300, "#c99a6a", bilhete(40, 400, 80, 60, ["ciên-", "cias"], 16, -3, "#fff") + bilhete(40, 480, 80, 70, ["horta"], 16, 4, "#bfe6ff") + bilhete(40, 570, 80, 60, ["vulcão"], 16, -2, "#ffd0d0")) +
    // janelas com grade à direita
    janela(c, 960, 360, 120, 420, { ceu: [[0, "#8fd0f5"], [1, "#e6f6ff"]], paisagem: arvore(c, 1030, 800, 0.8, "#3f7a35", "#79b85a"), moldura: "#5a7fa0", div: 1, grade: true }) +
    // pichação na carteira da frente e cartaz
    placa(360, 760, 360, 70, "#ffffff", [{ t: "PROIBIDO CELULAR EM SALA", tam: 26, cor: "#c0392b" }], { rot: -1, fonte: SANS }) +
    txt(160, 840, "Larissa ama J.", 22, "#2b4c9a", { fonte: MAO, rot: -6, op: 0.7 }) +
    fluorescente(c, 330, 140, 160, 0.4) +
    fluorescente(c, 600, 140, 160, 0.4) +
    piso(c, 1350, "#c9bfae", "#9a8f7e", "#7a7060") +
    g(carteiras, c.blur(1.2));
  return c.fim(corpo);
}

function escolaLaboratorio(): string {
  const c = new Cena("escola_laboratorio");
  semear(505);
  let pcs = "";
  for (let r = 0; r < 2; r++) {
    const y = 860 + r * 210;
    const s = 0.7 + r * 0.2;
    pcs += ret(40, y, 1000, 26, "#bcae94") + ret(40, y + 26, 1000, 140 + r * 40, "#a3957a");
    for (let k = 0; k < 4; k++) {
      const x = 160 + k * 255;
      const lig = rnd() < 0.6;
      pcs += crt(c, x, y, s, lig ? "#1f5aa8" : "#222", lig ? ret(x - 60 * s, y - 150 * s, 120 * s, 10 * s, "#fff", `opacity="0.5"`) : "", lig);
      if (!lig) pcs += placa(x - 50 * s, y - 130 * s, 100 * s, 40 * s, "#fffbe0", [{ t: "QUEBRADO", tam: 14 * s, cor: "#c0392b" }], { rot: -8 });
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#d7e3e6"], [1, "#b9cbd0"]])) +
    ret(0, 720, 1080, 640, "#8fb0b8") +
    // ar-condicionado com aviso
    rr(680, 180, 300, 110, 8, "#f4f4f2") +
    ret(700, 260, 260, 10, "#ccc") +
    bilhete(730, 300, 220, 80, ["NÃO LIGAR", "(goteira)"], 22, 4, "#fff", "#c0392b") +
    // placa do laboratório
    placa(90, 180, 500, 120, "#1f4e79", [{ t: "LABORATÓRIO DE INFORMÁTICA", tam: 28, cor: "#fff" }, { t: "Prof.ª Neide", tam: 24, cor: "#ffe07a" }], { fonte: SANS }) +
    // armário com cadeado
    ret(60, 360, 260, 340, "#7d8a90") +
    ret(70, 370, 115, 320, "#8e9ba1") +
    ret(195, 370, 115, 320, "#8e9ba1") +
    `<path d="M175,520 L175,500 Q190,480 205,500 L205,520" stroke="#cdb35a" stroke-width="7" fill="none"/>` +
    rr(168, 518, 44, 40, 6, "#e0b82e") +
    circ(190, 535, 5, "#6b5a1a") +
    placa(80, 600, 220, 70, "#fff", [{ t: "Chave na secretaria", tam: 20, cor: "#333" }], { rot: -2 }) +
    // regras
    placa(380, 360, 260, 300, "#fffdf2", [
      { t: "REGRAS", tam: 30, cor: "#c0392b" },
      { t: "1. Sem lanche", tam: 22 },
      { t: "2. Sem joguinho", tam: 22 },
      { t: "3. Não mexer", tam: 22 },
      { t: "no cabo azul", tam: 22 },
      { t: "4. Desligar no", tam: 22 },
      { t: "botão, não na", tam: 22 },
      { t: "tomada!!!", tam: 22 },
    ]) +
    // janela com grade
    janela(c, 720, 420, 300, 260, { ceu: [[0, "#9fd6f7"], [1, "#eaf7ff"]], paisagem: arvore(c, 900, 760, 0.7, "#3f7a35", "#79b85a"), moldura: "#6b8fa0", div: 2, grade: true }) +
    fluorescente(c, 160, 100, 200, 0.5) +
    fluorescente(c, 720, 100, 200, 0.5) +
    pcs +
    piso(c, 1360, "#b8b2a2", "#8c8676", "#6f6a5c");
  return c.fim(corpo);
}

function lanHouse(): string {
  const c = new Cena("lan_house");
  semear(606);
  let cabines = "";
  for (let k = 0; k < 4; k++) {
    const x = 30 + k * 262;
    const cor = ["#2f7de1", "#e14f7a", "#29b36b", "#f0a020"][k];
    cabines += ret(x, 760, 240, 440, "#1b2030") + ret(x, 760, 240, 12, cor) + txt(x + 120, 810, `PC ${k + 1}`, 34, cor, { peso: "bold" });
    const tela = [
      linhasCodigo(x + 50, 900, 140, 90, 7, ["#7cf", "#fff", "#fc6"]),
      ret(x + 46, 890, 148, 110, "#3a7a2a") + circ(x + 120, 940, 26, "#f5c542"),
      ret(x + 46, 890, 148, 110, "#5b2a6e") + ret(x + 60, 920, 120, 10, "#fff", `opacity="0.6"`),
      ret(x + 46, 890, 148, 110, "#e9e9e9") + ret(x + 56, 900, 128, 14, "#4a6ea9"),
    ][k];
    cabines += crt(c, x + 120, 1050, 0.95, ["#0e2a3f", "#2f6a2a", "#3a1f4a", "#cfcfcf"][k], tela);
    cabines += ret(x + 10, 1050, 220, 20, "#3a2f28") + cam(`M${x + 60},1048 L${x + 180},1048 L${x + 172},1030 L${x + 68},1030 Z`, "#111");
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#1a1530"], [1, "#2a2140"]])) +
    // parede de azulejo encardido no fundo
    ret(0, 0, 1080, 760, azulejo(c, "#cfd6cf", "#7a9a8a", 50), `opacity="0.16"`) +
    // placas
    placa(60, 120, 300, 130, "#fff200", [{ t: "IMPRESSÃO R$1", tam: 34, cor: "#c0001a" }, { t: "colorida R$2", tam: 24, cor: "#333" }], { rot: -3 }) +
    placa(400, 100, 280, 160, "#ffffff", [{ t: "HORA R$ 1,50", tam: 36, cor: "#1a3ea8" }, { t: "meia hora R$1", tam: 24 }, { t: "fiado só amanhã", tam: 22, cor: "#c0392b" }], { rot: 2, borda: "#1a3ea8" }) +
    placa(720, 130, 300, 120, "#ff5a7a", [{ t: "PROIBIDO JOGO", tam: 28, cor: "#fff" }, { t: "DEPOIS DAS 22H", tam: 28, cor: "#fff" }], { rot: -2 }) +
    placa(80, 300, 260, 110, "#e8f7ff", [{ t: "Xerox R$0,25", tam: 28, cor: "#222" }, { t: "Currículo na hora", tam: 20, cor: "#555" }], { rot: 3 }) +
    placa(380, 300, 320, 110, "#fff", [{ t: "Não aceitamos", tam: 24 }, { t: "moeda de 1 centavo", tam: 24, cor: "#c0392b" }], { rot: -1 }) +
    placa(740, 300, 260, 120, "#f5e663", [{ t: "Proibido rede", tam: 24 }, { t: "social de fofoca", tam: 24 }, { t: "no PC 3", tam: 20, cor: "#c0392b" }], { rot: 4 }) +
    // cordão de luzinhas
    (() => {
      let s = `<path d="M0,470 Q270,540 540,480 Q810,420 1080,500" stroke="#333" stroke-width="2" fill="none"/>`;
      const cores = ["#ff4d6d", "#ffd23f", "#3bceac", "#5ab0ff"];
      for (let i = 0; i < 22; i++) {
        const x = i * 52 + 10;
        const y = i < 11 ? 470 + Math.sin((i / 10) * Math.PI) * 45 : 480 - Math.sin(((i - 10) / 11) * Math.PI) * 40 + 10;
        s += circ(x, y + 8, 7, cores[i % 4]) + c.brilho(x, y + 8, 30, cores[i % 4], 0.6);
      }
      return s;
    })() +
    // ventilador de parede
    ventiladorMesa(980, 700, 0.6) +
    // gambiarra de fios por cima das cabines
    `<path d="M0,620 C200,600 400,660 600,620 C800,580 950,640 1080,610" stroke="#111" stroke-width="5" fill="none"/>` +
    `<path d="M0,640 C260,660 520,600 760,650 C900,680 1000,650 1080,660" stroke="#262626" stroke-width="4" fill="none"/>` +
    rr(500, 630, 60, 26, 4, "#ccc") +
    c.brilho(540, 980, 700, "#5ab0ff", 0.25, 400) +
    cabines +
    piso(c, 1360, "#3a3430", "#1f1b18", "#555");
  return c.fim(corpo, true);
}

function bibliotecaMunicipal(): string {
  const c = new Cena("biblioteca_municipal");
  semear(707);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e9dcc0"], [1, "#d1bf9a"]])) +
    // janela alta central com raios
    janela(c, 420, 140, 240, 560, { ceu: [[0, "#bfe2f7"], [1, "#fff6dc"]], paisagem: arvore(c, 540, 780, 1, "#4d8a3c", "#8cc56a", c.blur(3)), moldura: "#8a6a4a", div: 2 }) +
    cam(`M420,300 L660,300 L900,1360 L200,1360 Z`, "#fff4cf", `opacity="0.18" ${c.blur(18)}`) +
    // poeira no raio
    (() => {
      let s = "";
      for (let i = 0; i < 40; i++) s += circ(entre(300, 800), entre(400, 1300), entre(1, 3), "#fff", `opacity="${entre(0.3, 0.8).toFixed(2)}"`);
      return s;
    })() +
    estante(20, 140, 360, 1220, 6) +
    estante(700, 140, 360, 1220, 6) +
    // placas
    placa(450, 760, 180, 70, "#fff", [{ t: "SILÊNCIO", tam: 30, cor: "#7a1f1f" }], { fonte: SANS }) +
    placa(430, 850, 220, 90, "#fff6b5", [{ t: "Aceitamos doação", tam: 20 }, { t: "de livros", tam: 20 }], { rot: -3 }) +
    placa(60, 60, 960, 60, "#5a3d2b", [{ t: "BIBLIOTECA PÚBLICA MUNICIPAL MONTEIRO LOBATO", tam: 26, cor: "#f3e3b8" }], { fonte: SANS }) +
    // balcão com PC velho e carimbo
    ret(380, 1060, 320, 300, "#7a5235") +
    ret(370, 1040, 340, 30, "#8c623f") +
    crt(c, 470, 1040, 0.6, "#c9d9a0", ret(420, 960, 80, 8, "#335", `opacity="0.6"`)) +
    ret(580, 1000, 90, 40, "#3b6aa0") +
    ret(590, 980, 70, 22, "#e8e0cc") +
    rr(610, 1015, 30, 25, 4, "#8a2a2a") +
    ventiladorTeto(c, 540, 0, 0.8) +
    piso(c, 1360, "#a77a52", "#6e4c31", "#5a3c27");
  return c.fim(corpo);
}

function pracaInterior(): string {
  const c = new Cena("praca_interior");
  semear(808);
  const igreja =
    // torre central
    ret(440, 300, 200, 640, "#f4ead2") +
    cam(`M430,300 L540,150 L650,300 Z`, "#e8d8b6") +
    linha(540, 150, 540, 80, "#8a7a5a", 6) +
    linha(515, 105, 565, 105, "#8a7a5a", 6) +
    rr(500, 360, 80, 110, 40, "#3a5a7a") +
    circ(540, 540, 40, "#fbfaf5", `stroke="#8a7a5a" stroke-width="5"`) +
    linha(540, 540, 540, 512, "#333", 4) +
    linha(540, 540, 560, 548, "#333", 4) +
    // nave
    ret(250, 600, 580, 340, "#f8efda") +
    cam(`M240,600 L540,470 L840,600 Z`, "#e8d8b6") +
    ret(250, 600, 580, 18, "#e1c98f") +
    rr(490, 720, 100, 220, 50, "#6b3f22") +
    rr(330, 680, 60, 120, 30, "#3a5a7a") +
    rr(690, 680, 60, 120, 30, "#3a5a7a") +
    ret(250, 900, 580, 40, "#e1c98f");
  const coreto =
    ret(110, 1020, 340, 40, "#e8e1d0") +
    ret(130, 840, 12, 180, "#fff") +
    ret(270, 840, 12, 190, "#fff") +
    ret(420, 840, 12, 180, "#fff") +
    cam(`M90,850 L280,740 L470,850 Z`, "#2f8a7a") +
    cam(`M90,850 L470,850 L460,870 L100,870 Z`, "#25705f") +
    (() => {
      let s = "";
      for (let x = 120; x < 440; x += 22) s += ret(x, 960, 6, 60, "#fff");
      return s + ret(110, 955, 340, 8, "#fff");
    })();
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#5fb2ec"], [0.7, "#bfe6fb"], [1, "#f4f0dc"]])) +
    nuvem(220, 200, 1.1, "#fff", 0.9, c.blur(2)) +
    nuvem(860, 300, 0.8, "#fff", 0.8, c.blur(3)) +
    morro(0, 1080, 900, 1100, 40, 5, "#9fc28a", c.blur(5)) +
    g(igreja, c.blur(1)) +
    // casario lateral
    ret(0, 820, 230, 200, "#f2b84b") +
    ret(30, 870, 50, 80, "#2f6f95") +
    ret(120, 870, 50, 80, "#2f6f95") +
    ret(850, 800, 230, 220, "#e86f5a") +
    ret(880, 860, 50, 90, "#f4ead2") +
    ret(980, 860, 50, 90, "#f4ead2") +
    placa(860, 760, 210, 50, "#fff", [{ t: "Farmácia Popular", tam: 22, cor: "#1d6a3a" }], { fonte: SANS }) +
    arvore(c, 720, 1080, 1.1, "#2f6a2c", "#6aa64f") +
    arvore(c, 980, 1100, 1.25, "#2f6a2c", "#5e9c45") +
    coreto +
    // pipoqueiro e orelhão
    orelhao(640, 1180, 0.9) +
    ret(820, 1080, 150, 110, "#d33a2c") +
    ret(820, 1040, 150, 40, "#f6f0d8", `opacity="0.8"`) +
    cam(`M800,1040 L895,980 L990,1040 Z`, "#f5c542") +
    txt(895, 1150, "PIPOCA", 26, "#fff", { peso: "bold" }) +
    circ(840, 1200, 16, "#333") +
    circ(950, 1200, 16, "#333") +
    // bancos
    ret(40, 1200, 220, 20, "#e8e1d0") +
    ret(60, 1220, 20, 50, "#cfc6b2") +
    ret(220, 1220, 20, 50, "#cfc6b2") +
    txt(150, 1214, "Of. Bar do Zé", 14, "#777") +
    // pombos
    elip(480, 1290, 16, 10, "#7a7f88") +
    circ(492, 1282, 6, "#7a7f88") +
    elip(530, 1300, 14, 9, "#8e939b") +
    circ(519, 1293, 5, "#8e939b") +
    // chão de pedra portuguesa
    piso(c, 1260, "#e8dcc2", "#bfae8a") +
    ret(0, 1260, 1080, 660, c.padrao(140, 70, `<path d="M0,35 Q35,0 70,35 T140,35" stroke="#2b2b2b" stroke-width="6" fill="none" opacity="0.13"/>`));
  return c.fim(corpo);
}

function feiraRua(): string {
  const c = new Cena("feira_rua");
  semear(909);
  const barraca = (x: number, y: number, w: number, cor1: string, cor2: string, s: number, nome: string, preco: string, frutas: string[]) => {
    let listras = "";
    for (let i = 0; i < 8; i++) listras += cam(`M${x + (w / 8) * i},${y} L${x + (w / 8) * (i + 1)},${y} L${x + (w / 8) * (i + 1) + 6},${y + 90 * s} L${x + (w / 8) * i + 6},${y + 90 * s} Z`, i % 2 ? cor1 : cor2);
    let fr = "";
    for (let i = 0; i < 30; i++) fr += circ(x + entre(20, w - 20), y + entre(250, 300) * s, entre(14, 22) * s, escolhe(frutas));
    return (
      ret(x + 10, y, 10, 360 * s, "#666") +
      ret(x + w - 20, y, 10, 360 * s, "#666") +
      listras +
      cam(`M${x},${y + 90 * s} Q${x + w / 4},${y + 110 * s} ${x + w / 2},${y + 90 * s} Q${x + (3 * w) / 4},${y + 110 * s} ${x + w},${y + 90 * s}`, "none", `stroke="${cor1}" stroke-width="8"`) +
      ret(x, y + 280 * s, w, 80 * s, "#8a6a4a") +
      fr +
      placa(x + w * 0.2, y + 140 * s, w * 0.6, 80 * s, "#fff", [{ t: nome, tam: 24 * s, cor: "#c0392b" }, { t: preco, tam: 22 * s }], { rot: entre(-4, 4) })
    );
  };
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#72b8ec"], [1, "#e6f3fb"]])) +
    nuvem(800, 160, 1, "#fff", 0.9, c.blur(3)) +
    // casario ao fundo
    g(
      ret(0, 520, 200, 380, "#e9a24a") +
        ret(200, 560, 220, 340, "#7fb3a0") +
        ret(420, 500, 200, 400, "#e86f5a") +
        ret(620, 540, 240, 360, "#f2d06b") +
        ret(860, 510, 220, 390, "#9a8ac2") +
        txt(520, 560, "MERCEARIA", 28, "#fff", { peso: "bold" }) +
        txt(740, 600, "Salão da Cida", 26, "#7a3a1a", { fonte: MAO }),
      c.blur(3),
    ) +
    multidao(10, 40, 1040, 930, 0.9, ["#c0392b", "#2f6f95", "#f0a020", "#3a8a4a", "#6d4c8d"], c.blur(3)) +
    barraca(20, 640, 340, "#e14f4f", "#fff", 1, "BANANA", "3 dz R$5", ["#f5d23a", "#e8c23a"]) +
    barraca(370, 620, 340, "#2f8a4a", "#fff", 1, "PASTEL", "de vento R$4", ["#e8b25a", "#d9a04a"]) +
    barraca(720, 640, 340, "#2f6fd1", "#fff", 1, "LARANJA", "pra suco R$6", ["#f59a2a", "#f0b03a"]) +
    // carrinho de pamonha
    ret(380, 1140, 300, 120, "#f6f0d8") +
    ret(380, 1140, 300, 20, "#2f8a4a") +
    txt(530, 1220, "PAMONHA", 38, "#2f8a4a", { peso: "bold" }) +
    txt(530, 1252, "de Piracicaba (ou quase)", 16, "#555", { fonte: MAO }) +
    circ(420, 1280, 22, "#333") +
    circ(640, 1280, 22, "#333") +
    linha(680, 1160, 740, 1120, "#777", 6) +
    rr(600, 1090, 60, 50, 6, "#ddd") +
    circ(630, 1080, 14, "#888") +
    // caixotes
    ret(60, 1180, 160, 110, "#c4955a", `stroke="#8a6a4a" stroke-width="6"`) +
    ret(860, 1190, 160, 100, "#c4955a", `stroke="#8a6a4a" stroke-width="6"`) +
    piso(c, 1290, "#7d7a76", "#55524e");
  return c.fim(corpo);
}

function ruaInteriorNoite(): string {
  const c = new Cena("rua_interior_noite");
  semear(1010);
  const casa = (x: number, w: number, h: number, cor: string, porta: string, luz: boolean, extra = "") =>
    ret(x, 1200 - h, w, h, cor) +
    ret(x - 6, 1200 - h - 20, w + 12, 24, "#3a2a2a") +
    rr(x + w * 0.35, 1200 - 200, w * 0.3, 200, 4, porta) +
    ret(x + 30, 1200 - h + 60, 80, 90, luz ? "#ffd27a" : "#2a2f45") +
    (luz ? c.brilho(x + 70, 1200 - h + 105, 120, "#ffc766", 0.5) : "") +
    extra;
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#0b1030"], [0.6, "#23285a"], [1, "#3d3460"]])) +
    estrelas(120, 0, 1080, 0, 700) +
    circ(820, 220, 60, "#fff5d6") +
    c.brilho(820, 220, 220, "#fff5d6", 0.35) +
    morro(0, 1080, 820, 1000, 40, 5, "#1a1d3a") +
    casa(0, 260, 380, "#4a6aa0", "#2a3550", true, placa(40, 860, 180, 60, "#fff", [{ t: "Vende-se gelinho", tam: 20, cor: "#c0392b" }], { rot: -3 })) +
    casa(260, 280, 420, "#a0506a", "#3a2030", false) +
    casa(540, 260, 360, "#d0a040", "#4a3010", true) +
    casa(800, 280, 440, "#5a8a6a", "#2a4030", true, placa(830, 790, 220, 70, "#f6e8c0", [{ t: "BAR DO ZÉ", tam: 30, cor: "#7a1f1f" }], { fonte: SANS })) +
    cadeiraPlastico(820, 1224, 0.7) +
    cadeiraPlastico(1010, 1224, 0.7) +
    // mesa de plástico do bar
    ret(840, 1150, 140, 14, "#f2f2ee") +
    ret(860, 1164, 8, 60, "#e0e0dc") +
    ret(950, 1164, 8, 60, "#e0e0dc") +
    rr(880, 1110, 18, 40, 3, "#7a4a1a", `opacity="0.8"`) +
    // pichação
    txt(400, 1060, "FULANO + CICLANA", 34, "#ffffff", { fonte: MAO, op: 0.4, rot: -4 }) +
    // postes e fios
    poste(c, 220, 1220, 560, true) +
    poste(c, 760, 1220, 560, false) +
    fios([[228, 680], [768, 690], [1080, 660]], "#111", 3) +
    fios([[0, 700], [228, 700], [768, 710]], "#111", 2) +
    g(kombi(420, 1236, 0.8, "#4a8ac0"), c.blur(0.8)) +
    // cachorro dormindo
    elip(600, 1236, 50, 18, "#7a5a3a") +
    circ(642, 1226, 14, "#7a5a3a") +
    piso(c, 1220, "#4a4258", "#25202e");
  return c.fim(corpo, true);
}

function festaJunina(): string {
  const c = new Cena("festa_junina");
  semear(1111);
  const cores = ["#e63946", "#f1c40f", "#2a9d8f", "#3a86ff", "#ff7f11", "#9b5de5"];
  const barraca = (x: number, nome: string, cor: string) =>
    ret(x, 820, 250, 360, "#6b4a2b") +
    cam(`M${x - 20},830 L${x + 125},720 L${x + 270},830 Z`, cor) +
    ret(x + 10, 830, 230, 170, "#2a1a14") +
    c.brilho(x + 125, 900, 160, "#ffc766", 0.45) +
    placa(x + 25, 1005, 200, 84, "#f6e8c0", nome.split("|").map((t) => ({ t, tam: nome.includes("|") ? 24 : 28, cor: "#7a1f1f" }))) +
    ret(x, 1100, 250, 80, chita(c));
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#0d0b2a"], [0.7, "#2a1a4a"], [1, "#5a2a3a"]])) +
    estrelas(90, 0, 1080, 0, 600) +
    bandeirinhas(-20, 1100, 120, 60, 22, cores) +
    bandeirinhas(-20, 1100, 300, 70, 20, cores, 1.1) +
    bandeirinhas(-20, 1100, 500, 60, 18, cores, 1.2) +
    // lâmpadas no fio
    (() => {
      let s = "";
      for (let i = 0; i < 12; i++) {
        const x = i * 95 + 20;
        const y = 640 + Math.sin((i / 11) * Math.PI) * 50;
        s += c.brilho(x, y, 50, "#ffd27a", 0.8) + circ(x, y, 8, "#fff3c0");
      }
      return `<path d="M0,630 Q540,740 1080,630" stroke="#222" stroke-width="2" fill="none"/>` + s;
    })() +
    barraca(20, "QUENTÃO", "#e63946") +
    barraca(415, "PESCARIA", "#2a9d8f") +
    barraca(810, "CORREIO|ELEGANTE", "#f1c40f") +
    // fogueira
    c.brilho(540, 1240, 520, "#ff8a2a", 0.55, 300) +
    (() => {
      let s = "";
      for (let i = 0; i < 6; i++) s += ret(440 + i * 20, 1250, 200, 22, "#5a3a22", `transform="rotate(${-30 + i * 12} 540 1260)"`);
      return s;
    })() +
    g(
      cam(`M480,1260 Q470,1160 520,1100 Q510,1170 545,1180 Q550,1110 590,1060 Q590,1160 610,1260 Z`, "#ff7a1a") +
        cam(`M505,1260 Q500,1190 535,1150 Q540,1200 560,1200 Q570,1160 585,1140 Q590,1210 585,1260 Z`, "#ffd23a"),
      c.blur(2),
    ) +
    piso(c, 1270, "#6a4a32", "#3a2818");
  return c.fim(corpo, true);
}

function rodoviaria(): string {
  const c = new Cena("rodoviaria");
  semear(1212);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e9e3d3"], [1, "#d6cdb8"]])) +
    // cobertura metálica
    ret(0, 0, 1080, 160, "#8b939a") +
    (() => {
      let s = "";
      for (let x = 0; x < 1080; x += 90) s += cam(`M${x},160 L${x + 45},90 L${x + 90},160`, "none", `stroke="#6a737a" stroke-width="8"`);
      return s;
    })() +
    fluorescente(c, 120, 180, 200, 0.4) +
    fluorescente(c, 760, 180, 200, 0.4) +
    // guichês
    ret(40, 260, 1000, 380, "#2f5d8a") +
    (() => {
      let s = "";
      const nomes = ["VIAÇÃO SERTANEJA", "EXPRESSO BEM-TE-VI", "TRANSPORTE ESPERANÇA"];
      for (let i = 0; i < 3; i++) {
        const x = 70 + i * 330;
        s += ret(x, 290, 300, 60, "#f2f0e8") + txt(x + 150, 330, nomes[i], 22, "#2f5d8a", { peso: "bold" }) + ret(x + 20, 380, 260, 220, "#9cc3d4", `opacity="0.8"`) + rr(x + 110, 560, 80, 40, 6, "#2a2a2a") + txt(x + 150, 590, "PASSAGENS", 14, "#ffd23a");
      }
      return s;
    })() +
    // painel de horários escrito à mão
    placa(80, 680, 460, 300, "#1e1e1e", [
      { t: "PARTIDAS", tam: 34, cor: "#ffd23a" },
      { t: "06:10  CAPITAL  plat. 2", tam: 26, cor: "#fff" },
      { t: "13:40  CAPITAL  plat. 1", tam: 26, cor: "#fff" },
      { t: "22:30  CAPITAL  (leito)", tam: 26, cor: "#fff" },
      { t: "atraso? pergunta pro Seu Tonho", tam: 18, cor: "#aaa" },
    ]) +
    relogio(780, 760, 70, 22, 5) +
    // lanchonete
    ret(620, 880, 420, 200, "#c8553d") +
    txt(830, 940, "PÃO DE QUEIJO", 36, "#fff", { peso: "bold" }) +
    txt(830, 985, "café R$3  coxinha R$5", 24, "#ffe0a0", { fonte: MAO }) +
    ret(640, 1000, 380, 80, "#e9d8b0") +
    // ônibus parado ao fundo
    g(onibusLateral(400, 1260, 0.7, "#e9e9e6", "#2f8a4a", "CAPITAL 22:30"), c.blur(1)) +
    // banco de cimento
    ret(720, 1210, 320, 40, "#a8a29a") +
    ret(740, 1250, 30, 90, "#8e8880") +
    ret(990, 1250, 30, 90, "#8e8880") +
    ret(760, 1160, 90, 50, "#5a3a2a") +
    ret(780, 1150, 50, 12, "#3a2a1a") +
    piso(c, 1340, "#bfb6a4", "#8c8472", "#6a6352") +
    ret(0, 1340, 1080, 18, "#f2c12e");
  return c.fim(corpo);
}

function onibusNoite(): string {
  const c = new Cena("onibus_noite");
  semear(1313);
  let bancos = "";
  // perspectiva: fileiras de bancos convergindo ao centro
  for (let i = 5; i >= 0; i--) {
    const t = i / 5;
    const s = 0.35 + (1 - t) * 0.85;
    const y = 760 + (1 - t) * 520;
    const xe = 540 - (130 + (1 - t) * 330);
    const xd = 540 + (130 + (1 - t) * 330);
    const w = 220 * s;
    const h = 320 * s;
    const cor = c.lin([[0, "#3a4a7a"], [1, "#1e2848"]]);
    bancos += rr(xe - w, y - h, w, h, 24 * s, cor) + rr(xe - w + 10 * s, y - h + 10 * s, w - 20 * s, 60 * s, 18 * s, "#e9e4d6", `opacity="0.85"`);
    bancos += rr(xd, y - h, w, h, 24 * s, cor) + rr(xd + 10 * s, y - h + 10 * s, w - 20 * s, 60 * s, 18 * s, "#e9e4d6", `opacity="0.85"`);
    if (i % 2 === 0) bancos += elip(xe - w / 2, y - h - 20 * s, 34 * s, 40 * s, "#1a1a20") + elip(xd + w / 2, y - h - 18 * s, 32 * s, 38 * s, "#1a1a20");
  }
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#121630"], [1, "#0a0c1c"]])) +
    // teto
    cam(`M0,0 L1080,0 L700,460 L380,460 Z`, "#1c2040") +
    // luzinhas de leitura
    (() => {
      let s = "";
      for (let i = 0; i < 6; i++) {
        const t = i / 6;
        const xe = 140 + t * 220;
        const xd = 940 - t * 220;
        const y = 120 + t * 320;
        s += circ(xe, y, 6 - t * 3, "#9fd0ff") + circ(xd, y, 6 - t * 3, "#9fd0ff");
      }
      s += c.brilho(260, 300, 60, "#ffd27a", 0.9) + circ(260, 300, 8, "#fff3c0");
      return s;
    })() +
    // janelas laterais escuras com luzes passando
    cam(`M0,240 L330,470 L330,780 L0,980 Z`, c.lin([[0, "#0b1030"], [1, "#1d1840"]], 0, 0, 0, 1)) +
    cam(`M1080,240 L750,470 L750,780 L1080,980 Z`, c.lin([[0, "#0b1030"], [1, "#1d1840"]], 0, 0, 0, 1)) +
    g(
      linha(20, 620, 300, 640, "#ffb347", 5, `opacity="0.7"`) +
        linha(60, 700, 280, 690, "#ff6a3a", 3, `opacity="0.6"`) +
        linha(800, 650, 1060, 640, "#fff3c0", 4, `opacity="0.6"`) +
        estrelas(30, 760, 1060, 300, 560) +
        estrelas(30, 20, 320, 300, 560),
      c.blur(2),
    ) +
    // cortininhas
    cam(`M0,240 L110,316 L110,950 L0,980 Z`, "#7a2a3a", `opacity="0.9"`) +
    cam(`M1080,240 L970,316 L970,950 L1080,980 Z`, "#7a2a3a", `opacity="0.9"`) +
    // fundo: porta do banheiro e letreiro
    rr(470, 470, 140, 300, 6, "#2a2f50") +
    rr(500, 500, 80, 30, 4, "#111") +
    txt(540, 522, "WC", 22, "#ff5a5a", { fonte: MONO, peso: "bold" }) +
    c.brilho(540, 510, 80, "#ff5a5a", 0.4) +
    // corredor
    cam(`M440,780 L640,780 L900,1920 L180,1920 Z`, "#141a2e") +
    (() => {
      let s = "";
      for (let i = 0; i < 10; i++) {
        const y = 800 + i * i * 12;
        s += ellipseSeg(540, y, 30 + i * 22);
      }
      return s;
    })() +
    g(bancos) +
    piso(c, 1400, "#151a2c", "#0a0d18");
  return c.fim(corpo, true);
}
function ellipseSeg(cx: number, y: number, w: number): string {
  return circ(cx - w, y, 2.5, "#4aa0ff", `opacity="0.7"`) + circ(cx + w, y, 2.5, "#4aa0ff", `opacity="0.7"`);
}

function capitalRua(): string {
  const c = new Cena("capital_rua");
  semear(1414);
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#8e98a3"], [1, "#c9ced2"]])) +
    g(predios(c, -20, 1100, 1000, 500, 900, "#9aa4ad", "#e7eef2", 0.2), c.blur(5)) +
    g(predios(c, -40, 1100, 1060, 300, 700, "#6c7883", "#ffe9b0", 0.25), c.blur(2)) +
    // prédios da frente laterais
    ret(0, 200, 260, 900, "#4a5560") +
    (() => {
      let s = "";
      for (let y = 240; y < 1040; y += 70) for (let x = 20; x < 240; x += 60) s += ret(x, y, 40, 46, rnd() < 0.4 ? "#ffe7a8" : "#2e3842");
      return s;
    })() +
    ret(820, 120, 260, 980, "#3e4852") +
    (() => {
      let s = "";
      for (let y = 160; y < 1060; y += 60) s += ret(840, y, 220, 30, "#7fa6bd", `opacity="0.5"`);
      return s;
    })() +
    // outdoor genérico
    ret(300, 330, 480, 230, "#222") +
    ret(310, 340, 460, 210, c.lin([[0, "#ff5a7a"], [1, "#ff9a3a"]], 0, 0, 1, 1)) +
    txt(540, 420, "SEU PIX CAIU?", 44, "#fff", { peso: "bold" }) +
    txt(540, 480, "Desconfie do link.", 32, "#fff") +
    ret(400, 560, 10, 120, "#333") +
    ret(670, 560, 10, 120, "#333") +
    // pichação
    txt(130, 1070, "ARTE NÃO É CRIME", 30, "#f2c12e", { fonte: MAO, rot: -5, op: 0.8 }) +
    // semáforo
    ret(760, 760, 12, 400, "#333") +
    rr(730, 700, 70, 170, 10, "#222") +
    circ(765, 735, 20, "#5a1a1a") +
    circ(765, 785, 20, "#5a4a1a") +
    circ(765, 835, 20, "#2aff6a") +
    c.brilho(765, 835, 70, "#2aff6a", 0.5) +
    // carros com faróis
    g(carro(300, 1250, 0.9, "#c0392b", true) + carro(720, 1260, 0.85, "#e9e9e9", true), c.blur(1.5)) +
    multidao(6, 60, 1020, 1300, 1, ["#333", "#4a4a5a", "#2a3a4a", "#5a3a3a"], c.blur(2.5)) +
    guardaChuva(160, 1080, 0.9, "#1f1f2a") +
    guardaChuva(920, 1090, 0.9, "#c0392b") +
    guardaChuva(560, 1090, 0.8, "#2f6f95") +
    piso(c, 1310, "#5a6068", "#2f343a") +
    // reflexos molhados
    g(ret(740, 1320, 50, 260, "#2aff6a", `opacity="0.2"`) + ret(240, 1320, 120, 200, "#ffeab0", `opacity="0.12"`) + ret(650, 1320, 120, 200, "#ffeab0", `opacity="0.12"`), c.blur(10)) +
    ret(0, 1520, 1080, 8, "#e8e8e8", `opacity="0.4"`) +
    garoa(c, 260);
  return c.fim(corpo);
}

function metroLotado(): string {
  const c = new Cena("metro_lotado");
  semear(1515);
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#d9dfe3"], [1, "#b7c0c6"]])) +
    // teto com luz
    ret(0, 0, 1080, 180, "#eef2f4") +
    fluorescente(c, 140, 120, 300, 0.6) +
    fluorescente(c, 640, 120, 300, 0.6) +
    // mapa da linha
    ret(140, 220, 800, 90, "#fff") +
    linha(180, 265, 900, 265, "#d6336c", 10) +
    (() => {
      let s = "";
      const est = ["Terminal", "Sé", "Luz", "Paraíso", "Vila"];
      est.forEach((e, i) => {
        const x = 200 + i * 170;
        s += circ(x, 265, 14, i === 2 ? "#ffd23f" : "#fff", `stroke="#d6336c" stroke-width="5"`) + txt(x, 300, e, 18, "#333");
      });
      return s;
    })() +
    txt(540, 245, "PRÓXIMA: LUZ", 18, "#d6336c", { peso: "bold" }) +
    // janelas do túnel
    rr(60, 360, 420, 420, 30, "#121820") +
    rr(600, 360, 420, 420, 30, "#121820") +
    g(linha(60, 520, 480, 500, "#ffcf6a", 6, `opacity="0.6"`) + linha(600, 600, 1020, 580, "#ffcf6a", 6, `opacity="0.6"`), c.blur(4)) +
    // barras de apoio
    ret(0, 330, 1080, 12, "#c9ced2") +
    ret(260, 330, 14, 1100, "#d9dde0") +
    ret(800, 330, 14, 1100, "#d9dde0") +
    (() => {
      let s = "";
      for (let x = 80; x < 1060; x += 120) s += linha(x, 340, x, 420, "#999", 3) + `<path d="M${x - 18},420 Q${x},460 ${x + 18},420 Z" fill="none" stroke="#e0b030" stroke-width="7"/>`;
      return s;
    })() +
    // multidão
    multidao(9, 20, 1060, 1180, 1.6, ["#2a3a4a", "#5a2a3a", "#3a4a3a", "#4a3a5a", "#222", "#7a5a3a"], c.blur(3)) +
    multidao(6, 0, 1080, 1360, 2.1, ["#1e2a36", "#3a1e2a", "#2a2a2a", "#4a3a2a"], c.blur(1.5)) +
    placa(420, 820, 240, 70, "#ffd23f", [{ t: "Assento preferencial", tam: 20, cor: "#222" }], { fonte: SANS }) +
    piso(c, 1400, "#6a6e72", "#3e4246");
  return c.fim(corpo);
}

function republicaQuarto(): string {
  const c = new Cena("republica_quarto");
  semear(1616);
  const colchao = (x: number, y: number, w: number, cor: string, lencol: string) =>
    rr(x, y, w, 80, 16, cor) + rr(x, y - 10, w, 40, 16, lencol) + rr(x + 10, y - 40, 110, 40, 16, "#f2efe6");
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e6dccb"], [1, "#cfc2aa"]])) +
    cam(`M800,0 C760,100 880,180 820,300 C780,380 900,420 860,520`, "none", `stroke="#a89a82" stroke-width="3" opacity="0.6"`) +
    // janela com prédios
    janela(c, 380, 200, 320, 380, { ceu: [[0, "#9fb4c8"], [1, "#e0e6ea"]], paisagem: predios(c, 380, 700, 580, 120, 340, "#7d8a96", "#fff4c8", 0.2), moldura: "#f2efe6" }) +
    // varal interno
    `<path d="M0,170 Q540,260 1080,170" stroke="#555" stroke-width="3" fill="none"/>` +
    ret(80, 190, 90, 120, "#d6336c", `transform="rotate(4 125 190)"`) +
    ret(200, 205, 80, 70, "#2f6f95") +
    ret(820, 205, 100, 130, "#f0a020", `transform="rotate(-4 870 205)"`) +
    ret(950, 190, 60, 60, "#fff") +
    // pôsteres e escala
    placa(60, 400, 260, 300, "#fff", [
      { t: "ESCALA", tam: 30, cor: "#c0392b" },
      { t: "seg: Ju lixo", tam: 22 },
      { t: "ter: Bia louça", tam: 22 },
      { t: "qua: VOCÊ banheiro", tam: 20 },
      { t: "qui: ninguém :(", tam: 22 },
    ], { rot: -2 }) +
    quadro(780, 420, 240, 170, "#222", txt(900, 490, "foco", 44, "#f7e39a", { fonte: MAO }) + txt(900, 545, "força e café", 26, "#fff", { fonte: MAO })) +
    // extensão e celulares carregando
    `<path d="M1000,1000 C980,1100 900,1180 760,1220" stroke="#222" stroke-width="4" fill="none"/>` +
    rr(700, 1200, 120, 34, 6, "#fff", `stroke="#aaa"`) +
    // caixa de papelão como mesa
    ret(420, 980, 260, 200, "#c79a5a") +
    ret(420, 980, 260, 30, "#b5884a") +
    txt(550, 1100, "FRÁGIL", 30, "#7a4a1a", { peso: "bold", op: 0.6 }) +
    notebook(c, 550, 980, 0.6, "#2a4a7a", linhasCodigo(480, 885, 140, 70, 6, ["#9cf", "#fff"])) +
    rr(640, 940, 32, 40, 4, "#c0392b") +
    // mala
    rr(860, 960, 180, 260, 20, "#3a5a8a") +
    ret(930, 920, 40, 40, "none", `stroke="#222" stroke-width="8"`) +
    // colchões no chão
    colchao(20, 1240, 340, "#5a8a9a", "#f6c933") +
    colchao(380, 1270, 320, "#9a5a6a", "#e0e0e0") +
    colchao(720, 1250, 340, "#6a7a4a", chita(c)) +
    lampadaPendente(c, 540, 0, 80, "#fff3c4", 0.35) +
    piso(c, 1340, "#a89878", "#7a6c52", "#6a5e48");
  return c.fim(corpo);
}

function republicaCozinha(): string {
  const c = new Cena("republica_cozinha");
  semear(1717);
  let louca = "";
  for (let i = 0; i < 7; i++) louca += elip(420 + i * 12, 960 - i * 16, 70, 14, i % 2 ? "#f2f2f2" : "#e0e6ea", `stroke="#aab"`);
  const corpo =
    ret(0, 0, 1080, 1360, "#e2e6d8") +
    ret(0, 700, 1080, 300, azulejo(c, "#ffffff", "#9ab4a4", 50)) +
    // armários (um sem porta)
    ret(40, 150, 600, 300, "#c9a77a") +
    ret(60, 170, 170, 260, "#b8946a") +
    ret(250, 170, 170, 260, "#5a4030") +
    ret(260, 230, 150, 8, "#8a6a4a") +
    ret(270, 190, 30, 40, "#e0c040") +
    ret(310, 200, 40, 30, "#c0392b") +
    ret(270, 250, 120, 60, "#f2efe6") +
    ret(440, 170, 180, 260, "#b8946a") +
    txt(345, 470, "a porta caiu, não mexe", 22, "#7a1f1f", { fonte: MAO }) +
    // micro-ondas
    rr(700, 300, 300, 170, 10, "#f2f2ee") +
    ret(720, 320, 190, 130, "#2a2a2a") +
    ret(930, 330, 50, 100, "#ddd") +
    bilhete(730, 340, 150, 70, ["tampa!!!"], 26, -6, "#ffd0d0", "#7a1f1f") +
    // geladeira com bilhetes
    rr(760, 520, 280, 840, 26, c.lin([[0, "#fbfbf9"], [1, "#e2e2de"]], 0, 0, 1, 0)) +
    ret(760, 840, 280, 6, "#ccc") +
    ret(780, 600, 12, 160, "#bbb") +
    ret(780, 880, 12, 200, "#bbb") +
    bilhete(830, 560, 180, 110, ["não mexa no", "meu iogurte", "Ju"], 20, 4) +
    bilhete(830, 700, 180, 100, ["conta de luz", "R$ 287 :("], 20, -3, "#bfe6ff") +
    bilhete(840, 900, 170, 110, ["quem comeu", "meu miojo?", "VOU DESCOBRIR"], 18, 3, "#d6f5c0") +
    circ(920, 1000, 30, "#e63946") +
    // pia com louça empilhada
    ret(0, 1000, 740, 40, "#9aa0a6") +
    ret(0, 1040, 740, 320, "#d8cfba") +
    linha(370, 1040, 370, 1360, "#bfb6a0", 3) +
    louca +
    rr(560, 930, 60, 70, 6, "#f0b030") +
    ret(250, 960, 40, 40, "#3a8a4a") +
    `<path d="M200,1000 L200,940 Q200,915 230,915 L250,915" stroke="#c0c6cc" stroke-width="10" fill="none"/>` +
    // panos e janela pequena
    janela(c, 80, 520, 220, 150, { ceu: [[0, "#a9c4d6"], [1, "#e6eef2"]], paisagem: predios(c, 80, 300, 670, 60, 150, "#7d8a96", "#fff", 0.1), moldura: "#f2f2ee" }) +
    fluorescente(c, 300, 60, 300, 0.4) +
    rodape(1350, "#9a8e78") +
    piso(c, 1350, "#c2b8a4", "#8e8470") +
    ret(0, 1350, 1080, 570, ladrilho(c, "#c9bfaa", "#b5ab96", 70), `opacity="0.25"`);
  return c.fim(corpo);
}

function callCenter(): string {
  const c = new Cena("call_center");
  semear(1818);
  let baias = "";
  for (let r = 0; r < 3; r++) {
    const s = 0.55 + r * 0.25;
    const y = 880 + r * 150;
    const n = 5 - r;
    for (let k = 0; k < n; k++) {
      const x = 540 + (k - (n - 1) / 2) * 260 * s * 1.25;
      baias += ret(x - 120 * s, y - 160 * s, 240 * s, 160 * s, "#5a6a8a") + ret(x - 120 * s, y - 160 * s, 240 * s, 12 * s, "#7a8aa8");
      baias += rr(x - 60 * s, y - 150 * s, 120 * s, 80 * s, 4 * s, "#1b2a3a") + ret(x - 50 * s, y - 140 * s, 100 * s, 60 * s, "#3a7ab8") + c.brilho(x, y - 110 * s, 90 * s, "#7ab8ff", 0.3);
      baias += headset(x + 70 * s, y - 60 * s, s * 1.4);
      if ((k + r) % 2 === 0) baias += elip(x, y - 170 * s, 30 * s, 34 * s, "#2a1d17");
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#c8ccd4"], [1, "#a8aeb8"]])) +
    ret(0, 0, 1080, 120, "#e8eaee") +
    (() => {
      let s = "";
      for (let x = 0; x < 1080; x += 120) s += ret(x, 0, 2, 120, "#c0c4ca");
      return s;
    })() +
    fluorescente(c, 100, 140, 240, 0.5) +
    fluorescente(c, 740, 140, 240, 0.5) +
    // painel de fila
    rr(200, 230, 680, 300, 10, "#0d1117") +
    txt(540, 290, "CLIENTES EM ESPERA", 30, "#9aa", { fonte: MONO }) +
    txt(540, 390, "47", 100, "#ff4d4d", { fonte: MONO, peso: "bold" }) +
    txt(380, 480, "TMA 03:12", 30, "#ffd23f", { fonte: MONO }) +
    txt(700, 480, "META 02:30", 30, "#4cff6a", { fonte: MONO }) +
    c.brilho(540, 380, 400, "#ff4d4d", 0.12) +
    // cartazes
    placa(40, 580, 300, 140, "#ffe9f0", [{ t: "Sorria!", tam: 36, cor: "#d6336c" }, { t: "o cliente sente", tam: 22 }, { t: "pela voz", tam: 22 }], { rot: -3 }) +
    placa(760, 580, 280, 140, "#e6f4ff", [{ t: "Funcionária", tam: 26, cor: "#1a3ea8" }, { t: "do mês:", tam: 26, cor: "#1a3ea8" }, { t: "(foto em breve)", tam: 20 }], { rot: 2 }) +
    placa(400, 590, 280, 100, "#fff", [{ t: "Pausa: 10 min", tam: 26 }, { t: "banheiro conta", tam: 20, cor: "#c0392b" }]) +
    baias +
    piso(c, 1320, "#5a627a", "#3a4058") +
    ret(0, 1320, 1080, 600, c.padrao(40, 40, ret(0, 0, 40, 40, "none") + circ(20, 20, 2, "#fff", `opacity="0.08"`)));
  return c.fim(corpo);
}

function escritorioModerno(): string {
  const c = new Cena("escritorio_moderno");
  semear(1919);
  const corpo =
    ret(0, 0, 1080, 1360, "#f4f1ec") +
    // janelão com cidade
    ret(0, 160, 1080, 640, c.lin([[0, "#8fc9f0"], [1, "#e9f4fb"]])) +
    g(predios(c, 0, 1080, 800, 200, 480, "#b4c4d2", "#fff", 0.1), c.blur(4)) +
    (() => {
      let s = "";
      for (let x = 0; x <= 1080; x += 216) s += ret(x - 6, 160, 12, 640, "#2a2a2a");
      return s + ret(0, 150, 1080, 14, "#2a2a2a") + ret(0, 796, 1080, 14, "#2a2a2a");
    })() +
    // parede de tijolinho à esquerda com frase neon
    ret(0, 810, 1080, 550, c.padrao(120, 50, ret(0, 0, 120, 50, "#c9775a") + ret(0, 0, 58, 23, "#b86a4e") + ret(62, 0, 58, 23, "#c27050") + ret(30, 27, 58, 23, "#b86a4e") + ret(-30, 27, 58, 23, "#c27050") + ret(92, 27, 58, 23, "#c27050"))) +
    ret(0, 810, 1080, 550, "#000", `opacity="0.15"`) +
    c.brilho(540, 900, 460, "#ff5fd2", 0.35, 140) +
    txt(540, 900, "Faça acontecer!", 64, "#ffd6f5", { fonte: MAO, extra: `stroke="#ff5fd2" stroke-width="2"` }) +
    txt(540, 960, "(mas com MFA)", 38, "#c9f6ff", { fonte: MAO }) +
    // plantas penduradas
    vaso(120, 280, 0.8, "#4aa05a", "#f2f2ee") +
    vaso(960, 290, 0.8, "#4aa05a", "#f2f2ee") +
    linha(120, 0, 120, 252, "#999", 2) +
    linha(960, 0, 960, 262, "#999", 2) +
    // pendentes
    lampadaPendente(c, 340, 0, 120, "#ffe0a0", 0.3) +
    lampadaPendente(c, 740, 0, 120, "#ffe0a0", 0.3) +
    // quadro branco com post-its
    ret(80, 1010, 360, 230, "#fafafa", `stroke="#bbb" stroke-width="6"`) +
    bilhete(100, 1030, 90, 80, ["MVP"], 22, -4, "#ffe36b") +
    bilhete(210, 1030, 90, 80, ["bug"], 22, 3, "#ff9ac2") +
    bilhete(320, 1030, 90, 80, ["café?"], 20, -2, "#9be7ff") +
    txt(260, 1190, "sprint 42", 28, "#2a5ab0", { fonte: MAO }) +
    // puffs e plantas
    vaso(960, 1240, 1.3, "#3e8a4f", "#f2f2ee") +
    elip(640, 1300, 110, 60, "#ffb627") +
    elip(640, 1270, 100, 40, "#ffc94a") +
    elip(820, 1310, 90, 50, "#2ec4b6") +
    elip(820, 1285, 82, 34, "#4ad8cb") +
    // bicicleta encostada
    circ(560, 1230, 50, "none", `stroke="#333" stroke-width="6"`) +
    circ(700, 1230, 50, "none", `stroke="#333" stroke-width="6"`) +
    `<path d="M560,1230 L610,1160 L690,1160 L700,1230 M610,1160 L640,1230 L690,1160" stroke="#e63946" stroke-width="6" fill="none"/>` +
    piso(c, 1360, "#c9a77a", "#9a7a52", "#8a6a44");
  return c.fim(corpo);
}

function salaEntrevista(): string {
  const c = new Cena("sala_entrevista");
  semear(2020);
  const corpo =
    ret(0, 0, 1080, 1360, "#eef0f2") +
    // escritório desfocado atrás do vidro
    g(
      ret(0, 200, 1080, 900, "#dfe3e6") +
        predios(c, 0, 1080, 700, 150, 300, "#c9d2da", "#fff", 0.05) +
        ret(0, 700, 1080, 400, "#d2d6da") +
        multidao(6, 40, 1040, 980, 0.9, ["#3a5a8a", "#8a3a5a", "#3a7a5a", "#555"]) +
        ret(0, 980, 1080, 40, "#b8bec4") +
        vaso(140, 920, 1, "#3e8a4f", "#eee") +
        vaso(900, 920, 1, "#3e8a4f", "#eee"),
      c.blur(9),
    ) +
    // vidro e montantes
    ret(0, 200, 1080, 900, c.lin([[0, "#d8eef8", 0.35], [1, "#ffffff", 0.15]], 0, 0, 1, 1)) +
    cam(`M100,200 L300,200 L60,1100 L0,1100 L0,420 Z`, "#fff", `opacity="0.18"`) +
    cam(`M700,200 L760,200 L520,1100 L460,1100 Z`, "#fff", `opacity="0.12"`) +
    ret(0, 196, 1080, 10, "#9aa4ad") +
    ret(356, 200, 8, 900, "#9aa4ad") +
    ret(716, 200, 8, 900, "#9aa4ad") +
    ret(0, 560, 1080, 50, "#fff", `opacity="0.55"`) +
    txt(540, 595, "SALA ATENA", 28, "#555", { peso: "bold" }) +
    // teto
    ret(0, 0, 1080, 196, "#f8f9fa") +
    fluorescente(c, 360, 90, 360, 0.4) +
    // mesa de reunião
    cam(`M140,1100 L940,1100 L1040,1260 L40,1260 Z`, c.lin([[0, "#f2efe8"], [1, "#d9d3c6"]])) +
    ret(40, 1260, 1000, 18, "#b9b2a3") +
    rr(470, 1020, 60, 90, 8, "#e8f4fa", `opacity="0.8" stroke="#9ab"`) +
    ret(560, 1080, 120, 22, "#fff", `transform="rotate(-6 620 1090)"`) +
    elip(380, 1090, 30, 10, "#fff", `stroke="#ccc"`) +
    // cadeiras
    rr(160, 960, 140, 160, 30, "#2f3640") +
    rr(780, 960, 140, 160, 30, "#2f3640") +
    piso(c, 1278, "#8a8f94", "#5e6368");
  return c.fim(corpo);
}

function videochamada(): string {
  const c = new Cena("videochamada");
  semear(2121);
  const quad = (x: number, y: number, w: number, h: number, fundo: string, pele: string, roupa: string, nome: string, mudo: boolean) =>
    ret(x, y, w, h, fundo) +
    pessoa(x + w / 2, y + h, w / 220, roupa, pele) +
    rr(x + 8, y + h - 34, nome.length * 12 + 20, 26, 4, "#000", `opacity="0.55"`) +
    txt(x + 18, y + h - 15, nome, 16, "#fff", { ancora: "start" }) +
    (mudo ? circ(x + w - 22, y + 22, 14, "#e63946") + txt(x + w - 22, y + 28, "x", 16, "#fff", { peso: "bold" }) : "");
  const corpo =
    // quarto ao fundo desfocado
    g(
      ret(0, 0, 1080, 1920, c.lin([[0, "#c9b8d8"], [1, "#9a88aa"]])) +
        janela(c, 700, 140, 300, 360, { ceu: [[0, "#4a5a9a"], [1, "#f0a080"]], moldura: "#eee" }) +
        estante(40, 160, 300, 600, 4) +
        lampadaPendente(c, 540, 0, 120, "#ffe0a0", 0.4),
      c.blur(10),
    ) +
    // mesa
    ret(0, 1240, 1080, 680, c.lin([[0, "#8a6a4a"], [1, "#5a4028"]])) +
    // notebook grande
    cam(`M110,320 L970,320 L990,1180 L90,1180 Z`, "#2a2e36") +
    ret(140, 350, 800, 790, "#14171d") +
    quad(150, 360, 385, 330, "#e6d6b8", "#c48b63", "#2f6f95", "Dona Célia (RH)", false) +
    quad(545, 360, 385, 330, "#b8d6e6", "#5e3a26", "#3a3a3a", "Marcos | Seg. Info", false) +
    quad(150, 700, 385, 330, "#d6e6b8", "#e0b48c", "#8a3a5a", "Você", false) +
    quad(545, 700, 385, 330, "#2a2a2a", "#8a5a3c", "#555", "Lucas (câmera off)", true) +
    rr(545, 700, 385, 330, 0, "#1d1f24") +
    circ(737, 850, 60, "#5a6a8a") +
    txt(737, 870, "L", 54, "#fff", { peso: "bold" }) +
    rr(545 + 8, 1000, 200, 26, 4, "#000", `opacity="0.55"`) +
    txt(563, 1019, "Lucas (câmera off)", 16, "#fff", { ancora: "start" }) +
    // barra de controles
    ret(140, 1040, 800, 100, "#1b1e24") +
    circ(420, 1090, 30, "#3a3f48") +
    circ(500, 1090, 30, "#3a3f48") +
    circ(580, 1090, 30, "#e63946") +
    circ(660, 1090, 30, "#3a3f48") +
    rr(160, 1070, 160, 40, 6, "#2a2f38") +
    txt(240, 1097, "00:12:47", 20, "#9ab", { fonte: MONO }) +
    c.brilho(540, 750, 600, "#bcd4ff", 0.15) +
    cam(`M40,1180 L1040,1180 L1080,1240 L0,1240 Z`, "#3a3f48") +
    // caneca
    rr(920, 1220, 80, 100, 10, "#e63946") +
    `<path d="M1000,1240 Q1040,1270 1000,1300" stroke="#e63946" stroke-width="12" fill="none"/>`;
  return c.fim(corpo);
}

function cafeteria(): string {
  const c = new Cena("cafeteria");
  semear(2222);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#4a3428"], [1, "#2e2018"]])) +
    // janela para a rua com garoa
    ret(0, 160, 320, 700, c.lin([[0, "#9aa8b4"], [1, "#d0d6da"]])) +
    g(predios(c, 0, 320, 860, 200, 500, "#7a8692", "#ffe0a0", 0.3), c.blur(4)) +
    ret(0, 150, 330, 20, "#1e1612") +
    ret(310, 150, 20, 720, "#1e1612") +
    // quadro de menu
    lousa(380, 160, 640, 520, "#1e2622") +
    txt(700, 240, "CARDÁPIO", 48, "#f2e8d0", { fonte: MAO, peso: "bold" }) +
    txt(420, 320, "Café coado ........ R$ 6", 30, "#f2e8d0", { fonte: MAO, ancora: "start" }) +
    txt(420, 380, "Pingado ............ R$ 7", 30, "#f2e8d0", { fonte: MAO, ancora: "start" }) +
    txt(420, 440, "Pão na chapa ...... R$ 8", 30, "#f2e8d0", { fonte: MAO, ancora: "start" }) +
    txt(420, 500, "Pão de queijo ...... R$ 5", 30, "#f2e8d0", { fonte: MAO, ancora: "start" }) +
    txt(420, 580, "Wi-Fi: peça a senha no caixa", 26, "#ffd27a", { fonte: MAO, ancora: "start" }) +
    txt(420, 630, "(é 'cafezinho123')", 22, "#c9b8a0", { fonte: MAO, ancora: "start" }) +
    // pendentes
    lampadaPendente(c, 220, 0, 920, "#ffc070", 0.5) +
    lampadaPendente(c, 540, 0, 760, "#ffc070", 0.6) +
    lampadaPendente(c, 860, 0, 760, "#ffc070", 0.6) +
    // prateleira de xícaras
    ret(380, 720, 640, 16, "#7a5235") +
    (() => {
      let s = "";
      for (let i = 0; i < 10; i++) s += rr(400 + i * 62, 680, 44, 40, 6, i % 3 ? "#f2efe6" : "#c8553d");
      return s;
    })() +
    // balcão e máquina
    ret(0, 1020, 1080, 340, c.lin([[0, "#8a5a3a"], [1, "#5a3a24"]])) +
    ret(0, 1000, 1080, 30, "#c9b8a0") +
    rr(640, 820, 300, 180, 16, "#c9ced2") +
    ret(660, 840, 260, 40, "#8a9096") +
    ret(700, 910, 30, 50, "#333") +
    ret(820, 910, 30, 50, "#333") +
    circ(890, 860, 14, "#e63946") +
    g(`<path d="M715,800 C700,760 740,740 720,700" stroke="#fff" stroke-width="10" fill="none" opacity="0.35"/>`, c.blur(5)) +
    // vitrine de bolos
    rr(160, 900, 340, 110, 12, "#e8f4fa", `opacity="0.35" stroke="#fff"`) +
    elip(230, 970, 50, 22, "#e0a060") +
    elip(340, 975, 46, 20, "#6a3a2a") +
    elip(440, 970, 40, 18, "#f2d06b") +
    vaso(60, 1000, 0.9) +
    piso(c, 1360, "#3a2a20", "#20160f", "#4a3a2e");
  return c.fim(corpo);
}

function auditorioEvento(): string {
  const c = new Cena("auditorio_evento");
  semear(2323);
  const corpo =
    ret(0, 0, 1080, 1920, c.lin([[0, "#07081a"], [1, "#12102a"]])) +
    // telão
    c.brilho(540, 480, 640, "#3a7aff", 0.35, 400) +
    rr(110, 200, 860, 500, 10, "#0a0f2a") +
    ret(130, 220, 820, 460, c.lin([[0, "#1a2a6a"], [1, "#3a1a5a"]], 0, 0, 1, 1)) +
    circ(540, 380, 80, "none", `stroke="#7af0ff" stroke-width="10"`) +
    `<path d="M505,370 L505,340 Q540,295 575,340 L575,370" stroke="#7af0ff" stroke-width="10" fill="none"/>` +
    rr(490, 365, 100, 70, 10, "#7af0ff") +
    circ(540, 395, 10, "#1a2a6a") +
    txt(540, 530, "SEGURANÇA É PROCESSO,", 44, "#fff", { peso: "bold" }) +
    txt(540, 590, "NÃO PRODUTO", 44, "#ff5fd2", { peso: "bold" }) +
    txt(540, 650, "Conferência Sertão Seguro 2027", 24, "#9ab", {}) +
    // treliça e holofotes
    ret(0, 90, 1080, 24, "#2a2a3a") +
    holofote(c, 200, 110, 360, 1150, 160, "#9ad8ff", 0.25) +
    holofote(c, 880, 110, 720, 1150, 160, "#ff9ad8", 0.25) +
    holofote(c, 540, 110, 540, 1100, 120, "#fff2c0", 0.2) +
    circ(200, 112, 16, "#fff") +
    circ(540, 112, 16, "#fff") +
    circ(880, 112, 16, "#fff") +
    // palco
    ret(60, 860, 960, 260, "#1b1630") +
    ret(60, 860, 960, 20, "#ff5fd2", `opacity="0.7"`) +
    // púlpito
    cam(`M760,720 L900,720 L880,880 L780,880 Z`, "#2a2a40") +
    ret(770, 760, 120, 10, "#7af0ff") +
    linha(800, 720, 780, 680, "#999", 4) +
    // caixas de som
    ret(20, 640, 90, 220, "#111") +
    circ(65, 700, 26, "#2a2a2a") +
    circ(65, 790, 34, "#2a2a2a") +
    ret(970, 640, 90, 220, "#111") +
    circ(1015, 700, 26, "#2a2a2a") +
    circ(1015, 790, 34, "#2a2a2a") +
    // plateia de costas
    g(
      (() => {
        let s = "";
        for (let r = 0; r < 3; r++) {
          for (let i = 0; i < 9 - r; i++) {
            const x = 60 + i * (1000 / (9 - r)) + entre(-20, 20) + r * 40;
            const y = 1180 + r * 60;
            s += elip(x, y, 34 + r * 6, 40 + r * 6, "#0b0a18") + ret(x - 60 - r * 8, y + 30, 120 + r * 16, 80, "#0b0a18");
          }
        }
        return s;
      })(),
      c.blur(1),
    ) +
    // telas de celular erguidas
    rr(300, 1100, 40, 70, 6, "#cfe8ff") +
    c.brilho(320, 1135, 60, "#cfe8ff", 0.5) +
    rr(780, 1120, 40, 70, 6, "#cfe8ff") +
    c.brilho(800, 1155, 60, "#cfe8ff", 0.5) +
    piso(c, 1400, "#100e1e", "#06050d");
  return c.fim(corpo, true);
}

function salaCtf(): string {
  const c = new Cena("sala_ctf");
  semear(2424);
  let placar = "";
  const times = [
    ["1", "Cabra da Peste", "4200"],
    ["2", "Sudo Sertão", "3950"],
    ["3", "0xCuscuz", "3700"],
    ["4", "Root do Agreste", "3100"],
    ["5", "Ping Pong Pamonha", "2600"],
  ];
  times.forEach(([p, n, pt], i) => {
    const y = 330 + i * 70;
    placar += ret(170, y - 40, 740, 58, i === 2 ? "#2a3a1a" : i % 2 ? "#0f1a2a" : "#13223a");
    placar += txt(210, y, p, 32, "#ffd23f", { fonte: MONO, peso: "bold" }) + txt(260, y, n, 30, "#e8f4ff", { fonte: MONO, ancora: "start" }) + txt(880, y, pt, 30, "#7CFC9A", { fonte: MONO, ancora: "end" });
  });
  let mesas = "";
  for (let r = 0; r < 2; r++) {
    const y = 1040 + r * 190;
    const s = 0.65 + r * 0.3;
    mesas += ret(0, y, 1080, 30 * s, "#2a2f3a") + ret(0, y + 30 * s, 1080, 100 * s, "#1c2028");
    for (let k = 0; k < 4; k++) {
      const x = 140 + k * 265;
      mesas += notebook(c, x, y, s * 0.8, escolhe(["#0e2a1f", "#1a1030", "#0b1a2a"]), linhasCodigo(x - 90 * s, y - 135 * s, 180 * s, 100 * s, 7, ["#7CFC9A", "#7af0ff", "#ff7ad8"]));
      mesas += rr(x + 140 * s, y - 70 * s, 30 * s, 70 * s, 6 * s, escolhe(["#e63946", "#2ec4b6", "#ffb627"]));
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#0b0e1a"], [1, "#161a2a"]])) +
    // placar
    c.brilho(540, 450, 560, "#3a7aff", 0.25, 300) +
    rr(140, 170, 800, 560, 12, "#070a12", `stroke="#3a7aff" stroke-width="4"`) +
    txt(540, 240, "PLACAR  CTF", 46, "#7af0ff", { fonte: MONO, peso: "bold" }) +
    placar +
    txt(540, 710, "tempo restante 01:47:22", 26, "#ff5fd2", { fonte: MONO }) +
    // bandeirinhas com bandeira de CTF
    bandeirinhas(-20, 1100, 70, 30, 18, ["#ff5fd2", "#7af0ff", "#ffd23f"], 0.8) +
    // cartazes
    placa(30, 780, 260, 110, "#ffd23f", [{ t: "flag{não_é_aqui}", tam: 22, cor: "#222" }], { fonte: MONO, rot: -4 }) +
    placa(800, 780, 250, 120, "#fff", [{ t: "Wi-Fi do evento", tam: 22 }, { t: "senha no crachá", tam: 22, cor: "#c0392b" }], { rot: 3 }) +
    // cabos pelo chão
    `<path d="M0,1350 C200,1300 400,1380 600,1330 C800,1290 950,1360 1080,1320" stroke="#333" stroke-width="6" fill="none"/>` +
    mesas +
    piso(c, 1360, "#1a1e2a", "#0c0f16");
  return c.fim(corpo, true);
}

function socSala(): string {
  const c = new Cena("soc_sala");
  semear(2525);
  let mapa = "";
  for (let i = 0; i < 26; i++) {
    const x = entre(400, 680);
    const y = entre(260, 470);
    mapa += circ(x, y, entre(3, 7), rnd() < 0.25 ? "#ff4d4d" : "#4cff6a", `opacity="0.85"`);
  }
  let mesas = "";
  for (let r = 0; r < 2; r++) {
    const y = 1080 + r * 170;
    const s = 0.7 + r * 0.3;
    mesas += ret(0, y, 1080, 26 * s, "#1c222c");
    for (let k = 0; k < 3; k++) {
      const x = 180 + k * 360;
      for (let m = -1; m <= 1; m += 2) {
        const mx = x + m * 70 * s;
        mesas += c.brilho(mx, y - 70 * s, 110 * s, "#4aa0ff", 0.25) + rr(mx - 64 * s, y - 130 * s, 128 * s, 90 * s, 4 * s, "#0a0e14") + telaGrafico(mx - 58 * s, y - 124 * s, 116 * s, 78 * s, m < 0 ? "#4cff6a" : "#7af0ff") + ret(mx - 6 * s, y - 40 * s, 12 * s, 40 * s, "#222");
      }
    }
  }
  const corpo =
    ret(0, 0, 1080, 1920, c.lin([[0, "#05070d"], [1, "#0b0f18"]])) +
    // videowall
    c.brilho(540, 480, 700, "#2a6aff", 0.3, 420) +
    ret(40, 160, 1000, 560, "#03050a") +
    telaGrafico(50, 170, 320, 260, "#4cff6a") +
    ret(380, 170, 320, 340, "#071628") +
    morro(400, 690, 380, 480, 40, 4, "#123a5a") +
    mapa +
    txt(540, 205, "EVENTOS POR REGIÃO", 18, "#7af0ff", { fonte: MONO }) +
    telaGrafico(710, 170, 320, 260, "#7af0ff") +
    rr(50, 440, 320, 270, 0, "#200a0e") +
    txt(210, 500, "ALERTAS CRÍTICOS", 22, "#ff8a8a", { fonte: MONO }) +
    txt(210, 610, "3", 110, "#ff4d4d", { fonte: MONO, peso: "bold" }) +
    c.brilho(210, 580, 160, "#ff4d4d", 0.25) +
    ret(380, 520, 320, 190, "#0a1a12") +
    linhasCodigo(395, 535, 290, 160, 10, ["#4cff6a", "#c9ffd8", "#ffd23f"]) +
    ret(710, 440, 320, 270, "#0b1220") +
    (() => {
      let s = "";
      for (let i = 0; i < 6; i++) s += ret(725, 460 + i * 40, 290, 30, i === 1 ? "#5a1a22" : "#14203a") + txt(735, 482 + i * 40, ["login fora do horário", "PowerShell suspeito", "VPN de outro país", "muitas falhas de senha", "USB desconhecido", "DNS estranho"][i], 16, "#cfe8ff", { fonte: MONO, ancora: "start" });
      return s;
    })() +
    // grade do videowall
    ret(370, 160, 10, 560, "#000") +
    ret(700, 160, 10, 560, "#000") +
    ret(40, 430, 1000, 10, "#000") +
    // luz no teto
    ret(0, 0, 1080, 100, "#0a0d14") +
    ret(200, 90, 680, 6, "#2a6aff", `opacity="0.6"`) +
    // placa
    placa(380, 760, 320, 70, "#0e1420", [{ t: "SOC 24x7", tam: 32, cor: "#7af0ff" }], { fonte: MONO, borda: "#2a6aff" }) +
    mesas +
    piso(c, 1400, "#0d1118", "#05070b");
  return c.fim(corpo, true);
}

function apartamentoCapital(): string {
  const c = new Cena("apartamento_capital");
  semear(2626);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f0e2cf"], [1, "#e0ccb2"]])) +
    // janela grande com cidade ao entardecer
    janela(c, 520, 180, 480, 560, {
      ceu: [[0, "#3a3a7a"], [0.5, "#d0708a"], [1, "#ffb870"]],
      paisagem: g(predios(c, 520, 1000, 740, 150, 420, "#3a3050", "#ffd27a", 0.3), c.blur(1.5)) + circ(880, 330, 40, "#ffe0a0", `opacity="0.9"`),
      moldura: "#f6f2ea",
      cortina: "#e9dcc6",
    }) +
    c.brilho(760, 640, 420, "#ffb870", 0.3, 300) +
    // estante com livros e certificado
    estante(40, 180, 380, 520, 3, "#e9e4da", 0.75) +
    quadro(110, 760, 240, 170, "#c9a77a", ret(124, 774, 212, 142, "#fbf8ef") + txt(230, 820, "CERTIFICADO", 20, "#7a5a2a", { peso: "bold" }) + txt(230, 860, "Analista de Segurança", 16, "#555") + circ(300, 890, 14, "#d6a63a")) +
    quadro(380, 780, 120, 150, "#333", ret(390, 790, 100, 130, "#9ab8c8") + elip(440, 860, 26, 32, "#c48b63") + elip(440, 920, 40, 30, "#2f6f95")) +
    // cozinha americana
    ret(40, 980, 440, 40, "#3a3f48") +
    ret(60, 1020, 400, 340, "#e9e4da") +
    rr(100, 920, 60, 60, 8, "#e63946") +
    rr(200, 930, 40, 50, 6, "#f2efe6") +
    vaso(400, 940, 0.6) +
    // sofá
    rr(540, 1060, 500, 220, 40, "#5a7a8a") +
    rr(560, 990, 460, 120, 40, "#6a8a9a") +
    rr(600, 1040, 130, 90, 20, chita(c)) +
    rr(860, 1040, 120, 90, 20, "#f0a020") +
    // luminária de pé
    linha(1030, 1300, 1030, 880, "#333", 6) +
    cam(`M990,880 L1070,880 L1050,820 L1010,820 Z`, "#f2e2c0") +
    c.brilho(1030, 900, 260, "#ffd27a", 0.45) +
    // tapete
    piso(c, 1360, "#b9946a", "#8a6a48", "#7a5a3a") +
    elip(560, 1500, 420, 110, "#d0708a", `opacity="0.35"`);
  return c.fim(corpo);
}

function assistenciaTecnica(): string {
  const c = new Cena("assistencia_tecnica");
  semear(2727);
  let vitrine = "";
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < 6; i++) {
      const x = 90 + i * 150;
      const y = 520 + r * 120;
      vitrine += rr(x, y, 60, 100, 10, escolhe(["#222", "#3a3a40", "#e9e9e9", "#c0392b", "#2f6f95"])) + rr(x + 5, y + 8, 50, 80, 6, escolhe(["#1a3a6a", "#2a2a2a", "#3a6a4a", "#5a2a5a"])) + txt(x + 30, y + 118, `R$${Math.floor(entre(8, 60)) * 10}`, 14, "#ffd23f", { peso: "bold" });
      if (rnd() < 0.2) vitrine += linha(x + 8, y + 14, x + 50, y + 80, "#fff", 2, `opacity="0.7"`) + linha(x + 50, y + 20, x + 14, y + 70, "#fff", 2, `opacity="0.6"`);
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e9f0f2"], [1, "#cfdadf"]])) +
    // porta de aço enrolada no topo
    ret(0, 0, 1080, 150, "#8a9399") +
    (() => {
      let s = "";
      for (let y = 6; y < 150; y += 14) s += ret(0, y, 1080, 4, "#6a7379");
      return s;
    })() +
    // letreiro
    rr(80, 170, 920, 140, 10, "#d6336c") +
    txt(540, 250, "ASSISTÊNCIA TÉCNICA", 52, "#fff", { peso: "bold" }) +
    txt(540, 292, "conserto com carinho e nota fiscal", 24, "#ffe0f0", { fonte: MAO }) +
    // placas escritas à mão
    placa(80, 340, 300, 140, "#fff", [{ t: "Troca de tela", tam: 28, cor: "#1a3ea8" }, { t: "na hora*", tam: 26 }, { t: "*hora de Deus", tam: 18, cor: "#888" }], { rot: -3 }) +
    placa(410, 340, 260, 140, "#ffd23f", [{ t: "Desbloqueio?", tam: 28, cor: "#c0392b" }, { t: "Só com nota", tam: 24 }, { t: "e documento", tam: 24 }], { rot: 2 }) +
    placa(700, 340, 300, 140, "#e6f4ff", [{ t: "Formatação", tam: 28 }, { t: "+ backup R$80", tam: 26, cor: "#1d6a3a" }, { t: "Wi-Fi: pergunte", tam: 18, cor: "#888" }], { rot: -1 }) +
    // vitrine
    ret(60, 500, 960, 400, "#0e1a24") +
    ret(60, 500, 960, 400, c.lin([[0, "#fff", 0.18], [1, "#fff", 0.02]], 0, 0, 1, 1)) +
    vitrine +
    ret(60, 500, 960, 400, "none", `stroke="#bfc8cc" stroke-width="10"`) +
    cam(`M80,510 L300,510 L80,860 Z`, "#fff", `opacity="0.1"`) +
    // bancada com ferramentas e lupa
    ret(0, 1000, 1080, 40, "#3a5a6a") +
    ret(0, 1040, 1080, 320, "#2a4a5a") +
    rr(120, 960, 140, 40, 6, "#2a9d8f") +
    ret(300, 970, 120, 30, "#ffb627") +
    circ(560, 930, 50, "none", `stroke="#555" stroke-width="10"`) +
    circ(560, 930, 44, "#cfe8ff", `opacity="0.4"`) +
    linha(560, 980, 560, 1000, "#555", 10) +
    linha(700, 1000, 760, 900, "#333", 6) +
    circ(760, 900, 10, "#e63946") +
    rr(840, 950, 140, 50, 8, "#222") +
    txt(910, 983, "18.0", 22, "#4cff6a", { fonte: MONO }) +
    lampadaPendente(c, 540, 0, 100, "#fff6d8", 0.25) +
    piso(c, 1360, "#c8cdd0", "#9aa0a4") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#d8dcde", "#c2c7ca", 90), `opacity="0.18"`);
  return c.fim(corpo);
}

function prefeituraSala(): string {
  const c = new Cena("prefeitura_sala");
  semear(2828);
  let pilhas = "";
  for (let i = 0; i < 3; i++) {
    let y = 1000;
    for (let k = 0; k < 6 + i * 2; k++) {
      const h = entre(12, 22);
      y -= h;
      pilhas += ret(600 + i * 110 + entre(-6, 6), y, 100, h, escolhe(["#f2e8c8", "#d8c8a0", "#e8dcc0", "#c9d6e0"]), `stroke="#a89a7a" stroke-width="1"`);
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#dfe6d4"], [1, "#c8d0b8"]])) +
    ret(0, 820, 1080, 540, "#a8b88a") +
    ret(0, 812, 1080, 12, "#7a8a5a") +
    // brasão genérico
    cam(`M540,130 L640,170 L630,310 Q600,380 540,410 Q480,380 450,310 L440,170 Z`, "#2f6f95", `stroke="#d6a63a" stroke-width="8"`) +
    cam(`M540,190 L560,240 L612,240 L570,270 L586,320 L540,290 L494,320 L510,270 L468,240 L520,240 Z`, "#f6d65a") +
    txt(540, 460, "PREFEITURA MUNICIPAL", 38, "#2f4a2a", { peso: "bold" }) +
    txt(540, 500, "Secretaria de Administração", 24, "#4a5a3a") +
    // bandeira simplificada no mastro
    ret(90, 220, 8, 600, "#8a7a5a") +
    cam(`M98,230 Q170,210 240,240 L240,380 Q170,350 98,370 Z`, "#2a8a4a") +
    cam(`M120,300 L170,255 L220,305 L170,345 Z`, "#f6d65a") +
    circ(170, 300, 22, "#2a4aa0") +
    // calendário e quadro de avisos
    calendario(860, 180, 170, "PREFEITURA", "Feliz 2027!", "Gestão Unida") +
    placa(780, 520, 260, 220, "#f6efdb", [{ t: "AVISO", tam: 30, cor: "#c0392b" }, { t: "Senha do sistema", tam: 20 }, { t: "NÃO é a data", tam: 20 }, { t: "de nascimento", tam: 20 }, { t: "do prefeito", tam: 20 }], { rot: 2 }) +
    // arquivo de aço
    ret(40, 600, 220, 760, "#8e989e") +
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += ret(55, 620 + i * 180, 190, 160, "#a4aeb4") + rr(120, 680 + i * 180, 60, 16, 4, "#5a6268");
      return s;
    })() +
    // mesa com PC e processos
    ret(320, 1000, 700, 40, "#7a5a3a") +
    ret(340, 1040, 660, 320, "#6a4a2e") +
    crt(c, 440, 1000, 0.85, "#2a6aa0", ret(380, 870, 120, 10, "#fff", `opacity="0.5"`) + txt(440, 905, "Aguarde...", 14, "#fff", { fonte: MONO })) +
    pilhas +
    ventiladorMesa(960, 1000, 0.55) +
    elip(540, 990, 30, 10, "#fff", `stroke="#ccc"`) +
    fluorescente(c, 360, 60, 360, 0.4) +
    piso(c, 1360, "#b5a88a", "#857a60") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#c8bca0", "#a89a7a", 80), `opacity="0.15"`);
  return c.fim(corpo);
}

function cooperativa(): string {
  const c = new Cena("cooperativa");
  semear(2929);
  const paisagem =
    ret(560, 420, 460, 320, "#e8d070") +
    (() => {
      let s = "";
      for (let i = 0; i < 12; i++) s += linha(560 + i * 50, 740, 790 + i * 10, 470, "#c9a840", 4);
      return s;
    })() +
    morro(560, 1020, 430, 520, 20, 3, "#8ab06a", c.blur(2)) +
    ret(870, 280, 60, 200, "#cfd4d8") +
    ret(940, 260, 60, 220, "#bfc4c8") +
    elip(900, 280, 30, 14, "#e0e4e8") +
    elip(970, 260, 30, 14, "#d0d4d8") +
    nuvem(680, 300, 0.5, "#fff", 0.85);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f2ead6"], [1, "#e0d2b2"]])) +
    ret(0, 860, 1080, 500, "#c79a5a") +
    janela(c, 560, 200, 460, 540, { ceu: [[0, "#6ab8ec"], [1, "#dff2ff"]], paisagem, moldura: "#7a5a3a", div: 2 }) +
    // mapa de talhões
    quadro(50, 180, 440, 340, "#5a3d2b", ret(66, 196, 408, 308, "#f2ead0") + ret(80, 210, 180, 130, "#8ab06a", `stroke="#555"`) + ret(270, 210, 190, 90, "#e8d070", `stroke="#555"`) + ret(270, 300, 190, 150, "#b8d08a", `stroke="#555"`) + ret(80, 340, 180, 150, "#d0b080", `stroke="#555"`) + txt(170, 280, "T1 soja", 22, "#2a2a2a", { fonte: MAO }) + txt(365, 260, "T2 milho", 22, "#2a2a2a", { fonte: MAO }) + txt(365, 380, "T3 café", 22, "#2a2a2a", { fonte: MAO }) + txt(170, 420, "T4 pasto", 22, "#2a2a2a", { fonte: MAO })) +
    placa(60, 560, 420, 110, "#2a7a3a", [{ t: "COOPERATIVA AGRO UNIÃO", tam: 28, cor: "#fff" }, { t: "safra 2027: fé e planilha", tam: 20, cor: "#f6e8a0" }], { fonte: SANS }) +
    // chapéu e boné no prego
    circ(140, 720, 5, "#444") +
    elip(140, 760, 70, 18, "#d9b96a") +
    elip(140, 740, 40, 30, "#d9b96a") +
    circ(260, 720, 5, "#444") +
    elip(260, 750, 40, 28, "#2f6f95") +
    elip(285, 768, 40, 10, "#2f6f95") +
    // sacas
    rr(40, 1040, 200, 300, 40, "#d8c49a") +
    txt(110, 1170, "SEMENTE", 24, "#7a5a2a", { peso: "bold" }) +
    rr(180, 1100, 180, 250, 40, "#cdb88c") +
    // mesa com PC, galão de café
    ret(420, 1000, 620, 40, "#6a4a2e") +
    ret(440, 1040, 580, 320, "#5a3d27") +
    crt(c, 560, 1000, 0.85, "#e8f0e0", (() => {
      let s = "";
      for (let i = 0; i < 6; i++) for (let k = 0; k < 4; k++) s += ret(487 + k * 37, 856 + i * 16, 34, 13, k === 0 ? "#cfe0c0" : "#fff", `stroke="#9a9" stroke-width="1"`);
      return s;
    })()) +
    rr(800, 900, 80, 100, 10, "#c0392b") +
    rr(820, 880, 40, 24, 4, "#222") +
    txt(840, 960, "CAFÉ", 18, "#fff", { peso: "bold" }) +
    rr(900, 960, 30, 40, 4, "#fff") +
    rr(940, 960, 30, 40, 4, "#fff") +
    ventiladorTeto(c, 540, 40, 0.8) +
    piso(c, 1360, "#9a7a5a", "#6a4e38");
  return c.fim(corpo);
}

function delegacia(): string {
  const c = new Cena("delegacia");
  semear(3030);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#d8dde0"], [1, "#b8c0c4"]])) +
    ret(0, 780, 1080, 580, "#7a8a96") +
    ret(0, 772, 1080, 12, "#5a6a76") +
    placa(140, 120, 800, 110, "#1d3a5a", [{ t: "DELEGACIA DE POLÍCIA CIVIL", tam: 36, cor: "#fff" }, { t: "Atendimento ao público", tam: 22, cor: "#cfe0f0" }], { fonte: SANS }) +
    // cartazes
    placa(60, 290, 300, 220, "#fff7d6", [{ t: "GOLPE DO PIX?", tam: 28, cor: "#c0392b" }, { t: "Registre o B.O.", tam: 22 }, { t: "Guarde prints", tam: 22 }, { t: "e comprovantes", tam: 22 }], { rot: -2 }) +
    placa(390, 290, 300, 220, "#e6f4ff", [{ t: "NÃO PAGUE", tam: 30, cor: "#1a3ea8" }, { t: "RESGATE", tam: 30, cor: "#1a3ea8" }, { t: "de dados nem", tam: 20 }, { t: "de \"sobrinho\"", tam: 20 }], { rot: 1 }) +
    placa(720, 290, 300, 220, "#fff", [{ t: "SENHA DE", tam: 26 }, { t: "ATENDIMENTO", tam: 26 }, { t: "037", tam: 60, cor: "#c0392b" }], { fonte: SANS }) +
    // grade de cela ao fundo à direita
    ret(760, 560, 320, 500, "#3a4048") +
    (() => {
      let s = "";
      for (let x = 770; x < 1080; x += 36) s += ret(x, 560, 10, 500, "#9aa4ab");
      return s + ret(760, 600, 320, 12, "#9aa4ab") + ret(760, 1000, 320, 12, "#9aa4ab");
    })() +
    // balcão
    ret(60, 900, 640, 40, "#5a4a3a") +
    ret(80, 940, 600, 420, "#6a5a48") +
    crt(c, 220, 900, 0.75, "#2a6aa0", "") +
    rr(330, 860, 150, 40, 4, "#d8d0b8") +
    elip(560, 890, 30, 10, "#fff", `stroke="#ccc"`) +
    ret(600, 840, 40, 50, "#c9a77a") +
    // bancos de espera
    ret(0, 1200, 60, 160, "#3a4a5a") +
    fluorescente(c, 160, 60, 300, 0.5) +
    fluorescente(c, 640, 60, 300, 0.5) +
    relogio(540, 620, 50, 15, 40) +
    piso(c, 1360, "#a8aeb2", "#7a8084") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#b8bec2", "#a2a8ac", 80), `opacity="0.18"`);
  return c.fim(corpo);
}

function hospitalCorredor(): string {
  const c = new Cena("hospital_corredor");
  semear(3131);
  // ponto de fuga em (540, 760)
  const fx = 540;
  const fy = 760;
  let portas = "";
  for (let i = 0; i < 5; i++) {
    const t = i / 5;
    const t2 = (i + 0.5) / 5;
    const xa = 0 + (fx - 160) * (t * 0.85);
    const xb = 0 + (fx - 160) * (t2 * 0.85);
    const ya1 = 300 + (fy - 140 - 300) * t;
    const ya2 = 1360 + (fy + 120 - 1360) * t;
    const yb1 = 300 + (fy - 140 - 300) * t2;
    const yb2 = 1360 + (fy + 120 - 1360) * t2;
    if (i % 2 === 0) {
      portas += cam(`M${xa},${ya1 + 60 * (1 - t)} L${xb},${yb1 + 60 * (1 - t2)} L${xb},${yb2} L${xa},${ya2} Z`, "#6a9a8a");
      portas += cam(`M${1080 - xa},${ya1 + 60 * (1 - t)} L${1080 - xb},${yb1 + 60 * (1 - t2)} L${1080 - xb},${yb2} L${1080 - xa},${ya2} Z`, "#6a9a8a");
    }
  }
  let luzes = "";
  for (let i = 0; i < 6; i++) {
    const t = i / 6;
    const y = 40 + (fy - 160 - 40) * Math.pow(t, 0.8);
    const w = 260 * (1 - t) + 30;
    luzes += c.brilho(fx, y + 20, w * 1.2, "#eaffff", 0.35, 60 * (1 - t) + 10) + rr(fx - w / 2, y, w, 18 * (1 - t) + 4, 4, "#ffffff");
  }
  const corpo =
    // teto
    cam(`M0,0 L1080,0 L700,620 L380,620 Z`, "#eef3f2") +
    // paredes laterais
    cam(`M0,0 L380,620 L380,900 L0,1360 Z`, c.lin([[0, "#d7ebe6"], [1, "#b9d6cf"]], 0, 0, 1, 0)) +
    cam(`M1080,0 L700,620 L700,900 L1080,1360 Z`, c.lin([[0, "#d7ebe6"], [1, "#b9d6cf"]], 1, 0, 0, 0)) +
    // faixas verdes
    cam(`M0,900 L380,820 L380,840 L0,960 Z`, "#4a9a7a") +
    cam(`M1080,900 L700,820 L700,840 L1080,960 Z`, "#4a9a7a") +
    portas +
    // fundo
    ret(380, 620, 320, 280, "#cfe3de") +
    rr(470, 680, 140, 220, 4, "#8ab0a6") +
    ret(500, 700, 80, 60, "#e8f4f2", `opacity="0.8"`) +
    placa(450, 630, 180, 40, "#2a7a5a", [{ t: "RAIO-X  >", tam: 20, cor: "#fff" }], { fonte: SANS }) +
    luzes +
    // placas
    placa(80, 420, 200, 80, "#fff", [{ t: "SILÊNCIO", tam: 28, cor: "#2a7a5a" }], { fonte: SANS }) +
    placa(800, 430, 220, 90, "#fff7d6", [{ t: "Lave as mãos", tam: 22 }, { t: "e desconfie do", tam: 18 }, { t: "pendrive achado", tam: 18, cor: "#c0392b" }], { rot: 2 }) +
    // cadeiras de espera e maca
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += rr(20 + i * 70, 1060 - i * 40, 60, 80, 8, "#3a7ab8") + ret(30 + i * 70, 1140 - i * 40, 6, 60, "#666");
      return s;
    })() +
    ret(760, 1040, 260, 30, "#e8eef0") +
    ret(780, 1070, 8, 120, "#999") +
    ret(990, 1070, 8, 120, "#999") +
    rr(770, 1020, 80, 24, 10, "#fff") +
    circ(790, 1196, 12, "#333") +
    circ(994, 1196, 12, "#333") +
    // piso brilhante em perspectiva
    cam(`M380,900 L700,900 L1080,1360 L1080,1920 L0,1920 L0,1360 Z`, c.lin([[0, "#c9d4d2"], [1, "#9aa8a6"]])) +
    g(ret(500, 920, 80, 900, "#fff", `opacity="0.22"`), c.blur(16));
  return c.fim(corpo);
}

function palcoPremiacao(): string {
  const c = new Cena("palco_premiacao");
  semear(3232);
  const cortinaGr = c.lin([[0, "#5a0a2a"], [0.5, "#a01a4a"], [1, "#5a0a2a"]], 0, 0, 1, 0);
  let dobras = "";
  for (let x = 0; x < 260; x += 44) dobras += ret(x, 0, 22, 1300, "#000", `opacity="0.18"`) + ret(1080 - x - 22, 0, 22, 1300, "#000", `opacity="0.18"`);
  const corpo =
    ret(0, 0, 1080, 1920, "#0a0612") +
    // fundo do palco com telão
    c.brilho(540, 560, 600, "#ff5fd2", 0.3, 420) +
    rr(240, 220, 600, 420, 12, "#140a20", `stroke="#d6a63a" stroke-width="6"`) +
    ret(260, 240, 560, 380, c.lin([[0, "#2a0a3a"], [1, "#5a1a4a"]])) +
    // troféu
    cam(`M490,320 L590,320 Q590,420 540,440 Q490,420 490,320 Z`, "#f6d65a") +
    `<path d="M490,340 Q450,340 460,380 Q470,400 495,400" stroke="#f6d65a" stroke-width="10" fill="none"/>` +
    `<path d="M590,340 Q630,340 620,380 Q610,400 585,400" stroke="#f6d65a" stroke-width="10" fill="none"/>` +
    ret(530, 440, 20, 40, "#d6a63a") +
    ret(500, 480, 80, 20, "#d6a63a") +
    c.brilho(540, 380, 120, "#fff3c0", 0.4) +
    txt(540, 560, "PRÊMIO MULHERES", 34, "#fff", { peso: "bold" }) +
    txt(540, 600, "NA SEGURANÇA DIGITAL", 30, "#ffd6f5", { peso: "bold" }) +
    // cortinas
    ret(0, 0, 260, 1300, cortinaGr) +
    ret(820, 0, 260, 1300, cortinaGr) +
    dobras +
    cam(`M0,0 L1080,0 L1080,140 Q810,200 540,150 Q270,200 0,140 Z`, "#7a0a3a") +
    cam(`M0,120 Q270,190 540,140 Q810,190 1080,120 L1080,150 Q810,220 540,170 Q270,220 0,150 Z`, "#d6a63a") +
    // holofotes
    holofote(c, 160, 0, 540, 1180, 220, "#fff6d0", 0.3) +
    holofote(c, 920, 0, 540, 1180, 220, "#ffd6f5", 0.25) +
    // palco
    ret(0, 1000, 1080, 300, c.lin([[0, "#3a1a2a"], [1, "#1a0a14"]])) +
    ret(0, 1000, 1080, 14, "#d6a63a") +
    elip(540, 1120, 340, 60, "#fff6d0", `opacity="0.18" ${c.blur(10)}`) +
    // microfone de pedestal
    linha(540, 1100, 540, 880, "#888", 6) +
    elip(540, 870, 14, 22, "#333") +
    elip(540, 1104, 50, 10, "#444") +
    confete(140, 0, 1080, 0, 1200, ["#f6d65a", "#ff5fd2", "#7af0ff", "#fff"]) +
    piso(c, 1300, "#1a0e18", "#08050a");
  return c.fim(corpo, true);
}

function aeroporto(): string {
  const c = new Cena("aeroporto");
  semear(3333);
  let cadeiras = "";
  for (let i = 0; i < 7; i++) cadeiras += rr(60 + i * 140, 1160, 120, 100, 14, "#2f4a6a") + rr(60 + i * 140, 1250, 120, 30, 8, "#26405a");
  const aviao =
    elip(560, 720, 300, 46, "#f4f6f8") +
    cam(`M300,720 Q250,700 270,690 L330,700 Z`, "#f4f6f8") +
    cam(`M300,700 L250,600 L300,600 L370,700 Z`, "#d6336c") +
    cam(`M520,730 L420,850 L480,850 L640,735 Z`, "#dfe3e6") +
    cam(`M540,710 L470,640 L510,640 L620,705 Z`, "#cfd4d8") +
    (() => {
      let s = "";
      for (let i = 0; i < 14; i++) s += circ(420 + i * 26, 712, 6, "#3a5a7a");
      return s;
    })() +
    cam(`M820,700 Q865,712 858,730 Q840,745 800,740 Z`, "#2a3a4a");
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#dfe6ec"], [1, "#c8d2da"]])) +
    // janelão
    ret(0, 300, 1080, 640, c.lin([[0, "#7ab8ec"], [1, "#f2e8d8"]])) +
    nuvem(200, 420, 1, "#fff", 0.85, c.blur(3)) +
    nuvem(900, 380, 0.8, "#fff", 0.8, c.blur(3)) +
    g(aviao, c.blur(1.2)) +
    ret(0, 860, 1080, 80, "#8a9096") +
    ret(0, 850, 1080, 12, "#f2c12e", `opacity="0.7"`) +
    (() => {
      let s = "";
      for (let x = 0; x <= 1080; x += 180) s += ret(x - 6, 300, 12, 640, "#5a646c");
      return s + ret(0, 296, 1080, 12, "#5a646c") + ret(0, 600, 1080, 6, "#5a646c", `opacity="0.6"`);
    })() +
    // painel de partidas
    rr(140, 60, 800, 220, 8, "#0e1218") +
    txt(220, 108, "PARTIDAS", 28, "#ffd23f", { fonte: MONO, peso: "bold", ancora: "start" }) +
    (() => {
      let s = "";
      const voos = [
        ["08:15", "LISBOA", "EMBARQUE"],
        ["08:40", "RECIFE", "NO HORÁRIO"],
        ["09:05", "SÃO PAULO", "ATRASADO"],
        ["09:30", "CAMPINA GDE", "NO HORÁRIO"],
      ];
      voos.forEach(([h, d, st], i) => {
        const y = 150 + i * 32;
        s += txt(180, y, h, 24, "#e8f4ff", { fonte: MONO, ancora: "start" }) + txt(320, y, d, 24, "#e8f4ff", { fonte: MONO, ancora: "start" }) + txt(900, y, st, 22, st === "ATRASADO" ? "#ff6a6a" : st === "EMBARQUE" ? "#4cff6a" : "#9ab", { fonte: MONO, ancora: "end" });
      });
      return s;
    })() +
    c.brilho(540, 980, 600, "#fff", 0.2, 200) +
    cadeiras +
    // tomada disputada
    rr(980, 1080, 70, 60, 6, "#f2f2ee", `stroke="#aaa"`) +
    placa(860, 1000, 210, 60, "#fff", [{ t: "carregue aqui :)", tam: 20, cor: "#1a3ea8" }], { rot: 3 }) +
    piso(c, 1300, "#d8dde2", "#a8b0b8") +
    g(ret(0, 1300, 1080, 400, c.lin([[0, "#fff", 0.35], [1, "#fff", 0]])), c.blur(6));
  return c.fim(corpo);
}

function quartoMadrugada(): string {
  const c = new Cena("quarto_madrugada");
  semear(3434);
  const tela = linhasCodigo(388, 690, 300, 170, 12, ["#7CFC9A", "#7af0ff", "#cfe8ff"]);
  const corpo =
    ret(0, 0, 1080, 1920, "#05060c") +
    // janela com lua
    janela(c, 720, 200, 280, 320, { ceu: [[0, "#0a0e2a"], [1, "#1a1e3a"]], paisagem: estrelas(40, 720, 1000, 200, 520) + circ(900, 300, 36, "#e8eaf6") + predios(c, 720, 1000, 520, 40, 140, "#06081a", "#ffd27a", 0.08), moldura: "#1a1c26", cortina: "#141826" }) +
    c.brilho(860, 360, 260, "#9ab0ff", 0.12) +
    // luz azul da tela na parede
    c.brilho(540, 760, 760, "#3a7aff", 0.5, 640) + c.brilho(540, 800, 300, "#7af0ff", 0.25) +
    // pôsteres apagados
    quadro(80, 300, 220, 300, "#0e1018", txt(190, 440, "sudo", 40, "#2a4a3a", { fonte: MONO }) + txt(190, 490, "dormir", 40, "#2a4a3a", { fonte: MONO })) +
    quadro(340, 260, 180, 140, "#0e1018", circ(430, 330, 40, "#1a2a3a")) +
    bilhete(560, 460, 140, 90, ["não esquece", "o backup"], 16, 4, "#3a3a2a", "#9a9a7a") +
    // relógio digital
    rr(110, 880, 170, 70, 8, "#0a0a0a") +
    txt(195, 930, "03:17", 44, "#ff3b3b", { fonte: MONO, peso: "bold" }) +
    c.brilho(195, 915, 110, "#ff3b3b", 0.3) +
    // mesa e monitor
    ret(60, 950, 960, 36, "#141418") +
    ret(80, 986, 22, 380, "#0e0e12") +
    ret(980, 986, 22, 380, "#0e0e12") +
    rr(360, 660, 360, 240, 8, "#0c0c10") +
    ret(376, 676, 328, 200, "#071a22") +
    tela +
    ret(520, 900, 40, 40, "#0c0c10") +
    ret(470, 936, 140, 14, "#0c0c10") +
    cam(`M400,950 L680,950 L670,930 L410,930 Z`, "#15161c") +
    // caneca e embalagem
    rr(760, 880, 60, 70, 8, "#1e2a44") +
    rr(840, 900, 90, 50, 6, "#2a1e1e") +
    // fio solto
    `<path d="M560,950 C560,1050 700,1080 760,1200 C800,1280 900,1300 1080,1290" stroke="#111" stroke-width="5" fill="none"/>` +
    // cadeira
    rr(440, 1040, 200, 260, 30, "#0c0d14") +
    piso(c, 1360, "#0a0b12", "#040408");
  return c.fim(corpo, true);
}

// --- Grupo da Família ------------------------------------------------------

function croche(cx: number, y: number, w: number, cor = "#fbf8f0"): string {
  // toalhinha de crochê com bicos
  let s = ret(cx - w / 2, y, w, 18, cor);
  const n = Math.floor(w / 28);
  for (let i = 0; i < n; i++) {
    const x = cx - w / 2 + 14 + i * 28;
    s += cam(`M${x - 14},${y + 16} L${x},${y + 44} L${x + 14},${y + 16} Z`, cor) + circ(x, y + 26, 4, "none", `stroke="#d8cfbd" stroke-width="2"`);
  }
  return s;
}

function portaRetrato(x: number, y: number, w: number, h: number, moldura: string, fundo: string, gente: number): string {
  let s = ret(x + 4, y + 5, w, h, "#000", `opacity="0.2"`) + ret(x, y, w, h, moldura) + ret(x + 6, y + 6, w - 12, h - 12, fundo);
  const peles = ["#c48b63", "#8a5a3c", "#e0b48c", "#5e3a26"];
  for (let i = 0; i < gente; i++) {
    const px = x + 6 + ((w - 12) / (gente + 1)) * (i + 1);
    s += elip(px, y + h * 0.5, w * 0.07, h * 0.1, peles[i % 4]) + elip(px, y + h - 10, w * 0.11, h * 0.2, ["#c0392b", "#2f6f95", "#f0a020", "#3a8a4a"][i % 4]);
  }
  return s;
}

function salaFamilia(): string {
  const c = new Cena("sala_familia");
  semear(4141);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f2dcc0"], [1, "#e2c4a0"]])) +
    // papel de parede com listrinhas
    ret(0, 0, 1080, 1360, c.padrao(60, 60, ret(0, 0, 60, 60, "none") + ret(26, 0, 8, 60, "#c9a27a", `opacity="0.18"`))) +
    ret(0, 0, 1080, 90, "#f8efe2") +
    ret(0, 86, 1080, 12, "#d8bf9a") +
    ventiladorTeto(c, 540, 40, 0.9) +
    lampadaPendente(c, 860, 0, 110, "#ffe0a0", 0.25) +
    // quadro da Santa Ceia (silhuetas, sem rostos)
    quadro(330, 200, 420, 210, "#b8893a",
      ret(346, 216, 388, 178, c.lin([[0, "#c9a46a"], [1, "#7a5a32"]])) +
        ret(360, 320, 360, 40, "#6a4a2a") +
        (() => {
          let s = "";
          for (let i = 0; i < 13; i++) s += elip(372 + i * 28, 300, 11, 13, "#4a3020") + elip(372 + i * 28, 330, 14, 24, i === 6 ? "#a83a2a" : "#5a3a24");
          return s + c.brilho(540, 300, 60, "#fff3c0", 0.6);
        })()) +
    // relógio de parede com nome de loja
    relogio(150, 280, 60, 8, 50, "#7a5235") +
    txt(150, 380, "Móveis Esperança", 18, "#7a5235", { fonte: MAO }) +
    // estante com TV, toalhinha, porta-retratos e santinho
    ret(220, 520, 640, 640, "#6a4428") +
    ret(240, 540, 600, 600, "#4a2e1a") +
    ret(240, 760, 600, 16, "#6a4428") +
    ret(240, 960, 600, 16, "#6a4428") +
    // TV de tela plana com toalhinha por cima (sim)
    rr(380, 600, 320, 160, 6, "#141414") +
    ret(392, 612, 296, 136, c.lin([[0, "#3a6a9a"], [1, "#1a2a4a"]])) +
    txt(540, 700, "PLANTÃO", 30, "#ffd23f", { peso: "bold" }) +
    croche(540, 588, 330) +
    portaRetrato(260, 640, 100, 120, "#d6a63a", "#9ac0d8", 3) +
    portaRetrato(720, 650, 100, 110, "#f2efe6", "#e6d0a0", 2) +
    portaRetrato(270, 830, 120, 130, "#c0c0c0", "#b8d8a0", 4) +
    // santinho com velinha
    rr(450, 840, 80, 120, 40, "#f6f0e0") +
    elip(490, 880, 14, 16, "#e0b48c") +
    cam(`M470,960 Q490,890 510,960 Z`, "#3a6ab0") +
    circ(490, 878, 24, "none", `stroke="#f6d65a" stroke-width="4"`) +
    ret(560, 920, 16, 40, "#fbf8f0") +
    elip(568, 912, 5, 9, "#ffb000") +
    c.brilho(568, 912, 50, "#ffc766", 0.6) +
    // bibelôs: elefante de costas pra porta, galo de Portugal genérico
    elip(660, 935, 40, 25, "#9aa0a6") +
    circ(630, 920, 18, "#9aa0a6") +
    ret(700, 900, 30, 60, "#2a4a8a") +
    circ(715, 895, 14, "#c0392b") +
    // livros e enciclopédia
    (() => {
      let s = "";
      for (let i = 0; i < 12; i++) s += ret(260 + i * 22, 1040, 18, 90, ["#7a1f1f", "#1f3a6a", "#2a5a2a"][i % 3]);
      return s;
    })() +
    rr(560, 1050, 120, 80, 6, "#3a3a3a") +
    txt(620, 1100, "DVD", 18, "#aaa") +
    // vaso com flor de plástico
    vaso(960, 1000, 0.9, "#c0392b", "#e8e1d0") +
    ret(900, 1000, 120, 160, "#7a5235") +
    // janela lateral com cortina rendada
    janela(c, 40, 470, 140, 400, { ceu: [[0, "#9fd0f0"], [1, "#e9f6ff"]], moldura: "#f2efe6", div: 1, vidro: true }) +
    ret(20, 450, 180, 460, c.padrao(24, 24, circ(12, 12, 7, "none", `stroke="#fff" stroke-width="2"`)), `opacity="0.7"`) +
    // sofá de couro gasto com capa
    rr(60, 1150, 960, 210, 40, "#5a3a24") +
    rr(90, 1080, 900, 140, 50, c.lin([[0, "#6a4428"], [1, "#4a2e1a"]])) +
    rr(140, 1100, 380, 180, 40, "#e9dcc0", `opacity="0.92"`) +
    rr(560, 1100, 380, 180, 40, "#e9dcc0", `opacity="0.92"`) +
    cam(`M200,1110 C240,1150 220,1200 260,1240`, "none", `stroke="#cbb994" stroke-width="4"`) +
    cam(`M700,1110 C680,1160 720,1210 690,1250`, "none", `stroke="#cbb994" stroke-width="4"`) +
    elip(330, 1150, 40, 20, "#3a2416", `opacity="0.4"`) +
    // controle remoto no plástico
    g(rr(820, 1130, 50, 120, 10, "#222") + rr(814, 1124, 62, 132, 14, "#e8f4fa", `opacity="0.45" stroke="#fff" stroke-width="2"`) + circ(845, 1150, 6, "#e63946"), `transform="rotate(-20 845 1190)"`) +
    rr(400, 1110, 120, 90, 20, chita(c), `transform="rotate(-8 460 1155)"`) +
    piso(c, 1360, "#c9a77a", "#9a7a52", "#8a6a44") +
    elip(540, 1560, 420, 110, "#8a3a2a", `opacity="0.35"`);
  return c.fim(corpo);
}

function quintalAlmoco(): string {
  const c = new Cena("quintal_almoco");
  semear(4242);
  const baloes = (x0: number, y0: number) => {
    let s = "";
    const cores = ["#e63946", "#f1c40f", "#2a9d8f", "#3a86ff", "#ff7ad8", "#ff9f1c"];
    for (let i = 0; i < 6; i++) {
      const x = x0 + entre(-50, 50);
      const y = y0 + entre(-40, 50);
      const cor = cores[i % cores.length];
      s += linha(x, y + 46, x0, y0 + 160, "#777", 1.5) + elip(x, y, 34, 42, cor) + elip(x - 10, y - 14, 8, 12, "#fff", `opacity="0.4"`);
    }
    return s;
  };
  let cadeiras = "";
  for (let i = 0; i < 6; i++) cadeiras += cadeiraPlastico(140 + i * 160, 1290, 0.85, i % 2 ? "#e8e6e0" : "#d9302c");
  let pratos = "";
  for (let i = 0; i < 7; i++) pratos += elip(130 + i * 140, 1130, 44, 12, "#fbfbf7", `stroke="#ccc"`);
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#55aef0"], [0.7, "#bfe6fb"], [1, "#f4ecd6"]])) +
    nuvem(860, 140, 0.9, "#fff", 0.9, c.blur(2)) +
    // casa vizinha e laje com caixa d'água
    g(ret(700, 330, 380, 420, "#e9c08a") + ret(760, 400, 100, 90, "#5a8ab0") + ret(900, 260, 140, 80, "#3a8ad0") + ret(890, 250, 160, 16, "#2a6aa0"), c.blur(2.5)) +
    ret(0, 380, 700, 420, "#f2e2c8") +
    ret(0, 360, 720, 30, "#9a9a92") +
    (() => {
      let s = "";
      for (let x = 10; x < 700; x += 70) s += ret(x, 300, 8, 64, "#7a7a72");
      return s;
    })() +
    ret(80, 470, 140, 140, "#5a8ab0") +
    rr(330, 520, 120, 280, 4, "#7a5235") +
    // varal ao fundo
    `<path d="M20,560 Q350,640 690,560" stroke="#555" stroke-width="3" fill="none"/>` +
    ret(80, 580, 70, 90, "#2a9d8f", `transform="rotate(4 115 580)"`) +
    ret(480, 600, 80, 60, "#f1c40f") +
    ret(590, 585, 60, 100, "#fff") +
    ret(180, 595, 50, 50, "#ff7ad8") +
    // faixa
    `<path d="M40,180 Q540,250 1040,180 L1040,300 Q540,370 40,300 Z" fill="#fff8e8" stroke="#e63946" stroke-width="8"/>` +
    txt(540, 290, "80 ANOS VÓ DITA", 70, "#e63946", { peso: "bold", fonte: MAO }) +
    txt(900, 330, "te amamos!", 26, "#2a6aa0", { fonte: MAO, rot: -6 }) +
    bandeirinhas(-20, 1100, 110, 30, 22, ["#e63946", "#f1c40f", "#2a9d8f", "#3a86ff", "#ff7ad8"], 0.9) +
    baloes(80, 360) +
    baloes(1000, 380) +
    // churrasqueira de tijolo com fumaça
    ret(760, 640, 260, 360, c.padrao(60, 30, ret(0, 0, 60, 30, "#a8553a") + ret(1, 1, 28, 13, "#c0683f") + ret(31, 1, 28, 13, "#b85e3a") + ret(16, 16, 28, 13, "#c0683f") + ret(-14, 16, 28, 13, "#b85e3a") + ret(46, 16, 28, 13, "#b85e3a"))) +
    cam(`M740,640 L1040,640 L960,520 L820,520 Z`, "#8a4a32") +
    ret(860, 420, 60, 110, "#8a4a32") +
    ret(790, 760, 200, 100, "#2a1a14") +
    c.brilho(890, 840, 120, "#ff8a2a", 0.6) +
    ret(800, 800, 180, 6, "#999") +
    elip(850, 795, 26, 10, "#8a3a2a") +
    elip(920, 795, 26, 10, "#a84a2a") +
    g(`<path d="M890,410 C860,350 930,320 890,260 C860,220 920,180 900,130" stroke="#eee" stroke-width="30" fill="none" opacity="0.45" stroke-linecap="round"/>`, c.blur(10)) +
    placa(780, 900, 220, 70, "#fff", [{ t: "NÃO MEXE NA", tam: 18 }, { t: "PICANHA - TIO NEL", tam: 18, cor: "#c0392b" }], { rot: 3 }) +
    // caixa de som de festa
    rr(40, 860, 120, 180, 10, "#1a1a1a") +
    circ(100, 920, 30, "#333") +
    circ(100, 1000, 20, "#333") +
    c.brilho(100, 920, 80, "#ff5fd2", 0.3) +
    // mesa comprida com toalha xadrez
    ret(0, 1090, 1080, 40, c.padrao(40, 40, ret(0, 0, 40, 40, "#fff") + ret(0, 0, 20, 40, "#e63946", `opacity="0.6"`) + ret(0, 0, 40, 20, "#e63946", `opacity="0.6"`))) +
    cam(`M0,1128 L1080,1128 L1080,1190 Q1000,1210 940,1190 Q860,1210 780,1190 Q700,1210 620,1190 Q540,1210 460,1190 Q380,1210 300,1190 Q220,1210 140,1190 Q70,1210 0,1190 Z`, c.padrao(40, 40, ret(0, 0, 40, 40, "#fff") + ret(0, 0, 20, 40, "#e63946", `opacity="0.6"`) + ret(0, 0, 40, 20, "#e63946", `opacity="0.6"`))) +
    pratos +
    // bolo, farofa, vinagrete, refri sem marca
    rr(470, 1000, 140, 90, 10, "#fff0f6") +
    rr(480, 960, 120, 50, 8, "#ff9ac2") +
    ret(536, 920, 8, 40, "#f6d65a") +
    elip(540, 914, 6, 10, "#ffb000") +
    txt(540, 1060, "80", 34, "#e63946", { peso: "bold" }) +
    elip(250, 1080, 60, 18, "#e8c080") +
    elip(380, 1078, 50, 16, "#c0392b") +
    elip(380, 1074, 30, 8, "#3a8a4a") +
    rr(700, 980, 36, 110, 8, "#3a1a10", `opacity="0.85"`) +
    rr(760, 1000, 34, 90, 8, "#2a8a3a", `opacity="0.85"`) +
    rr(150, 1020, 50, 70, 6, "#f2f2ee") +
    cadeiras +
    piso(c, 1340, "#bdb5a6", "#8f877a") +
    confete(60, 0, 1080, 400, 1300, ["#e63946", "#f1c40f", "#2a9d8f", "#3a86ff"]);
  return c.fim(corpo);
}

function agenciaBanco(): string {
  const c = new Cena("agencia_banco");
  semear(4343);
  let cadeiras = "";
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) cadeiras += rr(80 + i * 150 + r * 40, 1080 + r * 120, 120, 70, 14, "#2a3a5a") + rr(80 + i * 150 + r * 40, 1140 + r * 120, 120, 26, 8, "#223050") + ret(110 + i * 150 + r * 40, 1166 + r * 120, 8, 40, "#888");
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#eef1f4"], [1, "#d6dce2"]])) +
    ret(0, 0, 1080, 130, "#fafbfc") +
    fluorescente(c, 120, 100, 300, 0.45) +
    fluorescente(c, 660, 100, 300, 0.45) +
    // faixa institucional sem marca
    ret(0, 150, 1080, 90, "#1d4a7a") +
    txt(540, 210, "AGÊNCIA CENTRO  •  ATENDIMENTO", 34, "#fff", { peso: "bold" }) +
    // painel de senhas
    rr(620, 280, 400, 230, 10, "#0d1117") +
    txt(820, 330, "SENHA", 30, "#9ab", { fonte: MONO }) +
    txt(820, 420, "P047", 86, "#ff4d4d", { fonte: MONO, peso: "bold" }) +
    txt(820, 485, "GUICHÊ 3", 32, "#4cff6a", { fonte: MONO }) +
    c.brilho(820, 400, 260, "#ff4d4d", 0.12) +
    // cartaz
    placa(60, 280, 500, 300, "#fff7d6", [
      { t: "O BANCO NUNCA", tam: 38, cor: "#c0392b" },
      { t: "PEDE SUA SENHA", tam: 38, cor: "#c0392b" },
      { t: "POR TELEFONE", tam: 38, cor: "#c0392b" },
      { t: "(nem por áudio da \"gerente\")", tam: 22, cor: "#555" },
    ], { fonte: SANS, borda: "#c0392b" }) +
    placa(640, 540, 360, 90, "#fff", [{ t: "Prioridade: idosos,", tam: 22 }, { t: "gestantes, PcD", tam: 22 }], { fonte: SANS }) +
    // guichês com vidro
    ret(0, 680, 1080, 300, "#c9d2da") +
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) {
        const x = 30 + i * 265;
        s += ret(x, 690, 240, 200, "#dfefff", `opacity="0.55"`) + ret(x, 690, 240, 200, "none", `stroke="#8a96a2" stroke-width="6"`) + rr(x + 80, 640, 80, 40, 6, "#1d4a7a") + txt(x + 120, 670, `${i + 1}`, 28, "#fff", { peso: "bold" });
        s += g(pessoa(x + 120, 890, 0.8, ["#2f6f95", "#555", "#8a3a5a", "#3a7a5a"][i], ["#c48b63", "#8a5a3c", "#e0b48c", "#5e3a26"][i]), c.blur(1.5));
        if (i === 2) s += placa(x + 30, 760, 180, 50, "#fff", [{ t: "Sistema fora", tam: 18, cor: "#c0392b" }], { rot: -3 });
      }
      return s;
    })() +
    ret(0, 890, 1080, 90, "#6a7682") +
    ret(0, 880, 1080, 14, "#a8b2bc") +
    // fila com fita retrátil
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += ret(120 + i * 250, 990, 10, 80, "#9aa4ad") + elip(125 + i * 250, 1070, 22, 6, "#666");
      for (let i = 0; i < 3; i++) s += `<path d="M130,${1000} Q${250 + i * 250},1020 ${370 + i * 250},1000" stroke="#c0392b" stroke-width="6" fill="none"/>`.replace("M130", `M${130 + i * 250}`);
      return s;
    })() +
    multidao(5, 160, 900, 1060, 0.85, ["#3a3a5a", "#5a2a3a", "#2a4a3a", "#7a5a3a"], c.blur(2.5)) +
    cadeiras +
    vaso(1030, 1060, 1, "#3e8a4f", "#e8e8e8") +
    piso(c, 1360, "#cfd4d8", "#a2a8ae", "#8a9096");
  return c.fim(corpo);
}

function carroNoite(): string {
  const c = new Cena("carro_noite");
  semear(4444);
  let bokeh = "";
  for (let i = 0; i < 45; i++) {
    const cor = escolhe(["#ffb347", "#ff4d4d", "#fff1c0", "#7af0ff", "#ffd23f"]);
    bokeh += circ(entre(80, 1000), entre(380, 820), entre(10, 34), cor, `opacity="${entre(0.25, 0.7).toFixed(2)}"`);
  }
  const corpo =
    ret(0, 0, 1080, 1920, "#05060c") +
    // para-brisa com cidade borrada
    cam(`M90,330 Q540,250 990,330 L1060,900 Q540,860 20,900 Z`, c.lin([[0, "#0a0e2a"], [0.6, "#1a1640"], [1, "#2a1a3a"]])) +
    g(predios(c, 40, 1060, 860, 150, 380, "#120e28", "#ffcf6a", 0.25) + bokeh, `${c.blur(7)} ${c.clip(`<path d="M90,330 Q540,250 990,330 L1060,900 Q540,860 20,900 Z"/>`)}`) +
    // gotas no vidro
    (() => {
      let s = "";
      for (let i = 0; i < 40; i++) s += circ(entre(120, 960), entre(340, 860), entre(2, 5), "#cfe8ff", `opacity="${entre(0.2, 0.5).toFixed(2)}"`);
      return s;
    })() +
    // reflexo no vidro
    cam(`M140,340 L320,320 L180,880 L60,890 Z`, "#fff", `opacity="0.04"`) +
    // colunas e teto
    cam(`M0,0 L1080,0 L1080,340 Q540,240 0,340 Z`, "#0e0f16") +
    cam(`M0,300 L100,330 L30,920 L0,940 Z`, "#14151e") +
    cam(`M1080,300 L980,330 L1050,920 L1080,940 Z`, "#14151e") +
    // retrovisor com terço pendurado
    rr(440, 290, 200, 60, 16, "#1a1b24") +
    rr(452, 300, 176, 40, 12, "#2a2d40") +
    `<path d="M520,350 Q510,420 540,470 Q570,420 560,350" stroke="#c9a46a" stroke-width="3" fill="none" stroke-dasharray="4 4"/>` +
    linha(540, 470, 540, 500, "#c9a46a", 3) +
    linha(530, 485, 550, 485, "#c9a46a", 3) +
    // cheirinho de pinheiro
    cam(`M600,350 L640,420 L620,420 L650,470 L590,470 L610,420 L590,420 Z`, "#2a8a4a", `opacity="0.85"`) +
    // painel
    cam(`M0,900 Q540,840 1080,900 L1080,1250 L0,1250 Z`, c.lin([[0, "#1c1d26"], [1, "#0c0d12"]])) +
    // volante
    circ(300, 1180, 220, "none", `stroke="#0a0a0e" stroke-width="44"`) +
    circ(300, 1180, 70, "#121218") +
    rr(220, 1020, 160, 40, 16, "#0a0a0e") +
    // instrumentos iluminados
    elip(300, 990, 120, 60, "#06070c") +
    circ(250, 990, 40, "none", `stroke="#ff8a2a" stroke-width="4" opacity="0.8"`) +
    circ(350, 990, 40, "none", `stroke="#ff8a2a" stroke-width="4" opacity="0.8"`) +
    linha(250, 990, 225, 965, "#ff4d4d", 3) +
    linha(350, 990, 370, 960, "#ff4d4d", 3) +
    c.brilho(300, 990, 140, "#ff8a2a", 0.2) +
    circ(300, 1030, 6, "#ffd23f") +
    // rádio
    rr(470, 940, 180, 70, 8, "#0a0a10") +
    txt(560, 985, "FM 98,7", 26, "#7af0ff", { fonte: MONO }) +
    c.brilho(560, 975, 120, "#7af0ff", 0.25) +
    // celular no suporte iluminando
    linha(800, 1000, 800, 1060, "#222", 10) +
    rr(740, 820, 120, 200, 16, "#0a0a0a") +
    rr(748, 830, 104, 180, 10, c.lin([[0, "#e8f4ff"], [1, "#9ad0ff"]])) +
    ret(748, 830, 104, 26, "#2a9d8f") +
    txt(800, 849, "Família", 13, "#fff") +
    rr(756, 866, 70, 22, 8, "#fff") +
    rr(772, 896, 72, 22, 8, "#d6f5c0") +
    rr(756, 926, 80, 22, 8, "#fff") +
    rr(770, 956, 74, 30, 8, "#d6f5c0") +
    txt(800, 1000, "47 novas", 12, "#c0392b", { peso: "bold" }) +
    c.brilho(800, 920, 340, "#9ad0ff", 0.4, 300) +
    // console e banco
    cam(`M440,1250 L700,1250 L760,1920 L380,1920 Z`, "#101118") +
    rr(510, 1300, 120, 90, 10, "#1a1b24") +
    piso(c, 1250, "#0d0e14", "#050508");
  return c.fim(corpo, true);
}

function quartoTia(): string {
  const c = new Cena("quarto_tia");
  semear(4545);
  const chenille = c.padrao(50, 50, ret(0, 0, 50, 50, "#f0a8b8") + circ(25, 25, 10, "#f7c8d4") + circ(0, 0, 6, "#e88aa0") + circ(50, 0, 6, "#e88aa0") + circ(0, 50, 6, "#e88aa0") + circ(50, 50, 6, "#e88aa0"));
  let perfumes = "";
  const cores = ["#f6d65a", "#ff9ac2", "#9ad0ff", "#c9a0ff", "#a0e0b0", "#ffb070"];
  for (let i = 0; i < 6; i++) {
    const x = 650 + i * 52;
    const h = entre(50, 90);
    perfumes += rr(x, 980 - h, 36, h, 8, cores[i], `opacity="0.85"`) + rr(x + 10, 980 - h - 18, 16, 18, 3, "#d6a63a") + elip(x + 12, 980 - h + 14, 5, 12, "#fff", `opacity="0.5"`);
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f6e2e6"], [1, "#e8c8d0"]])) +
    ret(0, 0, 1080, 1360, c.padrao(90, 90, ret(0, 0, 90, 90, "none") + circ(45, 45, 6, "#d88aa0", `opacity="0.25"`) + circ(0, 0, 4, "#d88aa0", `opacity="0.2"`))) +
    lampadaPendente(c, 540, 0, 90, "#ffe0b0", 0.35) +
    // quadro de flores
    quadro(80, 180, 340, 260, "#c9a46a",
      ret(96, 196, 308, 228, "#f4ecd8") +
        (() => {
          let s = "";
          for (let i = 0; i < 8; i++) {
            const x = 140 + entre(0, 230);
            const y = 260 + entre(0, 90);
            s += circ(x, y, entre(16, 30), escolhe(["#e63946", "#ff9ac2", "#f6d65a", "#ffffff", "#c9a0ff"]));
          }
          return cam(`M220,420 L250,320 L280,420 Z`, "#7aa0c0") + s;
        })()) +
    // janela com cortina de renda
    janela(c, 520, 180, 260, 300, { ceu: [[0, "#f6b26b"], [1, "#ffe1b0"]], moldura: "#f2efe6", cortina: "#fbf6ee" }) +
    // calendário de santo e terço na parede
    calendario(860, 200, 170, "FARMÁCIA", "Saúde e fé", "2027  Peça desconto") +
    // penteadeira com espelho
    elip(800, 680, 170, 200, "#c9a46a") +
    elip(800, 680, 150, 180, c.lin([[0, "#dfeef6"], [1, "#a8c4d4"]], 0, 0, 1, 1)) +
    cam(`M700,560 L760,540 L690,700 Z`, "#fff", `opacity="0.35"`) +
    bilhete(860, 560, 120, 70, ["NÃO", "clica link"], 16, 6, "#fdf6b2", "#c0392b") +
    ret(580, 980, 440, 30, "#c9a46a") +
    ret(600, 1010, 400, 350, "#b8935a") +
    ret(620, 1040, 170, 120, "#a8834a") +
    ret(810, 1040, 170, 120, "#a8834a") +
    circ(705, 1100, 7, "#f6d65a") +
    circ(895, 1100, 7, "#f6d65a") +
    croche(800, 980, 380) +
    perfumes +
    // terço sobre a penteadeira
    `<path d="M600,975 Q630,940 660,975" stroke="#8a5a3a" stroke-width="4" fill="none" stroke-dasharray="3 5"/>` +
    linha(630, 975, 630, 995, "#8a5a3a", 3) +
    linha(622, 985, 638, 985, "#8a5a3a", 3) +
    // celular carregando no benjamim
    rr(600, 1180, 60, 90, 6, "#f2f2f2", `stroke="#999"`) +
    circ(620, 1210, 4, "#333") +
    circ(640, 1210, 4, "#333") +
    rr(580, 1220, 54, 50, 6, "#fff", `stroke="#aaa" transform="rotate(-12 607 1245)"`) +
    rr(630, 1240, 40, 40, 6, "#fff", `stroke="#aaa" transform="rotate(20 650 1260)"`) +
    `<path d="M600,1250 C540,1260 520,1200 500,1150" stroke="#222" stroke-width="3" fill="none"/>` +
    `<path d="M650,1270 C700,1300 760,1290 820,1320" stroke="#222" stroke-width="3" fill="none"/>` +
    rr(470, 1080, 60, 100, 8, "#222", `transform="rotate(-10 500 1130)"`) +
    rr(476, 1088, 48, 82, 6, "#7ab8ff", `transform="rotate(-10 500 1130)"`) +
    c.brilho(500, 1130, 90, "#7ab8ff", 0.4) +
    // cama com colcha de chenille
    rr(0, 760, 80, 600, 8, "#8a5a36") +
    rr(-20, 1040, 470, 320, 30, chenille) +
    cam(`M-20,1340 Q100,1380 200,1350 Q320,1390 450,1350 L450,1360 L-20,1360 Z`, "#e88aa0") +
    rr(20, 980, 200, 80, 30, "#fbf6ee") +
    rr(40, 1000, 160, 50, 20, c.padrao(16, 16, ret(0, 0, 16, 16, "#fbf6ee") + circ(8, 8, 3, "#e8b8c4")), `opacity="0.8"`) +
    // gato de pelúcia de vigia
    elip(320, 1030, 50, 40, "#f2efe6") +
    circ(320, 990, 30, "#f2efe6") +
    cam(`M296,970 L300,945 L314,965 Z`, "#f2efe6") +
    cam(`M344,970 L340,945 L326,965 Z`, "#f2efe6") +
    piso(c, 1360, "#c49a7a", "#8e6a50", "#7a5a40") +
    elip(560, 1560, 320, 80, "#c96a8a", `opacity="0.35"`);
  return c.fim(corpo);
}

// --- A DPO Apavorada --------------------------------------------------------

function clinicaRecepcao(): string {
  const c = new Cena("clinica_recepcao");
  semear(5151);
  let cadeiras = "";
  for (let i = 0; i < 5; i++) cadeiras += rr(40 + i * 120, 1180, 100, 110, 16, "#4aa0a0") + rr(40 + i * 120, 1270, 100, 30, 10, "#3a8a8a") + ret(85 + i * 120, 1300, 10, 50, "#8a9096");
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#eef7f6"], [1, "#d8ebe8"]])) +
    ret(0, 0, 1080, 120, "#fafdfc") +
    fluorescente(c, 100, 90, 300, 0.45) +
    fluorescente(c, 680, 90, 300, 0.45) +
    // faixa com nome da clínica
    ret(0, 140, 1080, 110, c.lin([[0, "#2aa08a"], [1, "#1f7a6a"]], 0, 0, 1, 0)) +
    circ(120, 195, 38, "#fff") +
    ret(108, 172, 24, 46, "#2aa08a") +
    ret(97, 183, 46, 24, "#2aa08a") +
    txt(580, 212, "CLÍNICA BEM VIVER", 46, "#fff", { peso: "bold" }) +
    // TV com programa matinal
    rr(620, 290, 400, 240, 8, "#111") +
    ret(634, 304, 372, 212, c.lin([[0, "#ffcf6a"], [1, "#ff8a5a"]])) +
    elip(720, 470, 40, 60, "#c0392b") +
    circ(720, 395, 26, "#e0b48c") +
    elip(900, 480, 46, 50, "#2a6aa0") +
    circ(900, 410, 26, "#8a5a3c") +
    ret(634, 470, 372, 46, "#c0001a") +
    txt(820, 502, "RECEITA DE BOLO DE FUBÁ", 22, "#fff", { peso: "bold" }) +
    rr(950, 312, 46, 24, 4, "#fff") +
    txt(973, 330, "AO VIVO", 11, "#c0001a", { peso: "bold" }) +
    linha(820, 530, 820, 560, "#555", 8) +
    // painel de senhas
    rr(620, 580, 400, 140, 8, "#0d1117") +
    txt(720, 625, "SENHA", 22, "#9ab", { fonte: MONO }) +
    txt(720, 690, "C023", 54, "#4cff6a", { fonte: MONO, peso: "bold" }) +
    txt(920, 625, "GUICHÊ", 22, "#9ab", { fonte: MONO }) +
    txt(920, 690, "2", 54, "#ffd23f", { fonte: MONO, peso: "bold" }) +
    // cartazes
    placa(60, 300, 260, 160, "#fff", [{ t: "SORRIA,", tam: 30, cor: "#1a3ea8" }, { t: "você está sendo", tam: 22 }, { t: "filmado", tam: 22 }], { fonte: SANS, borda: "#1a3ea8" }) +
    g(placa(340, 300, 250, 190, "#eaffef", [{ t: "Seus dados são", tam: 24, cor: "#1d6a3a" }, { t: "protegidos", tam: 30, cor: "#1d6a3a" }, { t: "pela LGPD", tam: 30, cor: "#1d6a3a" }, { t: "(novo!)", tam: 18, cor: "#c0392b" }], { fonte: SANS, rot: -7, borda: "#2aa08a" }) + fita(380, 290, -30) + fita(560, 300, 20)) +
    placa(60, 490, 240, 110, "#fff7d6", [{ t: "Não aceitamos", tam: 20 }, { t: "cheque", tam: 26, cor: "#c0392b" }], { rot: 2 }) +
    // câmera no canto
    rr(20, 100, 70, 40, 8, "#e8e8e8") +
    circ(40, 120, 12, "#222") +
    circ(40, 120, 4, "#ff3b3b") +
    relogio(520, 580, 40, 7, 55, "#2aa08a") +
    // balcão de recepção
    ret(330, 760, 720, 60, "#f6f2ea") +
    ret(340, 820, 700, 520, c.lin([[0, "#2aa08a"], [1, "#1a6a5a"]])) +
    ret(340, 820, 700, 16, "#000", `opacity="0.15"`) +
    ret(340, 1000, 700, 8, "#fff", `opacity="0.2"`) +
    txt(690, 960, "RECEPÇÃO", 48, "#fff", { peso: "bold", op: 0.9 }) +
    // monitor, papelada, pote de canetas, sino
    rr(420, 640, 180, 120, 8, "#1a1a1a") +
    ret(430, 650, 160, 100, "#d8e8f4") +
    ret(440, 660, 140, 12, "#2aa08a") +
    (() => {
      let s = "";
      for (let i = 0; i < 5; i++) s += ret(440, 680 + i * 13, 140, 8, i === 2 ? "#ffd23f" : "#fff");
      return s;
    })() +
    ret(500, 750, 20, 12, "#333") +
    ret(640, 730, 120, 30, "#f2f2ee", `stroke="#ccc"`) +
    ret(650, 716, 110, 16, "#e8f4fa", `stroke="#ccc"`) +
    rr(800, 710, 40, 50, 4, "#c0392b") +
    linha(808, 710, 800, 680, "#1a3ea8", 4) +
    linha(820, 710, 826, 676, "#222", 4) +
    elip(900, 755, 30, 8, "#888") +
    cam(`M875,752 Q900,710 925,752 Z`, "#d6a63a") +
    bilhete(860, 790, 150, 90, ["Wi-Fi pacientes:", "saude2019"], 16, 3) +
    // bebedouro
    rr(60, 860, 110, 260, 10, "#e8ecef") +
    rr(70, 700, 90, 170, 30, "#9ad0f0", `opacity="0.85"`) +
    rr(90, 690, 50, 20, 4, "#3a86ff") +
    elip(100, 760, 12, 30, "#fff", `opacity="0.45"`) +
    rr(80, 900, 90, 30, 4, "#cfd4d8") +
    circ(100, 960, 8, "#3a86ff") +
    circ(130, 960, 8, "#e63946") +
    ret(180, 900, 30, 40, "#fff", `opacity="0.85" stroke="#ccc"`) +
    // planta de plástico
    vaso(250, 1110, 1.1, "#4cc06a", "#f2efe6") +
    // revisteiro
    ret(800, 1130, 220, 20, "#c9a77a") +
    (() => {
      let s = "";
      for (let i = 0; i < 5; i++) s += ret(810 + i * 42, 1060, 36, 72, ["#e63946", "#3a86ff", "#f1c40f", "#9b5de5", "#2a9d8f"][i], `transform="rotate(${-8 + i * 4} ${828 + i * 42} 1130)"`);
      return s;
    })() +
    g(cadeiras, c.blur(0.6)) +
    piso(c, 1350, "#e8eeec", "#bccac6", "#a8b8b4") +
    g(ret(0, 1350, 1080, 300, c.lin([[0, "#fff", 0.4], [1, "#fff", 0]])), c.blur(6));
  return c.fim(corpo);
}

function salaReuniao(): string {
  const c = new Cena("sala_reuniao");
  semear(5252);
  let cadeiras = "";
  for (let i = 0; i < 5; i++) {
    const x = 170 + i * 185;
    cadeiras += rr(x - 60, 900, 120, 180, 30, "#2a2a34") + rr(x - 50, 910, 100, 30, 14, "#3a3a46");
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e9e4dc"], [1, "#d4ccc0"]])) +
    ret(0, 0, 1080, 110, "#f6f3ee") +
    lampadaPendente(c, 540, 0, 80, "#ffe8c0", 0.3) +
    // tela de projeção com slide
    linha(220, 110, 220, 140, "#555", 4) +
    linha(860, 110, 860, 140, "#555", 4) +
    ret(190, 140, 700, 28, "#bbb") +
    ret(210, 168, 660, 420, "#fbfbf9") +
    c.brilho(540, 380, 420, "#ffffff", 0.3, 260) +
    ret(240, 200, 600, 60, "#1f4e79") +
    txt(540, 244, "REUNIÃO EXTRAORDINÁRIA", 30, "#fff", { peso: "bold" }) +
    txt(540, 420, "CRISE?", 130, "#c0392b", { peso: "bold" }) +
    txt(540, 500, "(é só um incidente, gente)", 28, "#555", { fonte: MAO }) +
    txt(840, 570, "1/37", 18, "#888") +
    // quadro branco com rabiscos
    ret(900, 200, 170, 420, "#fafafa", `stroke="#aaa" stroke-width="6"`) +
    txt(985, 260, "PLANO", 24, "#1a3ea8", { fonte: MAO }) +
    txt(985, 300, "1. calma", 20, "#1a3ea8", { fonte: MAO }) +
    txt(985, 340, "2. ????", 20, "#c0392b", { fonte: MAO }) +
    txt(985, 380, "3. lucro", 20, "#1a3ea8", { fonte: MAO, op: 0.4 }) +
    linha(925, 372, 1045, 372, "#c0392b", 3) +
    `<path d="M930,440 C960,400 990,480 1030,430 M940,520 L1040,470 M950,560 Q990,520 1030,580" stroke="#2a8a4a" stroke-width="3" fill="none"/>` +
    txt(985, 600, "ANPD??", 22, "#c0392b", { fonte: MAO, rot: -8 }) +
    // quadro do fundador e flip chart
    quadro(20, 230, 150, 190, "#c9a46a", ret(32, 242, 126, 166, "#d8d0c0") + pessoa(95, 408, 0.6, "#1a1a2a", "#e0b48c")) +
    txt(95, 450, "Dr. Fundador", 16, "#6a5a4a", { fonte: MAO }) +
    // janela com persiana
    ret(20, 500, 160, 300, "#a8c8e0") +
    (() => {
      let s = "";
      for (let y = 505; y < 800; y += 16) s += ret(20, y, 160, 10, "#eceae4");
      return s;
    })() +
    // mesa oval
    cadeiras +
    elip(540, 1090, 520, 130, "#3a2418") +
    elip(540, 1075, 510, 120, c.lin([[0, "#8a5a3a"], [1, "#5a3a24"]])) +
    elip(540, 1050, 380, 60, "#fff", `opacity="0.06"`) +
    // projetor com feixe
    holofote(c, 540, 1010, 540, 380, 300, "#fffbe0", 0.12) +
    rr(490, 990, 100, 44, 8, "#e8e8e8") +
    circ(540, 1010, 14, "#333") +
    // garrafa térmica e xícaras
    rr(260, 940, 60, 110, 14, "#c0392b") +
    rr(272, 920, 36, 24, 6, "#222") +
    txt(290, 1000, "CAFÉ", 14, "#fff", { peso: "bold" }) +
    ret(340, 1030, 30, 26, "#fff") +
    ret(380, 1035, 30, 26, "#fff") +
    // papéis, celulares virados, pote de biscoito
    ret(640, 1040, 90, 60, "#fff", `transform="rotate(10 685 1070)"`) +
    ret(720, 1020, 90, 60, "#f6f3ee", `transform="rotate(-6 765 1050)"`) +
    rr(820, 1050, 40, 70, 6, "#222", `transform="rotate(30 840 1085)"`) +
    rr(420, 1060, 40, 70, 6, "#222", `transform="rotate(-20 440 1095)"`) +
    rr(150, 1040, 70, 50, 10, "#e8d8b0") +
    piso(c, 1360, "#5a5a64", "#3a3a44") +
    elip(540, 1550, 480, 120, "#000", `opacity="0.15"`);
  return c.fim(corpo);
}

function salaDpo(): string {
  const c = new Cena("sala_dpo");
  semear(5353);
  const caixa = (x: number, y: number, w: number, h: number, rot: string) =>
    ret(x, y, w, h, "#c9a26a", `stroke="#9a7a4a" stroke-width="3"`) + ret(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.28, "#fff") + txt(x + w / 2, y + h * 0.5, rot, Math.min(18, w * 0.13), "#333", { fonte: MAO });
  let postits = "";
  const textos = [["RIPD", "!!!"], ["base", "legal?"], ["cookie", "banner"], ["ligar p/", "TI"], ["DPA", "fornec."], ["titular", "pediu"], ["prazo", "15 dias"], ["respira"]];
  textos.forEach((t, i) => {
    postits += bilhete(320 + (i % 4) * 110, 250 + Math.floor(i / 4) * 110, 96, 86, t, 15, entre(-8, 8), escolhe(["#fdf6b2", "#ffd0e0", "#bfe6ff", "#d6f5c0"]));
  });
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#dcd8cc"], [1, "#c4bfb0"]])) +
    // marca de prateleira antiga e placa improvisada
    ret(0, 0, 1080, 80, "#bdb8aa") +
    fluorescente(c, 380, 40, 300, 0.35) +
    placa(40, 110, 240, 80, "#fff", [{ t: "ENCARREGADA", tam: 22, cor: "#1a3ea8" }, { t: "(ex-almoxarifado)", tam: 16 }], { rot: -2 }) +
    // janelinha alta
    janela(c, 820, 150, 180, 120, { ceu: [[0, "#8fc9f0"], [1, "#d9f0ff"]], moldura: "#e8e4d8", div: 1 }) +
    postits +
    // calendário e certificado
    calendario(830, 340, 170, "CLÍNICA", "Prazo ANPD", "agosto") +
    quadro(40, 240, 240, 170, "#2a2a2a", ret(52, 252, 216, 146, "#fbf8ef") + txt(160, 300, "CERTIFICADO", 18, "#7a5a2a", { peso: "bold" }) + txt(160, 335, "Privacidade e", 15, "#555") + txt(160, 355, "Proteção de Dados", 15, "#555") + circ(230, 380, 12, "#d6a63a")) +
    // estante de aço com caixas de arquivo
    ret(20, 450, 280, 900, "#8e989e") +
    ret(20, 640, 280, 12, "#6a747a") +
    ret(20, 840, 280, 12, "#6a747a") +
    ret(20, 1040, 280, 12, "#6a747a") +
    caixa(34, 520, 120, 120, "2017") +
    caixa(160, 540, 126, 100, "2018") +
    caixa(34, 712, 126, 128, "não abrir") +
    caixa(166, 730, 120, 110, "fichas") +
    caixa(34, 920, 250, 120, "ARQUIVO MORTO") +
    caixa(50, 1110, 220, 120, "???") +
    // pilha de caixas no chão
    caixa(880, 1100, 180, 140, "prontuários") +
    caixa(900, 980, 150, 120, "papel") +
    caixa(910, 870, 130, 110, "RH") +
    // mesa apertada
    ret(310, 940, 560, 36, "#7a5a3a") +
    ret(320, 976, 24, 380, "#5a3d27") +
    ret(836, 976, 24, 380, "#5a3d27") +
    // vade-mécum gigante
    ret(340, 800, 230, 140, "#7a1f1f") +
    ret(340, 800, 230, 20, "#5a1414") +
    ret(560, 806, 16, 130, "#f2ead8") +
    txt(455, 880, "VADE MÉCUM", 26, "#f6d65a", { peso: "bold" }) +
    txt(455, 912, "2027 (6 kg)", 18, "#f6d65a") +
    // notebook
    notebook(c, 700, 940, 0.62, "#e8f0f6", (() => {
      let s = "";
      for (let i = 0; i < 6; i++) s += ret(620, 845 + i * 12, 160 - (i % 3) * 30, 6, "#4a6a8a", `opacity="0.7"`);
      return s;
    })()) +
    // caneca "Não sou TI"
    rr(590, 860, 70, 80, 8, "#fff", `stroke="#ccc" stroke-width="2"`) +
    `<path d="M660,876 Q690,900 660,924" stroke="#fff" stroke-width="10" fill="none"/>` +
    txt(625, 895, "NÃO", 15, "#c0392b", { peso: "bold" }) +
    txt(625, 915, "SOU TI", 15, "#c0392b", { peso: "bold" }) +
    // planta resistente (espada-de-são-jorge)
    (() => {
      let s = "";
      const angs = [-18, -8, 0, 8, 16, -26, 24];
      angs.forEach((a, i) => (s += cam(`M${790 + i * 3},940 Q${780 + i * 4},${820 - (i % 3) * 30} ${790 + i * 4},${760 - (i % 3) * 40} Q${806 + i * 3},${820} ${802 + i * 3},940 Z`, i % 2 ? "#3a7a3a" : "#5a9a3a", `transform="rotate(${a} 796 940)"`)));
      return s;
    })() +
    rr(760, 900, 80, 50, 6, "#b5653e") +
    piso(c, 1350, "#9a958a", "#6e6a60");
  return c.fim(corpo);
}

function studioPilates(): string {
  const c = new Cena("studio_pilates");
  semear(5454);
  const reformer = (x: number, y: number, s: number) =>
    rr(x, y - 40 * s, 420 * s, 40 * s, 10 * s, "#d9c4a0") +
    rr(x + 90 * s, y - 64 * s, 200 * s, 30 * s, 10 * s, "#3a3a46") +
    rr(x + 20 * s, y - 70 * s, 60 * s, 34 * s, 10 * s, "#3a3a46") +
    ret(x + 390 * s, y - 120 * s, 16 * s, 90 * s, "#c9ced2") +
    linha(x + 400 * s, y - 110 * s, x + 300 * s, y - 60 * s, "#555", 3 * s) +
    ret(x + 10 * s, y, 14 * s, 50 * s, "#c9ced2") +
    ret(x + 396 * s, y, 14 * s, 50 * s, "#c9ced2");
  let mural = "";
  const aniv = [["Dona Cida", "03"], ["Dona Lurdes", "11"], ["Dona Zezé", "19"], ["Seu Arnaldo", "27"]];
  aniv.forEach(([n, d], i) => {
    mural += bilhete(670 + (i % 2) * 170, 380 + Math.floor(i / 2) * 120, 150, 90, [n, `dia ${d}`], 18, entre(-5, 5), escolhe(["#ffd0e0", "#fdf6b2", "#d6f5c0", "#bfe6ff"]));
  });
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f6f0e8"], [1, "#eadfd0"]])) +
    // espelho grande com reflexo do estúdio
    ret(30, 220, 600, 760, "#c9ced2") +
    ret(42, 232, 576, 736, c.lin([[0, "#e6eef2"], [1, "#c6d4dc"]], 0, 0, 1, 1)) +
    g(
      ret(42, 700, 576, 268, "#c8b090", `opacity="0.5"`) +
        multidao(4, 100, 580, 900, 0.9, ["#ff9ac2", "#9ad0ff", "#c9a0ff", "#a0e0b0"]) +
        circ(500, 860, 60, "#7ab8ff", `opacity="0.6"`),
      `${c.blur(3)} ${c.clip(`<rect x="42" y="232" width="576" height="736"/>`)}`,
    ) +
    cam(`M60,240 L260,240 L60,700 Z`, "#fff", `opacity="0.3"`) +
    cam(`M300,240 L360,240 L120,960 L60,960 Z`, "#fff", `opacity="0.15"`) +
    // letreiro e frase
    txt(540, 140, "Studio Equilíbrio", 64, "#b0607a", { fonte: MAO }) +
    txt(540, 190, "pilates • alongamento • fofoca", 24, "#8a7a6a") +
    // mural de aniversariantes
    ret(650, 300, 380, 360, "#c9a77a") +
    ret(664, 314, 352, 332, "#e8d4b0") +
    txt(840, 360, "ANIVERSARIANTES", 24, "#b0607a", { peso: "bold" }) +
    mural +
    // prateleira com garrafinhas e toalhas
    ret(660, 720, 380, 16, "#c9a77a") +
    (() => {
      let s = "";
      const cores = ["#ff9ac2", "#7ab8ff", "#a0e0b0", "#f6d65a", "#c9a0ff", "#ff9f6a"];
      for (let i = 0; i < 6; i++) s += rr(680 + i * 58, 640, 36, 80, 10, cores[i], `opacity="0.85"`) + rr(688 + i * 58, 628, 20, 16, 4, "#fff");
      return s;
    })() +
    ret(660, 860, 380, 16, "#c9a77a") +
    rr(680, 800, 100, 60, 14, "#9ad0ff") +
    rr(790, 800, 100, 60, 14, "#ffd0e0") +
    rr(900, 800, 100, 60, 14, "#d6f5c0") +
    // bolas suíças
    circ(940, 1060, 110, c.rad([[0, "#9ad0ff"], [1, "#3a86ff"]], 0.35, 0.3, 0.7)) +
    circ(790, 1110, 80, c.rad([[0, "#ffc0d8"], [1, "#e0608a"]], 0.35, 0.3, 0.7)) +
    // plantas
    vaso(640, 1100, 1.1, "#4a9a5a", "#f2efe6") +
    // reformers
    reformer(60, 1180, 1.1) +
    reformer(560, 1260, 1.0) +
    // caixa de som e ar
    rr(820, 30, 220, 70, 8, "#f6f6f4") +
    ret(840, 80, 180, 6, "#ccc") +
    ventiladorTeto(c, 300, 20, 0.6) +
    piso(c, 1350, "#d8c09a", "#a88a62", "#9a7a52");
  return c.fim(corpo);
}

function homeOfficeNoite(): string {
  const c = new Cena("home_office_noite");
  semear(5555);
  let planilha = "";
  for (let r = 0; r < 9; r++) {
    for (let k = 0; k < 5; k++) {
      const vermelho = rnd() < 0.12;
      planilha += ret(422 + k * 50, 686 + r * 18, 48, 16, r === 0 ? "#2a8a4a" : vermelho ? "#ffb0b0" : k === 0 ? "#e6f0e0" : "#ffffff", `stroke="#b8c8b8" stroke-width="1"`);
    }
  }
  const corpo =
    ret(0, 0, 1080, 1920, c.lin([[0, "#121428"], [1, "#0a0b18"]])) +
    // janela com lua e prédios
    janela(c, 640, 160, 360, 400, { ceu: [[0, "#0a0e2a"], [1, "#2a2050"]], paisagem: estrelas(30, 640, 1000, 160, 500) + circ(920, 250, 34, "#f2eed8") + predios(c, 640, 1000, 560, 60, 200, "#0c0a20", "#ffd27a", 0.15), moldura: "#2a2a3a", cortina: "#3a3050" }) +
    // estante escura com livros
    g(estante(40, 160, 340, 600, 4, "#2a2018", 0.9), `opacity="0.55"`) +
    // luz da luminária e da tela
    c.brilho(260, 900, 520, "#ffc070", 0.4, 380) +
    c.brilho(540, 760, 400, "#bcd8ff", 0.35, 300) +
    // luminária articulada
    linha(200, 1000, 230, 780, "#2a2a2a", 10) +
    linha(230, 780, 330, 720, "#2a2a2a", 10) +
    cam(`M300,700 L380,730 L350,790 L280,760 Z`, "#d6a63a") +
    c.brilho(340, 780, 120, "#fff3c0", 0.6) +
    elip(200, 1000, 50, 12, "#2a2a2a") +
    // mesa
    ret(0, 1000, 1080, 40, "#4a3424") +
    ret(0, 1040, 1080, 300, "#2e2016") +
    // notebook com planilha
    cam(`M380,640 L700,640 L710,960 L370,960 Z`, "#2a2e36") +
    ret(400, 660, 290, 290, "#f4f6f4") +
    ret(400, 660, 290, 20, "#2a8a4a") +
    txt(410, 675, "titulares_v7_FINAL_agora_vai.xlsx", 11, "#fff", { ancora: "start" }) +
    planilha +
    cam(`M340,1000 L740,1000 L710,960 L370,960 Z`, "#4a4f58") +
    // gato dormindo sobre papéis
    ret(720, 960, 200, 40, "#f2f2ee", `transform="rotate(-6 820 980)"`) +
    ret(740, 950, 200, 40, "#e8e4d8", `transform="rotate(4 840 970)"`) +
    elip(830, 950, 110, 50, "#e08a3a") +
    circ(920, 930, 38, "#e08a3a") +
    cam(`M898,904 L904,872 L922,898 Z`, "#e08a3a") +
    cam(`M938,898 L950,870 L956,904 Z`, "#e08a3a") +
    `<path d="M904,934 Q912,940 920,934 M926,934 Q934,940 942,934" stroke="#5a2a10" stroke-width="3" fill="none"/>` +
    `<path d="M730,960 Q690,980 720,1000" stroke="#e08a3a" stroke-width="18" fill="none" stroke-linecap="round"/>` +
    `<path d="M780,920 Q800,910 820,920 M840,915 Q860,905 880,918" stroke="#b86a2a" stroke-width="5" fill="none"/>` +
    txt(990, 880, "z", 30, "#cfe8ff", { fonte: MAO, op: 0.7 }) +
    txt(1020, 840, "z", 40, "#cfe8ff", { fonte: MAO, op: 0.5 }) +
    // xícara de chá com fumaça
    rr(220, 920, 70, 80, 10, "#f2efe6") +
    `<path d="M290,940 Q320,960 290,980" stroke="#f2efe6" stroke-width="10" fill="none"/>` +
    linha(250, 920, 250, 880, "#ddd", 2) +
    ret(240, 880, 20, 22, "#f6d65a") +
    g(`<path d="M255,910 C240,870 280,850 260,810" stroke="#fff" stroke-width="8" fill="none" opacity="0.3"/>`, c.blur(4)) +
    // post-its e celular
    bilhete(560, 520, 110, 80, ["dormir?", "depois"], 15, -5) +
    rr(110, 960, 60, 36, 6, "#111") +
    ret(116, 964, 48, 28, "#2a4a7a") +
    piso(c, 1340, "#14121e", "#06050c");
  return c.fim(corpo, true);
}

// --- Maquininha -------------------------------------------------------------

function pastel(x: number, y: number, s: number, rot = 0): string {
  return g(
    cam(`M${x - 50 * s},${y} Q${x},${y - 46 * s} ${x + 50 * s},${y} Z`, "#e8a840") +
      cam(`M${x - 50 * s},${y} Q${x},${y - 46 * s} ${x + 50 * s},${y}`, "none", `stroke="#c9802a" stroke-width="${4 * s}" stroke-dasharray="${5 * s} ${4 * s}"`) +
      elip(x - 10 * s, y - 14 * s, 14 * s, 5 * s, "#f6d080", `opacity="0.7"`),
    rot ? `transform="rotate(${rot} ${x} ${y})"` : "",
  );
}

function maquininha(x: number, y: number, s: number, cor = "#2a2a34"): string {
  return g(
    rr(x - 40 * s, y - 120 * s, 80 * s, 120 * s, 12 * s, cor) +
      ret(x - 30 * s, y - 108 * s, 60 * s, 40 * s, "#9ad0b0") +
      txt(x, y - 82 * s, "R$ 12,00", 11 * s, "#1a3a2a", { fonte: MONO, peso: "bold" }) +
      (() => {
        let k = "";
        for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) k += rr(x - 28 * s + q * 20 * s, y - 60 * s + r * 16 * s, 16 * s, 11 * s, 2 * s, "#555");
        return k;
      })() +
      ret(x - 30 * s, y - 128 * s, 60 * s, 12 * s, "#fff", `opacity="0.9"`),
  );
}

function qrPlaca(x: number, y: number, s: number): string {
  let q = "";
  semear(777);
  for (let r = 0; r < 9; r++) for (let k = 0; k < 9; k++) if (rnd() < 0.5) q += ret(x - 36 * s + k * 8 * s, y - 120 * s + r * 8 * s, 8 * s, 8 * s, "#111");
  const canto = (cx: number, cy: number) => ret(cx, cy, 22 * s, 22 * s, "#111") + ret(cx + 5 * s, cy + 5 * s, 12 * s, 12 * s, "#fff") + ret(cx + 8 * s, cy + 8 * s, 6 * s, 6 * s, "#111");
  return g(
    cam(`M${x - 30 * s},${y} L${x + 30 * s},${y} L${x + 20 * s},${y - 20 * s} L${x - 20 * s},${y - 20 * s} Z`, "#888") +
      rr(x - 48 * s, y - 150 * s, 96 * s, 132 * s, 6 * s, "#fff", `stroke="#2a9d8f" stroke-width="${4 * s}"`) +
      q +
      canto(x - 40 * s, y - 124 * s) +
      canto(x + 18 * s, y - 124 * s) +
      canto(x - 40 * s, y - 66 * s) +
      txt(x, y - 132 * s, "PAGUE COM PIX", 10 * s, "#2a9d8f", { peso: "bold" }),
  );
}

function pastelaria(): string {
  const c = new Cena("pastelaria");
  semear(6161);
  let vitrine = "";
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) vitrine += pastel(260 + i * 70 + (r % 2) * 30, 930 + r * 50, 0.7, entre(-10, 10));
  const corpo =
    // interior com porta aberta para a calçada à direita
    ret(0, 0, 1080, 1360, c.lin([[0, "#fbe6b0"], [1, "#f2cf86"]])) +
    ret(0, 560, 1080, 340, azulejo(c, "#fffdf6", "#d6402a", 56)) +
    ret(0, 552, 1080, 14, "#d6402a") +
    // letreiro
    rr(80, 40, 920, 150, 16, "#d6402a") +
    rr(92, 52, 896, 126, 12, "none", `stroke="#ffd23f" stroke-width="5" stroke-dasharray="14 10"`) +
    txt(540, 125, "PASTEL QUENTINHO", 70, "#fff", { peso: "bold" }) +
    txt(540, 168, "desde a feira de domingo", 24, "#ffe9a0", { fonte: MAO }) +
    (() => {
      let s = "";
      for (let i = 0; i < 9; i++) s += circ(130 + i * 103, 32, 9, "#fff3c0") + c.brilho(130 + i * 103, 32, 30, "#ffd27a", 0.7);
      return s;
    })() +
    // cardápio escrito à mão
    lousa(80, 240, 520, 290, "#232a26") +
    txt(340, 290, "CARDÁPIO", 36, "#ffd23f", { fonte: MAO, peso: "bold" }) +
    txt(110, 340, "Carne ........... R$ 9", 26, "#f2efe6", { fonte: MAO, ancora: "start" }) +
    txt(110, 380, "Queijo .......... R$ 9", 26, "#f2efe6", { fonte: MAO, ancora: "start" }) +
    txt(110, 420, "Frango c/ catupiry  R$ 11", 26, "#f2efe6", { fonte: MAO, ancora: "start" }) +
    txt(110, 460, "Especial da Vó ... R$ 14", 26, "#f2efe6", { fonte: MAO, ancora: "start" }) +
    txt(110, 505, "Caldo de cana 500ml R$ 7", 24, "#9ae0a0", { fonte: MAO, ancora: "start" }) +
    linha(460, 410, 560, 395, "#ff6a6a", 3) +
    txt(560, 440, "12!", 26, "#ff6a6a", { fonte: MAO, rot: -8 }) +
    // placas de humor
    placa(650, 240, 360, 130, "#fff200", [{ t: "PIX SÓ VALE", tam: 34, cor: "#c0001a" }, { t: "QUANDO CAI", tam: 34, cor: "#c0001a" }], { rot: 3 }) +
    placa(660, 400, 340, 120, "#fff", [{ t: "Comprovante de", tam: 22 }, { t: "print não é Pix", tam: 26, cor: "#1a3ea8" }, { t: "(a gerência)", tam: 16, cor: "#888" }], { rot: -2 }) +
    // chapa e fritadeira ao fundo
    ret(620, 600, 420, 240, "#b8bec4") +
    ret(640, 620, 180, 120, "#2a2a2a") +
    c.brilho(730, 640, 140, "#ff8a2a", 0.35) +
    ret(650, 640, 160, 70, c.lin([[0, "#c08a3a"], [1, "#7a4a1a"]])) +
    ret(840, 620, 180, 120, "#9aa0a6") +
    ret(850, 630, 160, 60, "#5a3a14") +
    linha(870, 600, 900, 660, "#555", 6) +
    linha(960, 600, 990, 660, "#555", 6) +
    g(`<path d="M720,600 C700,550 750,520 720,470 M930,600 C960,550 900,520 940,470" stroke="#fff" stroke-width="22" fill="none" opacity="0.3" stroke-linecap="round"/>`, c.blur(10)) +
    // coifa
    cam(`M600,600 L1060,600 L1000,540 L660,540 Z`, "#cfd4d8") +
    // balcão de vidro cheio de pastéis
    ret(180, 840, 700, 30, "#e8eef0") +
    ret(190, 870, 680, 170, c.lin([[0, "#e8f6fa", 0.55], [1, "#bfe0ea", 0.35]])) +
    vitrine +
    ret(190, 870, 680, 170, "none", `stroke="#c0c8cc" stroke-width="6"`) +
    cam(`M200,876 L340,876 L200,1030 Z`, "#fff", `opacity="0.25"`) +
    ret(180, 1040, 700, 320, c.lin([[0, "#d6402a"], [1, "#a82a1a"]])) +
    ret(180, 1040, 700, 10, "#000", `opacity="0.2"`) +
    // QR, maquininha, pote de molho e guardanapo
    qrPlaca(240, 840, 0.9) +
    maquininha(360, 840, 0.9) +
    rr(780, 770, 40, 70, 6, "#c0392b") +
    rr(830, 780, 40, 60, 6, "#f1c40f") +
    rr(700, 790, 60, 50, 4, "#f2f2ee") +
    // caldo de cana em garrafas
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += rr(60 + i * 30, 780 - (i % 2) * 6, 24, 70, 6, "#b8d860", `opacity="0.9"`) + ret(64 + i * 30, 770 - (i % 2) * 6, 16, 12, "#2a8a3a");
      return s + ret(40, 850, 140, 16, "#8a6a4a") + ret(40, 866, 140, 494, "#e8d4b0");
    })() +
    // porta para a calçada à direita com mesinhas
    ret(900, 860, 180, 500, c.lin([[0, "#9ad0f0"], [1, "#e8e0c8"]])) +
    ret(890, 850, 14, 510, "#7a5a3a") +
    g(cadeiraPlastico(990, 1300, 0.7, "#e8e6e0") + ret(950, 1180, 120, 12, "#e8e6e0") + ret(1000, 1192, 10, 108, "#dcdad4") + cadeiraPlastico(1060, 1310, 0.6, "#d9302c"), c.blur(1.2)) +
    lampadaPendente(c, 400, 190, 230, "#ffd88a", 0.4) +
    piso(c, 1360, "#c9a07a", "#8a6a4a") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#c9a07a", "#b58e6a", 80), `opacity="0.2"`);
  return c.fim(corpo);
}

function feiraPastel(): string {
  const c = new Cena("feira_pastel");
  semear(6262);
  const toldo = (x: number, y: number, w: number, a: string, b: string) => {
    let s = "";
    for (let i = 0; i < 8; i++) s += cam(`M${x + (w / 8) * i},${y} L${x + (w / 8) * (i + 1)},${y} L${x + (w / 8) * (i + 1) + 8},${y + 100} L${x + (w / 8) * i + 8},${y + 100} Z`, i % 2 ? a : b);
    let fran = "";
    for (let i = 0; i < 8; i++) fran += cam(`M${x + 8 + (w / 8) * i},${y + 100} Q${x + 8 + (w / 8) * (i + 0.5)},${y + 130} ${x + 8 + (w / 8) * (i + 1)},${y + 100} Z`, i % 2 ? a : b);
    return s + fran;
  };
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#5fb2ec"], [1, "#e6f3fb"]])) +
    nuvem(250, 150, 1, "#fff", 0.9, c.blur(2)) +
    nuvem(880, 230, 0.7, "#fff", 0.8, c.blur(3)) +
    // fundo: outras barracas e prédios baixos desfocados
    g(
      ret(0, 420, 1080, 300, "#e8c08a") +
        ret(80, 470, 120, 140, "#5a8ab0") +
        ret(600, 450, 160, 160, "#5a8ab0") +
        toldo(-20, 560, 360, "#2a9d8f", "#fff") +
        toldo(720, 560, 380, "#e14f4f", "#fff") +
        multidao(9, 20, 1060, 820, 0.8, ["#c0392b", "#2f6f95", "#f0a020", "#3a8a4a", "#6d4c8d"]),
      c.blur(4),
    ) +
    bandeirinhas(-20, 1100, 380, 25, 16, ["#e63946", "#f1c40f", "#2a9d8f", "#3a86ff"], 0.8) +
    // barraca de açaí (esquerda)
    ret(20, 640, 10, 520, "#666") +
    ret(320, 640, 10, 520, "#666") +
    toldo(10, 620, 330, "#6a2a8a", "#f2e8ff") +
    placa(50, 780, 260, 90, "#6a2a8a", [{ t: "AÇAÍ", tam: 40, cor: "#fff" }, { t: "300ml R$ 12", tam: 20, cor: "#f6d65a" }], { fonte: SANS }) +
    ret(20, 960, 310, 200, "#3a1a4a") +
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += rr(40 + i * 70, 900, 56, 60, 8, "#5a1a6a") + elip(68 + i * 70, 900, 28, 8, "#9a5aaa");
      return s;
    })() +
    // barraca de pastel (centro, maior)
    ret(350, 600, 12, 560, "#666") +
    ret(740, 600, 12, 560, "#666") +
    toldo(340, 570, 420, "#d6402a", "#ffd23f") +
    placa(400, 730, 300, 110, "#fff", [{ t: "PASTEL QUENTINHO", tam: 28, cor: "#d6402a" }, { t: "carne, queijo, palmito", tam: 20 }], { fonte: SANS, borda: "#d6402a" }) +
    placa(420, 860, 160, 60, "#fff200", [{ t: "R$ 9", tam: 34, cor: "#c0001a" }], { rot: -4 }) +
    // tacho de óleo e pastéis
    elip(660, 960, 70, 20, "#555") +
    ret(590, 960, 140, 50, "#444") +
    elip(660, 962, 60, 14, "#c8902a") +
    g(`<path d="M640,950 C620,900 680,880 650,830" stroke="#fff" stroke-width="16" fill="none" opacity="0.35"/>`, c.blur(6)) +
    ret(360, 1010, 380, 150, "#8a6a4a") +
    pastel(420, 1000, 0.8, -6) +
    pastel(500, 1004, 0.8, 4) +
    pastel(580, 1000, 0.8, -2) +
    maquininha(700, 1010, 0.6) +
    // caldo de cana com moenda (direita)
    ret(770, 640, 10, 520, "#666") +
    ret(1060, 640, 10, 520, "#666") +
    toldo(760, 620, 320, "#2a8a3a", "#e8f8d0") +
    placa(790, 780, 260, 90, "#2a8a3a", [{ t: "CALDO DE CANA", tam: 28, cor: "#fff" }, { t: "com limão R$ 8", tam: 20, cor: "#f6d65a" }], { fonte: SANS }) +
    rr(820, 900, 200, 180, 14, "#c0392b") +
    circ(880, 960, 40, "#888", `stroke="#555" stroke-width="6"`) +
    circ(960, 960, 40, "#888", `stroke="#555" stroke-width="6"`) +
    linha(1000, 920, 1060, 880, "#555", 8) +
    (() => {
      let s = "";
      for (let i = 0; i < 6; i++) s += ret(790 + i * 12, 760, 8, 280, "#c9b060", `transform="rotate(${-8 + i * 2} ${794 + i * 12} 1040)"`);
      return s;
    })() +
    rr(830, 1060, 40, 60, 6, "#b8d860", `opacity="0.9"`) +
    // caixotes de frutas
    ret(40, 1170, 200, 120, "#c4955a", `stroke="#8a6a4a" stroke-width="6"`) +
    (() => {
      let s = "";
      for (let i = 0; i < 9; i++) s += circ(60 + (i % 5) * 38, 1170 - Math.floor(i / 5) * 26, 20, i % 2 ? "#f59a2a" : "#f0b03a");
      return s;
    })() +
    ret(850, 1180, 190, 110, "#c4955a", `stroke="#8a6a4a" stroke-width="6"`) +
    (() => {
      let s = "";
      for (let i = 0; i < 8; i++) s += elip(870 + (i % 4) * 44, 1178 - Math.floor(i / 4) * 24, 26, 16, "#e63946");
      return s;
    })() +
    piso(c, 1290, "#8a8680", "#5a5650") +
    linha(0, 1300, 1080, 1300, "#f2c12e", 6, `opacity="0.5"`);
  return c.fim(corpo);
}

function portaoNoite(): string {
  const c = new Cena("portao_noite");
  semear(6363);
  const chapisco = c.padrao(40, 40, ret(0, 0, 40, 40, "#8a8070") + circ(8, 10, 3, "#6e6658") + circ(28, 6, 2, "#a09684") + circ(20, 26, 3, "#6e6658") + circ(34, 32, 2, "#a09684") + circ(6, 34, 2, "#776f60"));
  let grade = "";
  for (let x = 360; x < 760; x += 34) grade += ret(x, 560, 10, 640, "#2a2a30") + cam(`M${x - 6},${560} L${x + 5},${530} L${x + 16},${560} Z`, "#2a2a30");
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#070a20"], [0.7, "#1a1a40"], [1, "#2a2440"]])) +
    estrelas(80, 0, 1080, 0, 500) +
    circ(180, 200, 46, "#f6f0d8") +
    c.brilho(180, 200, 180, "#f6f0d8", 0.3) +
    // casa atrás do muro
    ret(260, 300, 560, 300, "#4a5a7a") +
    cam(`M230,310 L540,180 L850,310 Z`, "#3a2a2a") +
    ret(320, 380, 120, 110, "#ffd27a") +
    c.brilho(380, 435, 160, "#ffc766", 0.4) +
    ret(320, 380, 120, 110, "none", `stroke="#2a2a30" stroke-width="6"`) +
    linha(380, 380, 380, 490, "#2a2a30", 5) +
    ret(640, 380, 120, 110, "#1a2040") +
    // muro chapiscado
    ret(0, 560, 360, 640, chapisco) +
    ret(760, 560, 320, 640, chapisco) +
    ret(0, 540, 360, 24, "#6a6258") +
    ret(760, 540, 320, 24, "#6a6258") +
    // caco de vidro em cima do muro (clássico)
    (() => {
      let s = "";
      for (let x = 10; x < 350; x += 22) s += cam(`M${x},540 L${x + 8},${520 - (x % 3) * 4} L${x + 14},540 Z`, "#7ab0a0", `opacity="0.7"`);
      for (let x = 770; x < 1070; x += 22) s += cam(`M${x},540 L${x + 8},${520 - (x % 3) * 4} L${x + 14},540 Z`, "#7ab0a0", `opacity="0.7"`);
      return s;
    })() +
    // portão de grade
    ret(360, 560, 400, 640, "#1a1d30", `opacity="0.6"`) +
    grade +
    ret(360, 560, 400, 14, "#2a2a30") +
    ret(360, 860, 400, 12, "#2a2a30") +
    // número e interfone
    rr(200, 640, 90, 50, 6, "#e8e0c8") +
    txt(245, 677, "127", 32, "#2a2a30", { peso: "bold" }) +
    rr(240, 760, 70, 110, 8, "#d8d4c8") +
    circ(275, 790, 14, "#333") +
    rr(258, 820, 34, 16, 3, "#555") +
    circ(275, 850, 6, "#ff3b3b") +
    c.brilho(275, 850, 30, "#ff3b3b", 0.6) +
    placa(40, 720, 150, 100, "#fff", [{ t: "CUIDADO", tam: 22, cor: "#c0392b" }, { t: "cão bravo", tam: 18 }, { t: "(é um poodle)", tam: 14, cor: "#888" }], { rot: -4 }) +
    // poste com luz amarela
    poste(c, 900, 1220, 820, true, "#ffb030") +
    fios([[908, 410], [1080, 380]], "#111", 3) +
    fios([[0, 380], [908, 410]], "#111", 3) +
    // moto parada
    g(
      circ(780, 1190, 52, "#111") +
        circ(780, 1190, 20, "#777") +
        circ(1000, 1190, 52, "#111") +
        circ(1000, 1190, 20, "#777") +
        cam(`M800,1170 L860,1100 L960,1100 L1000,1170 Z`, "#c0392b") +
        rr(840, 1080, 110, 30, 12, "#1a1a1a") +
        linha(960, 1100, 990, 1040, "#888", 8) +
        linha(980, 1040, 1020, 1030, "#888", 6) +
        circ(1010, 1060, 12, "#fff6c0") +
        rr(760, 1040, 80, 70, 10, "#e63946"),
      "",
    ) +
    // buquê de flores no chão
    cam(`M480,1240 L560,1240 L600,1170 L440,1170 Z`, "#f2e8d8", `transform="rotate(-20 520 1210)"`) +
    (() => {
      let s = "";
      const cores = ["#e63946", "#ff9ac2", "#fff", "#f6d65a", "#c9a0ff"];
      for (let i = 0; i < 9; i++) s += circ(450 + entre(0, 100), 1150 + entre(-30, 20), entre(14, 22), cores[i % 5]);
      return g(s, `transform="rotate(-20 520 1210)"`);
    })() +
    bilhete(560, 1200, 90, 50, ["desculpa"], 14, 10, "#fff", "#c0392b") +
    piso(c, 1220, "#3a3632", "#18160f") +
    elip(900, 1260, 340, 70, "#ffb030", `opacity="0.18"`);
  return c.fim(corpo, true);
}

function associacaoComerciantes(): string {
  const c = new Cena("associacao_comerciantes");
  semear(6464);
  let fileiras = "";
  for (let r = 0; r < 3; r++) {
    const s = 0.55 + r * 0.22;
    const y = 1080 + r * 110;
    const n = 7 - r;
    for (let i = 0; i < n; i++) {
      const x = 540 + (i - (n - 1) / 2) * 150 * s * 1.2;
      fileiras += cadeiraPlastico(x, y, s, (i + r) % 3 === 0 ? "#d9302c" : "#e8e6e0");
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f0ead8"], [1, "#ddd2b8"]])) +
    ret(0, 820, 1080, 540, "#9ab0a0") +
    ret(0, 812, 1080, 12, "#7a9080") +
    ventiladorTeto(c, 270, 40, 0.7) +
    ventiladorTeto(c, 810, 40, 0.7) +
    // faixa
    rr(80, 160, 920, 150, 8, "#1d4a7a") +
    txt(540, 230, "ASSOCIAÇÃO DOS COMERCIANTES", 44, "#fff", { peso: "bold" }) +
    txt(540, 285, "DA RUA 7", 44, "#ffd23f", { peso: "bold" }) +
    // bandeira do Brasil num mastro
    ret(120, 360, 10, 560, "#c9a46a") +
    circ(125, 356, 10, "#d6a63a") +
    cam(`M130,370 Q200,350 280,380 L280,540 Q200,510 130,530 Z`, "#2a9a4a") +
    cam(`M150,450 L205,400 L260,455 L205,500 Z`, "#f6d65a") +
    circ(205, 452, 28, "#1a3a9a") +
    `<path d="M178,446 Q205,436 232,452" stroke="#fff" stroke-width="4" fill="none"/>` +
    // quadros de avisos
    placa(360, 360, 360, 200, "#fff", [{ t: "PAUTA DE HOJE", tam: 28, cor: "#1d4a7a" }, { t: "1. Golpe da maquininha", tam: 20 }, { t: "2. Boleto falso do IPTU", tam: 20 }, { t: "3. Quem leva o bolo", tam: 20 }, { t: "na próxima", tam: 20 }], { fonte: SANS }) +
    placa(760, 360, 260, 160, "#fff7d6", [{ t: "Confira o", tam: 24 }, { t: "beneficiário", tam: 24, cor: "#c0392b" }, { t: "antes de pagar!", tam: 22 }], { rot: 3 }) +
    relogio(880, 610, 44, 19, 35) +
    quadro(400, 600, 280, 170, "#7a5235", ret(414, 614, 252, 142, "#c9d8b8") + multidao(6, 440, 650, 760, 0.45, ["#1d4a7a", "#c0392b", "#555"]) + txt(540, 640, "Fundadores 1998", 16, "#3a3a2a")) +
    // mesa com toalha, garrafa de café e bolo
    ret(260, 880, 560, 30, "#fff") +
    cam(`M260,906 L820,906 L830,1010 L250,1010 Z`, "#fff") +
    (() => {
      let s = "";
      for (let x = 270; x < 820; x += 40) s += linha(x, 910, x - 5, 1006, "#d6c8b0", 2);
      return s;
    })() +
    rr(330, 780, 60, 110, 14, "#2a6aa0") +
    rr(342, 760, 36, 24, 6, "#222") +
    ret(410, 850, 26, 30, "#fff") +
    ret(442, 850, 26, 30, "#fff") +
    ret(474, 850, 26, 30, "#fff") +
    elip(620, 870, 100, 20, "#ddd") +
    rr(540, 810, 160, 60, 12, "#8a4a2a") +
    rr(540, 806, 160, 16, 8, "#f2e8d8") +
    ret(608, 806, 24, 64, "#5a2a14") +
    rr(720, 830, 70, 50, 6, "#f2f2ee") +
    txt(755, 862, "R$", 18, "#2a8a3a", { peso: "bold" }) +
    // microfone de pedestal
    linha(860, 1000, 860, 800, "#888", 5) +
    elip(860, 792, 12, 18, "#333") +
    // caixa de som
    rr(920, 820, 110, 170, 8, "#1a1a1a") +
    circ(975, 880, 28, "#333") +
    circ(975, 950, 18, "#333") +
    fluorescente(c, 360, 110, 360, 0.4) +
    g(fileiras, c.blur(0.5)) +
    piso(c, 1350, "#b8ac90", "#887c62") +
    ret(0, 1350, 1080, 570, ladrilho(c, "#c0b498", "#a89c80", 80), `opacity="0.18"`);
  return c.fim(corpo);
}

function cozinhaPastelaria(): string {
  const c = new Cena("cozinha_pastelaria");
  semear(6565);
  let notas = "";
  for (let i = 0; i < 5; i++) notas += txt(entre(900, 1020), entre(240, 420), escolhe(["♪", "♫"]), entre(26, 40), "#2a2a2a", { op: 0.6, rot: entre(-15, 15) });
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f2e6cc"], [1, "#e2d0a8"]])) +
    ret(0, 520, 1080, 400, azulejo(c, "#fffdf6", "#2a9d8f", 50)) +
    ret(0, 512, 1080, 12, "#2a9d8f") +
    // janela basculante
    janela(c, 380, 160, 300, 160, { ceu: [[0, "#cfe8f4"], [1, "#f6f6ee"]], moldura: "#e0dcd0", div: 3 }) +
    lampadaPendente(c, 540, 0, 380, "#fff3c4", 0.35) +
    // calendário de fornecedor
    calendario(80, 160, 190, "TRIGO BOM", "Farinha especial", "2027  ligue e peça") +
    // avental e pano de prato pendurados
    circ(330, 330, 6, "#555") +
    cam(`M300,340 L360,340 L380,500 L280,500 Z`, chita(c)) +
    cam(`M310,340 Q330,300 350,340`, "none", `stroke="#d6402a" stroke-width="5"`) +
    // prateleira com potes
    ret(720, 360, 320, 16, "#8a6a4a") +
    (() => {
      let s = "";
      const rot = ["sal", "orég.", "cominho", "?"];
      for (let i = 0; i < 4; i++) s += rr(735 + i * 76, 280, 60, 80, 8, "#e8f4fa", `opacity="0.85" stroke="#bcd"`) + ret(735 + i * 76, 300 + (i % 2) * 10, 60, 60 - (i % 2) * 10, ["#f2f2ee", "#5a8a3a", "#c08a3a", "#a03a2a"][i], `opacity="0.7"`) + txt(765 + i * 76, 345, rot[i], 13, "#333", { fonte: MAO });
      return s;
    })() +
    // caixa de som tocando
    rr(870, 420, 140, 90, 12, "#1a1a1a") +
    circ(910, 465, 26, "#333") +
    circ(970, 465, 26, "#333") +
    c.brilho(940, 465, 90, "#ff5fd2", 0.25) +
    notas +
    // bilhete do fornecedor
    bilhete(560, 380, 140, 90, ["boleto do trigo", "CONFERIR CNPJ"], 14, 5, "#ffd0d0", "#7a1f1f") +
    // fogão com panelas de recheio
    rr(720, 760, 330, 600, 8, "#e8e8e4") +
    ret(720, 760, 330, 24, "#cfcfca") +
    rr(740, 640, 130, 120, 14, c.lin([[0, "#d8dde2"], [1, "#9aa2aa"]], 0, 0, 1, 0)) +
    elip(805, 640, 65, 14, "#8a4a2a") +
    rr(890, 660, 140, 100, 14, c.lin([[0, "#d8dde2"], [1, "#9aa2aa"]], 0, 0, 1, 0)) +
    elip(960, 660, 70, 14, "#f6e0a0") +
    linha(960, 650, 990, 580, "#8a6a4a", 8) +
    g(`<path d="M800,630 C780,580 830,560 800,500 M960,640 C990,600 940,560 970,510" stroke="#fff" stroke-width="16" fill="none" opacity="0.35" stroke-linecap="round"/>`, c.blur(6)) +
    txt(805, 720, "CARNE", 16, "#555", { peso: "bold" }) +
    txt(960, 730, "QUEIJO", 16, "#555", { peso: "bold" }) +
    // bancada com massa aberta, rolo e farinha
    ret(0, 900, 700, 40, "#c9b8a0") +
    ret(0, 940, 700, 420, "#b8a68a") +
    linha(350, 940, 350, 1360, "#a08e72", 3) +
    cam(`M80,890 Q120,840 300,850 Q480,840 520,880 Q500,905 300,902 Q120,906 80,890 Z`, "#f6ead0") +
    elip(300, 870, 160, 18, "#fff8e8", `opacity="0.6"`) +
    g(circ(150, 880, 30, "#fff", `opacity="0.5"`) + circ(460, 885, 24, "#fff", `opacity="0.4"`), c.blur(4)) +
    rr(380, 820, 220, 34, 17, "#d9b07a", `transform="rotate(-8 490 837)"`) +
    rr(360, 826, 34, 22, 8, "#b8905a", `transform="rotate(-8 490 837)"`) +
    rr(586, 798, 34, 22, 8, "#b8905a", `transform="rotate(-8 490 837)"`) +
    // pastéis prontos numa assadeira
    rr(540, 860, 150, 40, 6, "#9aa0a6") +
    pastel(580, 880, 0.6, 0) +
    pastel(650, 880, 0.6, 6) +
    // saco de farinha
    rr(20, 760, 130, 140, 30, "#f2efe6") +
    txt(85, 840, "TRIGO", 22, "#c0392b", { peso: "bold" }) +
    piso(c, 1350, "#a8a090", "#787060") +
    ret(0, 1350, 1080, 570, ladrilho(c, "#b0a898", "#9a9282", 70), `opacity="0.2"`);
  return c.fim(corpo);
}

// --- Black Friday do Desespero ----------------------------------------------

function gramado(c: Cena, x: number, y: number, w: number, h: number): string {
  let faixas = "";
  for (let i = 0; i < 6; i++) faixas += ret(x + (w / 6) * i, y, w / 6, h, i % 2 ? "#2f9a3a" : "#38aa44");
  return (
    faixas +
    ret(x, y, w, h * 0.12, "#1a2a3a", `opacity="0.7"`) +
    ret(x + w * 0.5 - 1, y + h * 0.12, 2, h * 0.88, "#fff", `opacity="0.8"`) +
    circ(x + w * 0.5, y + h * 0.56, h * 0.18, "none", `stroke="#fff" stroke-width="2" opacity="0.8"`) +
    circ(x + w * 0.62, y + h * 0.7, Math.max(2, h * 0.04), "#fff") +
    c.brilho(x + w / 2, y + h / 2, w * 0.6, "#bfffc0", 0.15)
  );
}

function salaTvVelha(): string {
  const c = new Cena("sala_tv_velha");
  semear(7171);
  const manta = c.padrao(60, 60, ret(0, 0, 60, 60, "#c0392b") + ret(0, 0, 60, 10, "#f1c40f") + ret(0, 30, 60, 6, "#2a6aa0") + ret(0, 46, 60, 4, "#fff"));
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#cfe0c8"], [1, "#b4ccaa"]])) +
    ret(0, 800, 1080, 560, "#9ab890") +
    ret(0, 792, 1080, 12, "#7a9a70") +
    cam(`M860,0 C840,90 900,140 870,240`, "none", `stroke="#8a9a80" stroke-width="3" opacity="0.6"`) +
    lampadaPendente(c, 540, 0, 90, "#fff3c4", 0.3) +
    // flâmula de time inventado
    linha(110, 170, 340, 170, "#7a5235", 6) +
    cam(`M120,175 L330,175 L225,420 Z`, "#1a3a8a") +
    cam(`M140,190 L310,190 L300,214 L150,214 Z`, "#fff") +
    circ(225, 270, 40, "#fff") +
    cam(`M225,240 L240,268 L270,270 L246,288 L254,316 L225,300 L196,316 L204,288 L180,270 L210,268 Z`, "#f1c40f") +
    txt(225, 208, "TUPINAMBÁ F.C.", 18, "#1a3a8a", { peso: "bold" }) +
    txt(225, 350, "CAMPEÃO 1994", 14, "#fff", { peso: "bold" }) +
    // quadro com foto do pai com a taça (silhueta)
    quadro(820, 200, 200, 240, "#c9a46a", ret(834, 214, 172, 212, "#9ac0d8") + pessoa(920, 426, 0.7, "#1a3a8a", "#8a5a3c") + cam(`M950,300 L990,300 L980,340 L960,340 Z`, "#f6d65a")) +
    // calendário de mercadinho
    calendario(420, 200, 150, "AÇOUGUE", "Boi Gordo", "2027") +
    // relógio na parede
    relogio(660, 320, 46, 3, 55) +
    // rack
    ret(220, 1000, 640, 40, "#6a4428") +
    ret(240, 1040, 600, 300, "#5a3a20") +
    ret(260, 1060, 270, 120, "#4a2e1a") +
    ret(550, 1060, 270, 120, "#4a2e1a") +
    // DVD velho e enfeites
    rr(280, 1100, 220, 50, 6, "#2a2a2a") +
    ret(300, 1118, 80, 10, "#4cff6a", `opacity="0.7"`) +
    elip(680, 1150, 60, 20, "#9aa0a6") +
    // TV de tubo enorme
    rr(250, 600, 580, 420, 30, c.lin([[0, "#5a5a5e"], [1, "#2e2e32"]])) +
    cam(`M300,600 L780,600 L740,520 L340,520 Z`, "#3e3e42") +
    rr(280, 630, 440, 350, 40, "#111") +
    rr(296, 646, 408, 318, 50, c.rad([[0, "#3a7a4a"], [0.8, "#1a4a2a"], [1, "#0a1a10"]])) +
    // chuvisco + jogo
    gramado(c, 330, 690, 340, 230) +
    (() => {
      let s = "";
      for (let i = 0; i < 90; i++) s += ret(entre(310, 690), entre(660, 950), entre(4, 10), 2, "#fff", `opacity="${entre(0.15, 0.5).toFixed(2)}"`);
      return s;
    })() +
    rr(296, 646, 408, 318, 50, "#fff", `opacity="0.06"`) +
    cam(`M320,670 L480,660 L330,820 Z`, "#fff", `opacity="0.1"`) +
    // painel lateral da TV
    ret(740, 660, 70, 300, "#3a3a3e") +
    circ(775, 700, 14, "#222") +
    circ(775, 750, 14, "#222") +
    circ(775, 900, 6, "#ff3b3b") +
    (() => {
      let s = "";
      for (let y = 790; y < 870; y += 12) s += ret(752, y, 46, 5, "#222");
      return s;
    })() +
    // antena com palha de aço e fita
    linha(480, 520, 400, 380, "#888", 5) +
    linha(600, 520, 690, 360, "#888", 5) +
    circ(400, 374, 22, "#cfd2d4", `stroke="#999" stroke-dasharray="3 3"`) +
    circ(690, 354, 22, "#cfd2d4", `stroke="#999" stroke-dasharray="3 3"`) +
    ret(520, 506, 40, 18, "#d8cfa0", `opacity="0.9"`) +
    // toalhinha de crochê e bibelô sobre a TV
    croche(540, 515, 260) +
    elip(620, 505, 30, 14, "#f6d65a") +
    // sofá com manta
    rr(0, 1140, 220, 220, 30, "#7a5a3a") +
    rr(0, 1100, 200, 120, 30, manta) +
    rr(860, 1140, 220, 220, 30, "#7a5a3a") +
    rr(880, 1090, 200, 130, 30, manta, `transform="rotate(4 980 1150)"`) +
    // controle com fita durex
    g(rr(900, 1060, 44, 110, 8, "#1a1a1a") + ret(894, 1100, 56, 20, "#f2ecc0", `opacity="0.75"`) + circ(922, 1078, 6, "#e63946"), `transform="rotate(20 922 1115)"`) +
    // ventilador
    ventiladorMesa(110, 1080, 0.55) +
    piso(c, 1360, "#a8a090", "#78705e") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#b8a888", "#a09070", 80), `opacity="0.18"`) +
    // chinelo largado
    elip(420, 1560, 44, 18, "#2a6aa0", `transform="rotate(-20 420 1560)"`) +
    elip(500, 1580, 44, 18, "#2a6aa0", `transform="rotate(14 500 1580)"`) +
    `<path d="M405,1550 L430,1568 L420,1548" stroke="#fff" stroke-width="5" fill="none"/>`;
  return c.fim(corpo);
}

function lojaEletronicos(): string {
  const c = new Cena("loja_eletronicos");
  semear(7272);
  let paredeTv = "";
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 4; k++) {
      const w = 220;
      const h = 130;
      const x = 60 + k * 245;
      const y = 300 + r * 160;
      paredeTv += rr(x - 8, y - 8, w + 16, h + 16, 6, "#0a0a0c") + gramado(c, x, y, w, h);
    }
  }
  const etiqueta = (x: number, y: number, de: string, por: string) =>
    g(
      cam(`M${x},${y} L${x + 150},${y} L${x + 150},${y + 90} L${x},${y + 90} L${x - 20},${y + 45} Z`, "#fff200") +
        circ(x - 4, y + 45, 6, "#222") +
        txt(x + 75, y + 30, `de ${de}`, 16, "#555", { extra: `text-decoration="line-through"` }) +
        txt(x + 75, y + 68, `por ${por}`, 26, "#c0001a", { peso: "bold" }),
      `transform="rotate(-6 ${x + 65} ${y + 45})"`,
    );
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e8ecf0"], [1, "#cfd6dc"]])) +
    ret(0, 0, 1080, 90, "#f6f8fa") +
    fluorescente(c, 80, 60, 260, 0.5) +
    fluorescente(c, 410, 60, 260, 0.5) +
    fluorescente(c, 740, 60, 260, 0.5) +
    // letreiro da loja
    ret(0, 110, 1080, 140, "#1a3a8a") +
    txt(540, 205, "MEGALAR", 86, "#ffd23f", { peso: "bold" }) +
    // parede de TVs
    ret(30, 270, 1020, 510, "#1a1c22") +
    c.brilho(540, 520, 600, "#7aff8a", 0.15, 300) +
    paredeTv +
    // faixa black friday
    cam(`M-20,760 L1100,700 L1100,820 L-20,880 Z`, "#111") +
    cam(`M-20,770 L1100,710 L1100,718 L-20,778 Z`, "#ffd23f") +
    cam(`M-20,862 L1100,802 L1100,810 L-20,870 Z`, "#ffd23f") +
    txt(540, 812, "BLACK FRIDAY", 76, "#ffd23f", { peso: "bold", rot: -3 }) +
    // balcão expositor com TVs grandes
    ret(0, 980, 1080, 380, "#2a2c34") +
    ret(0, 970, 1080, 16, "#4a4c56") +
    (() => {
      let s = "";
      for (let i = 0; i < 3; i++) {
        const x = 70 + i * 340;
        s += ret(x + 130, 930, 20, 50, "#222") + ret(x + 80, 966, 120, 10, "#222") + rr(x, 830, 280, 110, 6, "#0a0a0c") + gramado(c, x + 8, 838, 264, 94);
      }
      return s;
    })() +
    etiqueta(110, 1010, "R$ 3.999", "R$ 2.499") +
    etiqueta(450, 1020, "R$ 5.499", "R$ 3.799") +
    etiqueta(790, 1010, "R$ 2.299", "R$ 1.799") +
    placa(400, 1150, 280, 80, "#fff", [{ t: "12x sem juros*", tam: 26, cor: "#1a3a8a" }, { t: "*com juros", tam: 14, cor: "#888" }], { fonte: SANS }) +
    // vendedor silhueta ao fundo (na lateral)
    g(pessoa(990, 980, 1.05, "#c0001a", "#8a5a3c") + ret(960, 860, 60, 20, "#fff"), c.blur(1.5)) +
    g(multidao(3, 40, 300, 980, 0.9, ["#3a3a5a", "#5a3a2a", "#2a4a3a"]), c.blur(3)) +
    piso(c, 1360, "#e0e4e8", "#a8b0b8") +
    g(ret(0, 1360, 1080, 300, c.lin([[0, "#fff", 0.45], [1, "#fff", 0]])), c.blur(6));
  return c.fim(corpo);
}

function pontoOnibus(): string {
  const c = new Cena("ponto_onibus");
  semear(7373);
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#3a4a8a"], [0.45, "#d88aa0"], [0.75, "#ffc48a"], [1, "#ffe8c0"]])) +
    estrelas(20, 0, 1080, 0, 260) +
    circ(380, 820, 70, "#fff2c8") +
    c.brilho(380, 820, 380, "#ffd09a", 0.55) +
    nuvem(250, 420, 1, "#ffd0d8", 0.6, c.blur(4)) +
    nuvem(780, 560, 0.8, "#ffe0c8", 0.6, c.blur(4)) +
    // casario e morro ao fundo
    g(morro(0, 1080, 850, 1000, 50, 5, "#6a5a8a") + predios(c, 0, 1080, 1000, 80, 220, "#5a4a6a", "#ffd27a", 0.12), c.blur(3)) +
    // abrigo do ponto
    ret(160, 560, 760, 30, "#3a4a5a") +
    cam(`M140,560 L940,560 L920,520 L160,520 Z`, "#4a5a6a") +
    ret(180, 590, 14, 640, "#4a5a6a") +
    ret(886, 590, 14, 640, "#4a5a6a") +
    // painel de vidro e cartaz rasgado
    ret(200, 620, 330, 520, "#cfe8f4", `opacity="0.3"`) +
    ret(200, 620, 330, 520, "none", `stroke="#4a5a6a" stroke-width="6"`) +
    ret(560, 620, 310, 460, "#f6f0e0") +
    cam(`M560,620 L870,620 L870,760 L760,780 L700,740 L620,790 L560,760 Z`, "#e63946") +
    txt(715, 690, "ATÉ 70% OFF", 36, "#fff", { peso: "bold" }) +
    txt(715, 740, "SÓ HOJ", 30, "#ffd23f", { peso: "bold" }) +
    cam(`M560,760 L620,790 L700,740 L760,780 L870,760 L870,1080 L560,1080 Z`, "#fbf6ea") +
    txt(715, 850, "TV 50\" R$ 1.4", 28, "#333") +
    cam(`M800,800 L870,790 L870,960 L840,940 L820,980 Z`, "#9a948a", `opacity="0.5"`) +
    txt(715, 940, "Procura-se", 22, "#555", { fonte: MAO }) +
    txt(715, 970, "gato Pipoca", 22, "#555", { fonte: MAO }) +
    ret(590, 990, 240, 70, "#fff", `stroke="#ccc"`) +
    txt(710, 1035, "aulas de violão", 18, "#1a3ea8", { fonte: MAO }) +
    // placa de ponto e linhas
    ret(990, 420, 10, 820, "#555") +
    rr(940, 420, 110, 120, 8, "#1a6a3a") +
    txt(995, 470, "ÔNIBUS", 20, "#fff", { peso: "bold" }) +
    txt(995, 500, "102 • 340", 16, "#fff") +
    txt(995, 525, "Centro", 14, "#cfe") +
    // banco
    ret(220, 1080, 300, 24, "#7a5a3a") +
    ret(240, 1104, 14, 100, "#4a5a6a") +
    ret(486, 1104, 14, 100, "#4a5a6a") +
    // lixeira e copinho de café
    rr(60, 1080, 80, 120, 8, "#e67e22") +
    ret(56, 1074, 88, 14, "#c0651a") +
    rr(300, 1050, 22, 30, 3, "#fff") +
    // poste com luz ainda acesa
    poste(c, 40, 1240, 900, true, "#ffd27a") +
    fios([[48, 340], [1080, 300]], "#2a2a3a", 2) +
    piso(c, 1230, "#8a8288", "#4a4248") +
    ret(0, 1230, 1080, 16, "#b0a8a0") +
    linha(0, 1600, 1080, 1600, "#f2c12e", 8, `opacity="0.35" stroke-dasharray="80 60"`);
  return c.fim(corpo);
}

function shoppingCorredor(): string {
  const c = new Cena("shopping_corredor");
  semear(7474);
  const vitrine = (x: number, w: number, cor: string, nome: string, oferta: string, lado: number) =>
    ret(x, 520, w, 520, "#f6f2ea") +
    ret(x, 520, w, 90, cor) +
    txt(x + w / 2, 580, nome, 30, "#fff", { peso: "bold" }) +
    ret(x + 16, 626, w - 32, 400, c.lin([[0, "#fff", 0.6], [1, cor, 0.25]])) +
    // manequins
    elip(x + w * 0.35, 720, 18, 22, "#e8e4dc") +
    rr(x + w * 0.35 - 30, 744, 60, 140, 20, lado ? "#e63946" : "#2a6aa0") +
    elip(x + w * 0.68, 730, 18, 22, "#e8e4dc") +
    rr(x + w * 0.68 - 30, 754, 60, 130, 20, "#f1c40f") +
    placa(x + 30, 900, w - 60, 100, "#c0001a", [{ t: oferta, tam: 34, cor: "#fff" }], { fonte: SANS, rot: lado ? 3 : -3 }) +
    cam(`M${x + 20},630 L${x + 90},630 L${x + 20},780 Z`, "#fff", `opacity="0.35"`);
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#f4f0ea"], [1, "#e4dcd0"]])) +
    // claraboia
    ret(0, 0, 1080, 180, c.lin([[0, "#9ad0f0"], [1, "#d8eef8"]])) +
    (() => {
      let s = "";
      for (let x = 0; x <= 1080; x += 120) s += ret(x - 4, 0, 8, 180, "#9aa4ad");
      return s + ret(0, 176, 1080, 12, "#9aa4ad");
    })() +
    c.brilho(540, 300, 600, "#ffffff", 0.35, 200) +
    // piso superior com guarda-corpo e faixas penduradas
    ret(0, 300, 1080, 60, "#d8d0c4") +
    ret(0, 300, 1080, 12, "#bfb5a6") +
    ret(0, 250, 1080, 50, "#cfe8f4", `opacity="0.5"`) +
    g(multidao(9, 20, 1060, 300, 0.45, ["#c0392b", "#2f6f95", "#f0a020", "#3a8a4a", "#6d4c8d", "#222"]), c.blur(2.5)) +
    cam(`M260,360 L260,480 L300,460 L340,480 L340,360 Z`, "#111") +
    txt(300, 420, "BF", 26, "#ffd23f", { peso: "bold" }) +
    cam(`M740,360 L740,480 L780,460 L820,480 L820,360 Z`, "#111") +
    txt(780, 420, "OFF", 22, "#ffd23f", { peso: "bold" }) +
    // vitrines
    vitrine(20, 320, "#e14f7a", "MODA LUZ", "ATÉ 80% OFF", 0) +
    vitrine(740, 320, "#2a9d8f", "PÉ NA ESTRADA", "LEVE 3 PAGUE 2", 1) +
    // escada rolante no centro ao fundo
    cam(`M400,1040 L680,1040 L620,560 L460,560 Z`, "#9aa4ad") +
    cam(`M430,1040 L650,1040 L600,580 L480,580 Z`, "#5a646c") +
    (() => {
      let s = "";
      for (let i = 0; i < 14; i++) {
        const t = i / 14;
        const y = 1030 - t * 440;
        const hw = 110 - t * 50;
        s += ret(540 - hw, y, hw * 2, 4, "#8a949c");
      }
      return s;
    })() +
    linha(400, 1040, 460, 560, "#2a2a2a", 10) +
    linha(680, 1040, 620, 560, "#2a2a2a", 10) +
    g(pessoa(520, 820, 0.6, "#c0392b", "#c48b63") + pessoa(560, 700, 0.5, "#2f6f95", "#8a5a3c"), c.blur(1.5)) +
    // multidão desfocada no corredor com sacolas
    g(
      multidao(10, 0, 1080, 1180, 1.15, ["#3a3a5a", "#7a2a3a", "#2a5a4a", "#5a4a2a", "#222", "#6d4c8d"]) +
        (() => {
          let s = "";
          for (let i = 0; i < 9; i++) {
            const x = entre(40, 1040);
            s += rr(x, 1110, 60, 70, 4, escolhe(["#e14f7a", "#ffd23f", "#2a9d8f", "#fff", "#e67e22"])) + `<path d="M${x + 15},1110 Q${x + 30},1085 ${x + 45},1110" stroke="#333" stroke-width="3" fill="none"/>`;
          }
          return s;
        })(),
      c.blur(6),
    ) +
    piso(c, 1260, "#ece6dc", "#bfb5a6") +
    g(ret(300, 1260, 480, 400, "#fff", `opacity="0.3"`), c.blur(20)) +
    confete(40, 0, 1080, 200, 1200, ["#ffd23f", "#e14f7a", "#fff"]);
  return c.fim(corpo);
}

// --- Herança Digital --------------------------------------------------------

function celularVelho(x: number, y: number, s: number, rot: number, trincado: boolean): string {
  let trinca = "";
  if (trincado) {
    trinca =
      `<path d="M${x + 20 * s},${y + 40 * s} L${x + 55 * s},${y + 90 * s} L${x + 40 * s},${y + 140 * s} L${x + 80 * s},${y + 210 * s} M${x + 55 * s},${y + 90 * s} L${x + 100 * s},${y + 80 * s} M${x + 40 * s},${y + 140 * s} L${x + 10 * s},${y + 170 * s} M${x + 55 * s},${y + 90 * s} L${x + 30 * s},${y + 60 * s}" stroke="#fff" stroke-width="${2 * s}" fill="none" opacity="0.75"/>`;
  }
  return g(
    rr(x + 6 * s, y + 8 * s, 130 * s, 250 * s, 18 * s, "#000", `opacity="0.3"`) +
      rr(x, y, 130 * s, 250 * s, 18 * s, "#1e1f24") +
      rr(x + 8 * s, y + 24 * s, 114 * s, 196 * s, 6 * s, "#141a24") +
      trinca +
      rr(x + 50 * s, y + 10 * s, 30 * s, 5 * s, 2 * s, "#3a3a40") +
      circ(x + 65 * s, y + 234 * s, 9 * s, "none", `stroke="#3a3a40" stroke-width="${2 * s}"`),
    `transform="rotate(${rot} ${x + 65 * s} ${y + 125 * s})"`,
  );
}

function oculos(x: number, y: number, s: number, rot: number): string {
  return g(
    circ(x, y, 34 * s, "#cfe0ea", `opacity="0.25" stroke="#3a2a1a" stroke-width="${5 * s}"`) +
      circ(x + 84 * s, y, 34 * s, "#cfe0ea", `opacity="0.25" stroke="#3a2a1a" stroke-width="${5 * s}"`) +
      `<path d="M${x + 34 * s},${y - 4 * s} Q${x + 42 * s},${y - 14 * s} ${x + 50 * s},${y - 4 * s}" stroke="#3a2a1a" stroke-width="${4 * s}" fill="none"/>` +
      linha(x - 34 * s, y - 6 * s, x - 90 * s, y - 30 * s, "#3a2a1a", 4 * s) +
      linha(x + 118 * s, y - 6 * s, x + 170 * s, y - 34 * s, "#3a2a1a", 4 * s) +
      elip(x - 10 * s, y - 12 * s, 10 * s, 5 * s, "#fff", `opacity="0.5"`),
    `transform="rotate(${rot} ${x + 42 * s} ${y})"`,
  );
}

function gavetaCelular(): string {
  const c = new Cena("gaveta_celular");
  semear(8181);
  const madeira = c.lin([[0, "#9a6a40"], [1, "#6a4428"]]);
  const fundoGaveta = c.lin([[0, "#5a3a22"], [1, "#7a5232"]]);
  const corpo =
    // parede e luz de fim de tarde
    ret(0, 0, 1080, 1920, c.lin([[0, "#f2d8b0"], [1, "#d8b088"]])) +
    // feixe da janela vindo da esquerda
    cam(`M0,80 L320,80 L1080,900 L1080,1200 L0,700 Z`, "#ffd9a0", `opacity="0.28" ${c.blur(20)}`) +
    c.brilho(260, 260, 520, "#ffcf8a", 0.45) +
    // moldura de janela à esquerda com cortina
    ret(0, 60, 180, 520, "#ffe8c0") +
    cortina(0, 40, 200, 600, "#f6eedd", false) +
    // porta-retrato e santinho sobre a cômoda (fundo)
    quadro(600, 200, 200, 250, "#c9a46a", ret(614, 214, 172, 222, c.lin([[0, "#b8c8d0"], [1, "#d8c8a8"]])) + pessoa(670, 436, 0.55, "#2a4a6a", "#8a5a3c") + pessoa(740, 436, 0.5, "#f2f2ee", "#c48b63")) +
    rr(840, 300, 100, 150, 50, "#f6f0e0") +
    elip(890, 350, 16, 18, "#e0b48c") +
    cam(`M866,450 Q890,370 914,450 Z`, "#3a6ab0") +
    circ(890, 348, 28, "none", `stroke="#f6d65a" stroke-width="4"`) +
    // vela apagada e flor num copo
    ret(380, 330, 22, 120, "#fbf8f0") +
    linha(391, 330, 391, 316, "#333", 3) +
    rr(460, 360, 60, 90, 6, "#e8f4fa", `opacity="0.6"`) +
    linha(490, 360, 480, 260, "#3a7a3a", 4) +
    circ(480, 250, 20, "#f6d65a") +
    circ(480, 250, 8, "#c9802a") +
    // tampo da cômoda
    ret(0, 450, 1080, 50, "#8a5a36") +
    ret(0, 450, 1080, 10, "#b07a4a") +
    croche(540, 450, 760, "#fbf6ea") +
    ret(0, 500, 1080, 120, madeira) +
    // gaveta aberta em perspectiva
    cam(`M60,620 L1020,620 L1080,700 L0,700 Z`, "#4a2e1a") +
    cam(`M70,640 L1010,640 L960,1300 L120,1300 Z`, fundoGaveta) +
    cam(`M70,640 L120,1300 L60,1320 L0,700 Z`, "#8a5a36") +
    cam(`M1010,640 L960,1300 L1020,1320 L1080,700 Z`, "#7a4e2e") +
    ret(40, 1300, 1000, 120, madeira) +
    ret(40, 1300, 1000, 10, "#b07a4a") +
    rr(470, 1340, 140, 30, 12, "#c9a46a") +
    // forro de papel de jornal antigo no fundo da gaveta
    cam(`M140,680 L940,680 L900,1260 L180,1260 Z`, "#e8dcc0", `opacity="0.35"`) +
    (() => {
      let s = "";
      for (let i = 0; i < 18; i++) s += ret(200 + (i % 2) * 340, 720 + Math.floor(i / 2) * 56, 280, 8, "#8a7a5a", `opacity="0.25"`);
      return s;
    })() +
    // objetos
    // carregador velho enrolado
    g(
      circ(270, 820, 70, "none", `stroke="#f2f2ee" stroke-width="9"`) +
        circ(270, 820, 54, "none", `stroke="#e8e8e2" stroke-width="9"`) +
        rr(330, 760, 70, 50, 8, "#f2f2ee", `transform="rotate(20 365 785)"`) +
        ret(380, 750, 8, 20, "#c9c9c0", `transform="rotate(20 365 785)"`) +
        ret(372, 772, 8, 20, "#c9c9c0", `transform="rotate(20 365 785)"`) +
        ret(240, 790, 60, 16, "#d8cfa0", `opacity="0.8" transform="rotate(-30 270 798)"`),
      "",
    ) +
    // celular trincado no centro, iluminado pela luz
    c.brilho(560, 980, 260, "#ffe0a8", 0.35) +
    celularVelho(490, 850, 1.05, -12, true) +
    // óculos de leitura
    oculos(700, 1150, 1, 8) +
    // chaveiro de time
    circ(820, 800, 28, "none", `stroke="#b8b8b0" stroke-width="5"`) +
    rr(780, 820, 70, 80, 10, "#1a3a8a", `transform="rotate(15 815 860)"`) +
    circ(815, 860, 18, "#fff", `transform="rotate(15 815 860)"`) +
    cam(`M815,846 L820,856 L831,857 L823,864 L826,875 L815,869 L804,875 L807,864 L799,857 L810,856 Z`, "#f1c40f") +
    ret(840, 780, 46, 12, "#d6a63a", `transform="rotate(-30 863 786)"`) +
    // chave de fenda
    g(rr(200, 1060, 120, 34, 14, "#e63946") + ret(310, 1072, 170, 10, "#c0c6cc") + ret(476, 1068, 16, 18, "#9aa0a6") + ret(220, 1066, 80, 6, "#fff", `opacity="0.3"`), `transform="rotate(-18 340 1077)"`) +
    // foto 3x4
    g(ret(640, 720, 86, 112, "#fbfaf5") + ret(648, 728, 70, 88, "#b8c8d0") + elip(683, 768, 18, 22, "#8a5a3c") + elip(683, 808, 30, 18, "#3a4a5a") + cam(`M664,760 Q683,736 702,760`, "none", `stroke="#3a2a1a" stroke-width="6"`), `transform="rotate(10 683 776)"`) +
    // fita isolante e moedas
    circ(880, 1100, 34, "#111") +
    circ(880, 1100, 16, fundoGaveta) +
    circ(330, 1180, 14, "#c9a46a") +
    circ(362, 1194, 12, "#b8b8b0") +
    // poeira na luz
    (() => {
      let s = "";
      for (let i = 0; i < 30; i++) s += circ(entre(100, 900), entre(150, 900), entre(1, 3), "#fff8e0", `opacity="${entre(0.3, 0.8).toFixed(2)}"`);
      return s;
    })() +
    piso(c, 1420, "#8a6a50", "#5a4434");
  return c.fim(corpo);
}

function coroa(x: number, y: number, s: number, faixa: string): string {
  let flores = "";
  for (let i = 0; i < 26; i++) {
    const a = (Math.PI * 2 * i) / 26;
    flores += circ(x + Math.cos(a) * 110 * s, y + Math.sin(a) * 110 * s, entre(20, 28) * s, escolhe(["#ffffff", "#f6e8f0", "#f6d65a", "#ffd0dc"]));
  }
  return g(
    linha(x - 70 * s, y + 120 * s, x - 90 * s, y + 360 * s, "#6a5a4a", 5 * s) +
      linha(x + 70 * s, y + 120 * s, x + 90 * s, y + 360 * s, "#6a5a4a", 5 * s) +
      circ(x, y, 128 * s, "#3a7a4a") +
      circ(x, y, 70 * s, "#e8e0d0") +
      flores +
      cam(`M${x - 40 * s},${y + 20 * s} L${x + 40 * s},${y + 20 * s} L${x + 60 * s},${y + 260 * s} L${x + 20 * s},${y + 230 * s} L${x - 20 * s},${y + 260 * s} L${x - 60 * s},${y + 230 * s} Z`, "#7a5aa0", `opacity="0.92"`) +
      txt(x, y + 100 * s, faixa, 15 * s, "#fff", { fonte: SANS, extra: `transform="rotate(90 ${x} ${y + 100 * s})"` }),
  );
}

function velorio(): string {
  const c = new Cena("velorio");
  semear(8282);
  let cadeiras = "";
  for (let i = 0; i < 6; i++) cadeiras += rr(60 + i * 165, 1120, 120, 130, 16, "#5a6a7a") + rr(60 + i * 165, 1230, 120, 30, 8, "#4a5a6a") + ret(110 + i * 165, 1260, 12, 80, "#888");
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f2efe8"], [1, "#e2ddd2"]])) +
    ret(0, 0, 1080, 100, "#fafaf6") +
    fluorescente(c, 140, 70, 300, 0.4) +
    fluorescente(c, 640, 70, 300, 0.4) +
    ret(0, 800, 1080, 560, "#cfc8b8") +
    ret(0, 792, 1080, 12, "#b8b0a0") +
    // janela grande com céu limpo
    janela(c, 380, 170, 320, 380, { ceu: [[0, "#9ad0f0"], [1, "#f2f0e0"]], paisagem: arvore(c, 560, 600, 0.9, "#4a8a3c", "#8cc56a", c.blur(2)), moldura: "#e8e4da", cortina: "#f6f2e8" }) +
    c.brilho(540, 500, 420, "#fff8e0", 0.35) +
    // crucifixo discreto e relógio
    ret(536, 600, 8, 70, "#8a6a4a") +
    ret(516, 620, 48, 8, "#8a6a4a") +
    // caixão fechado discreto e distante, coberto de flores
    g(
      cam(`M360,780 L720,780 L700,860 L380,860 Z`, "#7a5a3a") +
        ret(380, 860, 320, 20, "#5a3a24") +
        (() => {
          let s = "";
          for (let i = 0; i < 16; i++) s += circ(400 + i * 19, 778 + (i % 2) * 6, 14, escolhe(["#fff", "#f6e8f0", "#f6d65a"]));
          return s;
        })() +
        ret(400, 880, 14, 60, "#9a9a92") +
        ret(666, 880, 14, 60, "#9a9a92"),
      c.blur(2),
    ) +
    // coroas de flores
    coroa(170, 450, 0.9, "SAUDADES ETERNAS") +
    coroa(910, 450, 0.9, "DOS AMIGOS DA OBRA") +
    // mesa com café e biscoito de polvilho
    ret(760, 960, 300, 24, "#fbfbf7") +
    cam(`M760,980 L1060,980 L1070,1060 L750,1060 Z`, "#fbfbf7") +
    rr(800, 860, 56, 100, 12, "#2a6aa0") +
    rr(812, 842, 32, 22, 6, "#222") +
    ret(870, 930, 20, 30, "#fff") +
    ret(896, 930, 20, 30, "#fff") +
    ret(922, 930, 20, 30, "#fff") +
    rr(960, 900, 80, 60, 8, "#f2e8c0", `opacity="0.9"`) +
    (() => {
      let s = "";
      for (let i = 0; i < 5; i++) s += elip(980 + (i % 3) * 20, 900 - Math.floor(i / 3) * 12, 14, 7, "#fff8e8", `stroke="#e8d8b0"`);
      return s;
    })() +
    placa(770, 1080, 280, 60, "#fff", [{ t: "Café e água à vontade", tam: 18, cor: "#555" }], { fonte: SANS }) +
    // livro de presença
    ret(80, 990, 240, 24, "#7a5a3a") +
    ret(100, 1014, 14, 100, "#5a3a24") +
    ret(286, 1014, 14, 100, "#5a3a24") +
    ret(130, 960, 180, 32, "#f6f2e8", `stroke="#ccc"`) +
    linha(220, 960, 220, 992, "#ccc", 2) +
    linha(280, 970, 300, 940, "#1a3ea8", 3) +
    g(cadeiras, c.blur(0.8)) +
    piso(c, 1360, "#c8c2b4", "#9a9486") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#d2ccbe", "#beb8aa", 80), `opacity="0.18"`);
  return c.fim(corpo);
}

function igrejaMissa(): string {
  const c = new Cena("igreja_missa");
  semear(8383);
  let vitral = "";
  const cores = ["#e63946", "#3a86ff", "#f1c40f", "#2a9d8f", "#9b5de5", "#ff9f1c"];
  for (let r = 0; r < 6; r++) for (let k = 0; k < 4; k++) vitral += ret(440 + k * 50, 220 + r * 55, 48, 53, cores[(r * 4 + k * 3) % 6], `opacity="0.85"`);
  let bancos = "";
  for (let r = 0; r < 4; r++) {
    const s = 0.6 + r * 0.18;
    const y = 960 + r * 100;
    const w = 380 * s;
    bancos += rr(540 - 60 * s - w, y - 80 * s, w, 80 * s, 6, "#7a4a2a") + ret(540 - 60 * s - w, y, w, 20 * s, "#5a3420");
    bancos += rr(540 + 60 * s, y - 80 * s, w, 80 * s, 6, "#7a4a2a") + ret(540 + 60 * s, y, w, 20 * s, "#5a3420");
    if (r < 2) bancos += g(pessoa(540 - 60 * s - w * 0.4, y - 70 * s, 0.55 * s, "#2a2a34", "#8a5a3c") + pessoa(540 + 60 * s + w * 0.6, y - 70 * s, 0.52 * s, "#4a3a4a", "#e0b48c") + pessoa(540 + 60 * s + w * 0.25, y - 70 * s, 0.5 * s, "#3a4a5a", "#c48b63"), c.blur(1.2));
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f2e8d8"], [1, "#e0d0b8"]])) +
    // arco do altar
    cam(`M200,1000 L200,300 Q540,40 880,300 L880,1000 Z`, "#fbf6ea") +
    cam(`M200,300 Q540,40 880,300`, "none", `stroke="#c9a46a" stroke-width="16"`) +
    // vitral em arco
    cam(`M430,580 L430,260 Q540,170 650,260 L650,580 Z`, "#2a2a3a") +
    g(vitral, c.clip(`<path d="M440,570 L440,264 Q540,182 640,264 L640,570 Z"/>`)) +
    linha(540, 190, 540, 570, "#2a2a3a", 6) +
    linha(440, 400, 640, 400, "#2a2a3a", 6) +
    c.brilho(540, 420, 260, "#fff3c0", 0.4) +
    // raios de luz coloridos
    cam(`M440,560 L640,560 L820,1300 L260,1300 Z`, "#fff3d0", `opacity="0.16" ${c.blur(16)}`) +
    g(ret(420, 900, 80, 300, "#3a86ff", `opacity="0.12"`) + ret(560, 900, 80, 300, "#e63946", `opacity="0.12"`) + ret(650, 900, 60, 300, "#f1c40f", `opacity="0.12"`), c.blur(18)) +
    // cruz e altar
    ret(530, 610, 20, 140, "#8a6a3a") +
    ret(490, 640, 100, 18, "#8a6a3a") +
    ret(340, 790, 400, 30, "#fbfbf7") +
    cam(`M340,820 L740,820 L730,940 L350,940 Z`, "#f6f2e8") +
    ret(340, 820, 400, 30, "#c9a46a", `opacity="0.6"`) +
    // velas e flores no altar
    ret(400, 720, 16, 70, "#fbf8f0") +
    elip(408, 712, 6, 10, "#ffb000") +
    c.brilho(408, 712, 50, "#ffc766", 0.7) +
    ret(664, 720, 16, 70, "#fbf8f0") +
    elip(672, 712, 6, 10, "#ffb000") +
    c.brilho(672, 712, 50, "#ffc766", 0.7) +
    (() => {
      let s = "";
      for (const bx of [250, 830]) {
        s += cam(`M${bx - 40},940 L${bx + 40},940 L${bx + 30},860 L${bx - 30},860 Z`, "#c9a46a");
        for (let i = 0; i < 12; i++) s += circ(bx + entre(-60, 60), 830 + entre(-50, 30), entre(14, 20), escolhe(["#fff", "#f6e8f0", "#f6d65a", "#ffd0dc"]));
        s += elip(bx - 50, 850, 20, 8, "#3a7a3a") + elip(bx + 50, 840, 20, 8, "#3a7a3a");
      }
      return s;
    })() +
    // foto do pai no altar, singela
    quadro(500, 760, 80, 100, "#c9a46a", ret(508, 768, 64, 84, "#b8c8d0") + elip(540, 798, 14, 16, "#8a5a3c") + elip(540, 840, 24, 14, "#2a4a6a")) +
    // colunas laterais e imagens
    ret(60, 200, 80, 1100, "#e8dcc6") +
    ret(940, 200, 80, 1100, "#e8dcc6") +
    rr(70, 520, 60, 130, 30, "#f6f0e0") +
    elip(100, 560, 12, 14, "#e0b48c") +
    cam(`M80,650 Q100,580 120,650 Z`, "#8a3a2a") +
    rr(950, 520, 60, 130, 30, "#f6f0e0") +
    elip(980, 560, 12, 14, "#e0b48c") +
    cam(`M960,650 Q980,580 1000,650 Z`, "#3a6ab0") +
    bancos +
    piso(c, 1340, "#b89a74", "#8a6e50") +
    cam(`M440,1340 L640,1340 L760,1920 L320,1920 Z`, "#8a2a2a", `opacity="0.55"`);
  return c.fim(corpo);
}

function cartorio(): string {
  const c = new Cena("cartorio");
  semear(8484);
  let pastas = "";
  for (let p = 0; p < 4; p++) {
    let y = 1010;
    const x = 80 + p * 70;
    for (let k = 0; k < 7 + p; k++) {
      const h = entre(14, 22);
      y -= h;
      pastas += ret(x + entre(-5, 5), y, 120, h, escolhe(["#c9a26a", "#e8d4a0", "#7a9ab8", "#d8a0a0", "#e8e0c8"]), `stroke="#8a7a5a" stroke-width="1"`);
    }
  }
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#e8e2cc"], [1, "#d4cab0"]])) +
    ret(0, 760, 1080, 600, "#b8a888") +
    ret(0, 752, 1080, 12, "#9a8a6a") +
    ventiladorTeto(c, 540, 40, 0.8) +
    // placa do cartório
    rr(140, 150, 800, 120, 8, "#3a4a3a") +
    txt(540, 205, "CARTÓRIO DE REGISTRO CIVIL", 36, "#f2e8c8", { peso: "bold" }) +
    txt(540, 248, "e Tabelionato de Notas  •  2º Ofício", 22, "#d8ccaa") +
    // painel de senhas
    rr(700, 300, 330, 150, 8, "#0d1117") +
    txt(865, 345, "SENHA", 22, "#9ab", { fonte: MONO }) +
    txt(865, 420, "N118", 60, "#ffd23f", { fonte: MONO, peso: "bold" }) +
    // avisos
    placa(60, 300, 260, 110, "#fff", [{ t: "SILÊNCIO", tam: 36, cor: "#7a1f1f" }], { fonte: SANS, borda: "#7a1f1f" }) +
    placa(350, 300, 320, 170, "#fff7d6", [{ t: "Traga RG, CPF e", tam: 22 }, { t: "certidão de óbito", tam: 22 }, { t: "ORIGINAIS", tam: 26, cor: "#c0392b" }, { t: "(xerox R$ 0,50)", tam: 16, cor: "#888" }], { rot: -2 }) +
    placa(700, 480, 330, 90, "#fff", [{ t: "Inventário: guichê 4", tam: 22 }, { t: "Pague no caixa antes", tam: 18, cor: "#555" }], { fonte: SANS }) +
    relogio(200, 560, 50, 14, 20) +
    // estante com livros de registro antigos
    ret(380, 500, 280, 260, "#6a4428") +
    (() => {
      let s = "";
      for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) s += ret(396 + i * 29, 520 + r * 120, 26, 100, r ? "#5a2a1a" : "#2a3a5a") + ret(400 + i * 29, 540 + r * 120, 18, 8, "#d6a63a");
      return s;
    })() +
    // balcão
    ret(0, 1010, 1080, 40, "#7a5a3a") +
    ret(0, 1050, 1080, 310, "#6a4a2e") +
    (() => {
      let s = "";
      for (let x = 30; x < 1080; x += 270) s += ret(x, 1080, 230, 250, "#5a3d27", `stroke="#4a301e" stroke-width="4"`);
      return s;
    })() +
    // vidro dos guichês
    ret(400, 800, 640, 210, "#e8f4fa", `opacity="0.35"`) +
    ret(400, 800, 640, 210, "none", `stroke="#9aa4ad" stroke-width="6"`) +
    ret(716, 800, 8, 210, "#9aa4ad") +
    g(pessoa(560, 1010, 0.75, "#3a5a3a", "#c48b63") + pessoa(880, 1010, 0.75, "#5a3a5a", "#8a5a3c"), c.blur(1.5)) +
    // carimbos, almofada e papéis no balcão
    pastas +
    rr(450, 960, 60, 50, 6, "#3a3a3a") +
    elip(480, 940, 22, 22, "#a0603a") +
    rr(530, 980, 90, 30, 4, "#1a3a8a") +
    rr(640, 950, 30, 60, 4, "#7a1f1f") +
    elip(655, 944, 16, 16, "#a0603a") +
    ret(760, 990, 150, 20, "#fbfaf5", `transform="rotate(-4 835 1000)"`) +
    rr(940, 960, 80, 50, 6, "#e8e8e8") +
    circ(980, 985, 12, "#c0392b") +
    piso(c, 1360, "#a89878", "#7a6c52") +
    ret(0, 1360, 1080, 560, ladrilho(c, "#b0a080", "#988868", 80), `opacity="0.18"`);
  return c.fim(corpo);
}

function quartoDoPai(): string {
  const c = new Cena("quarto_do_pai");
  semear(8585);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#dfe6ea"], [1, "#c6d0d6"]])) +
    ret(0, 860, 1080, 500, "#a8b4ba") +
    ret(0, 852, 1080, 12, "#8a969c") +
    // luz suave de fim de tarde
    janela(c, 760, 200, 260, 320, { ceu: [[0, "#f6b26b"], [1, "#ffe1b0"]], moldura: "#f2efe6", cortina: "#e8dcc6" }) +
    cam(`M760,520 L1020,520 L700,1360 L240,1360 Z`, "#ffd9a0", `opacity="0.16" ${c.blur(18)}`) +
    // foto de casamento na parede
    quadro(380, 190, 300, 360, "#c9a46a",
      ret(396, 206, 268, 328, c.lin([[0, "#e8dcc8"], [1, "#c8b89a"]])) +
        pessoa(480, 534, 1, "#1a1a2a", "#8a5a3c") +
        ret(474, 400, 12, 40, "#fff") +
        pessoa(580, 534, 0.95, "#fbfaf5", "#c48b63") +
        elip(580, 340, 40, 30, "#fbfaf5", `opacity="0.85"`) +
        circ(560, 470, 16, "#ff9ac2") +
        circ(574, 462, 12, "#fff")) +
    txt(530, 590, "1981", 22, "#7a6a50", { fonte: MAO }) +
    // camisa de botão no cabide atrás da porta
    ret(60, 120, 260, 900, "#c9a46a") +
    ret(70, 130, 240, 880, "#b8935a") +
    circ(190, 220, 8, "#888") +
    `<path d="M140,260 Q190,220 240,260" stroke="#888" stroke-width="5" fill="none"/>` +
    cam(`M120,260 L260,260 L290,330 L270,340 L262,560 L118,560 L110,340 L90,330 Z`, c.padrao(30, 30, ret(0, 0, 30, 30, "#9ab8d8") + ret(0, 0, 30, 4, "#7a98b8") + ret(0, 0, 4, 30, "#7a98b8"))) +
    cam(`M170,260 L190,300 L210,260 Z`, "#7a98b8") +
    (() => {
      let s = "";
      for (let y = 310; y < 550; y += 40) s += circ(190, y, 5, "#fff");
      return s;
    })() +
    rr(214, 330, 40, 50, 4, "#7a98b8") +
    ret(222, 320, 6, 30, "#1a3ea8") +
    // cama do casal, lado dele
    rr(320, 900, 540, 460, 20, "#7a5a3a") +
    rr(330, 860, 520, 140, 30, "#8a6a48") +
    rr(360, 960, 220, 90, 30, "#f6f2e8") +
    rr(610, 960, 220, 90, 30, "#f6f2e8") +
    rr(340, 1040, 520, 320, 20, c.lin([[0, "#c96a5a"], [1, "#a84a3a"]])) +
    cam(`M340,1040 L700,1040 L690,1120 L340,1110 Z`, "#fff", `opacity="0.08"`) +
    // mesa de cabeceira com carregador errado, rádio e óculos
    ret(0, 1010, 300, 30, "#8a6a48") +
    ret(10, 1040, 280, 320, "#7a5a3a") +
    ret(30, 1070, 240, 110, "#6a4a2e") +
    circ(150, 1125, 8, "#d6a63a") +
    // rádio de pilha
    rr(40, 900, 160, 110, 14, "#6a2a1a") +
    circ(90, 955, 32, "#3a2018") +
    (() => {
      let s = "";
      for (let i = 0; i < 6; i++) s += linha(64, 935 + i * 8, 116, 935 + i * 8, "#5a3a2a", 2);
      return s;
    })() +
    ret(130, 920, 56, 14, "#e0c47a") +
    circ(160, 970, 12, "#c9b080") +
    linha(180, 900, 240, 790, "#bbb", 3) +
    // carregador errado (pino grosso) e copo d'água
    rr(210, 960, 40, 50, 6, "#1a1a1a") +
    `<path d="M230,960 C240,900 300,920 290,860" stroke="#1a1a1a" stroke-width="4" fill="none"/>` +
    rr(278, 850, 22, 14, 3, "#555") +
    bilhete(150, 1180, 120, 60, ["esse não", "serve :("], 14, -4, "#fff", "#555") +
    // relógio de pulso esquecido
    `<path d="M40,1000 Q60,980 80,1000" stroke="#3a2a1a" stroke-width="6" fill="none"/>` +
    // caixa de ferramentas no canto
    rr(860, 1240, 200, 120, 8, "#c0392b") +
    ret(860, 1280, 200, 6, "#8a1f1f") +
    `<path d="M920,1240 L920,1210 L1000,1210 L1000,1240" stroke="#555" stroke-width="10" fill="none"/>` +
    ret(890, 1220, 40, 20, "#e8c040") +
    linha(1010, 1230, 1050, 1180, "#c0c6cc", 6) +
    rr(1036, 1160, 20, 30, 4, "#e8c040") +
    txt(960, 1330, "NÃO MEXER", 18, "#fff", { peso: "bold", op: 0.9 }) +
    // chinelo dele
    elip(560, 1430, 56, 22, "#3a3a3a") +
    elip(640, 1450, 56, 22, "#3a3a3a") +
    lampadaPendente(c, 540, 0, 80, "#ffe8c0", 0.25) +
    piso(c, 1360, "#b8a68a", "#8a7a62") +
    elip(560, 1580, 380, 90, "#6a7a9a", `opacity="0.3"`);
  return c.fim(corpo);
}

// --- A Casa Inteligente da Vó -----------------------------------------------

function assistenteVoz(c: Cena, x: number, y: number, s: number): string {
  // (x, y) = base
  return g(
    c.brilho(x, y - 40 * s, 90 * s, "#5ad8ff", 0.4) +
      rr(x - 40 * s, y - 90 * s, 80 * s, 90 * s, 30 * s, "#2a2d34") +
      cam(`M${x - 40 * s},${y - 60 * s} L${x + 40 * s},${y - 60 * s}`, "none", `stroke="#3a3e48" stroke-width="2"`) +
      elip(x, y - 88 * s, 38 * s, 8 * s, "#1a1c22") +
      elip(x, y - 88 * s, 30 * s, 5 * s, "none", `stroke="#5ad8ff" stroke-width="${3 * s}"`) +
      (() => {
        let p = "";
        for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) p += circ(x - 24 * s + k * 12 * s, y - 50 * s + r * 12 * s, 2 * s, "#4a4e58");
        return p;
      })(),
  );
}

function cameraSeg(c: Cena, x: number, y: number, s: number, rot = 0): string {
  return g(
    rr(x - 14 * s, y - 50 * s, 28 * s, 50 * s, 6 * s, "#f2f2ee") +
      rr(x - 40 * s, y, 80 * s, 56 * s, 22 * s, "#fbfbf8", `stroke="#ddd" stroke-width="2"`) +
      circ(x + 10 * s, y + 28 * s, 18 * s, "#1a1c22") +
      circ(x + 10 * s, y + 28 * s, 8 * s, "#3a4a6a") +
      circ(x + 14 * s, y + 24 * s, 3 * s, "#fff", `opacity="0.7"`) +
      circ(x - 22 * s, y + 14 * s, 4 * s, "#3ab0ff") +
      c.brilho(x - 22 * s, y + 14 * s, 26 * s, "#3ab0ff", 0.8),
    rot ? `transform="rotate(${rot} ${x} ${y})"` : "",
  );
}

function salaVoTech(): string {
  const c = new Cena("sala_vo_tech");
  semear(9191);
  const crocheSofa = c.padrao(40, 40, ret(0, 0, 40, 40, "#f2e2c8") + circ(20, 20, 12, "none", `stroke="#e08aa0" stroke-width="4"`) + circ(20, 20, 4, "#f6d65a") + circ(0, 0, 8, "none", `stroke="#9ac0a0" stroke-width="3"`) + circ(40, 40, 8, "none", `stroke="#9ac0a0" stroke-width="3"`));
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f0dcd0"], [1, "#e0c4b4"]])) +
    // luz roxa das lâmpadas coloridas
    c.brilho(300, 140, 560, "#b46aff", 0.45, 420) +
    c.brilho(840, 160, 480, "#ff6ad8", 0.3, 360) +
    ret(0, 0, 1080, 1360, c.padrao(70, 70, ret(0, 0, 70, 70, "none") + circ(35, 35, 5, "#c08a9a", `opacity="0.25"`))) +
    ret(0, 0, 1080, 80, "#f6eadf") +
    // pendentes com lâmpada colorida
    linha(300, 0, 300, 120, "#3a2a2a", 3) +
    circ(300, 145, 26, "#d8a0ff") +
    c.brilho(300, 145, 90, "#c08aff", 0.9) +
    linha(840, 0, 840, 100, "#3a2a2a", 3) +
    circ(840, 125, 24, "#ff9ae8") +
    c.brilho(840, 125, 80, "#ff8ae0", 0.9) +
    // câmera branca no canto do teto
    cameraSeg(c, 1020, 90, 1.1, 20) +
    // estante com TV, santinho, assistente de voz, porta-retratos
    ret(200, 460, 680, 620, "#7a4e2e") +
    ret(220, 480, 640, 580, "#5a3820") +
    ret(220, 740, 640, 16, "#7a4e2e") +
    ret(220, 920, 640, 16, "#7a4e2e") +
    // TV com novela
    rr(360, 520, 360, 210, 6, "#111") +
    ret(372, 532, 336, 176, c.lin([[0, "#f2b88a"], [1, "#b86a5a"]])) +
    pessoa(470, 708, 0.85, "#8a1f3a", "#e0b48c") +
    pessoa(610, 708, 0.9, "#1a2a4a", "#8a5a3c") +
    elip(470, 545, 30, 18, "#5a2a14") +
    txt(540, 560, "\"VOCÊ NÃO É MEU PAI!\"", 18, "#fff", { peso: "bold" }) +
    croche(540, 508, 380) +
    // santinho + assistente de voz lado a lado
    rr(250, 600, 70, 120, 35, "#f6f0e0") +
    elip(285, 640, 12, 14, "#e0b48c") +
    cam(`M262,720 Q285,650 308,720 Z`, "#3a6ab0") +
    circ(285, 638, 24, "none", `stroke="#f6d65a" stroke-width="3"`) +
    assistenteVoz(c, 790, 730, 0.9) +
    bilhete(740, 600, 110, 60, ["chama de", "a moça"], 14, 6) +
    // porta-retratos dos netos
    portaRetrato(250, 800, 110, 120, "#d6a63a", "#9ac0d8", 2) +
    portaRetrato(380, 790, 100, 130, "#f2efe6", "#f6d0a0", 1) +
    portaRetrato(500, 805, 140, 115, "#c0c0c0", "#b8d8a0", 3) +
    portaRetrato(660, 795, 100, 125, "#ff9ac2", "#d0c0f0", 1) +
    // tomada inteligente na cafeteira (prateleira de baixo)
    rr(270, 960, 120, 90, 10, "#3a3a3a") +
    rr(290, 930, 80, 40, 6, "#e8f4fa", `opacity="0.6"`) +
    rr(400, 1010, 50, 46, 8, "#fbfbf8", `stroke="#ccc"`) +
    circ(425, 1022, 4, "#4cff6a") +
    c.brilho(425, 1022, 24, "#4cff6a", 0.7) +
    `<path d="M390,1030 C395,1040 398,1040 400,1035" stroke="#222" stroke-width="3" fill="none"/>` +
    rr(500, 980, 180, 70, 6, "#2a2a2a") +
    txt(590, 1022, "DVD", 18, "#888") +
    vaso(760, 1010, 0.6, "#c0392b", "#e8e1d0") +
    // relógio cuco e quadro de paisagem
    quadro(40, 200, 130, 180, "#7a4e2e", ret(52, 212, 106, 156, "#7aa0c0") + morro(52, 158, 300, 368, 20, 2, "#5a8a4a")) +
    cam(`M920,220 L1000,180 L1080,220 L1080,380 L920,380 Z`, "#6a4428") +
    circ(1000, 290, 40, "#fbfaf5") +
    linha(1000, 290, 1000, 262, "#222", 4) +
    linha(1000, 290, 1020, 300, "#222", 4) +
    linha(980, 380, 980, 440, "#c9a46a", 3) +
    linha(1020, 380, 1020, 470, "#c9a46a", 3) +
    // sofá de crochê
    rr(20, 1150, 1040, 210, 40, "#6a3a3a") +
    rr(40, 1080, 1000, 150, 50, "#7a4444") +
    rr(80, 1100, 440, 170, 40, crocheSofa, `opacity="0.95"`) +
    rr(560, 1100, 440, 170, 40, crocheSofa, `opacity="0.95"`) +
    rr(140, 1120, 110, 80, 20, chita(c), `transform="rotate(-10 195 1160)"`) +
    // controles e celular da vó com letra gigante
    rr(820, 1140, 70, 120, 10, "#111", `transform="rotate(15 855 1200)"`) +
    rr(828, 1150, 54, 90, 6, "#fff", `transform="rotate(15 855 1200)"`) +
    txt(856, 1205, "A", 40, "#111", { peso: "bold", rot: 15 }) +
    piso(c, 1360, "#b89a7a", "#8a6a50", "#7a5a40") +
    elip(540, 1560, 420, 100, "#b46aff", `opacity="0.18"`);
  return c.fim(corpo);
}

function portaoVila(): string {
  const c = new Cena("portao_vila");
  semear(9292);
  const casinha = (x: number, w: number, cor: string, porta: string) =>
    ret(x, 420, w, 900, cor) + cam(`M${x - 10},430 L${x + w / 2},330 L${x + w + 10},430 Z`, "#a8553a") + rr(x + w / 2 - 60, 1040, 120, 280, 6, porta) + ret(x + 40, 560, 110, 120, "#cfe8f4", `stroke="#fff" stroke-width="8"`);
  const lata = (x: number, y: number, cor: string) => ret(x - 30, y - 70, 60, 70, cor) + ret(x - 30, y - 70, 60, 8, "#999") + vaso(x, y - 70, 0.55, "#3e8a4f", "none");
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#8ac8f0"], [1, "#e6f4fb"]])) +
    nuvem(800, 150, 0.9, "#fff", 0.9, c.blur(2)) +
    // fios e poste ao fundo
    fios([[0, 200], [540, 230], [1080, 190]], "#333", 2) +
    // casinhas geminadas
    g(casinha(-40, 300, "#f2b84b", "#2f6f95") + casinha(860, 300, "#9ad0b0", "#7a3a2a"), c.blur(1.5)) +
    casinha(260, 600, "#f4d6e0", "#3a5a8a") +
    // janela da vizinha com cortina entreaberta (casa da direita)
    ret(900, 560, 110, 120, "#3a3a4a") +
    cam(`M900,560 L955,560 Q945,620 960,680 L900,680 Z`, "#f6e8a0") +
    cam(`M1010,560 L968,560 Q975,620 968,680 L1010,680 Z`, "#f6e8a0") +
    elip(964, 610, 10, 14, "#c48b63") +
    circ(962, 606, 3, "#222") +
    // muro baixo com gato
    ret(0, 980, 1080, 120, "#e8e0d0") +
    ret(0, 970, 1080, 16, "#c9c0ae") +
    elip(170, 950, 60, 26, "#2a2a2a") +
    circ(220, 930, 22, "#2a2a2a") +
    cam(`M206,914 L210,896 L220,912 Z`, "#2a2a2a") +
    cam(`M226,912 L234,894 L238,914 Z`, "#2a2a2a") +
    circ(214, 930, 3, "#f6d65a") +
    circ(228, 930, 3, "#f6d65a") +
    `<path d="M110,950 Q80,990 100,1030" stroke="#2a2a2a" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    // portão baixo de grade
    ret(420, 980, 280, 340, "#3a5a8a", `opacity="0.25"`) +
    (() => {
      let s = "";
      for (let x = 430; x < 700; x += 30) s += ret(x, 960, 8, 360, "#2a3a5a");
      return s + ret(420, 960, 280, 12, "#2a3a5a") + ret(420, 1140, 280, 10, "#2a3a5a");
    })() +
    // campainha com câmera
    rr(740, 800, 60, 120, 14, "#1a1c22") +
    circ(770, 830, 14, "#3a4a6a") +
    circ(770, 830, 6, "#111") +
    circ(770, 885, 14, "none", `stroke="#5ad8ff" stroke-width="4"`) +
    c.brilho(770, 885, 40, "#5ad8ff", 0.6) +
    placa(720, 720, 160, 60, "#fff", [{ t: "SORRIA :)", tam: 20, cor: "#1a3ea8" }, { t: "a vó tá vendo", tam: 14 }], { rot: -3 }) +
    // número e caixa de correio
    rr(300, 760, 80, 50, 6, "#fff") +
    txt(340, 795, "14-B", 22, "#333", { peso: "bold" }) +
    rr(300, 840, 90, 70, 6, "#c0392b") +
    ret(310, 860, 70, 8, "#7a1f1f") +
    // plantas em lata
    lata(80, 1320, "#d8d8d0") +
    lata(170, 1320, "#e63946") +
    lata(950, 1320, "#f1c40f") +
    lata(1030, 1320, "#2a9d8f") +
    // varal de vizinho e bandeirinhas residuais
    bandeirinhas(-20, 1100, 300, 20, 14, ["#e63946", "#f1c40f", "#2a9d8f"], 0.7) +
    piso(c, 1320, "#b8b0a2", "#8a8274") +
    ret(0, 1320, 1080, 600, c.padrao(90, 50, `<rect x="2" y="2" width="86" height="46" fill="none" stroke="#7a7266" stroke-width="3" opacity="0.25"/>`));
  return c.fim(corpo);
}

function cozinhaVo(): string {
  const c = new Cena("cozinha_vo");
  semear(9393);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#f6e6b8"], [1, "#e8cc90"]])) +
    ret(0, 640, 1080, 480, azulejo(c, "#ffffff", "#e0608a", 56)) +
    ret(0, 632, 1080, 12, "#e0608a") +
    lampadaPendente(c, 540, 0, 120, "#ffe8a0", 0.35) +
    // janela com cortininha
    janela(c, 380, 220, 300, 260, { ceu: [[0, "#8ac8f0"], [1, "#e6f4fb"]], paisagem: arvore(c, 560, 540, 0.6, "#3f7a35", "#79b85a"), moldura: "#5aa0a0", cortina: chita(c) }) +
    // calendário e terço
    calendario(80, 180, 170, "PADARIA", "Pão quentinho", "2027") +
    // prateleira com potes e rádio
    ret(60, 560, 260, 14, "#8a6a4a") +
    rr(70, 490, 80, 70, 10, "#7b2d26") +
    circ(100, 525, 20, "#3a2a25") +
    ret(120, 505, 24, 8, "#e0c47a") +
    linha(140, 490, 180, 430, "#999", 3) +
    rr(170, 500, 50, 60, 6, "#f2efe6", `stroke="#ccc"`) +
    txt(195, 535, "açúcar", 11, "#c0392b", { fonte: MAO }) +
    rr(230, 500, 50, 60, 6, "#f2efe6", `stroke="#ccc"`) +
    txt(255, 535, "café", 11, "#7a3a1a", { fonte: MAO }) +
    // geladeira com ímãs e bilhete
    rr(780, 380, 260, 980, 26, c.lin([[0, "#fbfbf9"], [1, "#e2e2de"]], 0, 0, 1, 0)) +
    ret(780, 700, 260, 6, "#ccc") +
    ret(800, 440, 12, 200, "#bbb") +
    ret(800, 740, 12, 240, "#bbb") +
    bilhete(830, 420, 190, 140, ["senha do wifi", "NÃO é o nome", "do gato", "(Bolinha123)"], 18, 3, "#fdf6b2", "#c0392b") +
    circ(880, 600, 18, "#e63946") +
    circ(930, 610, 16, "#2a9d8f") +
    rr(960, 590, 50, 40, 6, "#f1c40f") +
    portaRetrato(830, 760, 110, 130, "#ff9ac2", "#bfe0f0", 2) +
    rr(960, 770, 60, 80, 6, "#fff", `stroke="#ccc"`) +
    txt(990, 800, "ÍMÃ", 12, "#555") +
    txt(990, 820, "Gás", 12, "#c0392b", { peso: "bold" }) +
    // bancada com caixinha de assistente de voz
    ret(320, 860, 440, 34, "#8f9499") +
    ret(330, 894, 420, 466, "#e8e1d2") +
    assistenteVoz(c, 690, 860, 0.8) +
    bilhete(560, 760, 100, 60, ["não fala", "\"compra\""], 13, -5) +
    rr(380, 800, 70, 60, 6, "#d9dde0") +
    `<path d="M420,860 L420,820 Q420,800 445,800 L460,800" stroke="#c0c6cc" stroke-width="10" fill="none"/>` +
    // filtro de barro
    ret(40, 980, 240, 20, "#7a5235") +
    ret(50, 1000, 14, 360, "#6b4a33") +
    ret(256, 1000, 14, 360, "#6b4a33") +
    elip(160, 920, 72, 60, c.rad([[0, "#d98a5c"], [1, "#9c4d2c"]], 0.35, 0.3, 0.75)) +
    elip(160, 810, 62, 52, c.rad([[0, "#df9465"], [1, "#a3532f"]], 0.35, 0.3, 0.75)) +
    elip(160, 764, 46, 12, "#8a4224") +
    ret(218, 930, 22, 8, "#c9ccce") +
    // mesa com toalha e bolo
    ret(180, 1120, 720, 30, chita(c)) +
    cam(`M180,1146 L900,1146 L920,1230 L160,1230 Z`, chita(c)) +
    ret(160, 1226, 760, 8, "#000", `opacity="0.15"`) +
    elip(540, 1110, 130, 24, "#f2f2ee", `stroke="#ccc"`) +
    rr(440, 1020, 200, 90, 30, c.lin([[0, "#c08040"], [1, "#9a5a2a"]])) +
    cam(`M440,1040 Q480,1020 520,1046 Q560,1020 600,1046 Q620,1030 640,1040 L640,1030 Q540,1000 440,1030 Z`, "#fbf2dc") +
    rr(700, 1060, 60, 60, 8, "#fff", `stroke="#ddd"`) +
    rr(300, 1070, 46, 50, 6, "#f2efe6", `stroke="#ccc"`) +
    g(`<path d="M323,1060 C310,1020 340,1000 320,960" stroke="#fff" stroke-width="10" fill="none" opacity="0.4"/>`, c.blur(4)) +
    piso(c, 1360, "#c86a4a", "#8a3a2a") +
    elip(540, 1560, 480, 120, "#fff", `opacity="0.05"`);
  return c.fim(corpo);
}

// --- O Primeiro Celular do Theo ---------------------------------------------

function blocoJogo(x: number, y: number, t: number, cor: string): string {
  return ret(x, y, t, t, cor) + ret(x, y, t, t * 0.2, "#fff", `opacity="0.25"`) + ret(x, y + t * 0.8, t, t * 0.2, "#000", `opacity="0.2"`);
}

function quartoTheo(): string {
  const c = new Cena("quarto_theo");
  semear(9494);
  const lencol = c.padrao(60, 60, ret(0, 0, 60, 60, "#3a6ab0") + ret(10, 10, 14, 14, "#5ad86a") + ret(36, 34, 14, 14, "#f1c40f") + ret(36, 8, 8, 8, "#fff", `opacity="0.4"`));
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#b8d8f0"], [1, "#98bede"]])) +
    ret(0, 820, 1080, 540, "#7aa0c8") +
    ret(0, 812, 1080, 12, "#5a80a8") +
    // pôster grande do jogo de blocos inventado
    quadro(60, 140, 380, 300, "#1a1a2a",
      ret(72, 152, 356, 276, c.lin([[0, "#7ac8ff"], [1, "#c8f0ff"]])) +
        (() => {
          let s = "";
          for (let i = 0; i < 9; i++) s += blocoJogo(72 + i * 40, 388, 40, i % 3 ? "#5aaa3a" : "#8a5a3a");
          for (let i = 0; i < 3; i++) s += blocoJogo(232, 268 + i * 40, 40, "#8a5a3a");
          s += blocoJogo(192, 228, 40, "#3a9a3a") + blocoJogo(232, 228, 40, "#3a9a3a") + blocoJogo(272, 228, 40, "#3a9a3a") + blocoJogo(232, 188, 40, "#3a9a3a");
          s += blocoJogo(340, 348, 40, "#8a8a8a") + blocoJogo(340, 308, 20, "#e63946");
          return s;
        })() +
        txt(250, 190, "BLOCOVERSO", 30, "#fff", { peso: "bold", extra: `stroke="#1a1a2a" stroke-width="2"` })) +
    quadro(470, 170, 200, 260, "#1a1a2a", ret(482, 182, 176, 236, "#2a1a3a") + blocoJogo(530, 250, 80, "#3a9a3a") + ret(548, 270, 14, 14, "#111") + ret(578, 270, 14, 14, "#111") + ret(558, 296, 24, 20, "#111") + txt(570, 380, "BUUM!", 30, "#f1c40f", { peso: "bold" })) +
    // janela com tarde
    janela(c, 760, 200, 260, 300, { ceu: [[0, "#6ab8ec"], [1, "#e6f4fb"]], paisagem: predios(c, 760, 1020, 500, 40, 140, "#9ab0c8", "#fff", 0.05), moldura: "#f2efe6", cortina: "#f1c40f" }) +
    // prateleira com troféu de futsal e bonecos de bloco
    ret(470, 520, 300, 14, "#8a6a4a") +
    cam(`M500,520 L540,520 L530,470 L510,470 Z`, "#d6a63a") +
    ret(505, 450, 30, 22, "#f6d65a") +
    blocoJogo(570, 480, 40, "#5aaa3a") +
    blocoJogo(620, 490, 30, "#e63946") +
    rr(680, 470, 60, 50, 6, "#2a9d8f") +
    // mesa de estudo
    ret(380, 900, 520, 34, "#e8d4b0") +
    ret(400, 934, 20, 420, "#c9b090") +
    ret(860, 934, 20, 420, "#c9b090") +
    ret(700, 940, 180, 220, "#d8c4a0") +
    ret(720, 970, 140, 70, "#c9b090") +
    ret(720, 1060, 140, 70, "#c9b090") +
    // caderno aberto, lápis, estojo
    cam(`M440,890 L640,890 L650,860 L430,860 Z`, "#fff") +
    linha(540, 860, 540, 890, "#ccc", 2) +
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += linha(450 + i * 2, 866 + i * 6, 530, 866 + i * 6, "#9ab", 1) + linha(550, 866 + i * 6, 630 - i * 2, 866 + i * 6, "#9ab", 1);
      return s;
    })() +
    rr(660, 870, 90, 26, 10, "#e63946") +
    linha(470, 896, 560, 884, "#f1c40f", 6) +
    // luminária acesa
    linha(820, 900, 840, 760, "#333", 8) +
    linha(840, 760, 780, 720, "#333", 8) +
    cam(`M740,700 L810,720 L790,770 L730,750 Z`, "#5ad86a") +
    c.brilho(770, 790, 220, "#fff3c0", 0.5) +
    // celular usado com adesivo de unicórnio e carregador
    c.brilho(600, 850, 120, "#bcd8ff", 0.5) +
    g(
      rr(570, 790, 64, 120, 12, "#e8e8ea") +
        circ(602, 850, 22, "#fff") +
        cam(`M600,828 L606,812 L610,830 Z`, "#f6d65a") +
        circ(602, 852, 16, "#ff9ae8") +
        circ(596, 848, 3, "#222") +
        cam(`M590,870 Q580,880 586,890 M614,870 Q624,880 618,890`, "none", `stroke="#9a5aff" stroke-width="5"`),
      `transform="rotate(-14 602 850)"`,
    ) +
    `<path d="M590,910 C580,980 520,1000 500,1060 C480,1120 440,1140 420,1150" stroke="#fff" stroke-width="5" fill="none"/>` +
    rr(392, 1130, 50, 70, 6, "#f2f2ee", `stroke="#aaa"`) +
    rr(400, 1140, 34, 30, 4, "#fff", `stroke="#aaa"`) +
    // mochila da escola encostada
    rr(920, 1120, 140, 220, 40, "#e63946") +
    rr(940, 1210, 100, 90, 20, "#c0302c") +
    `<path d="M950,1130 Q990,1060 1030,1130" stroke="#a02020" stroke-width="12" fill="none"/>` +
    rr(960, 1220, 40, 40, 8, "#f1c40f") +
    // cama
    rr(0, 960, 340, 400, 20, "#3a5a8a") +
    rr(0, 1040, 330, 320, 20, lencol) +
    rr(20, 990, 180, 70, 30, "#fff") +
    // bola e tênis
    circ(300, 1290, 50, "#fbfbf8", `stroke="#222" stroke-width="3"`) +
    cam(`M300,1260 L318,1275 L312,1298 L288,1298 L282,1275 Z`, "#222") +
    piso(c, 1360, "#c9a77a", "#9a7a52", "#8a6a44") +
    elip(560, 1540, 340, 90, "#5ad86a", `opacity="0.25"`);
  return c.fim(corpo);
}

function patioEscola(): string {
  const c = new Cena("patio_escola");
  semear(9595);
  const corpo =
    ret(0, 0, 1080, 1360, c.lin([[0, "#5fb2ec"], [1, "#d8eefa"]])) +
    nuvem(250, 160, 0.9, "#fff", 0.9, c.blur(2)) +
    // prédio da escola
    ret(0, 300, 1080, 420, "#e8d090") +
    ret(0, 300, 1080, 30, "#c9a85a") +
    (() => {
      let s = "";
      for (let i = 0; i < 6; i++) s += ret(40 + i * 175, 380, 130, 110, "#9ad0e8", `stroke="#fff" stroke-width="6"`) + ret(40 + i * 175, 380, 130, 110, c.padrao(26, 26, ret(0, 0, 26, 26, "none") + ret(10, 0, 4, 26, "#3a3a3a", `opacity="0.6"`)));
      return s;
    })() +
    rr(380, 340, 320, 30, 6, "#1d4a7a") +
    txt(540, 362, "E. M. PROF.ª MARIA DAS DORES", 20, "#fff", { peso: "bold" }) +
    ret(0, 560, 1080, 160, "#2a8a5a") +
    ret(0, 556, 1080, 10, "#1a6a4a") +
    // quadra com alambrado
    ret(0, 720, 1080, 300, "#3a8aa0") +
    ret(60, 740, 960, 260, "none", `stroke="#fff" stroke-width="5"`) +
    linha(540, 740, 540, 1000, "#fff", 5) +
    circ(540, 870, 60, "none", `stroke="#fff" stroke-width="5"`) +
    ret(60, 820, 60, 100, "none", `stroke="#fff" stroke-width="5"`) +
    ret(960, 820, 60, 100, "none", `stroke="#fff" stroke-width="5"`) +
    ret(0, 600, 1080, 130, c.padrao(24, 24, `<path d="M0,0 L24,24 M24,0 L0,24" stroke="#888" stroke-width="2" opacity="0.6"/>`)) +
    ret(0, 596, 1080, 8, "#777") +
    g(multidao(7, 120, 960, 990, 0.6, ["#fff", "#1d4a7a", "#e8e8e8", "#2a6aa0"]), c.blur(3.5)) +
    // árvore grande
    arvore(c, 120, 1150, 1.5, "#2f6a2c", "#6aa64f") +
    // mural de avisos
    ret(640, 1000, 360, 220, "#8a5a36") +
    ret(654, 1014, 332, 192, "#c9a77a") +
    bilhete(670, 1030, 120, 70, ["FESTA", "JUNINA!"], 14, -4, "#ffd0d0", "#7a1f1f") +
    bilhete(800, 1028, 120, 80, ["celular só", "no recreio"], 14, 3) +
    bilhete(680, 1120, 130, 70, ["vacinação", "dia 12"], 14, 2, "#bfe6ff") +
    bilhete(830, 1120, 130, 70, ["achados e", "perdidos"], 14, -3, "#d6f5c0") +
    ret(816, 1220, 10, 100, "#6a4a2e") +
    // bebedouro
    rr(420, 1080, 160, 220, 10, "#c9ced2") +
    ret(420, 1080, 160, 40, "#aeb4b8") +
    circ(460, 1100, 10, "#555") +
    circ(540, 1100, 10, "#555") +
    placa(410, 1010, 180, 50, "#fff", [{ t: "ÁGUA FRIA (às vezes)", tam: 14 }], { rot: -2 }) +
    g(multidao(4, 250, 1050, 1280, 0.85, ["#e8eef2", "#1d4a7a", "#cfd8de"]), c.blur(7)) +
    piso(c, 1310, "#bcb4a4", "#8a8274");
  return c.fim(corpo);
}

function salaReuniaoPais(): string {
  const c = new Cena("sala_reuniao_pais");
  semear(9696);
  let roda = "";
  for (let i = 0; i < 12; i++) {
    const a = Math.PI + (Math.PI * i) / 11;
    const x = 540 + Math.cos(a) * 420;
    const y = 1150 + Math.sin(a) * 160;
    roda += cadeiraEscola(x - 40, y + 60, 0.55);
  }
  const corpo =
    ret(0, 0, 1080, 1360, "#f1e6c8") +
    ret(0, 860, 1080, 500, "#9ab8d8") +
    ret(0, 850, 1080, 14, "#7a98b8") +
    ventiladorTeto(c, 220, 50, 0.7) +
    ventiladorTeto(c, 860, 50, 0.7) +
    fluorescente(c, 380, 140, 320, 0.4) +
    lousa(170, 270, 740, 360) +
    txt(540, 360, "REUNIÃO 1º BIMESTRE", 52, "#f3f3ea", { fonte: MAO, peso: "bold" }) +
    txt(260, 440, "Pauta:", 30, "#f7e39a", { fonte: MAO, ancora: "start" }) +
    txt(280, 490, "1. Notas", 28, "#e9efe0", { fonte: MAO, ancora: "start" }) +
    txt(280, 535, "2. Uso do celular", 28, "#e9efe0", { fonte: MAO, ancora: "start" }) +
    txt(280, 580, "3. Excursão (R$ 35)", 28, "#e9efe0", { fonte: MAO, ancora: "start" }) +
    txt(820, 600, "Sejam bem-vindos!", 22, "#ffd0e0", { fonte: MAO }) +
    // cartazes dos alunos
    bilhete(20, 300, 130, 160, ["MINHA", "FAMÍLIA", ":)"], 18, -4, "#fff", "#2a6aa0") +
    bilhete(930, 300, 130, 160, ["SISTEMA", "SOLAR"], 18, 4, "#fdf6b2", "#c0392b") +
    bilhete(20, 500, 130, 140, ["Internet", "segura!"], 18, 3, "#d6f5c0", "#1d6a3a") +
    bilhete(930, 500, 130, 140, ["Dengue", "NÃO"], 18, -3, "#ffd0d0", "#7a1f1f") +
    relogio(540, 190, 44, 19, 5) +
    // mesa da professora com lista e café
    ret(380, 760, 320, 24, "#c58b4f") +
    ret(400, 784, 280, 80, "#a8763f") +
    ret(420, 730, 120, 30, "#fbfaf5") +
    rr(600, 720, 40, 40, 4, "#e63946") +
    rr(560, 740, 30, 20, 4, "#fff") +
    // roda de carteiras
    g(roda, c.blur(0.6)) +
    piso(c, 1350, "#c9bfae", "#9a8f7e", "#7a7060");
  return c.fim(corpo);
}

function onibusEscolar(): string {
  const c = new Cena("onibus_escolar");
  semear(9797);
  const corpo =
    ret(0, 0, 1080, 1400, c.lin([[0, "#d8dfe4"], [1, "#b8c2ca"]])) +
    ret(0, 0, 1080, 140, "#eef2f4") +
    fluorescente(c, 140, 100, 300, 0.4) +
    fluorescente(c, 640, 100, 300, 0.4) +
    // janelões com rua de manhã
    (() => {
      let s = "";
      for (let i = 0; i < 3; i++) {
        const x = 30 + i * 350;
        s += rr(x, 230, 320, 420, 20, "#9aa4ad");
        s += g(
          ret(x + 12, 242, 296, 396, c.lin([[0, "#ffd8a8"], [1, "#e8f4fb"]])) +
            predios(c, x + 12, x + 308, 560, 60, 200, "#c8b8a8", "#fff", 0.05) +
            arvore(c, x + 100 + i * 30, 640, 0.6, "#4a8a3c", "#8cc56a") +
            ret(x + 12, 560, 296, 80, "#8a8a8a"),
          `${c.blur(3)} ${c.clip(`<rect x="${x + 12}" y="242" width="296" height="396" rx="12"/>`)}`,
        );
        s += ret(x + 12, 420, 296, 8, "#9aa4ad");
      }
      return s;
    })() +
    // sol batendo
    cam(`M0,240 L1080,240 L1080,700 L0,900 Z`, "#ffe8c0", `opacity="0.12" ${c.blur(14)}`) +
    // barras de apoio
    ret(0, 190, 1080, 12, "#e0b030") +
    ret(320, 190, 14, 1200, "#e0b030") +
    ret(760, 190, 14, 1200, "#e0b030") +
    (() => {
      let s = "";
      for (let x = 80; x < 1060; x += 140) s += linha(x, 200, x, 270, "#999", 3) + `<path d="M${x - 16},270 Q${x},306 ${x + 16},270 Z" fill="none" stroke="#e0b030" stroke-width="7"/>`;
      return s;
    })() +
    // aviso lugar preferencial e cobrador
    placa(380, 680, 320, 90, "#ffd23f", [{ t: "LUGAR PREFERENCIAL", tam: 22, cor: "#222" }, { t: "idosos, gestantes, PcD", tam: 16 }], { fonte: SANS }) +
    placa(40, 690, 240, 70, "#fff", [{ t: "Não fale com", tam: 16 }, { t: "o motorista", tam: 16 }], { fonte: SANS }) +
    // bancos
    (() => {
      let s = "";
      for (let i = 0; i < 4; i++) s += rr(40 + i * 260, 900, 200, 180, 20, "#2a6aa0") + rr(40 + i * 260, 1060, 200, 60, 14, "#1d4a7a");
      return s;
    })() +
    // alunos de mochila em silhueta (mochila aparece atrás do ombro)
    g(
      (() => {
        let s = "";
        for (let i = 0; i < 5; i++) {
          const x = 120 + i * 210;
          s += rr(x + 10, 1010, 110, 150, 30, escolhe(["#e63946", "#f1c40f", "#2a9d8f", "#9b5de5", "#ff7ad8"])) + rr(x + 30, 1060, 70, 50, 12, "#000", `opacity="0.15"`);
        }
        return s;
      })() +
        (() => {
          let s = "";
          for (let i = 0; i < 5; i++) s += pessoa(100 + i * 210, 1270, 1.25, escolhe(["#fff", "#1d4a7a", "#e8e8e8"]), escolhe(["#8a5a3c", "#c48b63", "#5e3a26", "#e0b48c"]));
          return s;
        })(),
      c.blur(3),
    ) +
    piso(c, 1390, "#5a6068", "#3a4048", "#2a3038");
  return c.fim(corpo);
}

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------

function montar(): Record<string, Cenario> {
  const lista: [string, string, () => string, boolean?][] = [
    ["casa_cozinha", "Cozinha de casa", casaCozinha],
    ["casa_quarto_infancia", "Quarto de infância", casaQuartoInfancia],
    ["quarto_adolescente", "Quarto adolescente", quartoAdolescente],
    ["escola_sala", "Sala de aula", escolaSala],
    ["escola_laboratorio", "Laboratório de informática", escolaLaboratorio],
    ["lan_house", "Lan house", lanHouse, true],
    ["biblioteca_municipal", "Biblioteca municipal", bibliotecaMunicipal],
    ["praca_interior", "Praça da matriz", pracaInterior],
    ["feira_rua", "Feira de rua", feiraRua],
    ["rua_interior_noite", "Rua à noite", ruaInteriorNoite, true],
    ["festa_junina", "Festa junina", festaJunina, true],
    ["rodoviaria", "Rodoviária", rodoviaria],
    ["onibus_noite", "Ônibus de viagem", onibusNoite, true],
    ["capital_rua", "Avenida da capital", capitalRua],
    ["metro_lotado", "Metrô lotado", metroLotado],
    ["republica_quarto", "Quarto da república", republicaQuarto],
    ["republica_cozinha", "Cozinha da república", republicaCozinha],
    ["call_center", "Call center", callCenter],
    ["escritorio_moderno", "Escritório de startup", escritorioModerno],
    ["sala_entrevista", "Sala de entrevista", salaEntrevista],
    ["videochamada", "Videochamada", videochamada],
    ["cafeteria", "Cafeteria", cafeteria],
    ["auditorio_evento", "Auditório do evento", auditorioEvento, true],
    ["sala_ctf", "Sala do CTF", salaCtf, true],
    ["soc_sala", "Sala do SOC", socSala, true],
    ["apartamento_capital", "Apartamento na capital", apartamentoCapital],
    ["assistencia_tecnica", "Assistência técnica", assistenciaTecnica],
    ["prefeitura_sala", "Sala da prefeitura", prefeituraSala],
    ["cooperativa", "Cooperativa agrícola", cooperativa],
    ["delegacia", "Delegacia", delegacia],
    ["hospital_corredor", "Corredor de hospital", hospitalCorredor],
    ["palco_premiacao", "Palco da premiação", palcoPremiacao, true],
    ["aeroporto", "Aeroporto", aeroporto],
    ["quarto_madrugada", "Quarto de madrugada", quartoMadrugada, true],
    ["sala_familia", "Sala da família", salaFamilia],
    ["quintal_almoco", "Almoço no quintal", quintalAlmoco],
    ["agencia_banco", "Agência bancária", agenciaBanco],
    ["carro_noite", "Carro à noite", carroNoite, true],
    ["quarto_tia", "Quarto da tia", quartoTia],
    ["clinica_recepcao", "Recepção da clínica", clinicaRecepcao],
    ["sala_reuniao", "Sala de reunião", salaReuniao],
    ["sala_dpo", "Sala da encarregada", salaDpo],
    ["studio_pilates", "Estúdio de pilates", studioPilates],
    ["home_office_noite", "Home office à noite", homeOfficeNoite, true],
    ["pastelaria", "Pastelaria", pastelaria],
    ["feira_pastel", "Feira de domingo", feiraPastel],
    ["portao_noite", "Portão à noite", portaoNoite, true],
    ["associacao_comerciantes", "Associação dos comerciantes", associacaoComerciantes],
    ["cozinha_pastelaria", "Cozinha da pastelaria", cozinhaPastelaria],
    ["sala_tv_velha", "Sala com TV velha", salaTvVelha],
    ["loja_eletronicos", "Loja de eletrônicos", lojaEletronicos],
    ["ponto_onibus", "Ponto de ônibus", pontoOnibus],
    ["shopping_corredor", "Corredor do shopping", shoppingCorredor],
    ["gaveta_celular", "Gaveta com o celular", gavetaCelular],
    ["velorio", "Velório", velorio],
    ["igreja_missa", "Missa de sétimo dia", igrejaMissa],
    ["cartorio", "Cartório", cartorio],
    ["quarto_do_pai", "Quarto do pai", quartoDoPai],
    ["sala_vo_tech", "Sala da vó conectada", salaVoTech],
    ["portao_vila", "Portão da vila", portaoVila],
    ["cozinha_vo", "Cozinha da vó", cozinhaVo],
    ["quarto_theo", "Quarto do Theo", quartoTheo],
    ["patio_escola", "Pátio da escola", patioEscola],
    ["sala_reuniao_pais", "Reunião de pais", salaReuniaoPais],
    ["onibus_escolar", "Ônibus de manhã", onibusEscolar],
  ];
  const out: Record<string, Cenario> = {};
  for (const [id, nome, fn, noite] of lista) {
    out[id] = noite ? { nome, svg: fn(), noite: true } : { nome, svg: fn() };
  }
  return out;
}

export const CENARIOS: Record<string, Cenario> = montar();
