import { el } from '../ui';
import { desenharPersonagem, ROUPAS, ACESSORIOS, CABELOS } from '../arte/personagem';
import { som } from '../som/tocador';
import type { Idade, Visual } from '../motor/tipos';

/** guarda-roupa estilo carrossel; tudo de graça */
export function guardaRoupa(app: HTMLElement, titulo: string, visual: Visual, idade: Idade, pronto: (v: Visual) => void): void {
  const v: Visual = { ...visual, idade };
  const roupas = ROUPAS.filter((r) => r.idades.includes(idade));
  let i = Math.max(0, roupas.findIndex((r) => r.id === v.roupa));
  if (!roupas.find((r) => r.id === v.roupa) && roupas[0]) v.roupa = roupas[0].id;

  const previa = el('div', { class: 'roupa-previa' });
  const nomeRoupa = el('strong', {});
  const piada = el('span', { class: 'piada-preco' });
  const contador = el('small', {});
  const desenhar = () => {
    const r = roupas[i];
    if (r) v.roupa = r.id;
    previa.innerHTML = desenharPersonagem(v, 'feliz');
    previa.classList.remove('entra');
    void previa.offsetWidth;
    previa.classList.add('entra');
    nomeRoupa.textContent = r?.nome ?? '';
    piada.replaceChildren(el('s', {}, `💎 ${12 + ((i * 5) % 9)}`), ' ', el('b', {}, 'GRÁTIS'), ' ', r?.piada ?? '');
    contador.textContent = `${i + 1} de ${roupas.length}`;
  };
  const mover = (d: number) => {
    i = (i + d + roupas.length) % roupas.length;
    som.efeito('clique');
    desenhar();
  };

  let inicioX = 0;
  const tela = el(
    'div',
    { class: 'guarda-roupa' },
    el('h2', {}, titulo),
    el(
      'div',
      { class: 'carrossel' },
      el('button', { class: 'seta', 'aria-label': 'Anterior', onclick: () => mover(-1) }, '‹'),
      previa,
      el('button', { class: 'seta', 'aria-label': 'Próxima', onclick: () => mover(1) }, '›'),
    ),
    el('div', { class: 'roupa-info' }, nomeRoupa, contador, piada),
    el(
      'details',
      { class: 'mais-visual' },
      el('summary', {}, 'Mudar cabelo e acessório'),
      el(
        'div',
        { class: 'opcoes-visual' },
        ...CABELOS.map((c) =>
          el('button', { class: 'chip', onclick: () => { v.cabelo = c.id; desenhar(); } }, c.nome),
        ),
      ),
      el(
        'div',
        { class: 'opcoes-visual' },
        ...ACESSORIOS.map((a) =>
          el('button', { class: 'chip', onclick: () => { v.acessorio = a.id === 'nenhum' ? undefined : a.id; desenhar(); } }, a.nome),
        ),
      ),
    ),
    el(
      'button',
      {
        class: 'botao grande',
        onclick: () => {
          som.efeito('especial');
          tela.remove();
          pronto(v);
        },
      },
      'Usar este visual',
    ),
  );
  previa.addEventListener('pointerdown', (e) => (inicioX = e.clientX));
  previa.addEventListener('pointerup', (e) => {
    const dx = e.clientX - inicioX;
    if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1);
  });
  app.append(tela);
  desenhar();
}
