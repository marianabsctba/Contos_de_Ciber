import { EXPRESSOES } from './tipos';
import type { Cena, Condicao, Efeito, Expressao, Idade, Linha, Opcao, Posicao, Roteiro } from './tipos';

export class ErroRoteiro extends Error {
  constructor(arquivo: string, linha: number, msg: string) {
    super(`${arquivo}:${linha}: ${msg}`);
  }
}

const POSICOES: Posicao[] = ['esquerda', 'centro', 'direita'];
const IDADES: Idade[] = ['crianca', 'adolescente', 'adulta'];

function ehExpr(s: string): s is Expressao {
  return (EXPRESSOES as readonly string[]).includes(s);
}

export function lerEfeitos(txt: string, onde: () => never): Efeito[] {
  const out: Efeito[] = [];
  for (const parte of txt.trim().split(/\s+/).filter(Boolean)) {
    let m = parte.match(/^(!?)marca:([a-z0-9_]+)$/);
    if (m) {
      out.push({ tipo: 'marca', nome: m[2], ligar: m[1] !== '!' });
      continue;
    }
    m = parte.match(/^([a-z_][a-z0-9_]*)([+\-=])(\d+)$/);
    if (!m) onde();
    out.push({ tipo: 'var', nome: m[1], op: m[2] as '+' | '-' | '=', valor: Number(m[3]) });
  }
  return out;
}

export function lerCondicoes(txt: string, onde: () => never): Condicao[] {
  const out: Condicao[] = [];
  for (const parte of txt.trim().split(/\s+e\s+/)) {
    let m = parte.trim().match(/^(!?)marca:([a-z0-9_]+)$/);
    if (m) {
      out.push({ tipo: 'marca', nome: m[2], negada: m[1] === '!' });
      continue;
    }
    m = parte.trim().match(/^([a-z_][a-z0-9_]*)\s*(>=|<=|>|<|=)\s*(-?\d+)$/);
    if (!m) onde();
    out.push({ tipo: 'var', nome: m[1], op: m[2] as '>=', valor: Number(m[3]) });
  }
  return out;
}

function lerOpcao(corpo: string, especial: boolean, erro: (m: string) => never): Opcao {
  let resto = corpo;
  let condicoes: Condicao[] = [];
  let efeitos: Efeito[] = [];
  const mCond = resto.match(/\[se ([^\]]+)\]\s*$/);
  if (mCond) {
    condicoes = lerCondicoes(mCond[1], () => erro(`condição inválida: ${mCond[1]}`));
    resto = resto.slice(0, mCond.index).trimEnd();
  }
  const mEf = resto.match(/\{([^}]*)\}\s*$/);
  if (mEf) {
    efeitos = lerEfeitos(mEf[1], () => erro(`efeito inválido: ${mEf[1]}`));
    resto = resto.slice(0, mEf.index).trimEnd();
  }
  const seta = resto.lastIndexOf('->');
  if (seta < 0) erro('opção sem destino (falta "-> cena")');
  const texto = resto.slice(0, seta).trim();
  const destino = resto.slice(seta + 2).trim();
  if (!texto) erro('opção sem texto');
  if (!/^[a-z0-9_]+$/.test(destino)) erro(`destino inválido: ${destino}`);
  return { texto, destino, efeitos, condicoes, especial };
}

export function lerRoteiro(arquivos: Record<string, string>): Roteiro {
  const cenas = new Map<string, Cena>();
  const ordem: string[] = [];
  const nomes = Object.keys(arquivos).sort();
  for (const arquivo of nomes) {
    const linhasTxt = arquivos[arquivo].replace(/\r/g, '').split('\n');
    let atual: Cena | null = null;
    let pergunta: string | undefined;
    let bloco: Opcao[] | null = null;

    const fecharBloco = () => {
      if (bloco && atual) atual.linhas.push({ t: 'escolha', pergunta, opcoes: bloco });
      bloco = null;
      pergunta = undefined;
    };

    linhasTxt.forEach((cru, i) => {
      const n = i + 1;
      const erro = (msg: string): never => {
        throw new ErroRoteiro(arquivo, n, msg);
      };
      const l = cru.trim();
      if (!l || l.startsWith('#')) return;

      if (l.startsWith('===')) {
        fecharBloco();
        const id = l.slice(3).trim();
        if (!/^[a-z0-9_]+$/.test(id)) erro(`id de cena inválido: ${id}`);
        if (cenas.has(id)) erro(`cena repetida: ${id}`);
        atual = { id, arquivo, linhaOrigem: n, linhas: [] };
        cenas.set(id, atual);
        ordem.push(id);
        return;
      }
      if (!atual) erro('linha fora de cena (falta "=== id")');
      const cena = atual as Cena;

      if (l.startsWith('?')) {
        fecharBloco();
        pergunta = l.slice(1).trim();
        bloco = [];
        return;
      }
      if (l.startsWith('*')) {
        const especial = l.startsWith('**');
        if (!bloco) bloco = [];
        bloco.push(lerOpcao(l.slice(especial ? 2 : 1).trim(), especial, erro));
        return;
      }
      fecharBloco();

      let linha: Linha;
      if (l.startsWith('>')) {
        linha = { t: 'narra', texto: l.slice(1).trim() };
      } else if (l.startsWith('(') && l.endsWith(')')) {
        linha = { t: 'pensa', texto: l.slice(1, -1).trim() };
      } else if (l.startsWith('@')) {
        linha = lerComando(l, erro);
      } else {
        const m = l.match(/^([A-Z][A-Z0-9_]*)\s*(?:\[([a-z]+)\])?\s*:\s*(.+)$/);
        if (!m) erro(`linha não reconhecida: ${l}`);
        const [, quem, expr, texto] = m!;
        if (expr && !ehExpr(expr)) erro(`expressão desconhecida: ${expr}`);
        linha = { t: 'fala', quem: quem.toLowerCase(), expr: expr as Expressao | undefined, texto };
      }
      cena.linhas.push(linha);
    });
    fecharBloco();
  }
  return { cenas, ordem };
}

function lerComando(l: string, erro: (m: string) => never): Linha {
  const m = l.match(/^@([a-z]+)\s*(.*)$/);
  if (!m) erro(`comando inválido: ${l}`);
  const [, cmd, argsTxt] = m!;
  const args = argsTxt.trim();
  const partes = args.split(/\s+/).filter(Boolean);
  switch (cmd) {
    case 'cap': {
      const mc = args.match(/^(\d+)\s+"(.+)"$/);
      if (!mc) erro('use @cap 1 "Título"');
      return { t: 'cap', numero: Number(mc![1]), titulo: mc![2] };
    }
    case 'fundo':
    case 'musica':
    case 'som':
    case 'anota':
    case 'final':
    case 'vai':
    case 'sai': {
      if (partes.length !== 1) erro(`@${cmd} pede um argumento`);
      const id = cmd === 'sai' ? partes[0].toLowerCase() : partes[0];
      if (cmd === 'vai') return { t: 'vai', destino: id };
      return { t: cmd, id } as Linha;
    }
    case 'entra': {
      const id = partes[0]?.toLowerCase();
      if (!id) erro('@entra pede personagem');
      let expr: Expressao = 'neutra';
      let pos: Posicao = 'centro';
      for (const p of partes.slice(1)) {
        if (ehExpr(p)) expr = p;
        else if ((POSICOES as string[]).includes(p)) pos = p as Posicao;
        else erro(`argumento de @entra desconhecido: ${p}`);
      }
      return { t: 'entra', id: id!, expr, pos };
    }
    case 'expr': {
      if (partes.length !== 2 || !ehExpr(partes[1])) erro('use @expr id expressao');
      return { t: 'expr', id: partes[0].toLowerCase(), expr: partes[1] as Expressao };
    }
    case 'idade': {
      if (!(IDADES as string[]).includes(args)) erro('idade inválida');
      return { t: 'idade', idade: args as Idade };
    }
    case 'muda':
      return { t: 'muda', efeitos: lerEfeitos(args, () => erro(`efeito inválido: ${args}`)) };
    case 'marca':
    case 'desmarca':
      if (!/^[a-z0-9_]+$/.test(args)) erro('marca inválida');
      return { t: 'muda', efeitos: [{ tipo: 'marca', nome: args, ligar: cmd === 'marca' }] };
    case 'se': {
      const ms = args.match(/^(.+?)\s*->\s*([a-z0-9_]+)$/);
      if (!ms) erro('use @se condição -> cena');
      return { t: 'se', condicoes: lerCondicoes(ms![1], () => erro(`condição inválida: ${ms![1]}`)), destino: ms![2] };
    }
    case 'roupa': {
      const mr = args.match(/^"(.+)"$/);
      return { t: 'roupa', titulo: mr ? mr[1] : 'Escolha o visual' };
    }
    case 'zap': {
      if (args === 'fim') return { t: 'zap', grupo: null };
      const mz = args.match(/^"(.+)"$/);
      if (!mz) erro('use @zap "Nome do grupo" ou @zap fim');
      return { t: 'zap', grupo: mz![1] };
    }
    case 'desafio': {
      const md = args.match(/^([a-z0-9_]+)\s*->\s*([a-z0-9_]+)\s*\|\s*([a-z0-9_]+)$/);
      if (!md) erro('use @desafio id -> acerto | erro');
      return { t: 'desafio', id: md![1], acerto: md![2], erro: md![3] };
    }
    default:
      return erro(`comando desconhecido: @${cmd}`);
  }
}
