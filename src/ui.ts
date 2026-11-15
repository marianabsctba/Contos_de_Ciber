type Filho = Node | string | null | undefined | false;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | boolean | ((ev: Event) => void)> = {},
  ...filhos: Filho[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v as EventListener);
    else if (k === 'class') e.className = String(v);
    else if (k === 'html') e.innerHTML = String(v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false) e.setAttribute(k, String(v));
  }
  for (const f of filhos) if (f) e.append(f);
  return e;
}

export function svg(html: string, classe = ''): HTMLElement {
  const d = document.createElement('div');
  d.className = classe;
  d.innerHTML = html;
  return d;
}

let pilhaToasts: HTMLElement | null = null;

export function toast(texto: string, tipo: 'info' | 'mais' | 'menos' | 'nota' = 'info'): void {
  const app = document.getElementById('app')!;
  if (!pilhaToasts || !app.contains(pilhaToasts)) {
    pilhaToasts = el('div', { class: 'toasts' });
    app.append(pilhaToasts);
  }
  const t = el('div', { class: `toast toast-${tipo}` }, texto);
  pilhaToasts.append(t);
  setTimeout(() => t.classList.add('sai'), 2300);
  setTimeout(() => t.remove(), 2800);
}

export function trocarTela(conteudo: HTMLElement): void {
  const app = document.getElementById('app')!;
  app.replaceChildren(conteudo);
  pilhaToasts = null;
}

export function modal(conteudo: HTMLElement, aoFechar?: () => void): () => void {
  const app = document.getElementById('app')!;
  const fundo = el('div', { class: 'modal-fundo' });
  const caixa = el('div', { class: 'modal' }, conteudo);
  const fechar = () => {
    fundo.remove();
    aoFechar?.();
  };
  fundo.addEventListener('click', (e) => {
    if (e.target === fundo) fechar();
  });
  fundo.append(caixa);
  app.append(fundo);
  return fechar;
}

export function embaralhar<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export const NOMES_ATRIB: Record<string, string> = {
  tecnica: 'Técnica',
  etica: 'Ética',
  grana: 'Grana',
  reputacao: 'Reputação',
  saude: 'Saúde mental',
};
