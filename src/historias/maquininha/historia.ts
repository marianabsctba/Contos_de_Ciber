import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'mae', nome: 'Dona Fátima', cor: '#d6336c', visual: { pele: 4, cabelo: 'cacheado_curto', corCabelo: 5, roupa: 'roupa_igreja', acessorio: 'oculos_redondo', idade: 'idosa' } },
  { id: 'jefferson', nome: 'Jefferson', cor: '#e8590c', visual: { pele: 6, cabelo: 'raspado', corCabelo: 0, roupa: 'avental', acessorio: 'bone', idade: 'adolescente', corpo: 'm' } },
  { id: 'tati', nome: 'Tati do Açaí', cor: '#7048e8', visual: { pele: 3, cabelo: 'rabo_de_cavalo', corCabelo: 7, roupa: 'cropped_e_calca_cargo', acessorio: 'brinco_argola', idade: 'adulta' } },
  { id: 'osvaldo', nome: 'Seu Osvaldo', cor: '#e67700', visual: { pele: 1, cabelo: 'careca', corCabelo: 8, roupa: 'camisa_xadrez_festa_junina', idade: 'idoso', corpo: 'm', barba: true } },
  { id: 'motoboy', nome: 'Motoboy', cor: '#495057', visual: { pele: 2, cabelo: 'liso_curto', corCabelo: 0, roupa: 'jaqueta_jeans', acessorio: 'bone', idade: 'adulta', corpo: 'm' } },
  { id: 'tecnico', nome: 'Técnico da Maquininha', cor: '#1864ab', visual: { pele: 1, cabelo: 'topete', corCabelo: 1, roupa: 'headset_call_center', idade: 'adulta', corpo: 'm' } },
  { id: 'cliente_pix', nome: 'Cliente simpático', cor: '#2b8a3e', visual: { pele: 3, cabelo: 'black_curto', corCabelo: 0, roupa: 'camisa_polo', acessorio: 'oculos_quadrado', idade: 'adulta', corpo: 'm' } },
  { id: 'gerente', nome: 'Gerente do banco', cor: '#0b7285', visual: { pele: 6, cabelo: 'coque', corCabelo: 0, roupa: 'blazer_entrevista', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'delegado', nome: 'Delegado Paulo', cor: '#343a40', visual: { pele: 5, cabelo: 'black_curto', corCabelo: 5, roupa: 'camisa_social', idade: 'adulta', corpo: 'm', barba: true } },
  { id: 'zeca', nome: 'Seu Zeca', cor: '#a61e4d', visual: { pele: 4, cabelo: 'raspado', corCabelo: 8, roupa: 'camisa_time_futebol', idade: 'idoso', corpo: 'm' } },
];

const finais: Final[] = [
  { id: 'pastelaria_blindada', tipo: 'bom', titulo: 'Pastelaria blindada', texto: 'Desde aquele mês, o Pastel da {nome} não perdeu mais um real para golpe. Na parede, do lado do cardápio, uma placa: "Pix só vale quando cai. Pastel só sai quando cai."' },
  { id: 'rua_protegida', tipo: 'bom', titulo: 'A Rua 7 aprendeu', texto: 'Você juntou a associação, fez cartilha e colou um aviso em cada balcão. O Seu Zeca, que era contra "essas modernidades", hoje confere o nome do recebedor antes de qualquer Pix e cobra isso dos outros.' },
  { id: 'mae_ganhou_a_contestacao', tipo: 'bom', titulo: 'Dona Fátima ganhou', texto: 'Com o boletim, a contestação feita rápido e cada detalhe anotado, o banco devolveu o dinheiro da Dona Fátima. Agora ela dá palestra no grupo da igreja: "Visor rachado? Não pago nem com reza."' },
  { id: 'virou_influencer', tipo: 'agridoce', titulo: 'Influencer do golpe', texto: 'Seus vídeos explicando golpe com um pastel na mão viralizaram. Você ajuda milhares de pessoas. Mas o balcão ficou sem dona, e o pastel de queijo nunca mais foi o mesmo.' },
  { id: 'voltou_pra_feira', tipo: 'agridoce', titulo: 'De volta para a feira', texto: 'Você fechou a loja e voltou para a barraca de domingo. Menor, mais simples, Pix conferido na tela do celular a cada venda. O Jefferson foi junto.' },
  { id: 'fechou_as_portas', tipo: 'ruim', titulo: 'Portas fechadas', texto: 'Entre maquininha, comprovante falso, QR code trocado e boleto adulterado, o caixa não aguentou. A placa "PASSA-SE O PONTO" ficou na porta por três meses.' },
  { id: 'caiu_em_tudo', tipo: 'ruim', titulo: 'Caiu em tudo', texto: 'Um golpe por semana, nenhum aprendizado. Ninguém está imune, mas quem não confere vira cliente fiel dos golpistas.' },
  { id: 'culpou_o_jefferson', tipo: 'ruim', titulo: 'Sem chapeiro e sem molho', texto: 'Você culpou o Jefferson pela conta invadida, sem olhar que a senha era sua e era a mesma de tudo. Ele foi embora e levou a receita do molho. A culpa era do processo, não da pessoa.' },
];

export const maquininha: Historia = {
  id: 'maquininha',
  titulo: 'Maquininha',
  subtitulo: 'Um mês, uma pastelaria e todos os golpes do balcão',
  sinopse:
    'A pastelaria da sua família saiu da feira de domingo e virou lanchonete. Aí veio a sexta em que um motoboy entregou flores para a sua mãe com "taxa de R$ 5,99" numa maquininha de visor rachado. Comprovante falso, QR code colado por cima do seu, técnico que liga pedindo para instalar aplicativo, boleto do queijo adulterado: o golpe mais brasileiro de todos tem muitos primos.',
  generos: ['Comédia', 'Comércio', 'Golpes'],
  capa: { fundo: 'pastelaria', cor: '#f08c00' },
  inicio: 'm01_inicio',
  protagonistaPadrao: {
    nome: 'Joyce',
    visual: { pele: 5, cabelo: 'trancas_box', corCabelo: 0, roupa: 'avental', acessorio: 'brinco_argola', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5, reputacao: 0 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', reputacao: 'Reputação na rua', caixa: 'Caixa (R$)' },
  hud: [{ var: 'caixa', icone: '💰 R$' }],
};
