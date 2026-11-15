import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'vo', nome: 'Vó Zilá', cor: '#9c36b5', visual: { pele: 6, cabelo: 'black_curto', corCabelo: 9, roupa: 'vestido_florido_idosa', acessorio: 'oculos_redondo', idade: 'idosa' } },
  { id: 'caique', nome: 'Caíque', cor: '#f76707', visual: { pele: 5, cabelo: 'topete', corCabelo: 0, roupa: 'camiseta_banda_rock', acessorio: 'bone', idade: 'adulta', corpo: 'm' } },
  { id: 'dona_jura', nome: 'Dona Jura', cor: '#d6336c', visual: { pele: 2, cabelo: 'coque', corCabelo: 6, roupa: 'avental', acessorio: 'brinco_argola', idade: 'idosa' } },
  { id: 'tecnico_falso', nome: 'Suporte Casa Conectada', cor: '#c92a2a', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 1, roupa: 'headset_call_center', idade: 'adulta', corpo: 'm' } },
  { id: 'sargento', nome: 'Sargento Lopes', cor: '#264653', visual: { pele: 5, cabelo: 'raspado', corCabelo: 0, roupa: 'farda_policia', idade: 'adulta', corpo: 'm', barba: true } },
  { id: 'tio_mauro', nome: 'Tio Mauro', cor: '#495057', visual: { pele: 6, cabelo: 'careca', corCabelo: 8, roupa: 'camisa_social', acessorio: 'oculos_quadrado', idade: 'adulta', corpo: 'm', barba: true } },
];

const finais: Final[] = [
  { id: 'casa_segura_e_dela', tipo: 'bom', titulo: 'A casa é dela', texto: 'A casa ficou segura e continua sendo da Vó Zilá: ela escolheu o que ficava, sabe desligar tudo e trocou a senha da fechadura sozinha. "A moça" agora pede confirmação antes de comprar qualquer coisa.' },
  { id: 'vo_influencer_tech', tipo: 'bom', titulo: 'A vó da vila', texto: 'A Vó Zilá virou a referência de segurança da vila. Ensinou a Dona Jura a trocar a senha da campainha e grava vídeo explicando "admin admin é para quem quer visita".' },
  { id: 'menos_e_mais', tipo: 'bom', titulo: 'Menos é mais', texto: 'Metade dos aparelhos voltou para a caixa. Ficaram o botão de emergência, a lâmpada da varanda e a assistente de voz da novela, todos bem configurados. A casa ficou mais silenciosa e mais segura.' },
  { id: 'vo_desligou_tudo', tipo: 'agridoce', titulo: 'Tudo fora da tomada', texto: 'A vó se assustou e tirou tudo da tomada. A casa está segura, mas o botão de emergência que ajudaria numa queda também foi para a gaveta.' },
  { id: 'caique_aprendeu_tarde', tipo: 'agridoce', titulo: 'O Caíque aprendeu', texto: 'Deu tudo certo no fim, mas o Caíque passou meses se sentindo o culpado da família. Hoje ele lê o manual antes de dar presente. Às vezes, até a caixa.' },
  { id: 'camera_na_internet', tipo: 'ruim', titulo: 'A sala virou vídeo', texto: 'A câmera continuou aberta. A sala da Vó Zilá, a novela e o cochilo da tarde viraram vídeo num fórum que ninguém da família conhece. Senha de fábrica é convite.' },
  { id: 'golpe_do_suporte', tipo: 'ruim', titulo: 'O suporte que não era', texto: 'A vó instalou o aplicativo do falso suporte e leu o código. Saiu dinheiro da aposentadoria antes de alguém perceber. Empresa séria não liga pedindo para instalar aplicativo.' },
  { id: 'vo_no_repouso', tipo: 'ruim', titulo: 'Contra a vontade dela', texto: 'A confusão virou argumento, e a Vó Zilá foi morar numa casa de repouso que não escolheu. Segurança que tira a autonomia de alguém não é segurança, é outra coisa.' },
];

export const casaDaVo: Historia = {
  id: 'casa_da_vo',
  titulo: 'A Casa Inteligente da Vó',
  subtitulo: 'Câmera, campainha, fechadura e a moça que compra sozinha',
  sinopse:
    'O Caíque resolveu modernizar a casa da Vó Zilá numa tarde: câmera na sala, campainha com vídeo, fechadura com senha, lâmpadas coloridas e uma assistente de voz que ela chama de "a moça". Tudo com a senha que veio na caixa. Num domingo, você encontra a sala da sua avó num site que lista câmeras abertas na internet.',
  generos: ['Comédia', 'Família', 'Casa conectada'],
  capa: { fundo: 'sala_vo_tech', cor: '#0ca678' },
  inicio: 'v01_inicio',
  protagonistaPadrao: {
    nome: 'Lívia',
    visual: { pele: 6, cabelo: 'crespo_volumoso', corCabelo: 0, roupa: 'jaqueta_jeans', acessorio: 'oculos_quadrado', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5, autonomia_vo: 3 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', autonomia_vo: 'Autonomia da vó', seguranca: 'Segurança da casa' },
  hud: [{ var: 'seguranca', icone: '🏠', sufixo: '/10' }],
};
