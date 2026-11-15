import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'lucia', nome: 'Dona Lúcia', cor: '#9c36b5', visual: { pele: 4, cabelo: 'franja_chanel', corCabelo: 5, roupa: 'roupa_igreja', acessorio: 'oculos_redondo', idade: 'idosa' } },
  { id: 'rodrigo', nome: 'Rodrigo', cor: '#1971c2', visual: { pele: 4, cabelo: 'liso_curto', corCabelo: 1, roupa: 'camisa_social', idade: 'adulta', corpo: 'm', barba: true } },
  { id: 'taina', nome: 'Tainá', cor: '#e64980', visual: { pele: 4, cabelo: 'cacheado_longo', corCabelo: 7, roupa: 'moletom_capuz', acessorio: 'fone_ouvido', idade: 'adolescente' } },
  { id: 'tio_nelson', nome: 'Tio Nelson', cor: '#2b8a3e', visual: { pele: 3, cabelo: 'careca', corCabelo: 8, roupa: 'camisa_polo', acessorio: 'oculos_quadrado', idade: 'idoso', corpo: 'm', barba: true } },
  { id: 'falso_advogado', nome: 'Dr. Ricardo Inventários', cor: '#495057', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 0, roupa: 'terno', idade: 'adulta', corpo: 'm' } },
  { id: 'atendente_banco', nome: 'Atendente do banco', cor: '#0b7285', visual: { pele: 6, cabelo: 'rabo_de_cavalo', corCabelo: 0, roupa: 'blazer_entrevista', acessorio: 'cracha', idade: 'adulta' } },
  { id: 'padre', nome: 'Padre Jonas', cor: '#e67700', visual: { pele: 6, cabelo: 'black_curto', corCabelo: 5, roupa: 'camisa_social', idade: 'adulta', corpo: 'm' } },
];

const finais: Final[] = [
  { id: 'album_da_familia', tipo: 'bom', titulo: 'O álbum da família', texto: 'As fotos de 30 anos voltaram pelo caminho certo e viraram um álbum impresso que passa de casa em casa entre os netos. Na última página, o Seu Valter de bermuda, consertando a fiação do vizinho de graça.' },
  { id: 'plano_para_todos', tipo: 'bom', titulo: 'Ninguém passa por isso de novo', texto: 'A família inteira fez o plano de herança digital: lista de contas, gerenciador de senhas com acesso de emergência e um contato de confiança. A Dona Lúcia foi a primeira. "Pra não dar trabalho pra vocês", disse.' },
  { id: 'memorial_do_valter', tipo: 'bom', titulo: 'Memorial do Valter', texto: 'O perfil virou memorial. Ninguém mais entra, ninguém mais posta por ele. A Tainá continua escrevendo para o pai no aniversário, e os amigos do futebol respondem com foto de churrasco.' },
  { id: 'irmaos_separados', tipo: 'agridoce', titulo: 'Tudo resolvido, menos os irmãos', texto: 'As contas foram encerradas, as fotos salvas, o golpe evitado. Mas o Rodrigo e você passaram um ano sem se falar. Voltaram no aniversário da mãe, com um pavê no meio da mesa como bandeira branca.' },
  { id: 'celular_na_gaveta', tipo: 'agridoce', titulo: 'O celular na gaveta', texto: 'O celular do Seu Valter está numa gaveta, desligado, com 1% de bateria. Algumas contas ainda cobram, algumas fotos ainda estão lá. Luto também tem fila, e tudo bem ir devagar.' },
  { id: 'taxa_do_inventario', tipo: 'ruim', titulo: 'A taxa do Dr. Ricardo', texto: 'O "Dr. Ricardo Inventários" recebeu a taxa e sumiu. Golpista lê obituário. A família perdeu dinheiro na semana em que menos podia.' },
  { id: 'conta_invadida_do_pai', tipo: 'ruim', titulo: 'Alguém virou o Valter', texto: 'Alguém tomou a conta do Seu Valter e pediu dinheiro aos amigos dele, no nome dele, com a foto dele. Dois caíram. A pior mensagem do mês foi a que parecia vir do pai.' },
  { id: 'pix_da_discordia', tipo: 'ruim', titulo: 'O Pix da discórdia', texto: 'O Pix tirado da conta do pai "só para o enterro" virou acusação no inventário. Três irmãos, dois advogados, nenhum churrasco.' },
];

export const herancaDigital: Historia = {
  id: 'heranca_digital',
  titulo: 'Herança Digital',
  subtitulo: 'O celular do pai tem 23% de bateria e ninguém sabe a senha',
  sinopse:
    'O Seu Valter morreu numa terça e deixou o celular de tela trincada com tudo dentro: banco, fotos de 30 anos, o chip e a verificação em duas etapas de todas as contas. Tem 23% de bateria e o carregador é de um modelo que ninguém tem. Os irmãos discordam, o perfil dele continua postando bom dia e um "advogado do inventário" já ligou para a sua mãe.',
  generos: ['Drama', 'Família', 'Comédia'],
  capa: { fundo: 'gaveta_celular', cor: '#5f3dc4' },
  inicio: 'h01_inicio',
  protagonistaPadrao: {
    nome: 'Renata',
    visual: { pele: 4, cabelo: 'rabo_de_cavalo', corCabelo: 1, roupa: 'camiseta_preta_hacker', acessorio: 'cracha', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5, uniao: 0 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', uniao: 'União dos irmãos', bateria: 'Bateria' },
  hud: [{ var: 'bateria', icone: '🔋', sufixo: '%' }],
};
