import type { Estado } from './executor';

const CHAVE = 'contos-de-ciber:v1';

export interface Perfil {
  /** progresso em andamento por história */
  progresso: Record<string, Estado>;
  /** finais já vistos, por história */
  finais: Record<string, string[]>;
  /** páginas do caderno liberadas (valem para todas as histórias) */
  notas: string[];
  config: { musica: number; efeitos: number; velocidadeTexto: number };
}

function vazio(): Perfil {
  return { progresso: {}, finais: {}, notas: [], config: { musica: 0.6, efeitos: 0.8, velocidadeTexto: 1 } };
}

let memoria: Perfil | null = null;

export function carregar(): Perfil {
  if (memoria) return memoria;
  let p = vazio();
  try {
    const txt = localStorage.getItem(CHAVE);
    if (txt) p = { ...p, ...JSON.parse(txt) };
  } catch {
    /* sem armazenamento: segue só na memória */
  }
  memoria = p;
  return p;
}

export function gravar(): void {
  if (!memoria) return;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(memoria));
  } catch {
    /* navegação privada ou cota cheia */
  }
}

export function salvarProgresso(e: Estado): void {
  const p = carregar();
  p.progresso[e.historia] = e;
  gravar();
}

export function apagarProgresso(historia: string): void {
  const p = carregar();
  delete p.progresso[historia];
  gravar();
}

export function registrarFinal(historia: string, final: string): void {
  const p = carregar();
  const lista = (p.finais[historia] ??= []);
  if (!lista.includes(final)) lista.push(final);
  gravar();
}

export function registrarNota(id: string): boolean {
  const p = carregar();
  if (p.notas.includes(id)) return false;
  p.notas.push(id);
  gravar();
  return true;
}

/** exporta o perfil como texto, para levar para outro navegador */
export function exportar(): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(carregar()))));
}

export function importar(codigo: string): boolean {
  try {
    const p = JSON.parse(decodeURIComponent(escape(atob(codigo.trim())))) as Perfil;
    if (!p || typeof p !== 'object' || !p.progresso) return false;
    memoria = { ...vazio(), ...p };
    gravar();
    return true;
  } catch {
    return false;
  }
}
