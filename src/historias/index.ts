import type { Historia } from '../motor/tipos';
import { sinalFraco } from './sinal_fraco/historia';
import { grupoDaFamilia } from './grupo_da_familia/historia';

export const HISTORIAS: Historia[] = [sinalFraco, grupoDaFamilia];

/** histórias anunciadas na biblioteca, ainda sem roteiro */
export const EM_BREVE: { titulo: string; sinopse: string; cor: string; fundo: string }[] = [
  { titulo: 'A DPO Apavorada', sinopse: 'A clínica vazou a planilha de pacientes num grupo de WhatsApp. Você é a encarregada de dados há três dias.', cor: '#9b5de5', fundo: 'hospital_corredor' },
  { titulo: 'Maquininha', sinopse: 'O motoboy chegou com a maquininha de visor quebrado. Uma história sobre o golpe mais brasileiro de todos.', cor: '#f4a261', fundo: 'rua_interior_noite' },
];
