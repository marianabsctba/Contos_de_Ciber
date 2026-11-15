import './estilo.css';
import { som } from './som/tocador';
import { carregar } from './motor/salvar';
import { telaBiblioteca } from './telas/biblioteca';

const cfg = carregar().config;
som.volumeMusica(cfg.musica);
som.volumeEfeitos(cfg.efeitos);

// o navegador só libera áudio depois de um gesto
const destravar = () => {
  som.destravar();
  window.removeEventListener('pointerdown', destravar);
  window.removeEventListener('keydown', destravar);
};
window.addEventListener('pointerdown', destravar);
window.addEventListener('keydown', destravar);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) som.pausar();
  else som.retomar();
});

telaBiblioteca();
