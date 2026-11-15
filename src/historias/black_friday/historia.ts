import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'pai', nome: 'Seu Ademar', cor: '#1971c2', visual: { pele: 5, cabelo: 'careca', corCabelo: 8, roupa: 'camisa_time_futebol', idade: 'idoso', corpo: 'm', barba: true } },
  { id: 'kevin', nome: 'Kevin', cor: '#f76707', visual: { pele: 5, cabelo: 'topete', corCabelo: 0, roupa: 'moletom_capuz', acessorio: 'bone', idade: 'adolescente', corpo: 'm' } },
  { id: 'paty', nome: 'Paty', cor: '#ae3ec9', visual: { pele: 2, cabelo: 'cacheado_longo', corCabelo: 3, roupa: 'headset_call_center', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'vendedor', nome: 'Vendedor Top 5 Estrelas', cor: '#495057', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 0, roupa: 'camisa_polo', idade: 'adulta', corpo: 'm' } },
  { id: 'sac_falso', nome: 'Atendimento Oficial', cor: '#c92a2a', visual: { pele: 2, cabelo: 'liso_longo', corCabelo: 1, roupa: 'headset_call_center', idade: 'adulta' } },
  { id: 'entregador', nome: 'Transportadora', cor: '#e67700', visual: { pele: 3, cabelo: 'raspado', corCabelo: 0, roupa: 'jaqueta_jeans', acessorio: 'bone', idade: 'adulta', corpo: 'm' } },
  { id: 'gerente', nome: 'Gerente do banco', cor: '#0b7285', visual: { pele: 6, cabelo: 'coque', corCabelo: 0, roupa: 'blazer_entrevista', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'dona_nice', nome: 'Dona Nice', cor: '#d6336c', visual: { pele: 3, cabelo: 'cacheado_curto', corCabelo: 6, roupa: 'vestido_florido_idosa', acessorio: 'oculos_redondo', idade: 'idosa' } },
];

const finais: Final[] = [
  { id: 'tv_nova_e_dinheiro_salvo', tipo: 'bom', titulo: 'TV nova, dinheiro salvo', texto: 'Comprou no lugar certo, pelo preço que faz sentido, e a TV chegou antes do jogo. O Seu Ademar chorou no hino e jurou que foi a cebola do vinagrete.' },
  { id: 'kevin_virou_caca_golpe', tipo: 'bom', titulo: 'Kevin, caçador de golpes', texto: 'O Kevin parou de espalhar link de oferta e começou a desmontar golpe em vídeo. Doze mil seguidores. A primeira postagem foi sobre a loja que quase pegou a irmã.' },
  { id: 'o_presente_era_outro', tipo: 'bom', titulo: 'O presente era outro', texto: 'O Seu Ademar queria mesmo era assistir à final com os filhos do lado. A TV nova veio duas semanas depois, comprada com calma, e a de tubo ganhou aposentadoria digna na casa da praia de um primo.' },
  { id: 'tv_da_dona_nice', tipo: 'agridoce', titulo: 'Na sala da Dona Nice', texto: 'Sem TV nova, a final foi na sala da vizinha, com bolo de fubá e uma opinião por minuto. Ninguém perdeu dinheiro. A Dona Nice perdeu a voz no segundo gol.' },
  { id: 'recuperou_metade', tipo: 'agridoce', titulo: 'Metade de volta', texto: 'Você caiu, mas agiu rápido: banco, contestação, boletim. Metade do dinheiro voltou. A TV fica para o Natal, e o Natal vai ser no lugar certo.' },
  { id: 'caiu_no_site_clone', tipo: 'ruim', titulo: 'A TV que nunca existiu', texto: 'O Pix de R$ 899 foi para uma loja que sumiu do ar na segunda de manhã. O contador regressivo estava certo: a oferta acabava mesmo. A loja também.' },
  { id: 'limpou_a_economia', tipo: 'ruim', titulo: 'Dez meses em um fim de semana', texto: 'Boleto com desconto, taxa de reentrega, estorno pelo privado. A economia de dez meses foi embora em parcelas pequenas e urgentes. Golpe não pega gente burra; pega gente com pressa.' },
  { id: 'cartao_clonado', tipo: 'ruim', titulo: 'Fatura de surpresa', texto: 'Os dados do cartão foram parar na página do cupom. As compras começaram a pingar na fatura de madrugada, uma de cada loja. O cupom de R$ 500 custou bem mais.' },
];

export const blackFriday: Historia = {
  id: 'black_friday',
  titulo: 'Black Friday do Desespero',
  subtitulo: 'Faltam 20 minutos para acabar a promoção',
  sinopse:
    'Sexta, 23h40. Você juntou R$ 2.400 em dez meses para dar uma TV nova ao seu pai antes da final do campeonato, e aparece um anúncio: TV de 65 polegadas por R$ 899, só até meia-noite. O site é idêntico ao da loja, o contador está correndo e o Kevin já mandou mais três links. O fim de semana vai ser longo.',
  generos: ['Comédia', 'Suspense', 'Compras'],
  capa: { fundo: 'sala_tv_velha', cor: '#212529' },
  inicio: 'b01_inicio',
  protagonistaPadrao: {
    nome: 'Bianca',
    visual: { pele: 4, cabelo: 'liso_longo', corCabelo: 2, roupa: 'moletom_capuz', acessorio: 'fone_ouvido', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', minutos: 'Minutos', economia: 'Economia (R$)' },
  hud: [
    { var: 'minutos', icone: '⏳', sufixo: ' min' },
    { var: 'economia', icone: '💳 R$' },
  ],
};
