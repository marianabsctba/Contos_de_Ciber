import type { Desafio, Final, Historia, Nota, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';
import * as p3 from './conteudo/parte3';
import * as p4 from './conteudo/parte4';
import * as p5 from './conteudo/parte5';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'mae', nome: 'Dona Rosilene', cor: '#e07a5f', visual: { pele: 5, cabelo: 'coque', corCabelo: 0, roupa: 'avental', idade: 'adulta' } },
  { id: 'vo', nome: 'Vó Nita', cor: '#b5838d', visual: { pele: 6, cabelo: 'coque', corCabelo: 9, roupa: 'vestido_florido_idosa', acessorio: 'lenco_cabeca', idade: 'idosa' } },
  { id: 'tio', nome: 'Tio Juca', cor: '#6d8b74', visual: { pele: 5, cabelo: 'raspado', corCabelo: 0, roupa: 'camisa_time_futebol', idade: 'adulta', corpo: 'm', barba: true } },
  { id: 'bia', nome: 'Bia', cor: '#f28482', visual: { pele: 3, cabelo: 'cacheado_longo', corCabelo: 4, roupa: 'camiseta_desenho', idade: 'crianca' }, cresceJunto: { crianca: 'camiseta_desenho', adolescente: 'jaqueta_jeans', adulta: 'avental' } },
  { id: 'leni', nome: 'Professora Leni', cor: '#7b9acc', visual: { pele: 2, cabelo: 'franja_chanel', corCabelo: 2, roupa: 'camisa_social', acessorio: 'oculos_redondo', idade: 'adulta' } },
  { id: 'cida', nome: 'Dona Cida', cor: '#f4a261', visual: { pele: 4, cabelo: 'cacheado_curto', corCabelo: 3, roupa: 'camisa_polo', acessorio: 'brinco_argola', idade: 'adulta' } },
  { id: 'valdir', nome: 'Seu Valdir', cor: '#c9a227', visual: { pele: 1, cabelo: 'careca', corCabelo: 8, roupa: 'avental', idade: 'idoso', corpo: 'm', barba: true } },
  { id: 'cleiton', nome: 'Cleiton', cor: '#9a8c98', visual: { pele: 2, cabelo: 'topete', corCabelo: 1, roupa: 'camisa_time_futebol', acessorio: 'bone', idade: 'adulta', corpo: 'm' } },
  { id: 'marlene', nome: 'Marlene', cor: '#d4a5a5', visual: { pele: 1, cabelo: 'liso_longo', corCabelo: 5, roupa: 'roupa_igreja', acessorio: 'brinco_argola', idade: 'adulta' } },
  { id: 'robson', nome: 'Robson', cor: '#8d99ae', visual: { pele: 3, cabelo: 'liso_curto', corCabelo: 0, roupa: 'camisa_polo', idade: 'adulta', corpo: 'm' } },
  { id: 'doutor', nome: '"Doutor" Anselmo', cor: '#8b0000', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 8, roupa: 'terno', acessorio: 'oculos_quadrado', idade: 'adulta', corpo: 'm' } },
  { id: 'thais', nome: 'Thaís', cor: '#2a9d8f', visual: { pele: 7, cabelo: 'trancas_box', corCabelo: 0, roupa: 'jaleco_laboratorio', idade: 'adulta' } },
  { id: 'kelly', nome: 'Kelly do RH', cor: '#ff70a6', visual: { pele: 2, cabelo: 'liso_longo', corCabelo: 5, roupa: 'blazer_entrevista', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'fabio', nome: 'Fábio', cor: '#577590', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 2, roupa: 'camisa_social', acessorio: 'cracha', idade: 'adulta', corpo: 'm' } },
  { id: 'iracema', nome: 'Iracema', cor: '#9b5de5', visual: { pele: 7, cabelo: 'crespo_volumoso', corCabelo: 8, roupa: 'camiseta_preta_hacker', acessorio: 'oculos_quadrado', idade: 'adulta' } },
  { id: 'davi', nome: 'Davi', cor: '#00bbf9', visual: { pele: 5, cabelo: 'black_curto', corCabelo: 0, roupa: 'camiseta_evento_ctf', acessorio: 'fone_ouvido', idade: 'adulta', corpo: 'm' } },
  { id: 'rafa', nome: 'Rafa', cor: '#f15bb5', visual: { pele: 3, cabelo: 'franja_chanel', corCabelo: 7, roupa: 'cropped_e_calca_cargo', idade: 'adulta' } },
  { id: 'prefeito', nome: 'Prefeito Zé Bento', cor: '#e9c46a', visual: { pele: 2, cabelo: 'careca', corCabelo: 8, roupa: 'terno', idade: 'idoso', corpo: 'm', barba: true } },
  { id: 'delegada', nome: 'Delegada Márcia', cor: '#264653', visual: { pele: 4, cabelo: 'rabo_de_cavalo', corCabelo: 0, roupa: 'farda_policia', idade: 'adulta' } },
];

const finais: Final[] = [
  { id: 'ciso', tipo: 'bom', titulo: 'A cadeira do andar de cima', texto: 'Você virou chefe de segurança de uma empresa enorme. A senha do Wi-Fi da sua mãe continua sendo o nome do cachorro, mas agora com 2FA.' },
  { id: 'pesquisadora', tipo: 'bom', titulo: 'Palco principal', texto: 'Sua pesquisa abriu o evento mais importante do país. Na plateia, uma menina de Pedra Lisa anotava tudo num caderno de capa dura.' },
  { id: 'bug_bounty', tipo: 'bom', titulo: 'Recompensa em dólar', texto: 'Você encontra falhas, reporta do jeito certo e é paga para isso. A Vó Nita conta para a igreja inteira que a neta "trabalha caçando vírus para os americanos".' },
  { id: 'empresa_interior', tipo: 'bom', titulo: 'Sinal forte', texto: 'Sua empresa protege prefeituras, cooperativas e o mercadinho da esquina da região inteira. Pedra Lisa agora tem duas barras de sinal e uma especialista.' },
  { id: 'professora', tipo: 'bom', titulo: 'O laboratório sem cadeado', texto: 'Você dá aula no mesmo laboratório que vivia trancado. Agora ele fica aberto, e as meninas fazem fila.' },
  { id: 'burnout', tipo: 'agridoce', titulo: 'Modo avião', texto: 'Você saiu da área para cuidar de si. Não foi derrota: foi o primeiro incidente que você resolveu priorizando a pessoa certa.' },
  { id: 'outra_carreira', tipo: 'agridoce', titulo: 'Outro caminho', texto: 'Você descobriu que ama outra coisa. Tudo o que aprendeu de segurança protege o seu negócio novo melhor que o de qualquer concorrente.' },
  { id: 'volta_pra_casa', tipo: 'agridoce', titulo: 'Rodoviária de volta', texto: 'Você voltou para Pedra Lisa sem o crachá dos sonhos, mas inteira. Ainda dá tempo. Sempre dá.' },
  { id: 'presa', tipo: 'ruim', titulo: 'Logs não esquecem', texto: 'O serviço para o Doutor voltou anos depois, num inquérito. Na segurança, o que você fez ontem fica registrado em algum lugar.' },
  { id: 'foragida', tipo: 'ruim', titulo: 'Rica e sozinha', texto: 'O dinheiro veio rápido. A paz nunca veio. Você troca de celular a cada mês e não liga mais para a sua mãe.' },
  { id: 'golpeada', tipo: 'ruim', titulo: 'Taxa de inscrição', texto: 'Entre vaga falsa, curso milagroso e aluguel que não existia, o dinheiro acabou antes do sonho. Ninguém está imune a golpe; dá para recomeçar.' },
];

const desafios: Desafio[] = [...p1.desafios, ...p2.desafios, ...p3.desafios, ...p4.desafios, ...p5.desafios];
const notas: Nota[] = [...p1.notas, ...p2.notas, ...p3.notas, ...p4.notas, ...p5.notas];

export const sinalFraco: Historia = {
  id: 'sinal_fraco',
  titulo: 'Sinal Fraco',
  subtitulo: 'Do interior para a segurança da informação',
  sinopse:
    'Em Pedra Lisa do Norte, o sinal de celular só pega em cima da caixa d\'água e o computador da escola vive trancado. Mesmo assim, uma menina decidiu que vai trabalhar com segurança. Entre lan house fiado, PC de gambiarra, clientes de índole duvidosa e seleções que pedem cinco anos de experiência para estágio, cada escolha leva a um final diferente.',
  generos: ['Drama', 'Comédia', 'Ciber'],
  capa: { fundo: 'praca_interior', cor: '#ff4f8b' },
  inicio: 'c01_inicio',
  protagonistaPadrao: {
    nome: 'Jéssica',
    visual: { pele: 4, cabelo: 'maria_chiquinha', corCabelo: 0, roupa: 'uniforme_escola_publica', idade: 'crianca' },
  },
  personagens,
  desafios,
  notas,
  finais,
  fontes,
};
