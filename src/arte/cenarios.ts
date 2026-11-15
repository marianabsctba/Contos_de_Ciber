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
  ];
  const out: Record<string, Cenario> = {};
  for (const [id, nome, fn, noite] of lista) {
    out[id] = noite ? { nome, svg: fn(), noite: true } : { nome, svg: fn() };
  }
  return out;
}

export const CENARIOS: Record<string, Cenario> = montar();
