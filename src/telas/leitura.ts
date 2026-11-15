import { el, svg, trocarTela, toast, modal, NOMES_ATRIB } from '../ui';
import { lerRoteiro } from '../motor/roteiro';
import { Executor } from '../motor/executor';
import type { Estado, Evento } from '../motor/executor';
import { carregar, salvarProgresso, registrarFinal, registrarNota, gravar } from '../motor/salvar';
import { CENARIOS } from '../arte/cenarios';
import { desenharPersonagem, desenharRosto } from '../arte/personagem';
import { som } from '../som/tocador';
import { guardaRoupa } from './roupa';
import { abrirDesafio } from './desafio';
import { abrirCaderno } from './caderno';
import { abrirFinais } from './finais';
import { telaDetalhe } from './detalhe';
import { abrirConfig } from './config';
import type { Historia, Roteiro, Visual } from '../motor/tipos';

const cacheRoteiro = new Map<string, Roteiro>();
const cacheDesenho = new Map<string, string>();

function desenho(v: Visual, expr: string, espelhar: boolean): string {
  const k = JSON.stringify([v, expr, espelhar]);
  let s = cacheDesenho.get(k);
  if (!s) {
    s = desenharPersonagem(v, expr as never, { espelhar });
    cacheDesenho.set(k, s);
    if (cacheDesenho.size > 120) cacheDesenho.delete(cacheDesenho.keys().next().value!);
  }
  return s;
}

export function telaLeitura(h: Historia): void {
  let roteiro = cacheRoteiro.get(h.id);
  if (!roteiro) {
    roteiro = lerRoteiro(h.fontes);
    cacheRoteiro.set(h.id, roteiro);
  }
  const perfil = carregar();
  const estado = perfil.progresso[h.id];
  if (!estado) return telaDetalhe(h);
  const ex = new Executor(roteiro, estado);
  const pers = new Map(h.personagens.map((p) => [p.id, p]));
  const ATRIB = h.atributos ?? NOMES_ATRIB;

  const fundoA = el('div', { class: 'fundo-cena' });
  const fundoB = el('div', { class: 'fundo-cena' });
  let fundoAtivo = fundoA;
  let fundoAtual = '';
  const palco = el('div', { class: 'palco' });
  const fala = el('div', { class: 'caixa-fala' });
  const escolhas = el('div', { class: 'escolhas' });
  const tituloCap = el('span', { class: 'titulo-cap' });
  const hud = el('div', { class: 'hud' });
  const celular = el('div', { class: 'celular' });
  const camadaToque = el('div', { class: 'toque' });
  const tela = el(
    'div',
    { class: 'tela leitura' },
    fundoA,
    fundoB,
    palco,
    celular,
    el(
      'header',
      { class: 'topo topo-leitura' },
      el('button', { class: 'icone', 'aria-label': 'Sair', onclick: () => sair() }, '✕'),
      tituloCap,
      hud,
      el('button', { class: 'icone', 'aria-label': 'Caderno', onclick: () => abrirCaderno(h) }, '📓'),
      el('button', { class: 'icone', 'aria-label': 'Menu', onclick: () => menu() }, '☰'),
    ),
    camadaToque,
    fala,
    escolhas,
  );
  trocarTela(tela);
  const app = document.getElementById('app')!;

  let ocupado = false;
  let digitando: { fim: () => void } | null = null;

  const salvar = () => salvarProgresso(ex.estado);

  ex.aoAnotar = (id) => {
    if (registrarNota(id)) {
      const n = h.notas.find((x) => x.id === id);
      som.efeito('pagina');
      toast(`📓 Nova página no caderno: ${n?.titulo ?? id}`, 'nota');
    }
  };
  ex.aoSom = (id) => som.efeito(id);

  function sair() {
    salvar();
    telaDetalhe(h);
  }

  function menu() {
    const fechar = modal(
      el(
        'div',
        { class: 'menu-leitura' },
        el('h3', {}, `Capítulo ${ex.estado.capitulo.numero}: ${ex.estado.capitulo.titulo}`),
        el('div', { class: 'atributos' }, ...Object.entries(ATRIB).map(([k, n]) => el('div', {}, el('span', {}, n), el('b', {}, String(ex.estado.vars[k] ?? 0))))),
        el(
          'div',
          { class: 'botoes coluna' },
          el('button', { class: 'botao secundario', onclick: () => { fechar(); recomecarCapitulo(); } }, 'Recomeçar este capítulo'),
          el('button', { class: 'botao secundario', onclick: () => { fechar(); abrirFinais(h); } }, 'Finais descobertos'),
          el('button', { class: 'botao secundario', onclick: () => { fechar(); abrirConfig(); } }, 'Configurações'),
          el('button', { class: 'botao', onclick: () => { fechar(); sair(); } }, 'Salvar e sair'),
        ),
      ),
    );
  }

  function recomecarCapitulo() {
    if (!ex.estado.inicioCapitulo) return;
    const antigo = JSON.parse(ex.estado.inicioCapitulo) as Estado;
    antigo.inicioCapitulo = ex.estado.inicioCapitulo;
    Object.assign(ex.estado, antigo);
    delete ex.estado.terminou;
    salvar();
    toast('Capítulo recomeçado. Escolhas diferentes, destinos diferentes.');
    mostrar(ex.executar());
  }

  function visualDe(per: { visual: Visual; cresceJunto?: Partial<Record<string, string>> }): Visual {
    if (!per.cresceJunto) return per.visual;
    const idade = ex.estado.idade;
    return { ...per.visual, idade, roupa: per.cresceJunto[idade] ?? per.visual.roupa };
  }

  function pintarFundo() {
    const id = ex.estado.fundo;
    if (id === fundoAtual) return;
    fundoAtual = id;
    const outro = fundoAtivo === fundoA ? fundoB : fundoA;
    outro.innerHTML = CENARIOS[id]?.svg ?? '';
    outro.classList.add('visivel');
    fundoAtivo.classList.remove('visivel');
    fundoAtivo = outro;
  }

  /** desenha o palco; quem fala fica em destaque, a protagonista aparece quando fala ou pensa */
  function pintarPalco(quemFala: string | null) {
    const e = ex.estado;
    const itens: { id: string; v: Visual; expr: string; pos: string }[] = [];
    const euAparece = quemFala === 'eu';
    for (const p of e.palco) {
      const per = pers.get(p.id);
      if (!per) continue;
      let pos: string = p.pos;
      if (euAparece && pos === 'centro') pos = 'direita';
      if (euAparece && pos === 'esquerda') pos = 'direita';
      itens.push({ id: p.id, v: visualDe(per), expr: p.expr, pos });
    }
    if (euAparece) itens.push({ id: 'eu', v: { ...e.visual, idade: e.idade }, expr: e.exprEu, pos: 'esquerda' });

    const atuais = new Map([...palco.children].map((c) => [(c as HTMLElement).dataset.id!, c as HTMLElement]));
    for (const [id, nodo] of atuais) {
      if (!itens.find((i) => i.id === id)) {
        nodo.classList.add('saindo');
        setTimeout(() => nodo.remove(), 350);
      }
    }
    for (const it of itens) {
      let nodo = atuais.get(it.id);
      const chave = `${JSON.stringify(it.v)}|${it.expr}|${it.pos}`;
      if (!nodo || nodo.classList.contains('saindo')) {
        nodo = el('div', { class: `ator ${it.pos} entrando`, 'data-id': it.id });
        palco.append(nodo);
        requestAnimationFrame(() => nodo!.classList.remove('entrando'));
      }
      if (nodo.dataset.chave !== chave) {
        nodo.innerHTML = desenho(it.v, it.expr, it.pos === 'direita');
        nodo.dataset.chave = chave;
      }
      nodo.className = `ator ${it.pos} ${quemFala && quemFala !== it.id ? 'apagado' : 'falando'}`;
    }
  }

  function escrever(alvo: HTMLElement, texto: string, pronto: () => void) {
    const vel = carregar().config.velocidadeTexto;
    if (vel >= 0.98) {
      alvo.textContent = texto;
      pronto();
      return;
    }
    let i = 0;
    const passo = Math.max(1, Math.round(1 + vel * 4));
    const t = window.setInterval(() => {
      i += passo;
      alvo.textContent = texto.slice(0, i);
      if (i >= texto.length) fim();
    }, 22);
    const fim = () => {
      clearInterval(t);
      alvo.textContent = texto;
      digitando = null;
      pronto();
    };
    digitando = { fim };
  }

  function pintarHud() {
    const itens = (h.hud ?? []).filter((x) => ex.estado.vars[x.var] !== undefined);
    hud.replaceChildren(
      ...itens.map((x) => {
        const v = ex.estado.vars[x.var];
        return el('span', { class: `hud-item ${x.var === 'minutos' && v <= 10 ? 'urgente' : ''}` }, `${x.icone} ${v}${x.sufixo ?? ''}`);
      }),
    );
  }

  function pintarCelular(animarUltima: boolean) {
    const e = ex.estado;
    if (!e.zap) {
      celular.classList.remove('aberto');
      return;
    }
    const log = e.zapLog ?? [];
    const membros = [...new Set(log.map((m) => m.quem).filter((q) => q && q !== 'eu'))]
      .map((q) => pers.get(q)?.nome.split(' ').slice(-1)[0] ?? q)
      .slice(0, 5);
    const lista = el('div', { class: 'zap-lista' });
    log.forEach((m, i) => {
      const nova = animarUltima && i === log.length - 1;
      lista.append(balaoZap(m.quem, m.texto, nova));
    });
    celular.replaceChildren(
      el(
        'div',
        { class: 'zap-topo' },
        el('span', { class: 'zap-avatar' }, '👪'),
        el('div', {}, el('strong', {}, e.zap), el('small', {}, membros.length ? `${membros.join(', ')}, você` : 'toque para ver os participantes')),
      ),
      lista,
    );
    celular.classList.add('aberto');
    lista.scrollTop = lista.scrollHeight;
  }

  function balaoZap(quem: string, texto: string, nova: boolean): HTMLElement {
    if (!quem) return el('div', { class: `zap-sistema ${nova ? 'nova' : ''}` }, texto);
    const eu = quem === 'eu';
    const per = pers.get(quem);
    const cor = per?.cor ?? '#888';
    let corpo: HTMLElement;
    const mAudio = texto.match(/^\[audio ([\d:]+)\]\s*(.*)$/);
    const mFoto = texto.match(/^\[foto\]\s*(.*)$/);
    const mFig = texto.match(/^\[figurinha\]\s*(.*)$/);
    if (mAudio) {
      corpo = el(
        'div',
        { class: 'zap-audio' },
        el('span', { class: 'play' }, '▶'),
        el('span', { class: 'onda' }, ...Array.from({ length: 22 }, (_, i) => el('i', { style: `height:${4 + ((i * 7 + texto.length) % 13)}px` }))),
        el('small', {}, mAudio[1]),
        mAudio[2] ? el('em', {}, `Transcrição: ${mAudio[2]}`) : null,
      );
    } else if (mFoto) {
      corpo = el('div', { class: 'zap-foto' }, el('div', { class: 'foto' }, '📷'), mFoto[1] ? el('span', {}, mFoto[1]) : null);
    } else if (mFig) {
      corpo = el('div', { class: 'zap-figurinha' }, el('span', {}, '🌹✨'), el('b', {}, mFig[1]));
    } else {
      corpo = el('span', {}, texto);
    }
    return el(
      'div',
      { class: `zap-msg ${eu ? 'minha' : ''} ${nova ? 'nova' : ''} ${mFig ? 'sem-balao' : ''}` },
      !eu ? el('b', { class: 'zap-nome', style: `color:${cor}` }, per?.nome ?? quem) : null,
      corpo,
      el('small', { class: 'zap-hora' }, eu ? '✓✓' : ''),
    );
  }

  function mostrarFala(ev: Extract<Evento, { t: 'narra' | 'pensa' | 'fala' }>) {
    if (ex.estado.zap && ev.t !== 'pensa') {
      pintarPalco(null);
      fala.className = 'caixa-fala';
      escolhas.replaceChildren();
      if (ev.t === 'fala' && ev.quem !== 'eu') {
        som.efeito('mensagem');
        celular.classList.add('digitando');
        ocupado = true;
        setTimeout(() => {
          celular.classList.remove('digitando');
          ocupado = false;
          pintarCelular(true);
        }, 380);
      } else pintarCelular(true);
      return;
    }
    fala.className = 'caixa-fala visivel';
    escolhas.replaceChildren();
    const textoEl = el('p', { class: 'texto' });
    if (ev.t === 'narra') {
      pintarPalco(null);
      fala.classList.add('narracao');
      fala.replaceChildren(textoEl);
    } else if (ev.t === 'pensa') {
      pintarPalco('eu');
      fala.classList.add('pensamento');
      fala.replaceChildren(el('div', { class: 'nome', style: '--cor:#c3a6ff' }, `${ex.estado.nome} pensa`), textoEl);
    } else {
      pintarPalco(ev.quem);
      const per = pers.get(ev.quem);
      const nome = ev.quem === 'eu' ? ex.estado.nome : per?.nome ?? ev.quem;
      const cor = ev.quem === 'eu' ? '#ff4f8b' : per?.cor ?? '#888';
      const rosto =
        ev.quem === 'eu'
          ? desenharRosto({ ...ex.estado.visual, idade: ex.estado.idade }, ex.estado.exprEu)
          : per
            ? desenharRosto(visualDe(per), ex.estado.palco.find((p) => p.id === ev.quem)?.expr ?? 'neutra')
            : '';
      fala.classList.add(ev.quem === 'eu' ? 'fala-eu' : 'fala-outro');
      fala.replaceChildren(svg(rosto, 'rostinho'), el('div', { class: 'nome', style: `--cor:${cor}` }, nome), textoEl);
    }
    escrever(textoEl, ev.texto, () => {});
  }

  function mostrarEscolha(ev: Extract<Evento, { t: 'escolha' }>) {
    pintarPalco(null);
    fala.className = 'caixa-fala';
    som.efeito('notificacao');
    escolhas.replaceChildren(
      ev.pergunta ? el('p', { class: 'pergunta' }, ev.pergunta) : '',
      ...ev.opcoes.map((o, i) =>
        el(
          'button',
          {
            class: `opcao ${o.especial ? 'especial' : ''} ${o.liberada ? '' : 'travada'}`,
            disabled: !o.liberada,
            onclick: (e: Event) => {
              e.stopPropagation();
              som.efeito(o.especial ? 'especial' : 'escolha');
              const antes = { ...ex.estado.vars };
              const prox = ex.escolher(i);
              avisarMudancas(antes);
              mostrar(prox);
            },
          },
          o.especial ? el('span', { class: 'preco' }, el('s', {}, '💎 17'), ' grátis') : '',
          el('span', {}, o.texto),
          !o.liberada ? el('small', { class: 'requisito' }, '🔒 ' + requisito(o.condicoes)) : '',
        ),
      ),
    );
  }

  function requisito(conds: { tipo: string; nome: string; op?: string; valor?: number; negada?: boolean }[]): string {
    return conds
      .map((c) => (c.tipo === 'var' ? `${ATRIB[c.nome] ?? nomeRel(c.nome)} ${c.op} ${c.valor}` : 'depende do que você fez antes'))
      .join(' e ');
  }

  function nomeRel(v: string): string {
    if (v.startsWith('rel_')) return `Relação com ${pers.get(v.slice(4))?.nome ?? v.slice(4)}`;
    return v;
  }

  function avisarMudancas(antes: Record<string, number>) {
    for (const [k, v] of Object.entries(ex.estado.vars)) {
      const d = v - (antes[k] ?? 0);
      if (!d) continue;
      const nome = ATRIB[k] ?? nomeRel(k);
      toast(`${d > 0 ? '▲' : '▼'} ${nome} ${d > 0 ? '+' : ''}${d}`, d > 0 ? 'mais' : 'menos');
    }
  }

  function mostrarCap(ev: Extract<Evento, { t: 'cap' }>) {
    ocupado = true;
    // o cartão já mostra o cenário do capítulo que vai começar
    const linhas = roteiro!.cenas.get(ex.estado.cena)?.linhas ?? [];
    for (let i = ex.estado.pos + 1; i < linhas.length; i++) {
      const l = linhas[i];
      if (l.t === 'fundo') {
        ex.estado.fundo = l.id;
        break;
      }
      if (['narra', 'pensa', 'fala', 'escolha', 'vai', 'se', 'desafio', 'final', 'roupa'].includes(l.t)) break;
    }
    pintarFundo();
    pintarPalco(null);
    fala.className = 'caixa-fala';
    escolhas.replaceChildren();
    tituloCap.textContent = `Cap. ${ev.numero} · ${ev.titulo}`;
    som.efeito('capitulo');
    const cartao = el('div', { class: 'cartao-cap' }, el('small', {}, h.titulo), el('span', {}, `Capítulo ${ev.numero}`), el('strong', {}, ev.titulo), el('em', {}, 'toque para começar'));
    tela.append(cartao);
    const ir = () => {
      cartao.classList.add('sai');
      setTimeout(() => cartao.remove(), 400);
      ocupado = false;
      mostrar(ex.avancar());
    };
    setTimeout(() => cartao.addEventListener('click', ir, { once: true }), 500);
  }

  function mostrarFinal(id: string) {
    ocupado = true;
    const f = h.finais.find((x) => x.id === id);
    registrarFinal(h.id, id);
    salvar();
    som.tocar(f?.tipo === 'ruim' ? 'final_ruim' : 'final_bom');
    const vistos = carregar().finais[h.id]?.length ?? 1;
    const e = ex.estado;
    tela.append(
      el(
        'div',
        { class: `tela-final final-${f?.tipo ?? 'bom'}` },
        el('small', {}, 'Fim'),
        el('h1', {}, f?.titulo ?? id),
        svg(desenharPersonagem({ ...e.visual, idade: e.idade }, f?.tipo === 'ruim' ? 'triste' : 'feliz'), 'final-retrato'),
        el('p', {}, (f?.texto ?? '').replace(/\{nome\}/g, e.nome)),
        el('div', { class: 'atributos' }, ...Object.entries(ATRIB).map(([k, n]) => el('div', {}, el('span', {}, n), el('b', {}, String(e.vars[k] ?? 0))))),
        el('p', { class: 'dica' }, `Você descobriu ${vistos} de ${h.finais.length} finais.`),
        el(
          'div',
          { class: 'botoes coluna' },
          el('button', { class: 'botao', onclick: () => abrirFinais(h) }, 'Ver todos os finais'),
          el('button', { class: 'botao secundario', onclick: () => recomecarCapituloDoFinal() }, 'Voltar ao começo do capítulo'),
          el('button', { class: 'botao secundario', onclick: () => telaDetalhe(h) }, 'Voltar à história'),
        ),
      ),
    );
  }

  function recomecarCapituloDoFinal() {
    tela.querySelector('.tela-final')?.remove();
    ocupado = false;
    recomecarCapitulo();
  }

  function mostrar(ev: Evento) {
    pintarFundo();
    pintarHud();
    if (!ex.estado.zap) celular.classList.remove('aberto');
    else if (!celular.classList.contains('aberto')) pintarCelular(false);
    som.tocar(ex.estado.musica);
    salvar();
    switch (ev.t) {
      case 'narra':
      case 'pensa':
      case 'fala':
        return mostrarFala(ev);
      case 'escolha':
        return mostrarEscolha(ev);
      case 'cap':
        return mostrarCap(ev);
      case 'anota':
        return mostrar(ex.avancar());
      case 'roupa':
        ocupado = true;
        fala.className = 'caixa-fala';
        return guardaRoupa(app, ev.titulo, ex.estado.visual, ex.estado.idade, (v) => {
          ex.estado.visual = { ...v };
          ocupado = false;
          gravar();
          mostrar(ex.avancar());
        });
      case 'desafio': {
        const d = h.desafios.find((x) => x.id === ev.id);
        if (!d) return mostrar(ex.resolverDesafio(false));
        ocupado = true;
        fala.className = 'caixa-fala';
        return abrirDesafio(app, d, (ok) => {
          ocupado = false;
          const antes = { ...ex.estado.vars };
          const prox = ex.resolverDesafio(ok);
          avisarMudancas(antes);
          mostrar(prox);
        });
      }
      case 'final':
        return mostrarFinal(ev.id);
    }
  }

  const avancar = () => {
    if (ocupado || escolhas.childElementCount) return;
    if (digitando) return digitando.fim();
    som.efeito('clique');
    mostrar(ex.avancar());
  };
  camadaToque.addEventListener('click', avancar);
  fala.addEventListener('click', avancar);
  const tecla = (e: KeyboardEvent) => {
    if (!document.body.contains(tela)) return window.removeEventListener('keydown', tecla);
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      avancar();
    }
  };
  window.addEventListener('keydown', tecla);

  if (ex.estado.terminou) return mostrarFinal(ex.estado.terminou);
  tituloCap.textContent = ex.estado.capitulo.numero ? `Cap. ${ex.estado.capitulo.numero} · ${ex.estado.capitulo.titulo}` : h.titulo;
  mostrar(ex.executar());
}
