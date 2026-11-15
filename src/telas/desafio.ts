import { el, embaralhar } from '../ui';
import { som } from '../som/tocador';
import type { Desafio } from '../motor/tipos';

const COMUNS = ['123456', 'senha', 'password', 'qwerty', 'abc123', 'brasil', 'jesus', 'amor', 'flamengo', 'corinthians', 'palmeiras', '102030', 'admin', 'iloveyou', 'teamo', 'mudar'];

/** estimativa simples de força: tamanho, variedade e padrões óbvios */
export function bitsSenha(s: string): { bits: number; problemas: string[] } {
  const problemas: string[] = [];
  if (!s) return { bits: 0, problemas: ['Vazia não vale, nem em Pedra Lisa.'] };
  let pool = 0;
  if (/[a-z]/.test(s)) pool += 26;
  if (/[A-Z]/.test(s)) pool += 26;
  if (/\d/.test(s)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(s)) pool += 33;
  let bits = s.length * Math.log2(Math.max(pool, 1));
  const baixa = s.toLowerCase();
  for (const c of COMUNS) {
    if (baixa.includes(c)) {
      bits -= c.length * 3.5;
      problemas.push(`Tem "${c}", que está em toda lista de senhas vazadas.`);
    }
  }
  if (/(.)\1{2,}/.test(s)) {
    bits -= 10;
    problemas.push('Caractere repetido em sequência.');
  }
  if (/(012|123|234|345|456|567|678|789|abc|bcd|cde)/i.test(s)) {
    bits -= 10;
    problemas.push('Sequência óbvia.');
  }
  if (/(19|20)\d{2}/.test(s)) {
    bits -= 8;
    problemas.push('Parece um ano. Data de aniversário é a primeira coisa que alguém tenta.');
  }
  if (s.length < 8) problemas.push('Curta demais.');
  if (s.length >= 16 && /\s|-/.test(s)) problemas.push('Frase-senha longa: ótima ideia.');
  return { bits: Math.max(0, Math.round(bits)), problemas };
}

export function abrirDesafio(app: HTMLElement, d: Desafio, fim: (acertou: boolean) => void): void {
  const corpo = el('div', { class: 'desafio-corpo' });
  const rodape = el('div', { class: 'desafio-rodape' });
  const caixa = el(
    'div',
    { class: 'desafio' },
    el('div', { class: 'desafio-selo' }, '🧠 Desafio de ciber'),
    el('h2', {}, d.titulo),
    el('p', { class: 'enunciado' }, d.enunciado),
    corpo,
    rodape,
  );
  const camada = el('div', { class: 'camada-desafio' }, caixa);
  app.append(camada);

  const concluir = (acertou: boolean, detalhe?: string) => {
    som.efeito(acertou ? 'acerto' : 'erro');
    rodape.replaceChildren(
      el(
        'div',
        { class: `resultado ${acertou ? 'ok' : 'nok'}` },
        el('strong', {}, acertou ? 'Mandou bem!' : 'Não foi dessa vez.'),
        detalhe ? el('p', {}, detalhe) : null,
        el('p', {}, d.explicacao),
        el(
          'button',
          {
            class: 'botao',
            onclick: () => {
              camada.remove();
              fim(acertou);
            },
          },
          'Continuar a história',
        ),
      ),
    );
    corpo.querySelectorAll('button, input').forEach((b) => ((b as HTMLButtonElement).disabled = true));
    rodape.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  if (d.tipo === 'quiz') {
    corpo.append(
      ...d.opcoes.map((o, i) =>
        el(
          'button',
          {
            class: 'opcao-quiz',
            onclick: (e: Event) => {
              (e.currentTarget as HTMLElement).classList.add(i === d.certa ? 'certa' : 'errada');
              corpo.children[d.certa]?.classList.add('certa');
              concluir(i === d.certa);
            },
          },
          o,
        ),
      ),
    );
  }

  if (d.tipo === 'achar') {
    const marcados = new Set<number>();
    const msg = el('div', { class: 'mensagem-suspeita' });
    d.trechos.forEach((t, i) => {
      const s = el('span', {
        class: 'trecho',
        role: 'button',
        tabindex: 0,
        onclick: () => {
          if (rodape.querySelector('.resultado')) return;
          if (marcados.has(i)) marcados.delete(i);
          else marcados.add(i);
          s.classList.toggle('marcado');
          som.efeito('clique');
        },
      }, t.texto);
      msg.append(s, ' ');
    });
    const total = d.trechos.filter((t) => t.suspeito).length;
    corpo.append(
      el('p', { class: 'dica' }, `Toque nos trechos suspeitos (há ${total}). Depois confira.`),
      msg,
    );
    rodape.append(
      el(
        'button',
        {
          class: 'botao',
          onclick: () => {
            let certos = 0;
            let falsos = 0;
            const porques: string[] = [];
            d.trechos.forEach((t, i) => {
              const span = msg.children[i] as HTMLElement;
              if (t.suspeito) {
                span.classList.add('era-suspeito');
                if (t.porque) porques.push(`"${t.texto.trim()}": ${t.porque}`);
              }
              if (marcados.has(i)) t.suspeito ? certos++ : falsos++;
            });
            const ok = certos >= d.minimo && falsos <= 1;
            concluir(ok, `Você achou ${certos} de ${total}${falsos ? ` e marcou ${falsos} inocente(s)` : ''}. ${porques.join(' ')}`);
          },
        },
        'Conferir',
      ),
    );
  }

  if (d.tipo === 'ordenar') {
    let ordem = embaralhar(d.passos.map((_, i) => i));
    while (d.passos.length > 1 && ordem.every((v, i) => v === i)) ordem = embaralhar(ordem);
    const lista = el('ol', { class: 'lista-ordenar' });
    const pintar = () => {
      lista.replaceChildren(
        ...ordem.map((idx, pos) =>
          el(
            'li',
            {},
            el('span', {}, d.passos[idx]),
            el(
              'span',
              { class: 'setas-ordem' },
              el('button', { 'aria-label': 'Subir', disabled: pos === 0, onclick: () => trocar(pos, pos - 1) }, '▲'),
              el('button', { 'aria-label': 'Descer', disabled: pos === ordem.length - 1, onclick: () => trocar(pos, pos + 1) }, '▼'),
            ),
          ),
        ),
      );
    };
    const trocar = (a: number, b: number) => {
      [ordem[a], ordem[b]] = [ordem[b], ordem[a]];
      som.efeito('clique');
      pintar();
    };
    pintar();
    corpo.append(lista);
    rodape.append(
      el(
        'button',
        {
          class: 'botao',
          onclick: () => {
            const certos = ordem.filter((v, i) => v === i).length;
            concluir(certos === ordem.length, `Ordem certa: ${d.passos.map((p, i) => `${i + 1}. ${p}`).join(' ')}`);
          },
        },
        'Conferir',
      ),
    );
  }

  if (d.tipo === 'formulario') {
    const escolhidas: (number | null)[] = d.campos.map(() => null);
    const blocos = d.campos.map((c, ci) => {
      const ordem = embaralhar(c.opcoes.map((_, i) => i));
      const linha = el('div', { class: 'form-opcoes' });
      ordem.forEach((oi) => {
        const b = el(
          'button',
          {
            class: 'form-opcao',
            onclick: () => {
              escolhidas[ci] = oi;
              linha.querySelectorAll('.form-opcao').forEach((x) => x.classList.remove('marcada'));
              b.classList.add('marcada');
              som.efeito('clique');
            },
          },
          c.opcoes[oi],
        );
        b.dataset.oi = String(oi);
        linha.append(b);
      });
      return el('fieldset', { class: 'form-campo' }, el('legend', {}, `${ci + 1}. ${c.rotulo}`), linha);
    });
    corpo.append(el('div', { class: 'formulario-doc' }, ...blocos));
    rodape.append(
      el(
        'button',
        {
          class: 'botao',
          onclick: () => {
            if (escolhidas.some((x) => x === null)) {
              rodape.querySelector('.dica')?.remove();
              rodape.prepend(el('p', { class: 'dica' }, 'Preencha todos os campos antes de enviar.'));
              return;
            }
            let certos = 0;
            const erros: string[] = [];
            d.campos.forEach((c, ci) => {
              const ok = escolhidas[ci] === c.certa;
              if (ok) certos++;
              else erros.push(`${c.rotulo}: ${c.porque}`);
              blocos[ci].querySelectorAll<HTMLElement>('.form-opcao').forEach((b) => {
                if (Number(b.dataset.oi) === c.certa) b.classList.add('certa');
                else if (b.classList.contains('marcada')) b.classList.add('errada');
              });
            });
            concluir(certos >= d.minimo, `${certos} de ${d.campos.length} campos certos. ${erros.join(' ')}`);
          },
        },
        'Enviar',
      ),
    );
  }

  if (d.tipo === 'senha') {
    const medidor = el('div', { class: 'medidor' }, el('div', { class: 'barra' }));
    const info = el('p', { class: 'dica' });
    const campo = el('input', {
      class: 'campo-senha',
      type: 'text',
      autocomplete: 'off',
      spellcheck: 'false',
      placeholder: 'Digite uma senha inventada (não use a sua de verdade!)',
      oninput: () => {
        const { bits, problemas } = bitsSenha(campo.value);
        const pct = Math.min(100, (bits / (d.minimoBits * 1.3)) * 100);
        (medidor.firstChild as HTMLElement).style.width = `${pct}%`;
        medidor.className = `medidor ${bits >= d.minimoBits ? 'forte' : bits >= d.minimoBits / 2 ? 'media' : 'fraca'}`;
        info.textContent = `Força estimada: ${bits} bits (meta ${d.minimoBits}). ${problemas.join(' ')}`;
      },
    }) as HTMLInputElement;
    corpo.append(campo, medidor, info);
    rodape.append(
      el(
        'button',
        {
          class: 'botao',
          onclick: () => {
            const { bits } = bitsSenha(campo.value);
            concluir(bits >= d.minimoBits, `Sua senha teve ${bits} bits.`);
          },
        },
        'Usar esta senha',
      ),
    );
  }
}
