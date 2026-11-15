import { el, svg, trocarTela, toast } from '../ui';
import { HISTORIAS, EM_BREVE } from '../historias';
import { carregar } from '../motor/salvar';
import { CENARIOS } from '../arte/cenarios';
import { desenharPersonagem } from '../arte/personagem';
import { som } from '../som/tocador';
import { telaDetalhe } from './detalhe';
import { abrirConfig } from './config';
import type { Historia } from '../motor/tipos';

export function moedas(): HTMLElement {
  return el(
    'div',
    { class: 'moedas', title: 'Tudo de graça' },
    el('button', { class: 'moeda', onclick: () => toast('Diamantes infinitos. Aqui não tem paywall, só firewall.') }, '💎 ∞'),
    el('button', { class: 'moeda', onclick: () => toast('Passes infinitos. Capítulo novo não espera 3 horas.') }, '🎟️ ∞'),
  );
}

export function capa(h: Historia, grande = false): HTMLElement {
  const fundo = CENARIOS[h.capa.fundo]?.svg ?? '';
  const p = carregar().progresso[h.id];
  const visual = p ? p.visual : h.protagonistaPadrao.visual;
  const c = el(
    'div',
    { class: grande ? 'capa capa-grande' : 'capa', style: `--cor:${h.capa.cor}` },
    svg(fundo, 'capa-fundo'),
    svg(desenharPersonagem({ ...visual, idade: grande ? 'adulta' : visual.idade }, 'feliz'), 'capa-pessoa'),
    el('div', { class: 'capa-titulo' }, el('strong', {}, h.titulo), el('span', {}, h.subtitulo)),
  );
  return c;
}

export function telaBiblioteca(): void {
  som.tocar('menu');
  const perfil = carregar();
  const destaque = HISTORIAS[0];
  const andamento = HISTORIAS.filter((h) => perfil.progresso[h.id] && !perfil.progresso[h.id].terminou);

  const tela = el(
    'div',
    { class: 'tela biblioteca' },
    el(
      'header',
      { class: 'topo' },
      el('div', { class: 'logo' }, el('span', { class: 'logo-a' }, 'Contos'), el('span', { class: 'logo-b' }, 'de Ciber')),
      moedas(),
      el('button', { class: 'icone', 'aria-label': 'Configurações', onclick: () => abrirConfig() }, '⚙️'),
    ),
    el(
      'section',
      { class: 'destaque', onclick: () => telaDetalhe(destaque) },
      capa(destaque, true),
      el('div', { class: 'destaque-info' }, el('span', { class: 'selo' }, 'NOVA'), el('p', {}, destaque.sinopse.slice(0, 140) + '...')),
    ),
    andamento.length
      ? el(
          'section',
          { class: 'prateleira' },
          el('h2', {}, 'Continuar lendo'),
          el(
            'div',
            { class: 'linha-capas' },
            ...andamento.map((h) =>
              el(
                'button',
                { class: 'item-capa', onclick: () => telaDetalhe(h) },
                capa(h),
                el('small', {}, `Capítulo ${perfil.progresso[h.id].capitulo.numero || 1}`),
              ),
            ),
          ),
        )
      : null,
    el(
      'section',
      { class: 'prateleira' },
      el('h2', {}, 'Todas as histórias'),
      el(
        'div',
        { class: 'linha-capas' },
        ...HISTORIAS.map((h) => el('button', { class: 'item-capa', onclick: () => telaDetalhe(h) }, capa(h), el('small', {}, h.generos.join(' · ')))),
        ...EM_BREVE.map((b) =>
          el(
            'button',
            { class: 'item-capa em-breve', onclick: () => toast(`${b.titulo}: em breve. ${b.sinopse}`) },
            el(
              'div',
              { class: 'capa', style: `--cor:${b.cor}` },
              svg(CENARIOS[b.fundo]?.svg ?? '', 'capa-fundo'),
              el('div', { class: 'capa-titulo' }, el('strong', {}, b.titulo), el('span', {}, 'Em breve')),
            ),
            el('small', {}, 'Em breve'),
          ),
        ),
      ),
    ),
    el(
      'footer',
      { class: 'rodape' },
      el('p', {}, 'Histórias de ficção. Nomes, cidades e empresas são inventados. A técnica é de verdade.'),
      el('p', {}, el('a', { href: 'https://github.com/marianabsctba/Contos_de_Ciber', target: '_blank', rel: 'noopener' }, 'Código aberto no GitHub')),
    ),
  );
  trocarTela(tela);
}
