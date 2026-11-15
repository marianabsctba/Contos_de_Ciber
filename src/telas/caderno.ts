import { el, modal } from '../ui';
import { carregar } from '../motor/salvar';
import { som } from '../som/tocador';
import type { Historia } from '../motor/tipos';

export function abrirCaderno(h: Historia): void {
  const liberadas = new Set(carregar().notas);
  som.efeito('pagina');
  const total = h.notas.filter((n) => liberadas.has(n.id)).length;
  modal(
    el(
      'div',
      { class: 'caderno' },
      el('h3', {}, '📓 Caderno de ciber'),
      el('p', { class: 'dica' }, `${total} de ${h.notas.length} páginas. Cada coisa que a protagonista aprende vira uma página aqui.`),
      ...h.notas.map((n) =>
        liberadas.has(n.id)
          ? el(
              'details',
              { class: 'pagina' },
              el('summary', {}, n.titulo),
              el('p', {}, n.texto),
              el('p', {}, el('b', {}, 'Na vida real: '), n.exemplo),
              el('p', {}, el('b', {}, 'Como se proteger: '), n.defesa),
            )
          : el('div', { class: 'pagina trancada' }, '🔒 Página ainda não descoberta'),
      ),
    ),
  );
}
