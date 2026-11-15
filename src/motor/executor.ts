import type { Condicao, Efeito, Expressao, Historia, Idade, Linha, Opcao, Posicao, Roteiro, Visual } from './tipos';

export interface NoPalco {
  id: string;
  expr: Expressao;
  pos: Posicao;
}

export interface Estado {
  historia: string;
  cena: string;
  pos: number;
  vars: Record<string, number>;
  marcas: string[];
  fundo: string;
  musica: string;
  palco: NoPalco[];
  idade: Idade;
  exprEu: Expressao;
  nome: string;
  visual: Visual;
  capitulo: { numero: number; titulo: string };
  /** cópia do estado no começo do capítulo, para recomeçar */
  inicioCapitulo?: string;
  terminou?: string;
  /** conversa aberta no celular e suas últimas mensagens */
  zap?: string;
  zapLog?: MensagemZap[];
  zapUltima?: string;
}

export interface MensagemZap {
  quem: string;
  texto: string;
}

export type Evento =
  | { t: 'narra'; texto: string }
  | { t: 'pensa'; texto: string }
  | { t: 'fala'; quem: string; texto: string }
  | { t: 'cap'; numero: number; titulo: string }
  | { t: 'escolha'; pergunta?: string; opcoes: (Opcao & { liberada: boolean })[] }
  | { t: 'roupa'; titulo: string }
  | { t: 'desafio'; id: string }
  | { t: 'final'; id: string }
  | { t: 'anota'; id: string };

export const VARS_INICIAIS: Record<string, number> = { tecnica: 0, etica: 0, grana: 0, reputacao: 0, saude: 5 };

export function novoEstado(h: Historia, nome: string, visual: Visual): Estado {
  return {
    historia: h.id,
    cena: h.inicio,
    pos: 0,
    vars: { ...(h.varsIniciais ?? VARS_INICIAIS) },
    marcas: [],
    fundo: '',
    musica: 'nenhuma',
    palco: [],
    idade: 'crianca',
    exprEu: 'neutra',
    nome,
    visual: { ...visual },
    capitulo: { numero: 0, titulo: '' },
  };
}

export function interpolar(texto: string, e: Estado): string {
  return texto.replace(/\{nome\}/g, e.nome);
}

export function testa(conds: Condicao[], e: Estado): boolean {
  return conds.every((c) => {
    if (c.tipo === 'marca') return e.marcas.includes(c.nome) !== c.negada;
    const v = e.vars[c.nome] ?? 0;
    switch (c.op) {
      case '>=': return v >= c.valor;
      case '<=': return v <= c.valor;
      case '>': return v > c.valor;
      case '<': return v < c.valor;
      default: return v === c.valor;
    }
  });
}

export function aplica(efs: Efeito[], e: Estado): void {
  for (const ef of efs) {
    if (ef.tipo === 'marca') {
      if (ef.ligar && !e.marcas.includes(ef.nome)) e.marcas.push(ef.nome);
      if (!ef.ligar) e.marcas = e.marcas.filter((m) => m !== ef.nome);
      continue;
    }
    const v = e.vars[ef.nome] ?? 0;
    e.vars[ef.nome] = ef.op === '+' ? v + ef.valor : ef.op === '-' ? v - ef.valor : ef.valor;
    if (ef.nome === 'saude' || ef.nome === 'paciencia' || ef.nome === 'risco') e.vars[ef.nome] = Math.max(0, Math.min(10, e.vars[ef.nome]));
    if (ef.nome === 'minutos') e.vars.minutos = Math.max(0, e.vars.minutos);
    if (ef.nome === 'bateria') e.vars.bateria = Math.max(0, Math.min(100, e.vars.bateria));
  }
}

export class Executor {
  /** chamado quando uma nota é liberada ou um final alcançado, para o perfil global */
  aoAnotar: (id: string) => void = () => {};
  aoSom: (id: string) => void = () => {};

  constructor(public roteiro: Roteiro, public estado: Estado) {}

  private linha(): Linha {
    const cena = this.roteiro.cenas.get(this.estado.cena);
    if (!cena) throw new Error(`cena inexistente: ${this.estado.cena}`);
    const l = cena.linhas[this.estado.pos];
    if (!l) throw new Error(`a cena ${cena.id} terminou sem @vai, escolha ou @final`);
    return l;
  }

  pular(destino: string): void {
    if (!this.roteiro.cenas.has(destino)) throw new Error(`cena inexistente: ${destino}`);
    this.estado.cena = destino;
    this.estado.pos = 0;
  }

  /** roda comandos até chegar em algo que precisa da jogadora */
  executar(): Evento {
    const e = this.estado;
    for (let guarda = 0; guarda < 100000; guarda++) {
      const l = this.linha();
      switch (l.t) {
        case 'narra':
          this.registrarZap('', interpolar(l.texto, e));
          return { t: 'narra', texto: interpolar(l.texto, e) };
        case 'pensa': return { t: 'pensa', texto: interpolar(l.texto, e) };
        case 'fala':
          if (l.expr) {
            if (l.quem === 'eu') e.exprEu = l.expr;
            const p = e.palco.find((x) => x.id === l.quem);
            if (p) p.expr = l.expr;
          }
          this.registrarZap(l.quem, interpolar(l.texto, e));
          return { t: 'fala', quem: l.quem, texto: interpolar(l.texto, e) };
        case 'cap': {
          e.capitulo = { numero: l.numero, titulo: l.titulo };
          const copia: Estado = { ...e, inicioCapitulo: undefined };
          e.inicioCapitulo = JSON.stringify(copia);
          return { t: 'cap', numero: l.numero, titulo: l.titulo };
        }
        case 'escolha':
          return {
            t: 'escolha',
            pergunta: l.pergunta && interpolar(l.pergunta, e),
            opcoes: l.opcoes.map((o) => ({ ...o, texto: interpolar(o.texto, e), liberada: testa(o.condicoes, e) })),
          };
        case 'roupa': return { t: 'roupa', titulo: l.titulo };
        case 'desafio': return { t: 'desafio', id: l.id };
        case 'final':
          e.terminou = l.id;
          return { t: 'final', id: l.id };
        case 'anota':
          this.aoAnotar(l.id);
          return { t: 'anota', id: l.id };
        case 'zap':
          e.zap = l.grupo ?? undefined;
          e.zapLog = [];
          e.zapUltima = undefined;
          break;
        case 'fundo': e.fundo = l.id; break;
        case 'musica': e.musica = l.id; break;
        case 'som': this.aoSom(l.id); break;
        case 'entra':
          e.palco = e.palco.filter((p) => p.id !== l.id && p.pos !== l.pos);
          e.palco.push({ id: l.id, expr: l.expr, pos: l.pos });
          break;
        case 'sai':
          e.palco = l.id === 'todos' ? [] : e.palco.filter((p) => p.id !== l.id);
          break;
        case 'expr':
          if (l.id === 'eu') e.exprEu = l.expr;
          else {
            const p = e.palco.find((x) => x.id === l.id);
            if (p) p.expr = l.expr;
          }
          break;
        case 'idade': e.idade = l.idade; break;
        case 'muda': aplica(l.efeitos, e); break;
        case 'se':
          if (testa(l.condicoes, e)) {
            this.pular(l.destino);
            continue;
          }
          break;
        case 'vai':
          this.pular(l.destino);
          continue;
      }
      e.pos++;
    }
    throw new Error('laço infinito no roteiro');
  }

  /** guarda a mensagem no histórico da conversa, sem repetir ao recarregar */
  private registrarZap(quem: string, texto: string): void {
    const e = this.estado;
    if (!e.zap) return;
    const chave = `${e.cena}:${e.pos}`;
    if (e.zapUltima === chave) return;
    e.zapUltima = chave;
    e.zapLog = [...(e.zapLog ?? []), { quem, texto }].slice(-40);
  }

  avancar(): Evento {
    this.estado.pos++;
    return this.executar();
  }

  escolher(i: number): Evento {
    const l = this.linha();
    if (l.t !== 'escolha') throw new Error('não há escolha aqui');
    const o = l.opcoes[i];
    if (!o || !testa(o.condicoes, this.estado)) throw new Error('opção indisponível');
    aplica(o.efeitos, this.estado);
    this.pular(o.destino);
    return this.executar();
  }

  resolverDesafio(acertou: boolean): Evento {
    const l = this.linha();
    if (l.t !== 'desafio') throw new Error('não há desafio aqui');
    aplica([{ tipo: 'var', nome: 'tecnica', op: acertou ? '+' : '-', valor: acertou ? 1 : 0 }], this.estado);
    this.pular(acertou ? l.acerto : l.erro);
    return this.executar();
  }
}
