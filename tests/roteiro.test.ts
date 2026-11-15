import { describe, expect, it } from 'vitest';
import { validar } from '../src/motor/validar';
import { HISTORIAS } from '../src/historias';
import { FUNDOS, MUSICAS_IDS, EFEITOS_IDS } from './ids';

const rec = { fundos: new Set(FUNDOS), musicas: new Set(MUSICAS_IDS), efeitos: new Set(EFEITOS_IDS) };

describe.each(HISTORIAS.map((h) => [h.titulo, h] as const))('%s', (_t, h) => {
  const rel = validar(h, rec);
  it('roteiro sem erros', () => {
    expect(rel.erros).toEqual([]);
  });
  it('toda cena e todo final alcançáveis', () => {
    console.log(`${h.titulo}: ${rel.cenas} cenas, ${rel.falas} falas, ${rel.palavras} palavras`, rel.finaisAlcancados);
    expect(rel.avisos).toEqual([]);
  });
});
