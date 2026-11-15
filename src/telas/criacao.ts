import { el, svg, trocarTela } from '../ui';
import { novoEstado } from '../motor/executor';
import { salvarProgresso } from '../motor/salvar';
import { desenharPersonagem, TONS_PELE, CABELOS, CORES_CABELO, ACESSORIOS } from '../arte/personagem';
import { CENARIOS } from '../arte/cenarios';
import { som } from '../som/tocador';
import { telaDetalhe } from './detalhe';
import { telaLeitura } from './leitura';
import type { Historia, Visual } from '../motor/tipos';

export function telaCriacao(h: Historia): void {
  const visual: Visual = { ...h.protagonistaPadrao.visual };
  let nome = h.protagonistaPadrao.nome;
  const previa = el('div', { class: 'criacao-previa' });
  const desenhar = () => {
    previa.innerHTML = desenharPersonagem(visual, 'feliz');
  };
  desenhar();

  const grupo = (titulo: string, itens: { rotulo: string; cor?: string; ativo: () => boolean; escolher: () => void }[]) => {
    const linha = el('div', { class: 'opcoes-visual' });
    const pintar = () => {
      linha.replaceChildren(
        ...itens.map((it) =>
          el(
            'button',
            {
              class: `chip ${it.ativo() ? 'ativo' : ''} ${it.cor ? 'chip-cor' : ''}`,
              style: it.cor ? `--c:${it.cor}` : '',
              'aria-label': it.rotulo,
              title: it.rotulo,
              onclick: () => {
                it.escolher();
                som.efeito('clique');
                desenhar();
                pintar();
              },
            },
            it.cor ? '' : it.rotulo,
          ),
        ),
      );
    };
    pintar();
    return el('div', { class: 'grupo-visual' }, el('h4', {}, titulo), linha);
  };

  const campoNome = el('input', {
    class: 'campo-nome',
    value: nome,
    maxlength: 16,
    'aria-label': 'Nome da protagonista',
    oninput: (e: Event) => (nome = (e.target as HTMLInputElement).value),
  });

  trocarTela(
    el(
      'div',
      { class: 'tela criacao' },
      svg(CENARIOS['casa_quarto_infancia']?.svg ?? '', 'fundo-cena'),
      el(
        'header',
        { class: 'topo' },
        el('button', { class: 'icone', 'aria-label': 'Voltar', onclick: () => telaDetalhe(h) }, '←'),
        el('h2', {}, 'Crie a sua protagonista'),
      ),
      previa,
      el(
        'div',
        { class: 'painel-criacao' },
        el('label', { class: 'rotulo-nome' }, 'Nome', campoNome),
        grupo('Tom de pele', TONS_PELE.map((c, i) => ({ rotulo: `Tom ${i + 1}`, cor: c, ativo: () => visual.pele === i, escolher: () => (visual.pele = i) }))),
        grupo('Cabelo', CABELOS.map((c) => ({ rotulo: c.nome, ativo: () => visual.cabelo === c.id, escolher: () => (visual.cabelo = c.id) }))),
        grupo('Cor do cabelo', CORES_CABELO.map((c, i) => ({ rotulo: `Cor ${i + 1}`, cor: c, ativo: () => visual.corCabelo === i, escolher: () => (visual.corCabelo = i) }))),
        grupo('Acessório', ACESSORIOS.map((a) => ({ rotulo: a.nome, ativo: () => (visual.acessorio ?? 'nenhum') === a.id, escolher: () => (visual.acessorio = a.id === 'nenhum' ? undefined : a.id) }))),
        el(
          'button',
          {
            class: 'botao grande',
            onclick: () => {
              const n = nome.trim() || h.protagonistaPadrao.nome;
              salvarProgresso(novoEstado(h, n, visual));
              som.efeito('especial');
              telaLeitura(h);
            },
          },
          'Começar a história',
        ),
      ),
    ),
  );
}
