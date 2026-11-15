export type Posicao = 'esquerda' | 'centro' | 'direita';
export type Idade = 'crianca' | 'adolescente' | 'adulta';
export const EXPRESSOES = ['neutra', 'feliz', 'triste', 'brava', 'surpresa', 'pensativa', 'envergonhada', 'assustada'] as const;
export type Expressao = (typeof EXPRESSOES)[number];

export type Efeito =
  | { tipo: 'var'; nome: string; op: '+' | '-' | '='; valor: number }
  | { tipo: 'marca'; nome: string; ligar: boolean };

export type Condicao =
  | { tipo: 'var'; nome: string; op: '>=' | '<=' | '>' | '<' | '='; valor: number }
  | { tipo: 'marca'; nome: string; negada: boolean };

export interface Opcao {
  texto: string;
  destino: string;
  efeitos: Efeito[];
  condicoes: Condicao[];
  especial: boolean;
}

export type Linha =
  | { t: 'narra'; texto: string }
  | { t: 'pensa'; texto: string }
  | { t: 'fala'; quem: string; expr?: Expressao; texto: string }
  | { t: 'cap'; numero: number; titulo: string }
  | { t: 'fundo'; id: string }
  | { t: 'musica'; id: string }
  | { t: 'som'; id: string }
  | { t: 'entra'; id: string; expr: Expressao; pos: Posicao }
  | { t: 'sai'; id: string }
  | { t: 'expr'; id: string; expr: Expressao }
  | { t: 'idade'; idade: Idade }
  | { t: 'muda'; efeitos: Efeito[] }
  | { t: 'se'; condicoes: Condicao[]; destino: string }
  | { t: 'vai'; destino: string }
  | { t: 'roupa'; titulo: string }
  | { t: 'desafio'; id: string; acerto: string; erro: string }
  | { t: 'anota'; id: string }
  | { t: 'final'; id: string }
  | { t: 'escolha'; pergunta?: string; opcoes: Opcao[] };

export interface Cena {
  id: string;
  arquivo: string;
  linhaOrigem: number;
  linhas: Linha[];
}

export interface Roteiro {
  cenas: Map<string, Cena>;
  ordem: string[];
}

export interface Personagem {
  id: string;
  nome: string;
  cor: string;
  /** aparência para o desenho em SVG */
  visual: Visual;
  /** personagem que tem a mesma idade da protagonista; a roupa muda por fase */
  cresceJunto?: Partial<Record<Idade, string>>;
}

export interface Visual {
  pele: number;
  cabelo: string;
  corCabelo: number;
  roupa: string;
  acessorio?: string;
  idade: Idade | 'idosa' | 'idoso';
  corpo?: 'f' | 'm';
  barba?: boolean;
}

export type Desafio =
  | {
      id: string;
      tipo: 'quiz';
      titulo: string;
      enunciado: string;
      opcoes: string[];
      certa: number;
      explicacao: string;
    }
  | {
      id: string;
      tipo: 'achar';
      titulo: string;
      enunciado: string;
      /** mensagem montada em trechos; os suspeitos precisam ser marcados */
      trechos: { texto: string; suspeito?: boolean; porque?: string }[];
      minimo: number;
      explicacao: string;
    }
  | {
      id: string;
      tipo: 'ordenar';
      titulo: string;
      enunciado: string;
      /** na ordem certa; o jogo embaralha */
      passos: string[];
      explicacao: string;
    }
  | {
      id: string;
      tipo: 'senha';
      titulo: string;
      enunciado: string;
      /** bits mínimos de entropia estimada */
      minimoBits: number;
      explicacao: string;
    };

export interface Nota {
  id: string;
  titulo: string;
  texto: string;
  exemplo: string;
  defesa: string;
}

export interface Final {
  id: string;
  titulo: string;
  texto: string;
  tipo: 'bom' | 'agridoce' | 'ruim';
}

export interface Historia {
  id: string;
  titulo: string;
  subtitulo: string;
  sinopse: string;
  generos: string[];
  capa: { fundo: string; cor: string };
  inicio: string;
  protagonistaPadrao: { nome: string; visual: Visual };
  personagens: Personagem[];
  desafios: Desafio[];
  notas: Nota[];
  finais: Final[];
  fontes: Record<string, string>;
}
