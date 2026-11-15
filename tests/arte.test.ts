import { describe, expect, it } from 'vitest';
import { CENARIOS } from '../src/arte/cenarios';
import { ROUPAS, CABELOS, desenharPersonagem, desenharRosto } from '../src/arte/personagem';
import { MUSICAS, EFEITOS } from '../src/som/musica';
import { HISTORIAS } from '../src/historias';
import { EXPRESSOES } from '../src/motor/tipos';
import { FUNDOS, MUSICAS_IDS, EFEITOS_IDS } from './ids';

describe('contrato de arte e som', () => {
  it('todo cenário, música e efeito combinado existe', () => {
    expect(FUNDOS.filter((f) => !CENARIOS[f])).toEqual([]);
    expect(MUSICAS_IDS.filter((m) => !MUSICAS[m])).toEqual([]);
    expect(EFEITOS_IDS.filter((e) => !EFEITOS[e])).toEqual([]);
  });

  it('roupas e cabelos de todos os personagens existem', () => {
    const roupas = new Set(ROUPAS.map((r) => r.id));
    const cabelos = new Set(CABELOS.map((c) => c.id));
    for (const h of HISTORIAS) {
      for (const p of [...h.personagens.map((x) => x.visual), h.protagonistaPadrao.visual]) {
        expect(roupas.has(p.roupa), p.roupa).toBe(true);
        expect(cabelos.has(p.cabelo), p.cabelo).toBe(true);
      }
    }
  });

  it('desenha todo personagem em toda expressão', () => {
    for (const h of HISTORIAS) {
      for (const p of h.personagens) {
        for (const e of EXPRESSOES) {
          expect(desenharPersonagem(p.visual, e)).toMatch(/^<svg[\s\S]*<\/svg>$/);
          expect(desenharRosto(p.visual, e)).toMatch(/^<svg[\s\S]*<\/svg>$/);
        }
      }
    }
  });
});
