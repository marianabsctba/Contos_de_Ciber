import { lerRoteiro } from './roteiro';
import { Executor, novoEstado } from './executor';
import type { Historia, Linha, Roteiro } from './tipos';

export interface Recursos {
  fundos: Set<string>;
  musicas: Set<string>;
  efeitos: Set<string>;
}

export interface Relatorio {
  erros: string[];
  avisos: string[];
  finaisAlcancados: Record<string, number>;
  cenas: number;
  falas: number;
  palavras: number;
}

function destinos(l: Linha): string[] {
  switch (l.t) {
    case 'vai': return [l.destino];
    case 'se': return [l.destino];
    case 'escolha': return l.opcoes.map((o) => o.destino);
    case 'desafio': return [l.acerto, l.erro];
    default: return [];
  }
}

const TERMINAIS = new Set(['vai', 'escolha', 'desafio', 'final']);

export function validar(h: Historia, rec: Recursos, partidas = 4000): Relatorio {
  const erros: string[] = [];
  const avisos: string[] = [];
  let r: Roteiro;
  try {
    r = lerRoteiro(h.fontes);
  } catch (e) {
    return { erros: [String((e as Error).message)], avisos, finaisAlcancados: {}, cenas: 0, falas: 0, palavras: 0 };
  }
  const pers = new Set(['eu', ...h.personagens.map((p) => p.id)]);
  const desafios = new Set(h.desafios.map((d) => d.id));
  const notas = new Set(h.notas.map((n) => n.id));
  const finais = new Set(h.finais.map((f) => f.id));
  let falas = 0;
  let palavras = 0;

  if (!r.cenas.has(h.inicio)) erros.push(`cena inicial ${h.inicio} não existe`);
  for (const id of [...desafios]) if (h.desafios.filter((d) => d.id === id).length > 1) erros.push(`desafio repetido: ${id}`);
  for (const id of [...notas]) if (h.notas.filter((d) => d.id === id).length > 1) erros.push(`nota repetida: ${id}`);

  for (const cena of r.cenas.values()) {
    const onde = `${cena.arquivo.replace(/^.*\//, '')}:${cena.linhaOrigem} (${cena.id})`;
    const ult = cena.linhas[cena.linhas.length - 1];
    if (!ult || !TERMINAIS.has(ult.t)) erros.push(`${onde}: cena termina sem @vai, escolha, @desafio ou @final`);
    cena.linhas.forEach((l, i) => {
      if (TERMINAIS.has(l.t) && i < cena.linhas.length - 1) erros.push(`${onde}: há linhas depois de ${l.t} que nunca serão lidas`);
      for (const d of destinos(l)) if (!r.cenas.has(d)) erros.push(`${onde}: destino inexistente ${d}`);
      if (l.t === 'fala') {
        falas++;
        if (!pers.has(l.quem)) erros.push(`${onde}: personagem desconhecido ${l.quem}`);
      }
      if (l.t === 'narra' || l.t === 'pensa' || l.t === 'fala') palavras += l.texto.split(/\s+/).length;
      if ((l.t === 'entra' || l.t === 'expr') && !pers.has(l.id)) erros.push(`${onde}: personagem desconhecido ${l.id}`);
      if (l.t === 'entra' && l.id === 'eu') erros.push(`${onde}: a protagonista não usa @entra, ela aparece sozinha ao falar`);
      if (l.t === 'fundo' && !rec.fundos.has(l.id)) erros.push(`${onde}: cenário inexistente ${l.id}`);
      if (l.t === 'musica' && l.id !== 'nenhuma' && !rec.musicas.has(l.id)) erros.push(`${onde}: música inexistente ${l.id}`);
      if (l.t === 'som' && !rec.efeitos.has(l.id)) erros.push(`${onde}: efeito inexistente ${l.id}`);
      if (l.t === 'desafio' && !desafios.has(l.id)) erros.push(`${onde}: desafio inexistente ${l.id}`);
      if (l.t === 'anota' && !notas.has(l.id)) erros.push(`${onde}: nota inexistente ${l.id}`);
      if (l.t === 'final' && !finais.has(l.id)) erros.push(`${onde}: final inexistente ${l.id}`);
      if (/[–—]/.test(JSON.stringify(l))) erros.push(`${onde}: travessão no texto`);
    });
  }

  // alcance pelo grafo
  const vistos = new Set<string>();
  const fila = [h.inicio];
  while (fila.length) {
    const id = fila.pop()!;
    if (vistos.has(id) || !r.cenas.has(id)) continue;
    vistos.add(id);
    for (const l of r.cenas.get(id)!.linhas) fila.push(...destinos(l));
  }
  for (const id of r.ordem) if (!vistos.has(id)) avisos.push(`cena nunca alcançada: ${id}`);

  // partidas aleatórias respeitando condições
  const finaisAlcancados: Record<string, number> = {};
  if (erros.length === 0) {
    let semente = 12345;
    const rnd = () => ((semente = (semente * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    for (let n = 0; n < partidas; n++) {
      const ex = new Executor(r, novoEstado(h, 'Teste', h.protagonistaPadrao.visual));
      try {
        let ev = ex.executar();
        for (let passo = 0; passo < 20000; passo++) {
          if (ev.t === 'final') {
            finaisAlcancados[ev.id] = (finaisAlcancados[ev.id] ?? 0) + 1;
            break;
          }
          if (ev.t === 'escolha') {
            const livres = ev.opcoes.map((o, i) => (o.liberada ? i : -1)).filter((i) => i >= 0);
            if (!livres.length) throw new Error(`todas as opções travadas em ${ex.estado.cena}`);
            ev = ex.escolher(livres[Math.floor(rnd() * livres.length)]);
          } else if (ev.t === 'desafio') {
            ev = ex.resolverDesafio(rnd() < 0.6);
          } else {
            ev = ex.avancar();
          }
          if (passo === 19999) throw new Error(`partida sem fim perto de ${ex.estado.cena}`);
        }
      } catch (e) {
        erros.push(`partida ${n}: ${(e as Error).message}`);
        break;
      }
    }
    for (const f of finais) if (!finaisAlcancados[f]) avisos.push(`final nunca alcançado em ${partidas} partidas: ${f}`);
  }
  return { erros, avisos, finaisAlcancados, cenas: r.cenas.size, falas, palavras };
}
