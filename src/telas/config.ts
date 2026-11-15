import { el, modal, toast } from '../ui';
import { carregar, gravar, exportar, importar } from '../motor/salvar';
import { som } from '../som/tocador';

export function abrirConfig(): void {
  const p = carregar();
  const faixa = (rotulo: string, valor: number, mudou: (v: number) => void) =>
    el(
      'label',
      { class: 'faixa' },
      el('span', {}, rotulo),
      el('input', {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05,
        value: valor,
        oninput: (e: Event) => mudou(Number((e.target as HTMLInputElement).value)),
      }),
    );
  const codigo = el('textarea', { class: 'codigo', rows: 3, placeholder: 'Cole aqui o código de outro aparelho' }) as HTMLTextAreaElement;
  modal(
    el(
      'div',
      { class: 'config' },
      el('h3', {}, 'Configurações'),
      faixa('Música', p.config.musica, (v) => {
        p.config.musica = v;
        som.volumeMusica(v);
        gravar();
      }),
      faixa('Efeitos', p.config.efeitos, (v) => {
        p.config.efeitos = v;
        som.volumeEfeitos(v);
        gravar();
      }),
      faixa('Velocidade do texto', p.config.velocidadeTexto, (v) => {
        p.config.velocidadeTexto = v;
        gravar();
      }),
      el('p', { class: 'dica' }, 'Seu progresso fica salvo neste navegador, a cada fala. Para levar para outro aparelho, copie o código.'),
      el(
        'div',
        { class: 'botoes' },
        el(
          'button',
          {
            class: 'botao secundario',
            onclick: async () => {
              const c = exportar();
              try {
                await navigator.clipboard.writeText(c);
                toast('Código copiado.');
              } catch {
                codigo.value = c;
                toast('Copie o código da caixa.');
              }
            },
          },
          'Copiar código',
        ),
        el(
          'button',
          {
            class: 'botao secundario',
            onclick: () => {
              if (importar(codigo.value)) {
                toast('Progresso carregado.');
                location.reload();
              } else toast('Código inválido.', 'menos');
            },
          },
          'Carregar código',
        ),
      ),
      codigo,
    ),
  );
}
