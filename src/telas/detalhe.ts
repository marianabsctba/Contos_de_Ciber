import { el, trocarTela, modal } from '../ui';
import { carregar, apagarProgresso } from '../motor/salvar';
import { capa, moedas, telaBiblioteca } from './biblioteca';
import { telaCriacao } from './criacao';
import { telaLeitura } from './leitura';
import { abrirCaderno } from './caderno';
import { abrirFinais } from './finais';
import type { Historia } from '../motor/tipos';

export function telaDetalhe(h: Historia): void {
  const perfil = carregar();
  const prog = perfil.progresso[h.id];
  const emAndamento = prog && !prog.terminou;
  const vistos = perfil.finais[h.id]?.length ?? 0;

  const confirmarRecomeco = () => {
    const fechar = modal(
      el(
        'div',
        { class: 'confirma' },
        el('h3', {}, 'Recomeçar do zero?'),
        el('p', {}, 'O progresso desta leitura será apagado. Finais vistos e páginas do caderno continuam com você.'),
        el(
          'div',
          { class: 'botoes' },
          el('button', { class: 'botao secundario', onclick: () => fechar() }, 'Cancelar'),
          el(
            'button',
            {
              class: 'botao',
              onclick: () => {
                fechar();
                apagarProgresso(h.id);
                telaCriacao(h);
              },
            },
            'Recomeçar',
          ),
        ),
      ),
    );
  };

  trocarTela(
    el(
      'div',
      { class: 'tela detalhe' },
      el(
        'header',
        { class: 'topo' },
        el('button', { class: 'icone', 'aria-label': 'Voltar', onclick: () => telaBiblioteca() }, '←'),
        moedas(),
      ),
      capa(h, true),
      el(
        'div',
        { class: 'detalhe-corpo' },
        el('div', { class: 'generos' }, ...h.generos.map((g) => el('span', { class: 'selo' }, g))),
        el('p', { class: 'sinopse' }, h.sinopse),
        el(
          'div',
          { class: 'botoes coluna' },
          emAndamento
            ? el('button', { class: 'botao grande', onclick: () => telaLeitura(h) }, `Continuar · Capítulo ${prog.capitulo.numero || 1}`)
            : el('button', { class: 'botao grande', onclick: () => telaCriacao(h) }, 'Começar a ler'),
          emAndamento ? el('button', { class: 'botao secundario', onclick: confirmarRecomeco }, 'Recomeçar do zero') : null,
          el('button', { class: 'botao secundario', onclick: () => abrirFinais(h) }, `Finais descobertos: ${vistos} de ${h.finais.length}`),
          el('button', { class: 'botao secundario', onclick: () => abrirCaderno(h) }, `Caderno de ciber: ${h.notas.filter((n) => perfil.notas.includes(n.id)).length} de ${h.notas.length} páginas`),
        ),
      ),
    ),
  );
}
