import { describe, expect, it } from 'vitest';
import { lerRoteiro } from '../src/motor/roteiro';
import { Executor, novoEstado } from '../src/motor/executor';
import { bitsSenha } from '../src/telas/desafio';
import type { Historia } from '../src/motor/tipos';

const h = {
  id: 't',
  inicio: 'a',
  protagonistaPadrao: { nome: 'Ana', visual: { pele: 0, cabelo: 'coque', corCabelo: 0, roupa: 'x', idade: 'crianca' } },
} as unknown as Historia;

const fonte = `
=== a
@cap 1 "Começo"
@fundo lan_house
@entra cida feliz esquerda
CIDA: Oi, {nome}!
EU [feliz]: Oi!
? E agora?
* Pagar -> b {grana-1 marca:pagou}
* Fiado -> c [se grana>=5]
** Especial -> c {tecnica+2}

=== b
@se marca:pagou -> c
@vai a

=== c
@final fim
`;

describe('motor', () => {
  it('lê e executa com interpolação, escolhas, condições e marcas', () => {
    const r = lerRoteiro({ 'x.txt': fonte });
    const ex = new Executor(r, novoEstado(h, 'Ana', h.protagonistaPadrao.visual));
    expect(ex.executar()).toMatchObject({ t: 'cap', numero: 1 });
    expect(ex.avancar()).toEqual({ t: 'fala', quem: 'cida', texto: 'Oi, Ana!' });
    expect(ex.estado.fundo).toBe('lan_house');
    expect(ex.estado.palco).toEqual([{ id: 'cida', expr: 'feliz', pos: 'esquerda' }]);
    ex.avancar();
    expect(ex.estado.exprEu).toBe('feliz');
    const esc = ex.avancar();
    expect(esc.t).toBe('escolha');
    if (esc.t !== 'escolha') return;
    expect(esc.opcoes.map((o) => o.liberada)).toEqual([true, false, true]);
    expect(esc.opcoes[2].especial).toBe(true);
    expect(ex.escolher(0)).toEqual({ t: 'final', id: 'fim' });
    expect(ex.estado.vars.grana).toBe(-1);
    expect(ex.estado.marcas).toContain('pagou');
  });

  it('recusa linha estranha com arquivo e linha', () => {
    expect(() => lerRoteiro({ 'y.txt': '=== a\nisso não é nada' })).toThrow(/y.txt:2/);
  });

  it('estado salvo retoma na mesma fala', () => {
    const r = lerRoteiro({ 'x.txt': fonte });
    const ex = new Executor(r, novoEstado(h, 'Ana', h.protagonistaPadrao.visual));
    ex.executar();
    ex.avancar();
    const copia = JSON.parse(JSON.stringify(ex.estado));
    const ex2 = new Executor(r, copia);
    expect(ex2.executar()).toEqual({ t: 'fala', quem: 'cida', texto: 'Oi, Ana!' });
  });
});

describe('medidor de senha', () => {
  it('senha óbvia é fraca e frase longa é forte', () => {
    expect(bitsSenha('123456').bits).toBeLessThan(20);
    expect(bitsSenha('Jessica2010').bits).toBeLessThan(60);
    expect(bitsSenha('pamonha-quente-na-caixa-dagua').bits).toBeGreaterThan(80);
  });
});

describe('modo conversa', () => {
  const zap = `
=== a
@muda minutos=40
@zap "Família Reunida"
NEIDE: [audio 1:02] oi gente
> Tia Neide apagou esta mensagem
EU: Tia, não manda mais nada!
@muda minutos-5
@zap fim
@final fim
`;
  it('guarda as mensagens sem repetir ao recarregar e fecha o celular', () => {
    const r = lerRoteiro({ 'z.txt': zap });
    const ex = new Executor(r, novoEstado(h, 'Ana', h.protagonistaPadrao.visual));
    ex.executar();
    expect(ex.estado.zap).toBe('Família Reunida');
    const copia = new Executor(r, JSON.parse(JSON.stringify(ex.estado)));
    copia.executar();
    expect(copia.estado.zapLog).toHaveLength(1);
    ex.avancar();
    ex.avancar();
    expect(ex.estado.zapLog?.map((m) => m.quem)).toEqual(['neide', '', 'eu']);
    expect(ex.avancar()).toEqual({ t: 'final', id: 'fim' });
    expect(ex.estado.zap).toBeUndefined();
    expect(ex.estado.vars.minutos).toBe(35);
  });
});
