// Gerador de personagens ilustrados em SVG, estilo romance interativo de celular.
// Tudo vetorial, sem imagens externas. Coordenadas:
//  - corpo: espaco 400x900 do adulto, base dos pes em y=892; escalado por idade a partir de (200,895)
//  - cabeca: espaco proprio (centro do rosto ~ 200,145, queixo ~ 225), encaixado na junta do pescoco
import type { Expressao, Idade, Visual } from '../motor/tipos';

// ---------------------------------------------------------------- catalogos

export const TONS_PELE: string[] = [
  '#fbe4d5',
  '#f3d0b5',
  '#e8bb96',
  '#d6a173',
  '#bb7f52',
  '#99643f',
  '#70462b',
  '#4b2d1c',
];

export const CORES_CABELO: string[] = [
  '#1f1a1c', // preto
  '#3d2a1f', // castanho escuro
  '#7a5136', // castanho claro
  '#b4492a', // ruivo
  '#e3bb6a', // loiro
  '#8f8c89', // grisalho
  '#ebe7e1', // branco
  '#ef7fb3', // rosa
  '#3f7bd8', // azul
  '#7c4cc4', // roxo
];

export const CABELOS: { id: string; nome: string }[] = [
  { id: 'liso_longo', nome: 'Liso longo' },
  { id: 'liso_curto', nome: 'Liso curto' },
  { id: 'cacheado_longo', nome: 'Cacheado longo' },
  { id: 'cacheado_curto', nome: 'Cacheado curto' },
  { id: 'crespo_volumoso', nome: 'Black power' },
  { id: 'trancas_box', nome: 'Box braids' },
  { id: 'coque', nome: 'Coque' },
  { id: 'rabo_de_cavalo', nome: 'Rabo de cavalo' },
  { id: 'maria_chiquinha', nome: 'Maria-chiquinha' },
  { id: 'franja_chanel', nome: 'Chanel com franja' },
  { id: 'raspado', nome: 'Raspado' },
  { id: 'careca', nome: 'Careca' },
  { id: 'topete', nome: 'Topete' },
  { id: 'black_curto', nome: 'Black curtinho' },
];

export const ROUPAS: { id: string; nome: string; idades: Idade[]; piada: string }[] = [
  { id: 'uniforme_escola_publica', nome: 'Uniforme da escola pública', idades: ['crianca'], piada: 'De graça. Igual Wi-Fi de rodoviária, mas funciona.' },
  { id: 'vestido_chita', nome: 'Vestido de chita', idades: ['crianca', 'adolescente'], piada: '0 gemas. A vó já pagou em 1998.' },
  { id: 'camiseta_desenho', nome: 'Camiseta de desenho', idades: ['crianca'], piada: 'Grátis. Licença do desenho? A gente inventou outro.' },
  { id: 'short_e_regata', nome: 'Short e regata', idades: ['crianca', 'adolescente'], piada: 'Custa um picolé. Brincadeira, é de graça.' },
  { id: 'moletom_irmao_mais_velho', nome: 'Moletom do irmão mais velho', idades: ['crianca'], piada: 'Herdado. Taxa de herança: um "devolve depois".' },
  { id: 'moletom_capuz', nome: 'Moletom com capuz', idades: ['adolescente', 'adulta'], piada: 'Grátis. O capuz esconde até olheira de semana de prova.' },
  { id: 'camiseta_banda_rock', nome: 'Camiseta de banda de rock', idades: ['adolescente', 'adulta'], piada: 'De graça. Nunca ouviu a banda, mas ninguém precisa saber.' },
  { id: 'uniforme_ensino_medio', nome: 'Uniforme do ensino médio', idades: ['adolescente'], piada: 'Zero reais. A carteirinha de meia-entrada vem em espírito.' },
  { id: 'jaqueta_jeans', nome: 'Jaqueta jeans', idades: ['adolescente', 'adulta'], piada: 'Grátis. Já passou por três primas e continua firme.' },
  { id: 'camisa_xadrez_festa_junina', nome: 'Camisa xadrez de festa junina', idades: ['crianca', 'adolescente', 'adulta'], piada: 'Sai por uma quadrilha dançada. Pode errar o passo.' },
  { id: 'vestido_formatura', nome: 'Vestido de formatura', idades: ['adolescente', 'adulta'], piada: 'De graça. Diferente da comissão de formatura.' },
  { id: 'camiseta_preta_hacker', nome: 'Camiseta preta de hacker', idades: ['adolescente', 'adulta'], piada: 'Grátis. Vem com 5% a mais de cara de quem sabe Linux.' },
  { id: 'blazer_entrevista', nome: 'Blazer de entrevista', idades: ['adulta'], piada: '0 moedas. Pretensão salarial: a combinar.' },
  { id: 'camisa_social', nome: 'Camisa social', idades: ['adulta'], piada: 'Grátis. Passar a ferro não é DLC, é castigo.' },
  { id: 'headset_call_center', nome: 'Uniforme de operadora', idades: ['adulta'], piada: 'Sem custo. "Sua ligação é muito importante para nós."' },
  { id: 'jaleco_laboratorio', nome: 'Jaleco de laboratório', idades: ['adulta'], piada: 'Grátis. Não dá doutorado, mas impõe respeito.' },
  { id: 'vestido_festa', nome: 'Vestido de festa', idades: ['adulta'], piada: 'De graça. Sem 12x sem juros, sem juros nenhum.' },
  { id: 'terno', nome: 'Terno', idades: ['adulta'], piada: 'Grátis. A gravata aperta, mas não cobra.' },
  { id: 'cropped_e_calca_cargo', nome: 'Cropped e calça cargo', idades: ['adolescente', 'adulta'], piada: 'Zero. Os bolsos cabem mais coisa que a sua carteira.' },
  { id: 'camiseta_evento_ctf', nome: 'Camiseta de evento CTF', idades: ['adolescente', 'adulta'], piada: 'Brinde de evento. Conquistada na fila do coffee break.' },
  { id: 'roupa_academia', nome: 'Roupa de academia', idades: ['adolescente', 'adulta'], piada: 'Grátis. A mensalidade da academia, infelizmente, não.' },
  { id: 'avental', nome: 'Avental de comerciante', idades: ['adulta'], piada: 'De graça. Fiado, mas de graça.' },
  { id: 'uniforme_prefeitura', nome: 'Uniforme da prefeitura', idades: ['adulta'], piada: 'Grátis. Licitação dispensada, juramos.' },
  { id: 'camisa_polo', nome: 'Camisa polo', idades: ['adolescente', 'adulta'], piada: 'Sem custo. Gola levantada é opcional e será julgada.' },
  { id: 'roupa_igreja', nome: 'Roupa de domingo', idades: ['crianca', 'adolescente', 'adulta'], piada: 'De graça. O dízimo é com o pastor, não com a gente.' },
  { id: 'farda_policia', nome: 'Farda de polícia', idades: ['adulta'], piada: 'Não está à venda. Nem tente pagar com Pix suspeito.' },
  { id: 'vestido_florido_idosa', nome: 'Vestido florido com casaquinho', idades: ['adulta'], piada: 'Grátis. Cheirinho de naftalina incluso.' },
  { id: 'camisa_time_futebol', nome: 'Camisa de time', idades: ['crianca', 'adolescente', 'adulta'], piada: 'De graça. Original do camelô, garantia de 90 minutos.' },
];

export const ACESSORIOS: { id: string; nome: string }[] = [
  { id: 'nenhum', nome: 'Nenhum' },
  { id: 'oculos_redondo', nome: 'Óculos redondo' },
  { id: 'oculos_quadrado', nome: 'Óculos quadrado' },
  { id: 'fone_ouvido', nome: 'Fone de ouvido' },
  { id: 'bone', nome: 'Boné' },
  { id: 'brinco_argola', nome: 'Brinco de argola' },
  { id: 'lenco_cabeca', nome: 'Lenço na cabeça' },
  { id: 'cracha', nome: 'Crachá' },
];

// ---------------------------------------------------------------- cores

function hexRgb(h: string): [number, number, number] {
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const v = parseInt(s, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function misturar(a: string, b: string, t: number): string {
  const x = hexRgb(a);
  const y = hexRgb(b);
  const c = x.map((v, i) => Math.round(v + (y[i] - v) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
const escurecer = (c: string, t: number) => misturar(c, '#1a0e12', t);
const clarear = (c: string, t: number) => misturar(c, '#ffffff', t);

// ---------------------------------------------------------------- geometria basica

type P = { x: number; y: number };
const n = (v: number) => String(Math.round(v * 10) / 10);
const pt = (p: P) => `${n(p.x)},${n(p.y)}`;

/** espelha horizontalmente (x -> 400 - x) os pares "x,y" de um path com comandos absolutos */
function esp(d: string): string {
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_m, x: string, y: string) => `${n(400 - parseFloat(x))},${y}`);
}
function circ(x: number, y: number, r: number): string {
  return `M${n(x - r)},${n(y)} a${n(r)},${n(r)} 0 1,0 ${n(2 * r)},0 a${n(r)},${n(r)} 0 1,0 ${n(-2 * r)},0Z`;
}
function elip(x: number, y: number, rx: number, ry: number): string {
  return `M${n(x - rx)},${n(y)} a${n(rx)},${n(ry)} 0 1,0 ${n(2 * rx)},0 a${n(rx)},${n(ry)} 0 1,0 ${n(-2 * rx)},0Z`;
}

/**
 * Membro afinado (braco, perna, manga) ao longo de uma curva que passa por a, b (em t=0.5) e c.
 * w = larguras em a, b, c. Retorna path fechado com pontas arredondadas.
 */
function membro(a: P, b: P, c: P, w: [number, number, number], t0 = 0, t1 = 1): string {
  const k = { x: 2 * b.x - (a.x + c.x) / 2, y: 2 * b.y - (a.y + c.y) / 2 };
  const N = 22;
  const esq: P[] = [];
  const dir: P[] = [];
  let d0: P = { x: 0, y: 1 };
  let d1: P = { x: 0, y: 1 };
  let wIni = w[0];
  let wFim = w[2];
  for (let i = 0; i <= N; i++) {
    const t = t0 + ((t1 - t0) * i) / N;
    const u = 1 - t;
    const p = { x: u * u * a.x + 2 * u * t * k.x + t * t * c.x, y: u * u * a.y + 2 * u * t * k.y + t * t * c.y };
    let dx = 2 * u * (k.x - a.x) + 2 * t * (c.x - k.x);
    let dy = 2 * u * (k.y - a.y) + 2 * t * (c.y - k.y);
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const wt = t < 0.5 ? w[0] + (w[1] - w[0]) * (t / 0.5) : w[1] + (w[2] - w[1]) * ((t - 0.5) / 0.5);
    esq.push({ x: p.x - (dy * wt) / 2, y: p.y + (dx * wt) / 2 });
    dir.push({ x: p.x + (dy * wt) / 2, y: p.y - (dx * wt) / 2 });
    if (i === 0) {
      d0 = { x: dx, y: dy };
      wIni = wt;
    }
    if (i === N) {
      d1 = { x: dx, y: dy };
      wFim = wt;
    }
  }
  const kf = wFim * 0.62;
  const ki = wIni * 0.62;
  const e0 = esq[0];
  const eN = esq[N];
  const r0 = dir[0];
  const rN = dir[N];
  let d = `M${pt(e0)}`;
  for (let i = 1; i <= N; i++) d += ` L${pt(esq[i])}`;
  d += ` C${pt({ x: eN.x + d1.x * kf, y: eN.y + d1.y * kf })} ${pt({ x: rN.x + d1.x * kf, y: rN.y + d1.y * kf })} ${pt(rN)}`;
  for (let i = N - 1; i >= 0; i--) d += ` L${pt(dir[i])}`;
  d += ` C${pt({ x: r0.x - d0.x * ki, y: r0.y - d0.y * ki })} ${pt({ x: e0.x - d0.x * ki, y: e0.y - d0.y * ki })} ${pt(e0)}Z`;
  return d;
}
/** ponto da curva de membro em t */
function pontoMembro(a: P, b: P, c: P, t: number): P {
  const k = { x: 2 * b.x - (a.x + c.x) / 2, y: 2 * b.y - (a.y + c.y) / 2 };
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * k.x + t * t * c.x, y: u * u * a.y + 2 * u * t * k.y + t * t * c.y };
}

/** desenha varias formas como uma silhueta so: contorno so por fora, emendas internas somem */
function silhueta(ds: string[], fill: string, contorno: string, w = 2, sombra = ''): string {
  const st = ds.map((d) => `<path d="${d}" fill="${contorno}" stroke="${contorno}" stroke-width="${n(w * 2)}" stroke-linejoin="round"/>`).join('');
  const fi = ds.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');
  const sh = sombra ? ds.map((d) => `<path d="${d}" fill="${sombra}"/>`).join('') : '';
  return st + fi + sh;
}
function forma(d: string, fill: string, contorno: string, w = 2, extra = ''): string {
  return `<path d="${d}" fill="${fill}" stroke="${contorno}" stroke-width="${w}" stroke-linejoin="round" ${extra}/>`;
}
function traco(d: string, cor: string, w: number, op = 1, extra = ''): string {
  return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}" ${extra}/>`;
}

// ---------------------------------------------------------------- tipos internos

type Manga = 'nenhuma' | 'curta' | 'media' | 'longa' | 'muito_longa';
type Gola = 'redonda' | 'v' | 'colarinho' | 'polo' | 'alta' | 'capuz';
type Padrao = 'xadrez' | 'chita' | 'floral' | 'listras' | 'jeans';
interface Topo {
  tipo: 'camiseta' | 'regata' | 'top' | 'cropped' | 'vestido' | 'moletom';
  cor: string;
  padrao?: Padrao;
  manga: Manga;
  gola: Gola;
  corGola?: string;
  fim?: number;
  largo?: number;
  saia?: { fim: number; abre: number };
  enfiada?: boolean;
}
interface Baixo {
  tipo: 'calca' | 'short' | 'bermuda' | 'legging' | 'saia' | 'saia_longa' | 'nenhum';
  cor: string;
  padrao?: Padrao;
  cinto?: string;
}
interface Sobre {
  tipo: 'jaqueta' | 'blazer' | 'jaleco' | 'avental' | 'colete' | 'cardiga';
  cor: string;
  padrao?: Padrao;
  manga?: Manga;
}
interface Sapato {
  tipo: 'tenis' | 'sapato' | 'sandalia' | 'salto' | 'bota' | 'chinelo';
  cor: string;
}
interface Espec {
  topo: Topo;
  baixo: Baixo;
  sobre?: Sobre;
  sapato: Sapato;
  detalhes?: string[];
  cabeca?: 'headset' | 'chapeu_palha' | 'quepe';
  m?: Partial<Omit<Espec, 'm'>>;
}

const ESPEC: Record<string, Espec> = {
  uniforme_escola_publica: {
    topo: { tipo: 'camiseta', cor: '#f8f8f5', manga: 'curta', gola: 'redonda', corGola: '#2a5bb8' },
    baixo: { tipo: 'bermuda', cor: '#1f3d7a' },
    sapato: { tipo: 'tenis', cor: '#2a2a2e' },
    detalhes: ['brasao'],
  },
  vestido_chita: {
    topo: { tipo: 'vestido', cor: '#d8352a', padrao: 'chita', manga: 'curta', gola: 'redonda', corGola: '#ffd23f', saia: { fim: 650, abre: 36 } },
    baixo: { tipo: 'nenhum', cor: '#000' },
    sapato: { tipo: 'sandalia', cor: '#f2c14e' },
  },
  camiseta_desenho: {
    topo: { tipo: 'camiseta', cor: '#ffd23f', manga: 'curta', gola: 'redonda', corGola: '#ff7b39' },
    baixo: { tipo: 'short', cor: '#4f7cc9', padrao: 'jeans' },
    sapato: { tipo: 'tenis', cor: '#ff5c8a' },
    detalhes: ['desenho'],
  },
  short_e_regata: {
    topo: { tipo: 'regata', cor: '#2fa596', padrao: 'listras', manga: 'nenhuma', gola: 'redonda' },
    baixo: { tipo: 'short', cor: '#f28c38' },
    sapato: { tipo: 'chinelo', cor: '#2a7de1' },
  },
  moletom_irmao_mais_velho: {
    topo: { tipo: 'moletom', cor: '#8a8f98', manga: 'muito_longa', gola: 'capuz', largo: 12, fim: 615 },
    baixo: { tipo: 'legging', cor: '#2b2d42' },
    sapato: { tipo: 'tenis', cor: '#e63946' },
    detalhes: ['bolso_canguru'],
  },
  moletom_capuz: {
    topo: { tipo: 'moletom', cor: '#6c4ab6', manga: 'longa', gola: 'capuz', largo: 5, fim: 565 },
    baixo: { tipo: 'calca', cor: '#3d5a8a', padrao: 'jeans' },
    sapato: { tipo: 'tenis', cor: '#f1f1f1' },
    detalhes: ['bolso_canguru'],
  },
  camiseta_banda_rock: {
    topo: { tipo: 'camiseta', cor: '#1b1b1f', manga: 'curta', gola: 'redonda' },
    baixo: { tipo: 'calca', cor: '#2f4d7a', padrao: 'jeans' },
    sapato: { tipo: 'bota', cor: '#1a1a1a' },
    detalhes: ['caveira', 'rasgos'],
  },
  uniforme_ensino_medio: {
    topo: { tipo: 'camiseta', cor: '#ffffff', manga: 'curta', gola: 'polo', corGola: '#1d4e89' },
    baixo: { tipo: 'calca', cor: '#1d2f5a' },
    sapato: { tipo: 'tenis', cor: '#1a1a1a' },
    detalhes: ['brasao', 'faixa_lateral'],
  },
  jaqueta_jeans: {
    topo: { tipo: 'camiseta', cor: '#f4f1ea', manga: 'curta', gola: 'redonda' },
    sobre: { tipo: 'jaqueta', cor: '#5b84c4', padrao: 'jeans', manga: 'longa' },
    baixo: { tipo: 'calca', cor: '#2a2a30' },
    sapato: { tipo: 'tenis', cor: '#ffffff' },
  },
  camisa_xadrez_festa_junina: {
    topo: { tipo: 'camiseta', cor: '#c0392b', padrao: 'xadrez', manga: 'longa', gola: 'colarinho' },
    baixo: { tipo: 'calca', cor: '#4a6fa5', padrao: 'jeans' },
    sapato: { tipo: 'bota', cor: '#7a4a24' },
    detalhes: ['remendos'],
    cabeca: 'chapeu_palha',
  },
  vestido_formatura: {
    topo: { tipo: 'regata', cor: '#7fb6e8', manga: 'nenhuma', gola: 'v', saia: { fim: 872, abre: 62 } },
    baixo: { tipo: 'nenhum', cor: '#000' },
    sapato: { tipo: 'salto', cor: '#d9d9e6' },
    detalhes: ['faixa_cintura', 'brilhos'],
    m: { topo: { tipo: 'camiseta', cor: '#ffffff', manga: 'longa', gola: 'colarinho', enfiada: true }, sobre: { tipo: 'blazer', cor: '#2b4a7a', manga: 'longa' }, baixo: { tipo: 'calca', cor: '#1d1f24', cinto: '#111111' }, sapato: { tipo: 'sapato', cor: '#111111' }, detalhes: ['gravata'] },
  },
  camiseta_preta_hacker: {
    topo: { tipo: 'camiseta', cor: '#18181c', manga: 'curta', gola: 'redonda' },
    baixo: { tipo: 'calca', cor: '#2c3440', padrao: 'jeans' },
    sapato: { tipo: 'tenis', cor: '#2b2b2b' },
    detalhes: ['terminal'],
  },
  blazer_entrevista: {
    topo: { tipo: 'camiseta', cor: '#f5f3ef', manga: 'longa', gola: 'redonda', enfiada: true },
    sobre: { tipo: 'blazer', cor: '#26324d', manga: 'longa' },
    baixo: { tipo: 'calca', cor: '#26324d', cinto: '#1a1a1a' },
    sapato: { tipo: 'sapato', cor: '#1c1c1c' },
  },
  camisa_social: {
    topo: { tipo: 'camiseta', cor: '#bcd4ee', manga: 'longa', gola: 'colarinho', enfiada: true },
    baixo: { tipo: 'calca', cor: '#b89f7a', cinto: '#4a2f1e' },
    sapato: { tipo: 'sapato', cor: '#5a3820' },
    detalhes: ['botoes'],
  },
  headset_call_center: {
    topo: { tipo: 'camiseta', cor: '#7a3fb0', manga: 'curta', gola: 'polo', corGola: '#ffcc33' },
    baixo: { tipo: 'calca', cor: '#22222a' },
    sapato: { tipo: 'tenis', cor: '#333338' },
    detalhes: ['logo_call', 'cracha'],
    cabeca: 'headset',
  },
  jaleco_laboratorio: {
    topo: { tipo: 'camiseta', cor: '#4b7bd1', manga: 'curta', gola: 'v' },
    sobre: { tipo: 'jaleco', cor: '#fafafa', manga: 'longa' },
    baixo: { tipo: 'calca', cor: '#2f3a4f' },
    sapato: { tipo: 'tenis', cor: '#ececec' },
  },
  vestido_festa: {
    topo: { tipo: 'regata', cor: '#c8213a', manga: 'nenhuma', gola: 'v', saia: { fim: 735, abre: 30 } },
    baixo: { tipo: 'nenhum', cor: '#000' },
    sapato: { tipo: 'salto', cor: '#1a1a1a' },
    detalhes: ['brilhos'],
  },
  terno: {
    topo: { tipo: 'camiseta', cor: '#ffffff', manga: 'longa', gola: 'colarinho', enfiada: true },
    sobre: { tipo: 'blazer', cor: '#1d1f24', manga: 'longa' },
    baixo: { tipo: 'calca', cor: '#1d1f24', cinto: '#111111' },
    sapato: { tipo: 'sapato', cor: '#0e0e0e' },
    detalhes: ['gravata'],
  },
  cropped_e_calca_cargo: {
    topo: { tipo: 'cropped', cor: '#ff7eb6', manga: 'curta', gola: 'redonda', fim: 425 },
    baixo: { tipo: 'calca', cor: '#5e6b45', cinto: '#2a2a2a' },
    sapato: { tipo: 'tenis', cor: '#fafafa' },
    detalhes: ['bolsos_cargo'],
  },
  camiseta_evento_ctf: {
    topo: { tipo: 'camiseta', cor: '#ff8a1f', manga: 'curta', gola: 'redonda', corGola: '#1a1a1a' },
    baixo: { tipo: 'calca', cor: '#34507e', padrao: 'jeans' },
    sapato: { tipo: 'tenis', cor: '#1f1f1f' },
    detalhes: ['ctf', 'cracha'],
  },
  roupa_academia: {
    topo: { tipo: 'top', cor: '#00b39b', manga: 'nenhuma', gola: 'redonda', fim: 418 },
    baixo: { tipo: 'legging', cor: '#2a2a3a' },
    sapato: { tipo: 'tenis', cor: '#c6ff3d' },
    detalhes: ['faixa_lateral'],
    m: { topo: { tipo: 'regata', cor: '#00b39b', manga: 'nenhuma', gola: 'redonda' }, baixo: { tipo: 'bermuda', cor: '#2a2a3a' } },
  },
  avental: {
    topo: { tipo: 'camiseta', cor: '#f2e8d5', manga: 'curta', gola: 'redonda' },
    sobre: { tipo: 'avental', cor: '#2f7d4a' },
    baixo: { tipo: 'calca', cor: '#3a3a44' },
    sapato: { tipo: 'tenis', cor: '#5a5a5a' },
  },
  uniforme_prefeitura: {
    topo: { tipo: 'camiseta', cor: '#2d5fa8', manga: 'curta', gola: 'polo', corGola: '#f5c400' },
    sobre: { tipo: 'colete', cor: '#ff7a00' },
    baixo: { tipo: 'calca', cor: '#283a5c' },
    sapato: { tipo: 'bota', cor: '#2a2a2a' },
  },
  camisa_polo: {
    topo: { tipo: 'camiseta', cor: '#2e8b57', manga: 'curta', gola: 'polo' },
    baixo: { tipo: 'calca', cor: '#c9b28a' },
    sapato: { tipo: 'sapato', cor: '#6b4428' },
  },
  roupa_igreja: {
    topo: { tipo: 'camiseta', cor: '#f3e6f0', padrao: 'floral', manga: 'media', gola: 'redonda', enfiada: true },
    baixo: { tipo: 'saia_longa', cor: '#2c3e66' },
    sapato: { tipo: 'sapato', cor: '#1a1a1a' },
    m: { topo: { tipo: 'camiseta', cor: '#ffffff', manga: 'longa', gola: 'colarinho', enfiada: true }, baixo: { tipo: 'calca', cor: '#2c3e66', cinto: '#1a1a1a' }, detalhes: ['botoes'] },
  },
  farda_policia: {
    topo: { tipo: 'camiseta', cor: '#2b3a55', manga: 'curta', gola: 'colarinho', enfiada: true },
    baixo: { tipo: 'calca', cor: '#1f2a3e', cinto: '#111111' },
    sapato: { tipo: 'bota', cor: '#111111' },
    detalhes: ['distintivo', 'botoes'],
    cabeca: 'quepe',
  },
  vestido_florido_idosa: {
    topo: { tipo: 'vestido', cor: '#b9a0d6', padrao: 'floral', manga: 'media', gola: 'redonda', saia: { fim: 770, abre: 26 } },
    sobre: { tipo: 'cardiga', cor: '#e9dcc4', manga: 'longa' },
    baixo: { tipo: 'nenhum', cor: '#000' },
    sapato: { tipo: 'sapato', cor: '#6b4a3a' },
  },
  camisa_time_futebol: {
    topo: { tipo: 'camiseta', cor: '#ffd400', manga: 'curta', gola: 'v', corGola: '#159947' },
    baixo: { tipo: 'short', cor: '#1d48a8' },
    sapato: { tipo: 'tenis', cor: '#ffffff' },
    detalhes: ['escudo_time'],
  },
};

interface Geo {
  s: number;
  h: number;
  dy: number;
  sw: number;
  peito: number;
  cintura: number;
  quadril: number;
  nh: number;
  braco: [number, number, number];
  perna: [number, number, number];
  mao: number;
  f: boolean;
  crianca: boolean;
  idoso: boolean;
  busto: boolean;
}

interface Ctx {
  id: string;
  v: Visual;
  expr: Expressao;
  espelhar: boolean;
  defs: string[];
  feitos: Set<string>;
  g: Geo;
  e: Espec;
  pele: string;
  peleSombra: string;
  peleLuz: string;
  contornoPele: string;
  corCab: string;
  corOlho: string;
}

let contador = 0;

// ---------------------------------------------------------------- montagem

function geometria(v: Visual): Geo {
  const corpo = v.corpo ?? (v.idade === 'idoso' ? 'm' : 'f');
  const f = corpo === 'f';
  const id = v.idade;
  const crianca = id === 'crianca';
  const idoso = id === 'idosa' || id === 'idoso';
  let s = 0.97;
  let h = 1.07;
  let dy = 0;
  if (crianca) {
    s = 0.65;
    h = 0.9;
  } else if (id === 'adolescente') {
    s = 0.92;
    h = 1.03;
  } else if (idoso) {
    s = 0.94;
    h = 1.05;
    dy = 6;
  }
  let sw: number;
  let peito: number;
  let cintura: number;
  let quadril: number;
  if (crianca) {
    [sw, peito, cintura, quadril] = f ? [70, 68, 64, 70] : [72, 70, 66, 69];
  } else if (id === 'adolescente') {
    [sw, peito, cintura, quadril] = f ? [74, 74, 58, 77] : [84, 82, 68, 74];
  } else if (idoso) {
    [sw, peito, cintura, quadril] = f ? [76, 82, 72, 88] : [86, 88, 82, 80];
  } else {
    [sw, peito, cintura, quadril] = f ? [78, 80, 62, 84] : [92, 90, 76, 79];
  }
  return {
    s,
    h,
    dy,
    sw,
    peito,
    cintura,
    quadril,
    nh: crianca ? 20 : f ? 17 : 22,
    braco: crianca ? [34, 26, 20] : f ? [30, 22, 16] : [37, 28, 20],
    perna: crianca ? [64, 38, 28] : f ? [78, 31, 21] : [72, 35, 25],
    mao: crianca ? 1.15 : f ? 1 : 1.16,
    f,
    crianca,
    idoso,
    busto: f && !crianca,
  };
}

function especificacao(v: Visual, g: Geo): Espec {
  const base = ESPEC[v.roupa] ?? ESPEC['camiseta_preta_hacker'];
  if (!g.f && base.m) return { ...base, ...base.m };
  return base;
}

function corDoOlho(v: Visual): string {
  const escuros = ['#5a3a22', '#3f2a1c', '#6b4a2a', '#2e1f16', '#4b3322'];
  const claros = ['#4f7a3a', '#3d6f9a', '#7a5a2f', '#5b7f8f'];
  const hsh = (v.pele * 7 + v.corCabelo * 13 + v.cabelo.length * 3) % 11;
  if (v.pele <= 2 && hsh < 4) return claros[hsh % claros.length];
  return escuros[hsh % escuros.length];
}

function novoCtx(v: Visual, expr: Expressao, espelhar: boolean): Ctx {
  const g = geometria(v);
  const pele = TONS_PELE[Math.max(0, Math.min(TONS_PELE.length - 1, Math.round(v.pele) || 0))];
  const corCab = CORES_CABELO[Math.max(0, Math.min(CORES_CABELO.length - 1, Math.round(v.corCabelo) || 0))];
  return {
    id: `pz${++contador}`,
    v,
    expr,
    espelhar,
    defs: [],
    feitos: new Set(),
    g,
    e: especificacao(v, g),
    pele,
    peleSombra: misturar(escurecer(pele, 0.2), '#a03a50', 0.08),
    peleLuz: clarear(pele, 0.16),
    contornoPele: escurecer(pele, 0.45),
    corCab,
    corOlho: corDoOlho(v),
  };
}

/** y da junta da cabeca no mundo */
function juntaY(g: Geo): number {
  return 895 - (895 - 226) * g.s + g.dy;
}
function tfCorpo(g: Geo): string {
  return `translate(200,895) scale(${g.s}) translate(-200,-895)`;
}
function tfCabeca(g: Geo): string {
  return `translate(200,${n(juntaY(g))}) scale(${g.h}) translate(-200,-215)`;
}
function cabecaParaCorpo(g: Geo, p: P): P {
  const wx = 200 + (p.x - 200) * g.h;
  const wy = juntaY(g) + (p.y - 215) * g.h;
  return { x: 200 + (wx - 200) / g.s, y: 895 + (wy - 895) / g.s };
}

function definicoesBase(c: Ctx): void {
  const i = c.id;
  c.defs.push(
    `<linearGradient id="${i}-sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".68" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>`,
    `<linearGradient id="${i}-shv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>`,
    `<radialGradient id="${i}-rosto" cx=".4" cy=".36" r=".72"><stop offset="0" stop-color="${c.peleLuz}"/><stop offset=".55" stop-color="${c.pele}"/><stop offset="1" stop-color="${c.peleSombra}"/></radialGradient>`,
    `<linearGradient id="${i}-pesc" gradientUnits="userSpaceOnUse" x1="0" y1="190" x2="0" y2="280"><stop offset="0" stop-color="${escurecer(c.pele, 0.34)}"/><stop offset=".6" stop-color="${escurecer(c.pele, 0.12)}"/><stop offset="1" stop-color="${c.pele}"/></linearGradient>`,
    `<linearGradient id="${i}-cab" gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="0" y2="420"><stop offset="0" stop-color="${clarear(c.corCab, 0.16)}"/><stop offset=".22" stop-color="${c.corCab}"/><stop offset="1" stop-color="${escurecer(c.corCab, 0.3)}"/></linearGradient>`,
    `<linearGradient id="${i}-branco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3a48" stop-opacity=".35"/><stop offset=".5" stop-color="#6a3a48" stop-opacity="0"/></linearGradient>`,
    `<radialGradient id="${i}-iris" cx=".5" cy=".72" r=".7"><stop offset="0" stop-color="${clarear(c.corOlho, 0.55)}"/><stop offset=".55" stop-color="${c.corOlho}"/><stop offset="1" stop-color="${escurecer(c.corOlho, 0.55)}"/></radialGradient>`,
    `<radialGradient id="${i}-rubor"><stop offset="0" stop-color="#ff5a6e" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a6e" stop-opacity="0"/></radialGradient>`,
  );
}

function padrao(c: Ctx, tipo: Padrao | undefined, cor: string): string {
  if (!tipo) return cor;
  const pid = `${c.id}-pd-${tipo}-${cor.replace('#', '')}`;
  if (!c.feitos.has(pid)) {
    c.feitos.add(pid);
    let corpo = '';
    let tam = 20;
    if (tipo === 'xadrez') {
      tam = 28;
      const esc = escurecer(cor, 0.45);
      corpo = `<rect width="28" height="28" fill="${cor}"/><rect y="9" width="28" height="9" fill="${esc}" opacity=".55"/><rect x="9" width="9" height="28" fill="${esc}" opacity=".55"/><rect y="13" width="28" height="1.6" fill="#fff" opacity=".4"/><rect x="13" width="1.6" height="28" fill="#fff" opacity=".4"/><rect y="24" width="28" height="1" fill="#000" opacity=".25"/>`;
    } else if (tipo === 'chita') {
      tam = 64;
      const flor = (x: number, y: number, r: number, cp: string, cm: string) => {
        let s = '';
        for (let k = 0; k < 6; k++) {
          const a = (k * Math.PI) / 3;
          s += `<circle cx="${n(x + Math.cos(a) * r)}" cy="${n(y + Math.sin(a) * r)}" r="${n(r * 0.75)}" fill="${cp}"/>`;
        }
        return s + `<circle cx="${x}" cy="${y}" r="${n(r * 0.6)}" fill="${cm}"/><circle cx="${x}" cy="${y}" r="${n(r * 0.25)}" fill="#fff" opacity=".7"/>`;
      };
      corpo =
        `<rect width="64" height="64" fill="${cor}"/>` +
        `<ellipse cx="34" cy="14" rx="8" ry="3.5" fill="#2f9e44" transform="rotate(-30 34 14)"/><ellipse cx="6" cy="40" rx="8" ry="3.5" fill="#2f9e44" transform="rotate(40 6 40)"/><ellipse cx="44" cy="58" rx="7" ry="3" fill="#2f9e44" transform="rotate(20 44 58)"/>` +
        flor(18, 20, 8, '#ffd23f', '#2a6fdb') +
        flor(50, 44, 6, '#ffffff', '#e94f37') +
        `<circle cx="52" cy="12" r="2.2" fill="#fff"/><circle cx="26" cy="54" r="2" fill="#ffd23f"/><circle cx="8" cy="6" r="1.8" fill="#fff"/>`;
    } else if (tipo === 'floral') {
      tam = 30;
      const pf = clarear(cor, 0.75);
      corpo =
        `<rect width="30" height="30" fill="${cor}"/>` +
        [0, 72, 144, 216, 288].map((a) => `<circle cx="${n(9 + Math.cos((a * Math.PI) / 180) * 3.2)}" cy="${n(9 + Math.sin((a * Math.PI) / 180) * 3.2)}" r="2.4" fill="${pf}"/>`).join('') +
        `<circle cx="9" cy="9" r="1.8" fill="#f2c14e"/><ellipse cx="23" cy="22" rx="3.6" ry="1.6" fill="${escurecer(cor, 0.25)}" transform="rotate(-35 23 22)"/><circle cx="24" cy="6" r="1.3" fill="${pf}"/><circle cx="5" cy="25" r="1.3" fill="${pf}"/>`;
    } else if (tipo === 'listras') {
      tam = 18;
      corpo = `<rect width="18" height="18" fill="${cor}"/><rect y="9" width="18" height="9" fill="${clarear(cor, 0.78)}"/>`;
    } else if (tipo === 'jeans') {
      tam = 6;
      corpo = `<rect width="6" height="6" fill="${cor}"/><path d="M0,6 L6,0" stroke="${clarear(cor, 0.3)}" stroke-width=".8" opacity=".5"/>`;
    }
    c.defs.push(`<pattern id="${pid}" width="${tam}" height="${tam}" patternUnits="userSpaceOnUse">${corpo}</pattern>`);
  }
  return `url(#${pid})`;
}

function texto(c: Ctx, x: number, y: number, s: string, attrs: string): string {
  const t = `<text x="${x}" y="${y}" ${attrs}>${s}</text>`;
  return c.espelhar ? `<g transform="translate(${2 * x},0) scale(-1,1)">${t}</g>` : t;
}

// ---------------------------------------------------------------- corpo

function meiaLargura(g: Geo, y: number): number {
  const k: [number, number][] = [
    [280, g.sw - 10],
    [300, g.sw],
    [345, g.peito],
    [440, g.cintura],
    [525, g.quadril],
    [575, g.quadril - 4],
    [720, g.quadril + 6],
    [900, g.quadril + 14],
  ];
  if (y <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [y0, a] = k[i];
    const [y1, b] = k[i + 1];
    if (y <= y1) {
      const t = (y - y0) / (y1 - y0);
      const s = (1 - Math.cos(Math.PI * t)) / 2;
      return a + (b - a) * s;
    }
  }
  return k[k.length - 1][1];
}

/** contorno do tronco; base 'pelve' fecha em curva entre as pernas, 'reto' faz barra */
function contornoTronco(g: Geo, ex: number, yFim: number, base: 'pelve' | 'reto', yIni = 300): string {
  const lados: P[] = [];
  for (let y = yIni; y < yFim; y += 6) lados.push({ x: 200 - meiaLargura(g, y) - ex, y });
  lados.push({ x: 200 - meiaLargura(g, yFim) - ex, y: yFim });
  const neck = { x: 200 - g.nh - ex * 0.4, y: 257 - ex };
  const c1 = { x: 200 - g.nh - 16 - ex, y: 266 - ex };
  const c2 = { x: 200 - g.sw + 12 - ex, y: 268 - ex };
  let d = `M${pt(neck)} C${pt(c1)} ${pt(c2)} ${pt(lados[0])}`;
  for (let i = 1; i < lados.length; i++) d += ` L${pt(lados[i])}`;
  const ult = lados[lados.length - 1];
  const ultR = { x: 400 - ult.x, y: ult.y };
  if (base === 'pelve') {
    d += ` C${n(ult.x + 4)},${n(yFim + 22)} ${n(200 - g.quadril * 0.42)},${n(yFim + 34)} 200,${n(yFim + 36)} C${n(200 + g.quadril * 0.42)},${n(yFim + 34)} ${n(ultR.x - 4)},${n(yFim + 22)} ${pt(ultR)}`;
  } else {
    d += ` Q200,${n(yFim + 7)} ${pt(ultR)}`;
  }
  for (let i = lados.length - 2; i >= 0; i--) d += ` L${pt({ x: 400 - lados[i].x, y: lados[i].y })}`;
  d += ` C${pt({ x: 400 - c2.x, y: c2.y })} ${pt({ x: 400 - c1.x, y: c1.y })} ${pt({ x: 400 - neck.x, y: neck.y })}Z`;
  return d;
}

/** regata/top: alcas e cava; decote embutido */
function contornoRegata(g: Geo, ex: number, yFim: number, decote: number): string {
  const lados: P[] = [];
  for (let y = 336; y < yFim; y += 6) lados.push({ x: 200 - meiaLargura(g, y) - ex, y });
  lados.push({ x: 200 - meiaLargura(g, yFim) - ex, y: yFim });
  const alcaFora = { x: 200 - g.nh - 18, y: 262 };
  const alcaDentro = { x: 200 - g.nh - 5, y: 259 };
  let d = `M${pt(alcaDentro)} L${pt(alcaFora)} C${n(200 - g.nh - 20)},${n(296)} ${n(200 - g.sw + 6)},${n(316)} ${pt(lados[0])}`;
  for (let i = 1; i < lados.length; i++) d += ` L${pt(lados[i])}`;
  const ult = lados[lados.length - 1];
  d += ` Q200,${n(yFim + 7)} ${n(400 - ult.x)},${n(ult.y)}`;
  for (let i = lados.length - 2; i >= 0; i--) d += ` L${n(400 - lados[i].x)},${n(lados[i].y)}`;
  d += ` C${n(200 + g.sw - 6)},316 ${n(200 + g.nh + 20)},296 ${n(400 - alcaFora.x)},${n(alcaFora.y)} L${n(400 - alcaDentro.x)},${n(alcaDentro.y)}`;
  d += ` Q200,${n(decote)} ${pt(alcaDentro)}Z`;
  return d;
}

function contornoSaia(g: Geo, yTop: number, yHem: number, abre: number): string {
  const top = meiaLargura(g, yTop) + 3;
  const q = g.quadril + 7;
  const l = `M${n(200 - top)},${yTop} C${n(200 - q - 2)},${n(yTop + 40)} ${n(200 - q - abre * 0.5)},${n(yTop + (yHem - yTop) * 0.5)} ${n(200 - q - abre)},${yHem}`;
  const r = `C${n(200 + q + abre * 0.5)},${n(yTop + (yHem - yTop) * 0.5)} ${n(200 + q + 2)},${n(yTop + 40)} ${n(200 + top)},${yTop}`;
  return `${l} Q200,${n(yHem + 14)} ${n(200 + q + abre)},${yHem} ${r}Z`;
}

interface Perna {
  q: P;
  j: P;
  t: P;
  lado: number;
}
function pernas(g: Geo): Perna[] {
  return [-1, 1].map((l) => ({
    lado: l,
    q: { x: 200 + l * g.quadril * 0.5, y: 522 },
    j: { x: 200 + l * g.quadril * 0.36, y: 706 },
    t: { x: 200 + l * g.quadril * 0.34, y: 862 },
  }));
}

interface Braco {
  lado: number;
  a: P;
  b: P;
  c: P;
  punho?: boolean;
}
function poseBracos(g: Geo, expr: Expressao): Braco[] {
  const caido = (expr === 'triste' ? 5 : 0) + (g.idoso ? 4 : 0);
  const A = (l: number): P => ({ x: 200 + l * (g.sw - 13), y: 302 + caido });
  const solto = (l: number, abre = 0): Braco => ({
    lado: l,
    a: A(l),
    b: { x: 200 + l * (g.sw + 6 + abre * 0.5), y: 418 + caido },
    c: { x: 200 + l * (Math.max(g.sw + 2, g.quadril + 8) + abre), y: 532 + caido },
  });
  const cintura = (l: number): Braco => ({
    lado: l,
    a: A(l),
    b: { x: 200 + l * (g.sw + 40), y: 408 },
    c: { x: 200 + l * (g.cintura + 14), y: 466 },
  });
  switch (expr) {
    case 'feliz':
      return [cintura(-1), solto(1, 6)];
    case 'triste':
      return [solto(-1, -6), solto(1, -6)];
    case 'brava':
      return [cintura(-1), cintura(1)];
    case 'surpresa':
      return [-1, 1].map((l) => ({ lado: l, a: A(l), b: { x: 200 + l * (g.sw + 30), y: 402 }, c: { x: 200 + l * (g.sw + 22), y: 322 } }));
    case 'assustada':
      return [-1, 1].map((l) => ({ lado: l, a: A(l), b: { x: 200 + l * (g.sw + 6), y: 408 }, c: { x: 200 + l * 20, y: 338 }, punho: true }));
    case 'envergonhada':
      return [-1, 1].map((l) => ({ lado: l, a: A(l), b: { x: 200 + l * (g.sw - 2), y: 428 }, c: { x: 200 + l * 9, y: 540 } }));
    case 'pensativa': {
      const queixo = cabecaParaCorpo(g, { x: 206, y: 224 });
      return [
        { lado: 1, a: A(1), b: { x: 200 + g.sw + 4, y: 402 }, c: { x: 200 - 34, y: 398 } },
        { lado: -1, a: A(-1), b: { x: 200 - 30, y: 392 }, c: queixo, punho: true },
      ];
    }
    default:
      return [solto(-1), solto(1)];
  }
}


function sapatos(c: Ctx): string {
  const s = c.e.sapato;
  const cor = s.cor;
  const k = escurecer(cor, 0.5);
  let out = '';
  for (const p of pernas(c.g)) {
    const x = p.t.x + p.lado * 3;
    const l = p.lado;
    const pe = `M${n(x - 13)},846 C${n(x - 15)},862 ${n(x - 22 + l * 2)},874 ${n(x - 22 + l * 2)},884 Q${n(x + l * 3)},895 ${n(x + 22 + l * 2)},884 C${n(x + 22 + l * 2)},874 ${n(x + 15)},862 ${n(x + 13)},846Z`;
    if (s.tipo === 'chinelo' || s.tipo === 'sandalia') {
      out += forma(pe, c.pele, c.contornoPele, 1.6);
      out += `<path d="${pe}" fill="url(#${c.id}-sh)"/>`;
      out += forma(`M${n(x - 25 + l * 2)},886 Q${n(x + l * 3)},898 ${n(x + 25 + l * 2)},886 L${n(x + 24 + l * 2)},891 Q${n(x + l * 3)},899 ${n(x - 24 + l * 2)},891Z`, cor, k, 1.2);
      if (s.tipo === 'chinelo') out += traco(`M${n(x - 16)},872 L${n(x + l * 2)},880 L${n(x + 16)},872`, cor, 4.5);
      else out += traco(`M${n(x - 15)},864 L${n(x + 15)},864 M${n(x - 18)},876 L${n(x + 18)},876`, cor, 4);
      out += traco(`M${n(x - 10 + l * 4)},885 l0,3 M${n(x - 3 + l * 4)},887 l0,3 M${n(x + 4 + l * 4)},887 l0,3`, c.contornoPele, 1, 0.5);
    } else if (s.tipo === 'salto') {
      out += forma(`M${n(x - 11)},846 L${n(x + 11)},846 L${n(x + 13)},868 L${n(x - 13)},868Z`, c.pele, c.contornoPele, 1.5);
      out += forma(`M${n(x - 15)},866 C${n(x - 18)},874 ${n(x - 16 + l * 2)},886 ${n(x + l * 4)},892 C${n(x + 16 + l * 2)},886 ${n(x + 18)},874 ${n(x + 15)},866 Q${n(x)},872 ${n(x - 15)},866Z`, cor, k, 1.5);
      out += traco(`M${n(x - 11)},852 Q${n(x)},856 ${n(x + 11)},852`, cor, 2.4);
      out += traco(`M${n(x - 6)},874 q4,-2 9,0`, '#fff', 1.6, 0.5);
    } else {
      if (s.tipo === 'bota') {
        out += forma(`M${n(x - 17)},790 L${n(x + 17)},790 L${n(x + 16)},852 L${n(x - 16)},852Z`, cor, k, 1.6);
        out += traco(`M${n(x - 7)},800 L${n(x + 7)},810 M${n(x + 7)},800 L${n(x - 7)},810 M${n(x - 7)},816 L${n(x + 7)},826 M${n(x + 7)},816 L${n(x - 7)},826 M${n(x - 7)},832 L${n(x + 7)},842 M${n(x + 7)},832 L${n(x - 7)},842`, clarear(cor, 0.4), 1.4, 0.8);
      }
      out += forma(pe, cor, k, 1.8);
      out += `<path d="${pe}" fill="url(#${c.id}-sh)"/>`;
      if (s.tipo === 'tenis') {
        out += forma(`M${n(x - 23 + l * 2)},880 Q${n(x + l * 3)},888 ${n(x + 23 + l * 2)},880 L${n(x + 23 + l * 2)},886 Q${n(x + l * 3)},896 ${n(x - 23 + l * 2)},886Z`, '#f4f4f2', '#9a9a9a', 1.2);
        out += traco(`M${n(x - 7)},854 L${n(x + 7)},854 M${n(x - 8)},861 L${n(x + 8)},861 M${n(x - 9)},868 L${n(x + 9)},868`, clarear(cor, 0.7), 1.6, 0.9);
      } else {
        out += `<ellipse cx="${n(x - 6 + l * 4)}" cy="878" rx="6" ry="3" fill="#fff" opacity=".35"/>`;
      }
    }
  }
  return out;
}

function pele(c: Ctx): string {
  const g = c.g;
  const ds: string[] = [];
  for (const p of pernas(g)) ds.push(membro(p.q, p.j, p.t, g.perna));
  const pesc = `M${200 - g.nh},185 L${200 + g.nh},185 L${200 + g.nh + 2},275 L${200 - g.nh - 2},275Z`;
  const tronco = contornoTronco(g, 0, 568, 'pelve');
  let out = silhueta([...ds, tronco], c.pele, c.contornoPele, 1.6);
  out += ds.map((d) => `<path d="${d}" fill="url(#${c.id}-sh)"/>`).join('');
  out += `<path d="${tronco}" fill="url(#${c.id}-sh)"/>`;
  out += `<path d="${pesc}" fill="url(#${c.id}-pesc)"/>`;
  // clavicula e joelho, bem discretos
  out += traco(`M${200 - g.nh - 4},282 Q${200 - 34},286 ${200 - g.sw + 18},284 M${200 + g.nh + 4},282 Q${200 + 34},286 ${200 + g.sw - 18},284`, c.peleSombra, 1.6, 0.55);
  for (const p of pernas(g)) out += traco(`M${n(p.j.x - 8)},${p.j.y + 6} Q${n(p.j.x)},${p.j.y + 11} ${n(p.j.x + 8)},${p.j.y + 6}`, c.peleSombra, 1.6, 0.6);
  // umbigo (aparece com cropped)
  out += `<ellipse cx="200" cy="468" rx="2" ry="3.2" fill="${c.peleSombra}" opacity=".7"/>`;
  return out;
}

function parteDeBaixo(c: Ctx): string {
  const g = c.g;
  const b = c.e.baixo;
  if (b.tipo === 'nenhum') return '';
  const cor = b.cor;
  const fill = padrao(c, b.padrao, cor);
  const k = escurecer(cor, 0.5);
  let out = '';
  if (b.tipo === 'saia' || b.tipo === 'saia_longa') {
    const d = contornoSaia(g, 446, b.tipo === 'saia' ? 650 : 845, b.tipo === 'saia' ? 26 : 34);
    out += silhueta([d], fill, k, 1.2, `url(#${c.id}-sh)`);
    out += traco(`M185,520 Q178,650 170,840 M215,520 Q222,650 230,840 M150,600 Q140,700 128,835 M250,600 Q260,700 272,835`, k, 1.6, 0.25);
  } else {
    const lim = b.tipo === 'short' ? 0.3 : b.tipo === 'bermuda' ? 0.5 : 1;
    const folga = b.tipo === 'legging' ? 2 : b.tipo === 'calca' ? 9 : 14;
    const blocoTopo = meiaLargura(g, 448) + 2;
    const bloco = `M${n(200 - blocoTopo)},448 L${n(200 + blocoTopo)},448 L${n(200 + blocoTopo)},452 L${n(200 - blocoTopo)},452Z`;
    const lados: P[] = [];
    for (let y = 448; y <= 574; y += 6) lados.push({ x: 200 - meiaLargura(g, y) - 2.5, y });
    let hip = `M${pt(lados[0])}`;
    for (let i = 1; i < lados.length; i++) hip += ` L${pt(lados[i])}`;
    const u = lados[lados.length - 1];
    hip += ` C${n(u.x + 4)},594 ${n(200 - g.quadril * 0.4)},606 200,608 C${n(200 + g.quadril * 0.4)},606 ${n(400 - u.x - 4)},594 ${n(400 - u.x)},${n(u.y)}`;
    for (let i = lados.length - 2; i >= 0; i--) hip += ` L${n(400 - lados[i].x)},${n(lados[i].y)}`;
    hip += 'Z';
    const pecas = [hip, bloco];
    for (const p of pernas(g)) {
      const w: [number, number, number] = [g.perna[0] + folga, g.perna[1] + folga, g.perna[2] + folga * (b.tipo === 'calca' ? 1.4 : 1)];
      pecas.push(membro(p.q, p.j, { x: p.t.x, y: p.t.y - 4 }, w, 0, lim));
    }
    out += silhueta(pecas, fill, k, 1.1, `url(#${c.id}-sh)`);
    // cos e braguilha
    out += traco(`M${n(200 - blocoTopo)},462 Q200,466 ${n(200 + blocoTopo)},462`, k, 1.4, 0.5);
    if (b.tipo !== 'legging') out += traco(`M203,466 Q205,520 200,560`, k, 1.4, 0.45);
    for (const p of pernas(g)) {
      if (b.padrao === 'jeans') {
        const fim = pontoMembro(p.q, p.j, p.t, lim * 0.97);
        out += traco(`M${n(p.q.x + p.lado * 22)},540 Q${n(p.j.x + p.lado * 19)},${p.j.y} ${n(fim.x + p.lado * 14)},${n(fim.y)}`, '#e0a24a', 1.1, 0.7, 'stroke-dasharray="3 3"');
      }
      // dobra no joelho e na barra
      if (lim === 1) out += traco(`M${n(p.j.x - 12)},${p.j.y - 4} Q${n(p.j.x)},${p.j.y + 4} ${n(p.j.x + 10)},${p.j.y - 2}`, k, 1.4, 0.35);
    }
    if (b.cinto) {
      const lw = meiaLargura(g, 458) + 3;
      out += forma(`M${n(200 - lw)},452 Q200,457 ${n(200 + lw)},452 L${n(200 + lw)},464 Q200,469 ${n(200 - lw)},464Z`, b.cinto, escurecer(b.cinto, 0.5), 1.2);
      out += `<rect x="192" y="452" width="16" height="13" rx="2" fill="none" stroke="#d8c27a" stroke-width="2.2"/>`;
    }
  }
  return out;
}

function decote(c: Ctx, tipo: Gola, cor: string, trim?: string): string {
  const g = c.g;
  const sk = `url(#${c.id}-pesc)`;
  const k = escurecer(cor, 0.5);
  const tr = trim ?? escurecer(cor, 0.15);
  const L = 200 - g.nh - 3;
  const R = 200 + g.nh + 3;
  if (tipo === 'redonda') {
    return `<path d="M${L},250 L${R},250 L${R},258 Q200,${292} ${L},258Z" fill="${sk}"/>` + traco(`M${L},258 Q200,292 ${R},258`, tr, 4.5) + traco(`M${L},258 Q200,292 ${R},258`, k, 1, 0.6);
  }
  if (tipo === 'v') {
    return `<path d="M${L},250 L${R},250 L${R},258 L200,312 L${L},258Z" fill="${sk}"/>` + traco(`M${L},258 L200,312 L${R},258`, tr, 4.5) + traco(`M${L},258 L200,312 L${R},258`, k, 1, 0.6);
  }
  if (tipo === 'alta') {
    return forma(`M${L},236 L${R},236 L${R + 2},266 Q200,272 ${L - 2},266Z`, cor, k, 1.4);
  }
  if (tipo === 'colarinho' || tipo === 'polo') {
    const fundo = tipo === 'polo' ? 300 : 296;
    const gola = clarear(cor, 0.05);
    const gc = trim ?? gola;
    let s = `<path d="M${L},250 L${R},250 L${R},258 L200,${fundo} L${L},258Z" fill="${sk}"/>`;
    s += forma(`M${L - 2},252 L${L + 2},246 L200,${fundo - 2} L${n(200 - 30)},${fundo + 4}Z`, gc, k, 1.4);
    s += forma(esp(`M${L - 2},252 L${L + 2},246 L200,${fundo - 2} L${n(200 - 30)},${fundo + 4}Z`), gc, k, 1.4);
    s += `<path d="M${L - 1},256 L200,${fundo} L${n(200 - 28)},${fundo + 2}Z" fill="#000" opacity=".1"/>`;
    if (tipo === 'polo') s += traco(`M200,${fundo} L200,338`, k, 1.2, 0.6) + `<circle cx="203" cy="312" r="2" fill="${k}" opacity=".7"/><circle cx="203" cy="328" r="2" fill="${k}" opacity=".7"/>`;
    return s;
  }
  // capuz: gola dobrada atras do pescoco
  const dc = escurecer(cor, 0.12);
  let s = `<path d="M${L},250 L${R},250 L${R},258 Q200,296 ${L},258Z" fill="${sk}"/>`;
  s += forma(`M${n(200 - g.nh - 30)},266 Q${n(200 - g.nh - 18)},300 200,308 Q${n(200 - 24)},292 ${n(200 - g.nh - 3)},258 Q${n(200 - g.nh - 20)},252 ${n(200 - g.nh - 30)},266Z`, dc, k, 1.4);
  s += forma(esp(`M${n(200 - g.nh - 30)},266 Q${n(200 - g.nh - 18)},300 200,308 Q${n(200 - 24)},292 ${n(200 - g.nh - 3)},258 Q${n(200 - g.nh - 20)},252 ${n(200 - g.nh - 30)},266Z`), dc, k, 1.4);
  s += traco('M192,304 Q190,340 193,370 M208,304 Q210,340 207,370', '#f4f4f4', 2.2);
  s += `<rect x="190" y="368" width="5" height="9" rx="1.5" fill="#bbb"/><rect x="205" y="368" width="5" height="9" rx="1.5" fill="#bbb"/>`;
  return s;
}

function parteDeCima(c: Ctx): string {
  const g = c.g;
  const t = c.e.topo;
  const cor = t.cor;
  const fill = padrao(c, t.padrao, cor);
  const k = escurecer(cor, 0.5);
  const ex = 3 + (t.largo ?? 0);
  let fim = t.fim ?? (t.enfiada ? 470 : t.tipo === 'moletom' ? 565 : 546);
  if (t.saia) fim = 452;
  const pecas: string[] = [];
  if (t.tipo === 'regata' || t.tipo === 'top') {
    pecas.push(contornoRegata(g, ex, t.tipo === 'top' ? (t.fim ?? 418) : fim, t.gola === 'v' ? 318 : t.tipo === 'top' ? 292 : 300));
  } else {
    pecas.push(contornoTronco(g, ex, fim, 'reto'));
  }
  if (t.saia) pecas.push(contornoSaia(g, 446, t.saia.fim, t.saia.abre));
  let out = silhueta(pecas, fill, k, 1.1, `url(#${c.id}-sh)`);
  if (t.saia) out += traco(`M182,${470} Q172,${n(600)} 166,${t.saia.fim - 6} M218,470 Q228,600 234,${t.saia.fim - 6} M200,480 L200,${t.saia.fim + 4}`, k, 1.6, 0.22);
  // busto e dobras laterais
  if (g.busto && t.tipo !== 'moletom') out += traco(`M${200 - 50},356 Q${200 - 28},372 ${200 - 8},358 M${200 + 50},356 Q${200 + 28},372 ${200 + 8},358`, '#000', 1.8, 0.16);
  out += traco(`M${n(200 - g.peito + 6)},${330} Q${n(200 - g.cintura)},${400} ${n(200 - g.cintura + 8)},430`, '#000', 1.6, 0.12);
  if (t.tipo === 'moletom') {
    out += forma(`M${n(200 - meiaLargura(g, fim - 14) - ex)},${fim - 14} Q200,${fim - 7} ${n(200 + meiaLargura(g, fim - 14) + ex)},${fim - 14} L${n(200 + meiaLargura(g, fim) + ex)},${fim} Q200,${fim + 7} ${n(200 - meiaLargura(g, fim) - ex)},${fim}Z`, escurecer(cor, 0.12), k, 1.2);
  }
  if (t.tipo === 'cropped' || t.tipo === 'top') out += traco(`M${n(200 - meiaLargura(g, (t.fim ?? 418) - 6) - ex)},${(t.fim ?? 418) - 5} Q200,${(t.fim ?? 418) + 1} ${n(200 + meiaLargura(g, (t.fim ?? 418) - 6) + ex)},${(t.fim ?? 418) - 5}`, escurecer(cor, 0.2), 3, 0.6);
  if (t.tipo !== 'regata' && t.tipo !== 'top') out += decote(c, t.gola, cor, t.corGola);
  else if (t.gola !== 'v' || t.saia) out += traco(`M${200 - g.nh - 5},259 Q200,${t.gola === 'v' ? 318 : t.tipo === 'top' ? 292 : 300} ${200 + g.nh + 5},259`, escurecer(cor, 0.25), 2, 0.6);
  return out;
}

function sobreposicao(c: Ctx): string {
  const s = c.e.sobre;
  if (!s) return '';
  const g = c.g;
  const cor = s.cor;
  const fill = padrao(c, s.padrao, cor);
  const k = escurecer(cor, 0.5);
  const sh = `url(#${c.id}-sh)`;
  if (s.tipo === 'avental') {
    const d = `M${200 - 46},338 L${200 + 46},338 Q${200 + 50},420 ${200 + g.cintura + 6},452 L${200 + g.quadril + 2},${690} Q200,700 ${200 - g.quadril - 2},690 L${200 - g.cintura - 6},452 Q${200 - 50},420 ${200 - 46},338Z`;
    let out = traco(`M${200 - 40},340 L${200 - g.nh - 1},262 M${200 + 40},340 L${200 + g.nh + 1},262`, cor, 6);
    out += silhueta([d], fill, k, 1.1, sh);
    out += forma(`M${200 - 34},520 L${200 + 34},520 L${200 + 32},580 L${200 - 32},580Z`, escurecer(cor, 0.1), k, 1.2);
    out += traco('M200,520 L200,580', k, 1.2, 0.6);
    out += traco(`M${n(200 - g.cintura - 6)},452 L${n(200 - g.cintura - 26)},470 M${n(200 + g.cintura + 6)},452 L${n(200 + g.cintura + 26)},472`, cor, 5);
    out += texto(c, 200, 410, 'FIADO SÓ AMANHÃ', `text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="${clarear(cor, 0.75)}"`);
    return out;
  }
  if (s.tipo === 'colete') {
    const lado = (l: number) => {
      const xs: P[] = [];
      for (let y = 330; y <= 548; y += 8) xs.push({ x: 200 + l * (meiaLargura(g, y) + 6), y });
      let d = `M${200 + l * (g.nh + 4)},262 L${200 + l * (g.nh + 18)},264 C${200 + l * (g.nh + 22)},298 ${200 + l * (g.sw - 4)},318 ${pt(xs[0])}`;
      for (const p of xs.slice(1)) d += ` L${pt(p)}`;
      d += ` L${200 + l * 6},552 L${200 + l * 6},340 Z`;
      return d;
    };
    let out = silhueta([lado(-1), lado(1)], cor, k, 1.1, sh);
    for (const y of [420, 470]) {
      out += `<rect x="${n(200 - meiaLargura(g, y) - 5)}" y="${y}" width="${n(meiaLargura(g, y) - 2)}" height="10" fill="#e8eef2"/><rect x="206" y="${y}" width="${n(meiaLargura(g, y) - 1)}" height="10" fill="#e8eef2"/>`;
    }
    return out;
  }
  const hem = s.tipo === 'jaleco' ? 712 : s.tipo === 'cardiga' ? 560 : s.tipo === 'jaqueta' ? 538 : 572;
  const ab = s.tipo === 'jaqueta' ? 16 : s.tipo === 'cardiga' ? 10 : 6;
  const vFundo = s.tipo === 'blazer' ? 420 : s.tipo === 'jaleco' ? 400 : 330;
  const painel = (l: number) => {
    const ex = 7;
    const xs: P[] = [];
    for (let y = 300; y < hem; y += 7) xs.push({ x: 200 + l * (meiaLargura(g, y) + ex + (s.tipo === 'jaleco' && y > 560 ? (y - 560) * 0.08 : 0)), y });
    xs.push({ x: 200 + l * (meiaLargura(g, hem) + ex + (s.tipo === 'jaleco' ? (hem - 560) * 0.08 : 0)), y: hem });
    let d = `M${n(200 + l * (g.nh - 2))},253 C${n(200 + l * (g.nh + 16))},262 ${n(200 + l * (g.sw - 10))},264 ${pt(xs[0])}`;
    for (const p of xs.slice(1)) d += ` L${pt(p)}`;
    d += ` L${n(200 + l * ab)},${hem} L${n(200 + l * ab)},${vFundo} Z`;
    return d;
  };
  let out = silhueta([painel(-1), painel(1)], fill, k, 1.1, sh);
  // lapela
  for (const l of [-1, 1]) {
    const lap = `M${n(200 + l * (g.nh + 1))},256 L${n(200 + l * ab)},${vFundo} L${n(200 + l * (ab + 26))},${n(vFundo - 70)} L${n(200 + l * (g.nh + 26))},${s.tipo === 'jaqueta' ? 300 : 290}Z`;
    if (s.tipo !== 'cardiga') out += forma(lap, escurecer(cor, 0.12), k, 1.3);
    out += traco(`M${n(200 + l * ab)},${vFundo} L${n(200 + l * ab)},${hem}`, k, 1.4, 0.7);
  }
  if (s.tipo === 'blazer') {
    out += `<circle cx="${200 - ab - 8}" cy="${vFundo + 26}" r="3.6" fill="${escurecer(cor, 0.3)}" stroke="${k}"/>`;
    out += traco(`M${200 - 60},500 L${200 - 26},500 M${200 + 26},500 L${200 + 60},500 M${200 + 34},346 L${200 + 54},346`, k, 1.6, 0.6);
  }
  if (s.tipo === 'jaleco') {
    out += forma(`M${200 + 30},344 L${200 + 58},344 L${200 + 57},376 L${200 + 31},376Z`, cor, k, 1.2);
    out += traco(`M${200 + 38},336 L${200 + 38},360`, '#2a62c9', 2.6);
    out += forma(`M${200 - 70},540 L${200 - 28},540 L${200 - 29},590 L${200 - 69},590Z`, cor, k, 1.2);
    out += forma(`M${200 + 28},540 L${200 + 70},540 L${200 + 69},590 L${200 + 29},590Z`, cor, k, 1.2);
    for (const y of [430, 480, 530, 580, 630]) out += `<circle cx="${200 + ab + 6}" cy="${y}" r="2.6" fill="#ddd" stroke="#aaa"/>`;
  }
  if (s.tipo === 'jaqueta') {
    for (const l of [-1, 1]) {
      out += forma(`M${200 + l * 30},350 L${200 + l * 62},350 L${200 + l * 61},380 L${200 + l * 31},380Z`, fill, k, 1.2);
      out += traco(`M${200 + l * 30},360 L${200 + l * 62},360`, '#e0a24a', 1, 0.8, 'stroke-dasharray="3 2"');
      out += `<circle cx="${200 + l * 46}" cy="368" r="2.4" fill="#c9a24a"/>`;
    }
    out += forma(`M${n(200 - meiaLargura(g, 524) - 7)},522 L${200 - ab},522 L${200 - ab},${hem} L${n(200 - meiaLargura(g, hem) - 7)},${hem}Z`, escurecer(cor, 0.1), k, 1);
    out += forma(esp(`M${n(200 - meiaLargura(g, 524) - 7)},522 L${200 - ab},522 L${200 - ab},${hem} L${n(200 - meiaLargura(g, hem) - 7)},${hem}Z`), escurecer(cor, 0.1), k, 1);
  }
  if (s.tipo === 'cardiga') for (const y of [350, 400, 450, 500]) out += `<circle cx="${200 - ab - 5}" cy="${y}" r="2.8" fill="${escurecer(cor, 0.35)}"/>`;
  return out;
}

function detalhes(c: Ctx): string {
  const g = c.g;
  const ds = c.e.detalhes ?? [];
  let out = '';
  for (const d of ds) {
    if (d === 'brasao') {
      out += forma('M223,318 L243,318 L243,330 Q243,342 233,347 Q223,342 223,330Z', '#2a5bb8', '#173a7a', 1.2);
      out += `<path d="M233,323 l2.4,5 5.4,.6 -4,3.6 1.2,5.3 -5,-2.8 -5,2.8 1.2,-5.3 -4,-3.6 5.4,-.6Z" fill="#ffd23f"/>`;
    } else if (d === 'desenho') {
      let star = '';
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        const r = k % 2 === 0 ? 34 : 16;
        star += `${k === 0 ? 'M' : 'L'}${n(200 + Math.cos(a) * r)},${n(378 + Math.sin(a) * r)} `;
      }
      out += forma(star + 'Z', '#ff7b39', '#c14d17', 2);
      out += `<circle cx="192" cy="376" r="3.4" fill="#2a1a12"/><circle cx="208" cy="376" r="3.4" fill="#2a1a12"/><circle cx="193" cy="375" r="1.2" fill="#fff"/><circle cx="209" cy="375" r="1.2" fill="#fff"/>`;
      out += traco('M192,386 Q200,393 208,386', '#2a1a12', 2.2);
      out += `<ellipse cx="186" cy="385" rx="3" ry="2" fill="#ff4f7a" opacity=".6"/><ellipse cx="214" cy="385" rx="3" ry="2" fill="#ff4f7a" opacity=".6"/>`;
    } else if (d === 'caveira') {
      out += forma('M200,344 C214,344 224,354 224,368 C224,378 218,383 214,385 L214,394 L186,394 L186,385 C182,383 176,378 176,368 C176,354 186,344 200,344Z', '#ececec', '#999', 1.2);
      out += `<ellipse cx="191" cy="369" rx="6" ry="7" fill="#1b1b1f"/><ellipse cx="209" cy="369" rx="6" ry="7" fill="#1b1b1f"/><path d="M200,377 l-3,6 h6Z" fill="#1b1b1f"/>`;
      out += traco('M192,390 l0,4 M197,390 l0,4 M203,390 l0,4 M208,390 l0,4', '#1b1b1f', 1.4);
      out += `<path d="M160,350 l10,0 -6,14 8,0 -16,22 5,-16 -7,0Z" fill="#ff3d7f"/><path d="M240,350 l-10,0 6,14 -8,0 16,22 -5,-16 7,0Z" fill="#ff3d7f"/>`;
    } else if (d === 'terminal') {
      out += `<rect x="168" y="340" width="64" height="46" rx="6" fill="#0c120e" stroke="#39ff7a" stroke-width="1.8"/>`;
      out += `<circle cx="176" cy="347" r="2" fill="#ff5f57"/><circle cx="183" cy="347" r="2" fill="#febc2e"/><circle cx="190" cy="347" r="2" fill="#28c840"/>`;
      out += traco('M176,360 L184,366 L176,372 M190,374 L204,374', '#39ff7a', 2.6);
    } else if (d === 'ctf') {
      out += traco('M182,334 L182,392', '#1a1a1a', 2.6);
      out += `<path d="M183,336 L220,344 L183,356Z" fill="#1a1a1a"/>`;
      out += texto(c, 200, 414, 'CTF', `text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="20" fill="#1a1a1a"`);
    } else if (d === 'logo_call') {
      out += forma('M222,320 h24 a5,5 0 0 1 5,5 v12 a5,5 0 0 1 -5,5 h-14 l-6,6 v-6 h-4 a5,5 0 0 1 -5,-5 v-12 a5,5 0 0 1 5,-5Z', '#ffcc33', '#a3801a', 1);
      out += traco('M229,336 Q229,326 234,326 Q239,326 239,336', '#7a3fb0', 1.8);
    } else if (d === 'escudo_time') {
      out += `<circle cx="233" cy="330" r="10" fill="#1d48a8" stroke="#159947" stroke-width="2.4"/><path d="M233,323.5 l1.8,4 4.4,.4 -3.3,2.9 1,4.3 -3.9,-2.3 -3.9,2.3 1,-4.3 -3.3,-2.9 4.4,-.4Z" fill="#ffd400"/>`;
      out += traco(`M${n(200 - meiaLargura(g, 320) - 3)},320 L${n(200 - meiaLargura(g, 540) - 3)},540 M${n(200 + meiaLargura(g, 320) + 3)},320 L${n(200 + meiaLargura(g, 540) + 3)},540`, '#159947', 4, 0.9);
    } else if (d === 'gravata') {
      out += forma('M193,290 L207,290 L205,302 L195,302Z', '#8a1c2b', '#4d0d16', 1.2);
      out += forma('M195,302 L205,302 L212,404 L200,420 L188,404Z', '#a32336', '#4d0d16', 1.2);
      out += traco('M193,330 L207,320 M191,360 L209,346 M190,390 L211,374', '#e3b23c', 2, 0.55);
    } else if (d === 'botoes') {
      out += traco('M200,300 L200,468', '#000', 1, 0.18);
      for (const y of [316, 350, 384, 418, 452]) out += `<circle cx="203.5" cy="${y}" r="2.2" fill="#fff" stroke="#888" stroke-width=".8"/>`;
    } else if (d === 'distintivo') {
      out += `<path d="M234,318 l3.5,7.5 8,1 -6,5.5 1.6,8 -7.1,-4 -7.1,4 1.6,-8 -6,-5.5 8,-1Z" fill="#e8c04a" stroke="#8a6a12" stroke-width="1"/>`;
      out += `<rect x="154" y="324" width="28" height="8" rx="1.5" fill="#d8d8d8" stroke="#888" stroke-width=".8"/>`;
      out += `<rect x="${n(200 - g.sw - 6)}" y="306" width="22" height="26" rx="4" fill="#c9a227" opacity=".85" transform="rotate(8 ${n(200 - g.sw + 5)} 318)"/>`;
    } else if (d === 'faixa_cintura') {
      const w = meiaLargura(g, 448) + 4;
      out += forma(`M${n(200 - w)},440 Q200,446 ${n(200 + w)},440 L${n(200 + w)},454 Q200,460 ${n(200 - w)},454Z`, '#e9f2fb', '#8fb2d4', 1.2);
      out += `<circle cx="226" cy="449" r="6" fill="#ffffff" stroke="#b5cbe2"/>`;
    } else if (d === 'brilhos') {
      for (const [x, y] of [[178, 520], [226, 560], [196, 620], [240, 680], [160, 650], [210, 500], [172, 720]] as [number, number][]) {
        out += `<path d="M${x},${y - 5} L${x + 1.4},${y - 1.4} L${x + 5},${y} L${x + 1.4},${y + 1.4} L${x},${y + 5} L${x - 1.4},${y + 1.4} L${x - 5},${y} L${x - 1.4},${y - 1.4}Z" fill="#fff" opacity=".75"/>`;
      }
    } else if (d === 'rasgos') {
      for (const p of pernas(g)) {
        out += `<ellipse cx="${n(p.j.x)}" cy="${p.j.y - 4}" rx="10" ry="3.6" fill="${c.pele}"/>`;
        out += traco(`M${n(p.j.x - 11)},${p.j.y - 6} l22,0 M${n(p.j.x - 10)},${p.j.y - 1} l20,0`, '#e8eef6', 1.2, 0.9);
      }
    } else if (d === 'remendos') {
      const [a, b] = pernas(g);
      out += `<rect x="${n(a.j.x - 11)}" y="${a.j.y - 14}" width="22" height="20" fill="#d1a12a" stroke="#7a5a12" stroke-dasharray="2 2" transform="rotate(-6 ${n(a.j.x)} ${a.j.y})"/>`;
      out += `<rect x="${n(b.j.x - 10)}" y="${b.j.y + 20}" width="18" height="18" fill="#a8432f" stroke="#5a1f12" stroke-dasharray="2 2" transform="rotate(8 ${n(b.j.x)} ${b.j.y})"/>`;
    } else if (d === 'bolsos_cargo') {
      for (const p of pernas(g)) {
        const x = p.q.x + p.lado * 14;
        const cor = escurecer(c.e.baixo.cor, 0.08);
        out += forma(`M${n(x - 15)},612 L${n(x + 15)},612 L${n(x + 15)},658 Q${n(x)},662 ${n(x - 15)},658Z`, cor, escurecer(cor, 0.5), 1.2);
        out += forma(`M${n(x - 16)},606 L${n(x + 16)},606 L${n(x + 16)},620 L${n(x - 16)},620Z`, escurecer(cor, 0.1), escurecer(cor, 0.5), 1.2);
      }
    } else if (d === 'bolso_canguru') {
      const cor = c.e.topo.cor;
      const y0 = (c.e.topo.fim ?? 565) - 92;
      out += forma(`M${200 - 44},${y0} L${200 + 44},${y0} L${200 + 58},${y0 + 62} L${200 - 58},${y0 + 62}Z`, escurecer(cor, 0.06), escurecer(cor, 0.5), 1.2);
      out += traco(`M${200 - 44},${y0} L${200 - 58},${y0 + 62} M${200 + 44},${y0} L${200 + 58},${y0 + 62}`, '#000', 3, 0.15);
    } else if (d === 'faixa_lateral') {
      for (const p of pernas(g)) out += traco(`M${n(p.q.x + p.lado * 24)},548 Q${n(p.j.x + p.lado * 20)},${p.j.y} ${n(p.t.x + p.lado * 15)},${p.t.y - 8}`, '#ffffff', 3.4, 0.9);
    } else if (d === 'cracha') {
      out += cracha(c);
    }
  }
  return out;
}

function cracha(c: Ctx): string {
  const g = c.g;
  let s = traco(`M${200 - g.nh - 2},262 Q${200 - 16},330 196,392 M${200 + g.nh + 2},262 Q${200 + 16},330 204,392`, '#2a62c9', 3.4);
  s += `<rect x="184" y="390" width="32" height="44" rx="4" fill="#ffffff" stroke="#9aa3b2" stroke-width="1.4"/>`;
  s += `<rect x="184" y="390" width="32" height="10" rx="3" fill="#2a62c9"/>`;
  s += `<rect x="191" y="404" width="18" height="16" rx="2" fill="#d5dbe5"/><circle cx="200" cy="410" r="4" fill="#9aa3b2"/>`;
  s += traco('M190,426 L210,426 M193,430 L207,430', '#9aa3b2', 1.6);
  return s;
}

function mao(c: Ctx, br: Braco): string {
  const g = c.g;
  const fim = pontoMembro(br.a, br.b, br.c, 1);
  const ant = pontoMembro(br.a, br.b, br.c, 0.94);
  let dx = fim.x - ant.x;
  let dy = fim.y - ant.y;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const k = g.mao;
  const cx = fim.x + dx * 8 * k;
  const cy = fim.y + dy * 8 * k;
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
  const ry = br.punho ? 13 * k : 15 * k;
  const rx = br.punho ? 12.5 * k : 10.8 * k;
  const lado = (cx - 200) * (br.lado < 0 ? 1 : -1) > 0 ? 1 : -1;
  const px = -dy * lado * br.lado;
  const py = dx * lado * br.lado;
  const md = elip(cx, cy, rx, ry);
  const pol = elip(fim.x + px * 8 * k + dx * 4, fim.y + py * 8 * k + dy * 4, 4 * k, 6.5 * k);
  const corpo = `<g transform="rotate(${n(ang)} ${n(cx)} ${n(cy)})">${silhueta([md], c.pele, c.contornoPele, 1.4, `url(#${c.id}-sh)`)}</g>`;
  let s = `<g transform="rotate(${n(ang)} ${n(fim.x + px * 8 * k + dx * 4)} ${n(fim.y + py * 8 * k + dy * 4)})">${forma(pol, c.pele, c.contornoPele, 1.2)}</g>` + corpo;
  if (!br.punho) s += traco(`M${n(cx + dx * 4 - px * 3)},${n(cy + dy * 4 - py * 3)} l${n(dx * 5)},${n(dy * 5)}`, c.contornoPele, 1, 0.4);
  return s;
}

function manga(c: Ctx, br: Braco, tipo: Manga | undefined, cor: string, pad: Padrao | undefined, folga: number, trim?: string): string {
  if (!tipo || tipo === 'nenhuma') return '';
  const g = c.g;
  const t1 = tipo === 'curta' ? 0.32 : tipo === 'media' ? 0.72 : tipo === 'longa' ? 0.94 : 1.03;
  const w: [number, number, number] = [g.braco[0] + folga, g.braco[1] + folga * 0.85, g.braco[2] + folga * 0.9];
  const d = membro(br.a, br.b, br.c, w, 0, t1);
  let s = silhueta([d], padrao(c, pad, cor), escurecer(cor, 0.5), 1.1, `url(#${c.id}-sh)`);
  const pa = pontoMembro(br.a, br.b, br.c, t1 - 0.05);
  const pb = pontoMembro(br.a, br.b, br.c, t1);
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const l = Math.hypot(dx, dy) || 1;
  const wt = t1 < 0.5 ? w[0] + (w[1] - w[0]) * (t1 / 0.5) : w[1] + (w[2] - w[1]) * Math.min(1, (t1 - 0.5) / 0.5);
  const nx = (-dy / l) * (wt / 2);
  const ny = (dx / l) * (wt / 2);
  const bainha = `M${n(pa.x + nx)},${n(pa.y + ny)} L${n(pa.x - nx)},${n(pa.y - ny)}`;
  s += traco(bainha, trim ?? escurecer(cor, 0.25), trim ? 4 : 1.6, trim ? 1 : 0.6);
  // dobra no cotovelo
  if (t1 > 0.55) {
    const e = pontoMembro(br.a, br.b, br.c, 0.5);
    s += traco(`M${n(e.x - 6)},${n(e.y - 3)} q6,5 12,0`, '#000', 1.4, 0.2);
  }
  return s;
}

function bracos(c: Ctx, poses: Braco[]): string {
  const g = c.g;
  const t = c.e.topo;
  const so = c.e.sobre;
  let out = '';
  for (const br of poses) {
    const pele = membro(br.a, br.b, br.c, g.braco);
    const sleeveT = t.tipo === 'regata' || t.tipo === 'top' ? undefined : t.manga;
    const sobreM = so && (so.tipo === 'jaqueta' || so.tipo === 'blazer' || so.tipo === 'jaleco' || so.tipo === 'cardiga') ? so.manga : undefined;
    const coberta = sleeveT === 'muito_longa';
    let s = silhueta([pele], c.pele, c.contornoPele, 1.4, `url(#${c.id}-sh)`);
    const cot = pontoMembro(br.a, br.b, br.c, 0.5);
    s += traco(`M${n(cot.x - 4)},${n(cot.y)} q4,3 8,0`, c.peleSombra, 1.2, 0.5);
    if (coberta) s += mao(c, br);
    s += manga(c, br, sleeveT, t.cor, t.padrao, t.tipo === 'moletom' ? 10 + (t.largo ?? 0) * 0.5 : 6, t.manga === 'curta' ? t.corGola : undefined);
    if (sobreM) s += manga(c, br, sobreM, so!.cor, so!.padrao, 12);
    if (!coberta) s += mao(c, br);
    out += s;
  }
  return out;
}

// ---------------------------------------------------------------- cabeca

const ROSTO_F = 'M200,64 C240,64 259,96 259,140 C259,170 250,192 234,207 C222,218 210,225 200,225 C190,225 178,218 166,207 C150,192 141,170 141,140 C141,96 160,64 200,64Z';
const ROSTO_M = 'M200,62 C242,62 261,96 261,140 C261,172 257,193 246,207 C233,221 215,228 200,228 C185,228 167,221 154,207 C143,193 139,172 139,140 C139,96 158,62 200,62Z';
const ROSTO_C = 'M200,64 C242,64 261,98 261,142 C261,176 248,200 230,212 C220,219 210,222 200,222 C190,222 180,219 170,212 C152,200 139,176 139,142 C139,98 158,64 200,64Z';

function rostoD(g: Geo): string {
  return g.crianca ? ROSTO_C : g.f ? ROSTO_F : ROSTO_M;
}

interface ParOlho {
  abre: number;
  baixo: number;
  dx: number;
  dy: number;
  ir: number;
  pup: number;
  caiDentro: number;
  caiFora: number;
}
function paramOlho(e: Expressao): ParOlho {
  const p: ParOlho = { abre: 1, baixo: 1, dx: 0, dy: 0, ir: 1, pup: 1, caiDentro: 0, caiFora: 0 };
  switch (e) {
    case 'feliz':
      return { ...p, abre: 0.95, baixo: -0.45 };
    case 'triste':
      return { ...p, abre: 0.82, dy: 2, caiFora: 3, caiDentro: -2 };
    case 'brava':
      return { ...p, abre: 0.78, baixo: 0.85, caiDentro: 6, ir: 0.92 };
    case 'surpresa':
      return { ...p, abre: 1.3, baixo: 1.3, ir: 0.82, pup: 0.8 };
    case 'pensativa':
      return { ...p, abre: 0.86, dx: 4, dy: -3 };
    case 'envergonhada':
      return { ...p, abre: 0.76, baixo: 0.9, dx: -4, dy: 3 };
    case 'assustada':
      return { ...p, abre: 1.35, baixo: 1.25, ir: 0.74, pup: 0.6 };
    default:
      return p;
  }
}

function olho(c: Ctx, cx: number, cy: number, lado: number, p: ParOlho): string {
  const g = c.g;
  const k = g.crianca ? 1.12 : 1;
  const hw = 15.5 * k;
  const up = 11.5 * k * p.abre;
  const dn = 7 * k * p.baixo;
  const I = { x: cx - lado * hw, y: cy + 2 };
  const O = { x: cx + lado * hw, y: cy - 1 + p.caiFora };
  const c1 = { x: cx - lado * hw * 0.55, y: cy - up * 1.25 + p.caiDentro };
  const c2 = { x: cx + lado * hw * 0.45, y: cy - up * 1.3 + p.caiFora * 0.5 };
  const c3 = { x: cx + lado * hw * 0.45, y: cy + dn * 1.2 };
  const c4 = { x: cx - lado * hw * 0.5, y: cy + dn * 1.2 };
  const sup = `M${pt(I)} C${pt(c1)} ${pt(c2)} ${pt(O)}`;
  const inf = `M${pt(O)} C${pt(c3)} ${pt(c4)} ${pt(I)}`;
  const contorno = `${sup} C${pt(c3)} ${pt(c4)} ${pt(I)}Z`;
  const clip = `${c.id}-olho${lado < 0 ? 'e' : 'd'}`;
  c.defs.push(`<clipPath id="${clip}"><path d="${contorno}"/></clipPath>`);
  const r = 9.4 * k * p.ir;
  const ix = cx + p.dx;
  const iy = cy + p.dy + 1;
  const cil = escurecer(c.corCab, 0.75);
  const linha = misturar('#24161a', cil, 0.3);
  let s = `<path d="${contorno}" fill="#fdfbf8"/>`;
  s += `<g clip-path="url(#${clip})">`;
  s += `<circle cx="${n(ix)}" cy="${n(iy)}" r="${n(r)}" fill="url(#${c.id}-iris)"/>`;
  s += `<circle cx="${n(ix)}" cy="${n(iy)}" r="${n(r)}" fill="none" stroke="${escurecer(c.corOlho, 0.6)}" stroke-width="1.2"/>`;
  s += `<circle cx="${n(ix)}" cy="${n(iy)}" r="${n(r * 0.46 * p.pup)}" fill="#120a0c"/>`;
  s += `<path d="${contorno}" fill="url(#${c.id}-branco)"/>`;
  s += `<circle cx="${n(ix - 3.4 * k)}" cy="${n(iy - 3.8 * k)}" r="${n(2.9 * k)}" fill="#fff"/>`;
  s += `<circle cx="${n(ix + 3.4 * k)}" cy="${n(iy + 3.4 * k)}" r="${n(1.3 * k)}" fill="#fff" opacity=".85"/>`;
  s += `</g>`;
  s += traco(inf, linha, 1.1, 0.45);
  s += `<g transform="translate(0,${n(-5 * k)})">${traco(sup, linha, 1, 0.28)}</g>`;
  s += traco(sup, linha, g.f ? 3.4 : 2.8);
  if (g.f) {
    s += traco(`M${pt(O)} q${n(lado * 4)},-1 ${n(lado * 7)},-6`, linha, 2.2);
    s += traco(`M${n(O.x - lado * 4)},${n(O.y - 3)} q${n(lado * 3)},-2 ${n(lado * 5)},-7`, linha, 1.8);
  }
  if (c.expr === 'triste') s += traco(`M${n(cx - lado * 8)},${n(cy + dn + 1)} Q${n(cx)},${n(cy + dn + 3)} ${n(cx + lado * 8)},${n(cy + dn + 1)}`, '#bfe6ff', 1.6, 0.8);
  return s;
}

function sobrancelhas(c: Ctx): string {
  const g = c.g;
  const corS = escurecer(c.corCab, c.v.corCabelo >= 4 && c.v.corCabelo <= 6 ? 0.35 : 0.15);
  const espess = g.f ? 4.6 : 6.4;
  const tab: Record<Expressao, [number, number, number, number, number, number]> = {
    neutra: [0, 0, 3, 0, 0, 3],
    feliz: [-3, -1, 5, -3, -1, 5],
    triste: [-7, 4, 1, -7, 4, 1],
    brava: [7, -4, -1, 7, -4, -1],
    surpresa: [-10, -7, 6, -10, -7, 6],
    pensativa: [-6, -4, 4, 2, 1, 2],
    envergonhada: [-5, 2, 2, -5, 2, 2],
    assustada: [-9, -1, 2, -9, -1, 2],
  };
  const t = tab[c.expr];
  let s = '';
  for (const l of [-1, 1]) {
    const o = l < 0 ? 0 : 3;
    const Pi = { x: 200 + l * 11, y: 128 + t[o] };
    const Po = { x: 200 + l * 44, y: 125 + t[o + 1] };
    const m = { x: 200 + l * 28, y: (Pi.y + Po.y) / 2 - t[o + 2] - 3 };
    const ti = espess;
    s += `<path d="M${n(Pi.x)},${n(Pi.y - ti / 2)} Q${n(m.x)},${n(m.y - ti * 0.45)} ${pt(Po)} Q${n(m.x)},${n(m.y + ti * 0.55)} ${n(Pi.x)},${n(Pi.y + ti / 2)}Z" fill="${corS}"/>`;
  }
  return s;
}

function boca(c: Ctx): string {
  const g = c.g;
  const pele = c.pele;
  const linha = misturar(escurecer(pele, 0.55), '#5a1f2a', 0.4);
  const labio = g.f ? misturar(pele, '#c4505e', 0.45) : misturar(pele, '#a85a50', 0.22);
  const op = g.f ? 0.85 : 0.4;
  const dentro = '#5b1a26';
  let s = '';
  switch (c.expr) {
    case 'feliz':
      s += forma('M183,195 Q200,199 217,195 Q214,213 200,215 Q186,213 183,195Z', dentro, linha, 1.6);
      s += '<path d="M185.5,196.5 Q200,200 214.5,196.5 L213.5,201 Q200,204 186.5,201Z" fill="#fffaf5"/>';
      s += '<path d="M190,210 Q200,204 210,210 Q200,215.5 190,210Z" fill="#d9606a"/>';
      s += traco('M181,193 q-2,2 -1,5 M219,193 q2,2 1,5', linha, 1.2, 0.5);
      if (g.f) s += traco('M191,217.5 Q200,220 209,217.5', labio, 2.4, 0.6);
      break;
    case 'triste':
      s += traco('M188,205 Q200,196 212,205', linha, 2.2);
      s += traco('M193,207 Q200,210 207,207', labio, 2.6, op * 0.7);
      break;
    case 'brava':
      s += forma('M187,200 Q200,197 213,200 L212,207 Q200,209 188,207Z', '#fffaf5', linha, 1.8);
      s += traco('M188,203.5 L212,203.5 M194,200 L194,207 M200,199 L200,208 M206,200 L206,207', '#c9b9b0', 0.9, 0.9);
      s += traco('M186,199 q-2,-2 -4,-1 M214,199 q2,-2 4,-1', linha, 1.3, 0.6);
      break;
    case 'surpresa':
      s += forma('M200,192 C206,192 208.5,198 208.5,203 C208.5,209 204.5,212 200,212 C195.5,212 191.5,209 191.5,203 C191.5,198 194,192 200,192Z', dentro, linha, 1.6);
      s += '<path d="M194,208 Q200,204 206,208 Q200,212 194,208Z" fill="#d9606a"/>';
      break;
    case 'pensativa':
      s += traco('M190,201 Q199,201.5 211,196.5', linha, 2);
      s += traco('M195,204.5 Q201,206.5 207,203.5', labio, 2.6, op * 0.7);
      break;
    case 'envergonhada':
      s += traco('M189,201 Q194.5,197 200,201 Q205.5,205 211,201', linha, 2);
      break;
    case 'assustada':
      s += forma('M186,206 Q192,196 200,197 Q208,196 214,206 Q200,212 186,206Z', dentro, linha, 1.6);
      s += '<path d="M189.5,201.5 Q200,196.5 210.5,201.5 L211.5,203.5 Q200,199.5 188.5,203.5Z" fill="#fffaf5"/>';
      break;
    default:
      s += traco('M187,199 Q193,197.5 200,199 Q207,197.5 213,199', linha, 2);
      s += `<path d="M190,200.5 Q200,207.5 210,200.5 Q200,203 190,200.5Z" fill="${labio}" opacity="${op}"/>`;
      s += '<ellipse cx="203" cy="203" rx="3" ry="1" fill="#fff" opacity=".35"/>';
  }
  if (g.crianca) return `<g transform="translate(200,201) scale(.88) translate(-200,-201)">${s}</g>`;
  return s;
}

function rosto(c: Ctx): string {
  const g = c.g;
  const d = rostoD(g);
  const clip = `${c.id}-rostoclip`;
  c.defs.push(`<clipPath id="${clip}"><path d="${d}"/></clipPath>`);
  let s = '';
  // orelhas
  const orelha = 'M144,140 C134,134 130,150 133,162 C135,172 141,174 146,170Z';
  s += forma(orelha, c.pele, c.contornoPele, 1.6) + forma(esp(orelha), c.pele, c.contornoPele, 1.6);
  s += traco('M141,147 Q136,154 141,164', c.peleSombra, 1.6, 0.8) + traco(esp('M141,147 Q136,154 141,164'), c.peleSombra, 1.6, 0.8);
  s += silhueta([d], `url(#${c.id}-rosto)`, c.contornoPele, 1.1);
  return s;
}

function detalhesRosto(c: Ctx, sombraCabelo: string): string {
  const g = c.g;
  const clip = `${c.id}-rostoclip`;
  let s = `<g clip-path="url(#${clip})">`;
  if (sombraCabelo) s += `<path d="${sombraCabelo}" transform="translate(0,6)" fill="${escurecer(c.pele, 0.4)}" opacity=".32"/>`;
  // sombra da mandibula
  s += `<path d="${rostoD(g)}" fill="none" stroke="${c.peleSombra}" stroke-width="10" opacity=".25"/>`;
  s += '</g>';
  // luz na bochecha e na testa
  s += `<ellipse cx="170" cy="168" rx="12" ry="7" fill="#fff" opacity=".1"/>`;
  // rubor
  const rub = c.expr === 'envergonhada' ? 0.75 : g.crianca ? 0.35 : g.f ? 0.25 : 0.12;
  s += `<ellipse cx="166" cy="180" rx="15" ry="8.5" fill="url(#${c.id}-rubor)" opacity="${rub}"/><ellipse cx="234" cy="180" rx="15" ry="8.5" fill="url(#${c.id}-rubor)" opacity="${rub}"/>`;
  if (c.expr === 'envergonhada') s += traco('M158,177 l-3,6 M165,177 l-3,6 M172,177 l-3,6 M228,177 l-3,6 M235,177 l-3,6 M242,177 l-3,6', '#d94a5e', 1.4, 0.7);
  // nariz
  s += traco('M204,158 Q209,174 203,182', c.peleSombra, 1.8, 0.75);
  s += `<ellipse cx="200" cy="185" rx="8" ry="2.4" fill="${c.peleSombra}" opacity=".35"/>`;
  s += traco('M193,183 Q196,185.5 199,184 M201,184 Q204,185.5 207,183', c.contornoPele, 1.3, 0.55);
  s += `<ellipse cx="198" cy="172" rx="1.8" ry="4.5" fill="#fff" opacity=".35"/>`;
  // rugas
  if (g.idoso) {
    const r = 'M154,145 L147,142 M154,151 L146,151 M154,157 L147,160 M186,180 Q179,191 183,205 M163,163 Q175,168 187,163 M174,99 Q200,93 226,99 M180,107 Q200,102 220,107';
    s += traco(r, c.peleSombra, 1.5, 0.75) + traco(esp(r), c.peleSombra, 1.5, 0.75);
  }
  return s;
}

function barba(c: Ctx): string {
  if (!c.v.barba) return '';
  const cor = c.corCab;
  const k = escurecer(cor, 0.4);
  const d = 'M143,160 C146,190 158,212 176,222 C186,229 194,231 200,231 C206,231 214,229 224,222 C242,212 254,190 257,160 C253,178 245,193 232,201 C222,207 214,207 210,205 C206,212 194,212 190,205 C186,207 178,207 168,201 C155,193 147,178 143,160Z';
  const big = 'M183,191 C189,186 196,187 200,189 C204,187 211,186 217,191 C215,195 207,194 200,193 C193,194 185,195 183,191Z';
  let s = forma(d, `url(#${c.id}-cab)`, k, 1.2, 'opacity=".95"');
  s += forma(big, `url(#${c.id}-cab)`, k, 1);
  s += traco('M160,196 l2,6 M172,208 l1,6 M186,216 l0,6 M214,216 l0,6 M228,208 l-1,6 M240,196 l-2,6', escurecer(cor, 0.3), 1.2, 0.5);
  return s;
}

// ---------------------------------------------------------------- cabelo

interface Cab {
  tras: string;
  frente: string;
  sombra: string;
}

function anel(cx: number, cy: number, rx: number, ry: number, qtd: number, r: number, a0 = 0, a1 = Math.PI * 2): string[] {
  const out: string[] = [];
  for (let i = 0; i < qtd; i++) {
    const a = a0 + ((a1 - a0) * i) / (a1 - a0 >= Math.PI * 2 - 0.01 ? qtd : qtd - 1);
    const jr = r * (0.85 + 0.3 * Math.abs(Math.sin(i * 2.3)));
    out.push(circ(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, jr));
  }
  return out;
}

function cabelo(c: Ctx): Cab {
  const C = c.corCab;
  const F = `url(#${c.id}-cab)`;
  const K = escurecer(C, 0.48);
  const M = escurecer(C, 0.38);
  const L = clarear(C, 0.5);
  const peca = (d: string) => forma(d, F, K, 2);
  const fios = (ds: string[], cor = M, op = 0.5, w = 1.6) => ds.map((d) => traco(d, cor, w, op)).join('');
  const brilho = (d: string, w = 5) => traco(d, L, w * 2, 0.12) + traco(d, L, w * 0.7, 0.3);
  const nuvem = (ds: string[]) => silhueta(ds, F, K, 1.2);
  const cachos = (pts: [number, number][], r = 5) => pts.map(([x, y]) => traco(`M${x - r},${y} a${r},${r} 0 1,1 ${r},${r}`, M, 1.5, 0.55)).join('');
  const est = c.v.cabelo;
  /** franja de cachos: faixa sem contorno por cima (some no cabelo de tras) e bolinhas com contorno na borda */
  const franjaCachos = (yMeio: number, r: number, passo: number, yLado = 150, contorno = true) => {
    const faixa = `M136,${yLado} C130,80 165,50 200,50 C235,50 270,80 264,${yLado} C256,${n(yMeio + 10)} 230,${n(yMeio)} 200,${n(yMeio)} C170,${n(yMeio)} 144,${n(yMeio + 10)} 136,${yLado}Z`;
    const bs: string[] = [];
    const qtd = Math.round(130 / passo);
    for (let i = 0; i <= qtd; i++) {
      const t = i / qtd;
      const u = 1 - t;
      const x = u * u * 140 + 2 * u * t * 200 + t * t * 260;
      const y = u * u * yLado + 2 * u * t * (2 * yMeio - yLado) + t * t * yLado;
      bs.push(circ(x, y + 2, r * (0.85 + 0.25 * Math.abs(Math.sin(i * 2.1)))));
    }
    const st = contorno ? bs.map((d) => `<path d="${d}" fill="${K}" stroke="${K}" stroke-width="2.4"/>`).join('') : '';
    if (!contorno) return `<path d="${faixa}" fill="${F}"/>` + traco(`M136,${yLado} C144,${n(yMeio + 10)} 170,${n(yMeio)} 200,${n(yMeio)} C230,${n(yMeio)} 256,${n(yMeio + 10)} 264,${yLado}`, K, 1.4, 0.45);
    return st + [faixa, ...bs].map((d) => `<path d="${d}" fill="${F}"/>`).join('');
  };

  const capaCurta = 'M200,48 C150,48 130,86 132,140 C133,170 138,192 146,204 L254,204 C262,192 267,170 268,140 C270,86 250,48 200,48Z';
  const frenteLimpa = 'M138,152 C132,86 162,52 200,52 C238,52 268,86 262,152 C256,114 236,90 200,88 C164,90 144,114 138,152Z';

  switch (est) {
    case 'liso_longo': {
      const tras = 'M200,46 C150,46 128,84 130,140 C132,200 126,270 116,338 C150,352 250,352 284,338 C274,270 268,200 270,140 C272,84 250,46 200,46Z';
      const fr = 'M136,162 C128,92 160,50 205,50 C246,50 272,84 266,152 C262,128 254,110 240,98 C226,114 200,122 172,118 C160,130 150,146 146,172Z';
      const lado = 'M147,118 C136,170 138,240 128,304 C138,312 150,308 156,300 C151,240 150,182 159,128Z';
      return {
        tras: peca(tras) + fios(['M138,200 C134,250 130,290 124,334', 'M262,200 C266,250 270,290 276,334', 'M150,230 Q146,290 142,342', 'M250,230 Q254,290 258,342']),
        frente: peca(lado) + peca(esp(lado)) + peca(fr) + fios(['M205,54 C190,70 178,92 172,116', 'M222,56 C214,80 206,100 194,118', 'M244,64 C252,90 258,120 262,148', 'M150,150 C146,200 144,250 138,300', 'M250,150 C254,200 256,250 262,300']) + brilho('M166,72 Q200,56 238,70'),
        sombra: fr,
      };
    }
    case 'liso_curto': {
      const fr = 'M136,150 C130,86 162,50 202,50 C244,50 270,84 264,148 C258,124 248,106 232,98 C220,108 196,112 176,108 C164,118 150,130 146,160Z';
      const costeleta = 'M141,136 L151,134 L150,172 L143,166Z';
      return {
        tras: peca(capaCurta),
        frente: peca(costeleta) + peca(esp(costeleta)) + peca(fr) + fios(['M200,54 C188,70 182,90 178,106', 'M222,56 C218,76 212,92 204,108', 'M246,70 C254,92 260,116 262,140']) + brilho('M168,70 Q200,56 236,68'),
        sombra: fr,
      };
    }
    case 'franja_chanel': {
      const tras = 'M200,46 C148,46 126,86 128,150 C128,190 130,215 134,234 C160,242 240,242 266,234 C270,215 272,190 272,150 C274,86 252,46 200,46Z';
      const fr = 'M134,152 C130,82 162,48 200,48 C238,48 270,82 266,152 L262,160 C258,140 256,124 254,114 L240,121 L226,113 L212,121 L198,113 L184,121 L170,113 L156,121 L146,114 C144,124 142,140 138,160Z';
      const lado = 'M134,140 C134,190 134,215 138,236 L158,234 C151,205 148,175 150,140Z';
      return {
        tras: peca(tras) + fios(['M140,180 L142,232', 'M260,180 L258,232']),
        frente: peca(lado) + peca(esp(lado)) + peca(fr) + fios(['M170,60 L168,110', 'M190,52 L190,112', 'M212,52 L214,114', 'M234,60 L236,112', 'M144,160 L148,228', 'M256,160 L252,228']) + brilho('M160,74 Q200,58 240,74'),
        sombra: fr,
      };
    }
    case 'cacheado_longo': {
      const base = 'M200,44 C146,44 122,90 124,150 C124,220 116,280 112,330 C150,350 250,350 288,330 C284,280 276,220 276,150 C278,90 254,44 200,44Z';
      const bol = anel(200, 190, 92, 148, 30, 21);
      const ladosE: string[] = [];
      const ladoD: string[] = [];
      for (let i = 0; i < 6; i++) {
        ladosE.push(circ(138 + (i % 2) * 4, 176 + i * 24, 12));
        ladoD.push(circ(262 - (i % 2) * 4, 176 + i * 24, 12));
      }
      const pts: [number, number][] = [[120, 220], [130, 290], [270, 240], [276, 300], [160, 330], [240, 330], [118, 170], [282, 180]];
      return {
        tras: nuvem([base, ...bol]) + cachos(pts, 6),
        frente: nuvem([...ladosE, ...ladoD]) + franjaCachos(96, 13, 18, 160) + cachos([[170, 102], [194, 98], [216, 100], [146, 200], [254, 230]], 4.5) + brilho('M168,72 Q200,60 232,72', 4),
        sombra: 'M140,150 C140,100 170,84 200,84 C230,84 260,100 260,150 C250,118 230,106 200,106 C170,106 150,118 140,150Z',
      };
    }
    case 'cacheado_curto': {
      const bol = anel(200, 128, 74, 80, 20, 17);
      return {
        tras: nuvem([elip(200, 130, 74, 82), ...bol]) + cachos([[140, 120], [262, 130], [150, 180], [252, 180], [200, 52]], 5),
        frente: franjaCachos(98, 12, 17, 150) + cachos([[168, 102], [192, 98], [214, 100]], 4.5) + brilho('M172,70 Q200,60 228,70', 4),
        sombra: 'M140,150 C140,100 170,86 200,86 C230,86 260,100 260,150 C250,120 230,110 200,110 C170,110 150,120 140,150Z',
      };
    }
    case 'crespo_volumoso': {
      const bol = anel(200, 120, 102, 92, 28, 21);
      const linha = 'M139,152 C135,92 162,62 200,60 C238,62 265,92 261,152 C254,116 236,93 200,91 C164,93 146,116 139,152Z';
      const pts: [number, number][] = [];
      for (let i = 0; i < 26; i++) pts.push([Math.round(110 + ((i * 37) % 180)), Math.round(40 + ((i * 53) % 150))]);
      return {
        tras: nuvem([elip(200, 122, 104, 94), ...bol]) + cachos(pts.filter(([x, y]) => !(x > 140 && x < 260 && y > 90)), 4),
        frente: franjaCachos(90, 4, 7, 140, false) + brilho('M156,46 Q200,28 244,46', 5),
        sombra: linha,
      };
    }
    case 'black_curto': {
      const bol = anel(200, 112, 70, 62, 22, 13);
      const linha = 'M140,150 C136,94 162,66 200,64 C238,66 264,94 260,150 C254,118 236,98 200,96 C164,98 146,118 140,150Z';
      const pts: [number, number][] = [[160, 70], [190, 58], [222, 60], [246, 78], [150, 100], [252, 104]];
      return {
        tras: nuvem([elip(200, 114, 70, 64), ...bol]),
        frente: franjaCachos(96, 3.5, 7, 142, false) + cachos(pts, 3.5) + brilho('M166,64 Q200,50 234,64', 4),
        sombra: linha,
      };
    }
    case 'trancas_box': {
      let tras = peca('M200,46 C150,46 128,86 130,140 C131,170 136,196 144,210 L256,210 C264,196 269,170 270,140 C272,86 250,46 200,46Z');
      for (let i = 0; i < 14; i++) {
        const x0 = 134 + i * 10;
        const y0 = 150 - Math.sin((i / 13) * Math.PI) * 40;
        const x1 = x0 + (x0 - 200) * 0.38;
        const y1 = 420 + Math.sin(i * 1.7) * 14;
        const d = `M${n(x0)},${n(y0)} Q${n(x0 + (x0 - 200) * 0.15)},${n((y0 + y1) / 2)} ${n(x1)},${n(y1)}`;
        tras += traco(d, K, 13) + traco(d, F, 10.5) + traco(d, M, 10.5, 0.7, 'stroke-dasharray="2.5 6"') + traco(d, L, 1.4, 0.35);
        if (i % 3 === 0) tras += `<circle cx="${n(x1)}" cy="${n(y1 + 4)}" r="4" fill="#e0b84a" stroke="#8a6a12"/>`;
      }
      const linha = 'M139,152 C133,90 162,56 200,54 C238,56 267,90 261,152 C254,116 236,92 200,90 C164,92 146,116 139,152Z';
      let frente = peca(linha) + fios(['M200,56 L200,90', 'M176,62 L182,94', 'M224,62 L218,94', 'M154,80 L164,108', 'M246,80 L236,108'], escurecer(C, 0.6), 0.6, 1.4);
      for (const [x0, x1] of [[146, 136], [154, 148], [162, 160]] as [number, number][]) {
        for (const l of [-1, 1]) {
          const a = l < 0 ? x0 : 400 - x0;
          const b = l < 0 ? x1 : 400 - x1;
          const d = `M${a},120 Q${n(a + l * -4)},250 ${b},${n(372 + (x0 - 146) * 0.8)}`;
          frente += traco(d, K, 12.5) + traco(d, F, 10) + traco(d, M, 10, 0.7, 'stroke-dasharray="2.5 6"') + traco(d, L, 1.4, 0.35);
        }
      }
      return { tras, frente: frente + brilho('M166,68 Q200,56 234,68', 4), sombra: linha };
    }
    case 'coque': {
      const coque = circ(200, 40, 28);
      return {
        tras: peca(capaCurta) + peca(coque) + fios(['M178,36 Q200,22 222,38', 'M176,48 Q200,60 224,46', 'M186,24 Q206,40 216,62']) + traco('M178,62 Q200,70 222,62', escurecer(C, 0.6), 4),
        frente: peca(frenteLimpa) + fios(['M150,120 Q170,84 200,72', 'M250,120 Q230,84 200,72', 'M168,94 Q186,70 200,60', 'M232,94 Q214,70 200,60']) + brilho('M166,70 Q200,56 234,70', 4),
        sombra: frenteLimpa,
      };
    }
    case 'rabo_de_cavalo': {
      const rabo = 'M226,64 C262,60 292,100 290,160 C288,220 276,280 262,330 C256,300 252,260 256,220 C260,170 252,120 226,90Z';
      const mecha = 'M146,150 C140,110 160,78 196,74 C176,90 160,116 154,160Z';
      return {
        tras: peca(capaCurta) + peca(rabo) + fios(['M256,96 Q280,160 268,300', 'M244,90 Q270,170 262,290']) + traco('M222,72 Q234,58 250,70', escurecer(C, 0.6), 6),
        frente: peca(frenteLimpa) + peca(mecha) + fios(['M150,124 Q172,86 210,70', 'M248,118 Q232,86 214,70', 'M170,92 Q194,66 220,62']) + brilho('M166,70 Q200,56 234,70', 4),
        sombra: frenteLimpa,
      };
    }
    case 'maria_chiquinha': {
      const tufo = 'M140,108 C112,100 92,128 96,170 C98,200 104,230 110,250 C118,226 124,200 128,176 C132,150 140,130 148,122Z';
      const fr = 'M136,150 C130,86 162,50 200,50 C238,50 270,86 264,150 C258,126 250,112 240,104 C226,112 214,108 204,102 C192,112 176,114 162,106 C152,116 144,130 142,156Z';
      return {
        tras: peca(capaCurta) + peca(tufo) + peca(esp(tufo)) + fios(['M118,130 Q104,180 110,240', esp('M118,130 Q104,180 110,240')]),
        frente: peca(fr) + fios(['M190,56 Q176,80 168,104', 'M212,56 Q206,82 204,100', 'M234,64 Q240,84 242,104']) + `<circle cx="138" cy="116" r="7" fill="#ff5c8a" stroke="#b02a55" stroke-width="1.4"/><circle cx="262" cy="116" r="7" fill="#ff5c8a" stroke="#b02a55" stroke-width="1.4"/>` + brilho('M168,70 Q200,56 234,70', 4),
        sombra: fr,
      };
    }
    case 'raspado': {
      const d = 'M140,142 C136,84 164,56 200,56 C236,56 264,84 260,142 C256,118 244,104 228,98 C214,94 186,94 172,98 C156,104 144,118 140,142Z';
      return { tras: '', frente: forma(d, F, 'none', 0, 'opacity=".55"') + traco('M172,98 C186,94 214,94 228,98', K, 1, 0.3), sombra: '' };
    }
    case 'careca':
      return { tras: '', frente: `<ellipse cx="180" cy="84" rx="16" ry="9" fill="#fff" opacity=".22" transform="rotate(-20 180 84)"/>`, sombra: '' };
    case 'topete': {
      const fr = 'M138,148 C130,96 146,60 176,44 C200,30 242,30 260,52 C272,70 268,110 262,146 C258,120 250,104 238,98 C220,92 180,92 162,100 C150,108 142,124 140,148Z';
      const lado = 'M139,150 C136,120 140,100 150,92 L156,140 Z';
      return {
        tras: peca('M200,52 C152,52 134,88 136,140 C137,166 140,182 146,192 L254,192 C260,182 263,166 264,140 C266,88 248,52 200,52Z'),
        frente: forma(lado, F, K, 1.4, 'opacity=".75"') + forma(esp(lado), F, K, 1.4, 'opacity=".75"') + peca(fr) + fios(['M170,92 C172,66 196,44 232,40', 'M190,92 C194,70 214,54 246,50', 'M214,92 C222,76 240,68 258,70']) + brilho('M176,58 Q208,36 246,48', 5),
        sombra: fr,
      };
    }
    default:
      return cabelo({ ...c, v: { ...c.v, cabelo: 'liso_curto' } });
  }
}

// ---------------------------------------------------------------- acessorios

function acessorioCabeca(c: Ctx): string {
  const a = c.v.acessorio ?? 'nenhum';
  let s = '';
  if (a === 'oculos_redondo' || a === 'oculos_quadrado') {
    const cor = a === 'oculos_redondo' ? '#5a3a24' : '#1d1d22';
    for (const x of [175, 225]) {
      const lente = a === 'oculos_redondo' ? circ(x, 150, 19) : `M${x - 21},136 L${x + 21},136 Q${x + 22},136 ${x + 21},150 L${x + 19},162 Q${x + 18},166 ${x + 14},166 L${x - 14},166 Q${x - 18},166 ${x - 19},162 L${x - 21},150 Q${x - 22},136 ${x - 21},136Z`;
      s += `<path d="${lente}" fill="#bfe3ff" fill-opacity=".14" stroke="${cor}" stroke-width="3"/>`;
      s += traco(`M${x - 10},${144} l8,-6 M${x - 12},${152} l14,-11`, '#fff', 1.6, 0.5);
    }
    s += traco('M194,146 Q200,141 206,146', cor, 2.6) + traco('M156,146 L142,143 M244,146 L258,143', cor, 2.6);
  } else if (a === 'fone_ouvido') {
    s += traco('M128,156 C118,26 282,26 272,156', '#2a2a30', 10) + traco('M131,150 C124,36 276,36 269,150', '#ff5c8a', 3, 0.9);
    s += `<rect x="118" y="134" width="26" height="44" rx="12" fill="#2a2a30"/><rect x="256" y="134" width="26" height="44" rx="12" fill="#2a2a30"/>`;
    s += `<rect x="124" y="140" width="10" height="32" rx="5" fill="#ff5c8a"/><rect x="266" y="140" width="10" height="32" rx="5" fill="#ff5c8a"/>`;
  } else if (a === 'bone') {
    s += forma('M134,114 C132,48 268,48 266,114Z', '#c0392b', '#6a1a12', 2);
    s += traco('M200,52 L200,112 M166,60 Q160,90 158,112 M234,60 Q240,90 242,112', '#6a1a12', 1.4, 0.45);
    s += `<circle cx="200" cy="52" r="4.5" fill="#c0392b" stroke="#6a1a12"/>`;
    s += forma('M130,112 Q200,98 270,112 Q274,126 262,128 Q200,116 138,128 Q126,126 130,112Z', '#a52f22', '#6a1a12', 1.8);
    s += `<path d="M140,124 Q200,112 260,124" fill="none" stroke="#000" stroke-width="5" opacity=".15"/>`;
  } else if (a === 'brinco_argola') {
    s += `<circle cx="139" cy="181" r="8" fill="none" stroke="#e0b84a" stroke-width="2.6"/><circle cx="261" cy="181" r="8" fill="none" stroke="#e0b84a" stroke-width="2.6"/>`;
  } else if (a === 'lenco_cabeca') {
    const pid = `${c.id}-lenco`;
    c.defs.push(`<pattern id="${pid}" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e8a33a"/><circle cx="4" cy="4" r="2.2" fill="#b6321f"/><circle cx="11" cy="11" r="1.6" fill="#2a5bb8"/></pattern>`);
    s += forma('M132,132 C124,44 276,44 268,132 C240,112 160,112 132,132Z', `url(#${pid})`, '#7a4a12', 2);
    s += forma('M250,66 C266,54 282,62 276,76 C270,88 256,82 250,66Z', `url(#${pid})`, '#7a4a12', 1.6);
    s += forma('M262,76 C276,96 282,118 276,136 L268,132 C270,114 264,96 256,82Z', `url(#${pid})`, '#7a4a12', 1.6);
    s += traco('M136,126 C160,110 240,110 264,126', '#7a4a12', 2, 0.4);
  }
  const extra = c.e.cabeca;
  if (extra === 'headset') {
    s += traco('M136,152 C130,46 270,46 264,152', '#2a2a30', 6);
    s += `<rect x="128" y="138" width="18" height="30" rx="8" fill="#2a2a30"/><rect x="254" y="138" width="18" height="30" rx="8" fill="#2a2a30"/>`;
    s += traco('M138,166 Q146,206 180,207', '#2a2a30', 3.2);
    s += `<ellipse cx="183" cy="207" rx="5" ry="3.6" fill="#444"/>`;
  } else if (extra === 'chapeu_palha') {
    s += forma('M148,96 C146,38 254,38 252,96Z', '#e3c26b', '#8a6a24', 2);
    s += forma('M96,102 Q200,72 304,102 Q306,118 200,120 Q94,118 96,102Z', '#e8c975', '#8a6a24', 2);
    s += forma('M150,84 Q200,76 250,84 L251,96 Q200,90 149,96Z', '#c0392b', '#6a1a12', 1.2);
    s += traco('M120,104 L126,112 M150,98 L154,114 M182,94 L184,116 M218,94 L216,116 M250,98 L246,114 M280,104 L274,112', '#a8843a', 1.4, 0.6);
  } else if (extra === 'quepe') {
    s += forma('M136,108 C132,58 268,58 264,108Z', '#22314c', '#0d1424', 2);
    s += forma('M136,100 L264,100 L264,114 L136,114Z', '#141c2e', '#0d1424', 1.4);
    s += forma('M134,112 Q200,104 266,112 Q268,124 256,126 Q200,118 144,126 Q132,124 134,112Z', '#0b0b0e', '#000', 1.2);
    s += `<path d="M200,72 l4,8 9,1 -7,6 2,9 -8,-5 -8,5 2,-9 -7,-6 9,-1Z" fill="#e8c04a"/>`;
  }
  return s;
}

function efeitosExpressao(c: Ctx): string {
  if (c.expr === 'assustada' || c.expr === 'envergonhada') {
    return `<path d="M254,98 C258,108 262,114 262,119 A6,6 0 0 1 250,119 C250,114 252,108 254,98Z" fill="#bfe6ff" stroke="#6aa8d8" stroke-width="1.2"/>` + (c.expr === 'assustada' ? traco('M120,92 l-10,-6 M118,110 l-12,0 M282,92 l10,-6', '#6aa8d8', 2, 0.7) : '');
  }
  if (c.expr === 'brava') return traco('M246,82 l6,6 M252,82 l-6,6 M258,92 l5,5', '#d9394e', 2.4, 0.8);
  return '';
}

// ---------------------------------------------------------------- composicao

function camadas(c: Ctx): string {
  definicoesBase(c);
  const g = c.g;
  const cab = cabelo(c);
  const poses = poseBracos(g, c.expr);
  const bracosDepois = c.expr === 'pensativa';
  const tc = tfCorpo(g);
  const th = tfCabeca(g);

  const corpo = pele(c) + sapatos(c) + parteDeBaixo(c) + parteDeCima(c) + sobreposicao(c) + detalhes(c) + (c.v.acessorio === 'cracha' && !(c.e.detalhes ?? []).includes('cracha') ? cracha(c) : '');
  const arms = bracos(c, poses);
  const cabeca = rosto(c) + detalhesRosto(c, cab.sombra) + boca(c) + barba(c) + olho(c, 175, 150, -1, paramOlho(c.expr)) + olho(c, 225, 150, 1, paramOlho(c.expr)) + sobrancelhas(c) + cab.frente + acessorioCabeca(c) + efeitosExpressao(c);

  let s = '';
  s += `<g transform="${th}">${cab.tras}</g>`;
  s += `<g transform="${tc}">${corpo}${bracosDepois ? '' : arms}</g>`;
  s += `<g transform="${th}">${cabeca}</g>`;
  if (bracosDepois) s += `<g transform="${tc}">${arms}</g>`;
  return s;
}

export function desenharPersonagem(v: Visual, expr: Expressao, opts?: { espelhar?: boolean }): string {
  const c = novoCtx(v, expr, !!opts?.espelhar);
  const conteudo = camadas(c);
  const tf = c.espelhar ? ' transform="translate(400,0) scale(-1,1)"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax meet"><defs>${c.defs.join('')}</defs><g${tf}>${conteudo}</g></svg>`;
}

export function desenharRosto(v: Visual, expr: Expressao): string {
  const c = novoCtx(v, expr, false);
  const conteudo = camadas(c);
  const g = c.g;
  // centro da cabeca no mundo
  const hy = juntaY(g) + (140 - 215) * g.h;
  const k = 0.86 / g.h;
  const tx = 100 - 200 * k;
  const ty = 92 - hy * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>${c.defs.join('')}</defs><g transform="translate(${n(tx)},${n(ty)}) scale(${k.toFixed(4)})">${conteudo}</g></svg>`;
}
