import { el, modal } from '../ui';
import { carregar } from '../motor/salvar';
import type { Historia } from '../motor/tipos';

const ROTULO = { bom: 'Final feliz', agridoce: 'Final agridoce', ruim: 'Final ruim' };

export function abrirFinais(h: Historia): void {
  const vistos = new Set(carregar().finais[h.id] ?? []);
  modal(
    el(
      'div',
      { class: 'galeria-finais' },
      el('h3', {}, `Finais de ${h.titulo}`),
      el('p', { class: 'dica' }, `${vistos.size} de ${h.finais.length} descobertos. Escolhas diferentes, vida diferente.`),
      ...h.finais.map((f) =>
        vistos.has(f.id)
          ? el('div', { class: `cartao-final final-${f.tipo}` }, el('small', {}, ROTULO[f.tipo]), el('strong', {}, f.titulo), el('p', {}, f.texto))
          : el('div', { class: `cartao-final trancado final-${f.tipo}` }, el('small', {}, ROTULO[f.tipo]), el('strong', {}, '???'), el('p', {}, 'Ainda não descoberto.')),
      ),
    ),
  );
}
