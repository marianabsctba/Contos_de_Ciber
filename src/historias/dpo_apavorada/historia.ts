import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'romeu', nome: 'Dr. Romeu', cor: '#1971c2', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 8, roupa: 'jaleco_laboratorio', acessorio: 'oculos_quadrado', idade: 'idoso', corpo: 'm' } },
  { id: 'rosangela', nome: 'Rosângela', cor: '#e64980', visual: { pele: 5, cabelo: 'cacheado_curto', corCabelo: 3, roupa: 'camisa_polo', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'wesley', nome: 'Wesley do TI', cor: '#0ca678', visual: { pele: 3, cabelo: 'topete', corCabelo: 0, roupa: 'camiseta_preta_hacker', acessorio: 'fone_ouvido', idade: 'adulta', corpo: 'm' } },
  { id: 'bruna', nome: 'Bruna do Marketing', cor: '#f76707', visual: { pele: 2, cabelo: 'rabo_de_cavalo', corCabelo: 4, roupa: 'blazer_entrevista', acessorio: 'brinco_argola', idade: 'adulta' } },
  { id: 'cleide', nome: 'Dona Cleide', cor: '#ae3ec9', visual: { pele: 4, cabelo: 'coque', corCabelo: 8, roupa: 'roupa_academia', idade: 'idosa' } },
  { id: 'jorge', nome: 'Dr. Jorge', cor: '#495057', visual: { pele: 6, cabelo: 'black_curto', corCabelo: 5, roupa: 'terno', idade: 'adulta', corpo: 'm', barba: true } },
  { id: 'nayara', nome: 'Nayara', cor: '#d6336c', visual: { pele: 7, cabelo: 'trancas_box', corCabelo: 0, roupa: 'jaqueta_jeans', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'helena', nome: 'Dra. Helena', cor: '#7048e8', visual: { pele: 6, cabelo: 'crespo_volumoso', corCabelo: 5, roupa: 'jaleco_laboratorio', acessorio: 'oculos_redondo', idade: 'adulta' } },
  // grupo "Pilates das Amigas" (capítulo 1); a Marlene é vizinha da Dona Cleide
  { id: 'kelly', nome: 'Profe Kelly Pilates', cor: '#12b886', visual: { pele: 3, cabelo: 'rabo_de_cavalo', corCabelo: 6, roupa: 'roupa_academia', acessorio: 'fone_ouvido', idade: 'adulta' } },
  { id: 'marlene', nome: 'Marlene', cor: '#f59f00', visual: { pele: 2, cabelo: 'cacheado_curto', corCabelo: 7, roupa: 'roupa_academia', acessorio: 'oculos_redondo', idade: 'idosa' } },
  { id: 'zuleica', nome: 'Zuleica', cor: '#cc5de8', visual: { pele: 4, cabelo: 'franja_chanel', corCabelo: 4, roupa: 'roupa_academia', acessorio: 'brinco_argola', idade: 'idosa' } },
  { id: 'tereza', nome: 'Tereza', cor: '#4dabf7', visual: { pele: 6, cabelo: 'coque', corCabelo: 9, roupa: 'roupa_academia', idade: 'idosa' } },
  { id: 'golpista', nome: 'Central Bem Viver', cor: '#c92a2a', visual: { pele: 2, cabelo: 'liso_curto', corCabelo: 1, roupa: 'headset_call_center', idade: 'adulta', corpo: 'm' } },
];

const finais: Final[] = [
  { id: 'dpo_respeitada', tipo: 'bom', titulo: 'A DPO que a cidade respeita', texto: 'A Bem Viver virou exemplo de como tratar um incidente: rápido, transparente e humano. Outras clínicas ligam pedindo o seu contato. O Dr. Romeu agora diz "nossa encarregada" com orgulho.' },
  { id: 'processo_arquivado', tipo: 'bom', titulo: 'Arquivado', texto: 'Comunicação no prazo, medidas adotadas, cooperação total. A fiscalização se encerrou sem sanção. Você imprimiu o ofício e colou na parede, do lado da planilha que começou tudo.' },
  { id: 'rosangela_campea', tipo: 'bom', titulo: 'Rosângela, campeã de privacidade', texto: 'A Rosângela, que mandou a planilha no grupo errado, hoje dá o treinamento de privacidade da equipe. A primeira frase é sempre: "Errar acontece. Esconder é que não pode."' },
  { id: 'demitida_com_dignidade', tipo: 'agridoce', titulo: 'Demitida com dignidade', texto: 'O Dr. Romeu te demitiu por "atrapalhar". Você saiu com o registro do incidente em ordem e a consciência limpa. Seis meses depois, sua consultoria atende onze clínicas.' },
  { id: 'burnout_dpo', tipo: 'agridoce', titulo: 'A encarregada também precisa de cuidado', texto: 'Você fez quase tudo certo e quase nada por você. Saiu do cargo para respirar. Privacidade começa pela sua.' },
  { id: 'clinica_sancionada', tipo: 'ruim', titulo: 'Processo sancionador', texto: 'Prazo perdido, comunicação incompleta, titulares avisados tarde demais. A clínica respondeu a um processo sancionador, e a matéria do Fala Cidade ficou em primeiro lugar no buscador por meses.' },
  { id: 'cumplice', tipo: 'ruim', titulo: 'Cúmplice', texto: 'Você ajudou a esconder. Quando a verdade apareceu pelo grupo de pilates, como sempre aparece, sobrou para todo mundo, inclusive para você.' },
  { id: 'vazou_de_novo', tipo: 'ruim', titulo: 'Vazou de novo', texto: 'Nada mudou depois do susto. Três meses depois, a Bruna mandou a base inteira para uma agência sem contrato. O Wesley sugeriu apagar a mensagem.' },
];

export const dpoApavorada: Historia = {
  id: 'dpo_apavorada',
  titulo: 'A DPO Apavorada',
  subtitulo: 'Três dias no cargo, três dias úteis de prazo',
  sinopse:
    'Segunda, 8h12. A recepcionista da Clínica Bem Viver mandou a planilha com nome, CPF e diagnóstico de 1.847 pacientes no grupo "Pilates das Amigas 🧘‍♀️". Você é a encarregada de dados há três dias. O dono acha que "não vazou, foi compartilhado", o TI quer só apagar a mensagem e o marketing viu uma oportunidade. O prazo está correndo.',
  generos: ['Comédia', 'Drama', 'LGPD'],
  capa: { fundo: 'clinica_recepcao', cor: '#7048e8' },
  inicio: 'd01_inicio',
  protagonistaPadrao: {
    nome: 'Camila',
    visual: { pele: 2, cabelo: 'franja_chanel', corCabelo: 1, roupa: 'blazer_entrevista', acessorio: 'cracha', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5, credibilidade: 0, risco: 6 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', credibilidade: 'Credibilidade', risco: 'Risco', prazo: 'Prazo ANPD', prazo_titular: 'Prazo do titular' },
  hud: [
    { var: 'prazo', icone: '📅', sufixo: ' dias úteis', esconderCom: ['comunicou_anpd', 'perdeu_prazo'] },
    { var: 'prazo_titular', icone: '🗂️', sufixo: ' dias', esconderCom: ['respondeu_titular'] },
    { var: 'risco', icone: '⚠️', sufixo: '/10' },
  ],
};
