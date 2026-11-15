import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'theo', nome: 'Theo', cor: '#1c7ed6', visual: { pele: 3, cabelo: 'liso_curto', corCabelo: 1, roupa: 'uniforme_escola_publica', idade: 'crianca', corpo: 'm' } },
  { id: 'vo_cida', nome: 'Vó Cida', cor: '#ae3ec9', visual: { pele: 2, cabelo: 'cacheado_curto', corCabelo: 8, roupa: 'vestido_florido_idosa', acessorio: 'oculos_redondo', idade: 'idosa' } },
  { id: 'gui', nome: 'Gui', cor: '#2f9e44', visual: { pele: 6, cabelo: 'black_curto', corCabelo: 0, roupa: 'camiseta_desenho', acessorio: 'bone', idade: 'crianca', corpo: 'm' } },
  { id: 'prof_renata', nome: 'Professora Renata', cor: '#7048e8', visual: { pele: 5, cabelo: 'trancas_box', corCabelo: 0, roupa: 'camisa_social', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'mae_grupo', nome: 'Mãe do grupo', cor: '#e64980', visual: { pele: 1, cabelo: 'liso_longo', corCabelo: 4, roupa: 'roupa_academia', idade: 'adulta' } },
  { id: 'bia', nome: 'Bia', cor: '#f08c00', visual: { pele: 4, cabelo: 'cacheado_longo', corCabelo: 2, roupa: 'uniforme_escola_publica', idade: 'crianca' } },
  { id: 'duda', nome: 'Duda', cor: '#9c36b5', visual: { pele: 1, cabelo: 'maria_chiquinha', corCabelo: 6, roupa: 'uniforme_escola_publica', idade: 'crianca' } },
  { id: 'desconhecido', nome: 'Kaio_Pro_2009', cor: '#495057', visual: { pele: 3, cabelo: 'liso_curto', corCabelo: 0, roupa: 'moletom_capuz', idade: 'adulta', corpo: 'm' } },
  // Parte 2: colegas do 6º B e a mãe do Gui
  { id: 'enzo', nome: 'Enzo', cor: '#f76707', visual: { pele: 2, cabelo: 'topete', corCabelo: 3, roupa: 'uniforme_escola_publica', idade: 'crianca', corpo: 'm' } },
  { id: 'lara', nome: 'Lara', cor: '#d6336c', visual: { pele: 4, cabelo: 'rabo_de_cavalo', corCabelo: 0, roupa: 'uniforme_escola_publica', idade: 'crianca', corpo: 'f' } },
  { id: 'davi_lucas', nome: 'Davi Lucas', cor: '#0ca678', visual: { pele: 5, cabelo: 'cacheado_curto', corCabelo: 0, roupa: 'uniforme_escola_publica', acessorio: 'oculos_redondo', idade: 'crianca', corpo: 'm' } },
  { id: 'mae_gui', nome: 'Rose, mãe do Gui', cor: '#5c940d', visual: { pele: 6, cabelo: 'crespo_volumoso', corCabelo: 0, roupa: 'camisa_polo', idade: 'adulta' } },
];

const finais: Final[] = [
  { id: 'theo_contou_tudo', tipo: 'bom', titulo: '"Eu sabia que você ia me ouvir"', texto: 'O Theo contou do Kaio na mesma noite. A conta foi bloqueada, denunciada e as provas guardadas. Na hora de dormir, ele disse: "eu sabia que você ia me ouvir". Nenhum controle dos pais faz isso sozinho.' },
  { id: 'regras_na_geladeira', tipo: 'bom', titulo: 'As regras da geladeira', texto: 'As regras que vocês combinaram, presas na geladeira com o ímã da pizzaria, viraram modelo para a sala inteira. A Professora Renata pediu para usar na aula.' },
  { id: 'theo_youtuber_responsavel', tipo: 'bom', titulo: 'Canal do Theo', texto: 'O primeiro vídeo do canal do Theo ensina os colegas a não cair em moeda grátis. Sem rosto, sem uniforme, sem localização. Tem 38 visualizações, 30 delas da Vó Cida.' },
  { id: 'celular_na_gaveta', tipo: 'agridoce', titulo: 'Celular na gaveta', texto: 'O celular foi para a gaveta até o ano que vem. O Theo está seguro, mas parou de contar as coisas. A gaveta protege o aparelho; a conversa protege o filho.' },
  { id: 'mae_espia', tipo: 'agridoce', titulo: 'Espiã descoberta', texto: 'O aplicativo escondido mostrou tudo, mas o Theo descobriu o aplicativo. A confiança vai levar um tempo para voltar, e vocês dois sabem disso.' },
  { id: 'segredo_com_estranho', tipo: 'ruim', titulo: 'Segredo demais', texto: 'O Theo guardou o segredo do Kaio por semanas, porque achou que ia levar bronca. Deu tempo de proteger, mas foi por pouco. O que salvou foi o Gui contar para a mãe dele.' },
  { id: 'fatura_do_blocoverso', tipo: 'ruim', titulo: 'A fatura do BlocoVerso', texto: 'Entre moedas compradas com o cartão salvo e a conta roubada pelo site de moedas grátis, o mês acabou antes do salário. O Theo perdeu o mundo que construiu em dois anos.' },
  { id: 'theo_foi_o_zoador', tipo: 'ruim', titulo: 'Do outro lado da zoação', texto: 'O Theo participou da zoação. O Davi Lucas mudou de escola. Foi o pior bimestre da família, e também o começo de uma conversa que vocês nunca tinham tido.' },
];

export const celularDoTheo: Historia = {
  id: 'celular_do_theo',
  titulo: 'O Primeiro Celular do Theo',
  subtitulo: 'Um bimestre, dois pontos de vista',
  sinopse:
    'O Theo tem 11 anos, vai começar o sexto ano numa escola nova e vai ganhar o primeiro celular, usado, herdado da prima. Você é a mãe, enfermeira de plantão, e às vezes vai ser ele. O grupo da sala, as moedas do jogo, a foto com o uniforme, a zoação e um jogador desconhecido que quer conversar em segredo. A melhor ferramenta de segurança é ele confiar em você.',
  generos: ['Família', 'Drama', 'Comédia'],
  capa: { fundo: 'quarto_theo', cor: '#1c7ed6' },
  inicio: 't01_inicio',
  protagonistaPadrao: {
    nome: 'Michele',
    visual: { pele: 3, cabelo: 'rabo_de_cavalo', corCabelo: 1, roupa: 'jaleco_laboratorio', acessorio: 'cracha', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5, confianca: 5 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', confianca: 'Confiança do Theo' },
  hud: [{ var: 'confianca', icone: '🤝', sufixo: '/10' }],
};
