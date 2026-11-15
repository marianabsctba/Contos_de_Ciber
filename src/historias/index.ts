import type { Historia } from '../motor/tipos';
import { sinalFraco } from './sinal_fraco/historia';
import { grupoDaFamilia } from './grupo_da_familia/historia';
import { dpoApavorada } from './dpo_apavorada/historia';
import { maquininha } from './maquininha/historia';

export const HISTORIAS: Historia[] = [sinalFraco, grupoDaFamilia, dpoApavorada, maquininha];

/** histórias anunciadas na biblioteca, ainda sem roteiro */
export const EM_BREVE: { titulo: string; sinopse: string; cor: string; fundo: string }[] = [
];
