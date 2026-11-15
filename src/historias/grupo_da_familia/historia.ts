import type { Final, Historia, Personagem } from '../../motor/tipos';
import * as p1 from './conteudo/parte1';
import * as p2 from './conteudo/parte2';

const fontes = import.meta.glob('./roteiro/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const personagens: Personagem[] = [
  { id: 'neide', nome: 'Tia Neide', cor: '#d6336c', visual: { pele: 3, cabelo: 'franja_chanel', corCabelo: 3, roupa: 'roupa_igreja', acessorio: 'brinco_argola', idade: 'adulta' } },
  { id: 'juninho', nome: 'Juninho', cor: '#1c7ed6', visual: { pele: 3, cabelo: 'black_curto', corCabelo: 0, roupa: 'jaleco_laboratorio', idade: 'adulta', corpo: 'm' } },
  { id: 'vo', nome: 'Vó Dita', cor: '#9c36b5', visual: { pele: 5, cabelo: 'coque', corCabelo: 9, roupa: 'vestido_florido_idosa', acessorio: 'oculos_redondo', idade: 'idosa' } },
  { id: 'tio', nome: 'Tio Edson', cor: '#e67700', visual: { pele: 2, cabelo: 'careca', corCabelo: 8, roupa: 'camisa_polo', idade: 'idoso', corpo: 'm', barba: true } },
  { id: 'kaka', nome: 'Prima Kaká', cor: '#f06595', visual: { pele: 4, cabelo: 'liso_longo', corCabelo: 6, roupa: 'cropped_e_calca_cargo', acessorio: 'brinco_argola', idade: 'adulta' } },
  { id: 'mae', nome: 'Dona Selma', cor: '#2f9e44', visual: { pele: 5, cabelo: 'cacheado_curto', corCabelo: 1, roupa: 'avental', idade: 'adulta' } },
  { id: 'tio_bene', nome: 'Tio Benê', cor: '#5c940d', visual: { pele: 6, cabelo: 'raspado', corCabelo: 5, roupa: 'camisa_time_futebol', acessorio: 'bone', idade: 'idoso', corpo: 'm' } },
  { id: 'atendente', nome: 'Atendente do banco', cor: '#1864ab', visual: { pele: 6, cabelo: 'rabo_de_cavalo', corCabelo: 0, roupa: 'headset_call_center', idade: 'adulta' } },
  { id: 'golpista', nome: 'Juninho Novo', cor: '#495057', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 0, roupa: 'terno', idade: 'adulta', corpo: 'm' } },
  { id: 'fausto', nome: 'Dr. Fausto Recupera', cor: '#343a40', visual: { pele: 1, cabelo: 'liso_curto', corCabelo: 5, roupa: 'terno', acessorio: 'oculos_quadrado', idade: 'adulta', corpo: 'm' } },
  { id: 'central', nome: 'Central de Segurança', cor: '#c92a2a', visual: { pele: 2, cabelo: 'liso_curto', corCabelo: 1, roupa: 'headset_call_center', idade: 'adulta', corpo: 'm' } },
  { id: 'delegada', nome: 'Delegada Márcia', cor: '#264653', visual: { pele: 4, cabelo: 'rabo_de_cavalo', corCabelo: 0, roupa: 'farda_policia', idade: 'adulta' } },
];

const finais: Final[] = [
  { id: 'heroina_do_almoco', tipo: 'bom', titulo: 'Heroína do almoço', texto: 'O dinheiro foi bloqueado a tempo, a família inteira ligou a verificação em duas etapas e a Vó Dita fez um brinde a você com guaraná. A Tia Neide ainda diz que "quase descobriu sozinha".' },
  { id: 'vo_hacker', tipo: 'bom', titulo: 'Vó Dita, analista de ameaças', texto: 'Aos 80 anos, a Vó criou o grupo "Alerta de Golpe da Família", com regras, figurinha própria e zero corrente. Ela modera melhor que muita empresa.' },
  { id: 'familia_blindada', tipo: 'bom', titulo: 'Família blindada', texto: 'A Tia Neide virou a primeira a avisar quando chega mensagem estranha. Ela ainda manda rosa animada de bom dia, mas agora pergunta antes de clicar.' },
  { id: 'dinheiro_foi_familia_ficou', tipo: 'agridoce', titulo: 'O dinheiro foi, a família ficou', texto: 'Os R$ 4.800 não voltaram. Mas o boletim foi feito, ninguém caiu de novo e, pela primeira vez, a Tia Neide disse "obrigada" sem completar com "mas".' },
  { id: 'saiu_do_grupo', tipo: 'agridoce', titulo: 'Você saiu do grupo', texto: 'Você saiu do grupo pela sua paz e criou um canal só de avisos. Tem 9 inscritos. Seis leem.' },
  { id: 'golpe_em_cadeia', tipo: 'ruim', titulo: 'Golpe em cadeia', texto: 'Falso filho, falsa central, falso advogado. Em um fim de semana a Tia Neide caiu três vezes e o almoço de 80 anos terminou com cada um num canto do quintal.' },
  { id: 'tio_rendeu_3_por_cento', tipo: 'ruim', titulo: 'Rendeu 3% ao dia (por 4 dias)', texto: 'O dinheiro da festa foi para o investimento garantido do Tio Edson. Rendeu lindamente até o site sair do ar. O bolo da Vó foi de padaria.' },
  { id: 'bloqueada_pela_tia', tipo: 'ruim', titulo: 'Bloqueada pela Tia Neide', texto: 'Você expôs a Tia Neide no grupo. Ela te bloqueou e, a partir dali, ninguém mais escutou seus avisos. Segurança sem empatia não protege ninguém.' },
];

export const grupoDaFamilia: Historia = {
  id: 'grupo_da_familia',
  titulo: 'Grupo da Família',
  subtitulo: 'Um fim de semana, oito golpes e um almoço de 80 anos',
  sinopse:
    'Sexta, 18h47. O grupo "Família Reunida 🙏🌹" explode: a Tia Neide acabou de mandar R$ 4.800 para o "Juninho de número novo". O relógio está correndo, a tia não quer admitir, o Tio Edson acha que golpe é coisa de gente burra e ainda falta organizar o almoço de 80 anos da Vó Dita. Você é a que mexe com computador. Boa sorte.',
  generos: ['Comédia', 'Suspense', 'Família'],
  capa: { fundo: 'sala_familia', cor: '#25a56a' },
  inicio: 'g01_inicio',
  protagonistaPadrao: {
    nome: 'Larissa',
    visual: { pele: 4, cabelo: 'cacheado_longo', corCabelo: 1, roupa: 'camisa_social', acessorio: 'oculos_redondo', idade: 'adulta' },
  },
  personagens,
  desafios: [...p1.desafios, ...p2.desafios],
  notas: [...p1.notas, ...p2.notas],
  finais,
  fontes,
  varsIniciais: { tecnica: 0, etica: 0, paciencia: 5, confianca: 0 },
  atributos: { tecnica: 'Técnica', etica: 'Ética', paciencia: 'Paciência', confianca: 'Confiança da família', minutos: 'Minutos' },
  hud: [{ var: 'minutos', icone: '⏱️', sufixo: ' min' }],
};
