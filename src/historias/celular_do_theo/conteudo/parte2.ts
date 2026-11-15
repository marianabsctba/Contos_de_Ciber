import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 't5_guardar_prova',
    tipo: 'ordenar',
    titulo: 'Virou alvo no grupo',
    enunciado: 'A zoação agora é com o Theo. Coloque na ordem certa o que fazer, do primeiro minuto até a escola.',
    passos: [
      'Não responder no calor da hora e não revidar com outra zoação',
      'Não apagar nada e não encaminhar a montagem para ninguém, nem para reclamar',
      'Tirar print com o nome do grupo, o nome de quem mandou, a data e a hora aparecendo',
      'Guardar os prints numa pasta separada no celular',
      'Mostrar para um adulto de confiança: mãe, avó, professora',
      'Levar o caso para a escola junto com esse adulto',
    ],
    explicacao:
      'Responder alimenta a zoação e revidar cria uma guerra em que todo mundo perde. Apagar faz sumir a prova, e encaminhar, mesmo para reclamar, espalha a humilhação de novo. O print só vale como prova se mostrar onde foi, quem mandou e quando. Com a prova guardada, o passo que resolve é contar para um adulto, que leva o caso para a escola.',
  },
  {
    id: 't6_alerta_falso',
    tipo: 'achar',
    titulo: 'O alerta do grupo de pais',
    enunciado:
      'Esta é a corrente que chegou no grupo "Mães e Pais 6º B". Toque em tudo o que mostra que o alerta é falso ou exagerado. Cuidado: nem tudo nele é mentira.',
    visual: 'mensagem',
    trechos: [
      {
        texto: '⚠️ URGENTE!!! REPASSEM PARA TODOS OS GRUPOS ⚠️',
        suspeito: true,
        porque:
          'Pedir para repassar com urgência é a marca de corrente. Aviso oficial de verdade é publicado pela própria escola ou pelo órgão responsável, e não depende de você espalhar.',
      },
      { texto: 'Um "desafio" perigoso está circulando entre as crianças em vídeos curtos.' },
      {
        texto: 'Já são 47 crianças internadas no estado só esta semana.',
        suspeito: true,
        porque: 'Número exato, sem data, sem hospital, sem fonte. Número inventado dá cara de verdade e espalha pânico.',
      },
      {
        texto: 'A polícia confirmou e mandou avisar.',
        suspeito: true,
        porque:
          'Citar uma autoridade sem link para o site oficial dela é o truque mais comum dos boatos. Se um órgão confirmou, está publicado no canal oficial dele.',
      },
      {
        texto: 'O desafio vem escondido em desenho infantil e o celular baixa sozinho um vírus que liga a câmera.',
        suspeito: true,
        porque: 'Exagero técnico que assusta, mas não se sustenta. Boato costuma misturar um perigo real com uma lenda.',
      },
      { texto: 'Converse com seu filho sobre o que ele vê na internet.' },
      {
        texto: 'Veja a lista das escolas atingidas: encurta.li/escolas47',
        suspeito: true,
        porque: 'Link encurtado esconde para onde vai. Em corrente de pânico, ele pode levar a golpe ou a página falsa. Não clique.',
      },
      {
        texto: '↪ Encaminhada com frequência',
        suspeito: true,
        porque: 'A mensagem já passou por muitas mãos e ninguém sabe de onde veio. Quanto mais encaminhada, mais longe da fonte.',
      },
    ],
    minimo: 3,
    explicacao:
      'Alerta falso mistura um perigo real (desafios perigosos existem e circulam entre crianças) com números sem fonte, autoridade sem link, exagero técnico e pedido de "repassem". Para checar: procure o texto num site de checagem de notícias, veja a data, procure no canal oficial do órgão citado e pergunte à escola pelo canal da escola. Checar não é ignorar: o alerta pode ser falso e a conversa com o filho continuar necessária.',
  },
  {
    id: 't7_sinais',
    tipo: 'achar',
    titulo: 'A conversa com Kaio_Pro_2009',
    enunciado:
      'Esta é a conversa que o desconhecido mandou ao Theo no chat do jogo. Toque em todos os sinais de alerta de um adulto desconhecido tentando se aproximar de uma criança.',
    visual: 'mensagem',
    trechos: [
      { texto: 'mano esse castelo é teu?? é o mais insano do servidor' },
      {
        texto: 'tu é diferente dos outros moleques da tua idade. dá pra ver',
        suspeito: true,
        porque: 'Elogio exagerado e "você é especial, mais maduro" fazem a criança se sentir escolhida. É o começo do vínculo.',
      },
      {
        texto: 'quer 5 mil moedas? te mando de presente. sem pegadinha',
        suspeito: true,
        porque: 'Presente de desconhecido cria uma sensação de dívida. Depois vem o "eu te dei, agora você me deve".',
      },
      { texto: 'viu a ponte nova? ficou boa' },
      {
        texto: 'qual escola tu estuda? acho que a gente mora perto',
        suspeito: true,
        porque: 'Escola e bairro são informação de onde a criança está todo dia. Ninguém precisa disso para jogar.',
      },
      {
        texto: 'que horas tu fica sozinho em casa?',
        suspeito: true,
        porque: 'Perguntar quando a criança está sem adulto por perto é um dos sinais mais sérios.',
      },
      {
        texto: 'bora conversar no outro app? aqui tem moderador chato',
        suspeito: true,
        porque: 'Mudar de plataforma é sair de onde existe moderação e denúncia, para um lugar mais escondido.',
      },
      {
        texto: 'não conta pros teus pais tá. eles não entendem a nossa amizade',
        suspeito: true,
        porque: 'Pedido de segredo isola a criança de quem pode protegê-la. Adulto de bem não pede segredo para criança.',
      },
      {
        texto: 'me manda uma foto tua. só pra eu saber quem é meu parceiro',
        suspeito: true,
        porque: 'Pedido de foto de uma criança por um desconhecido é motivo para parar a conversa, guardar prova e contar para um adulto na hora.',
      },
    ],
    minimo: 4,
    explicacao:
      'Os sinais de alerta de um adulto desconhecido costumam vir juntos: elogio exagerado, presentes, perguntas sobre escola, bairro e horários em que a criança fica sozinha, pedido para mudar para outro aplicativo, pedido de segredo e pedido de foto. Um sinal sozinho já pede atenção; vários juntos pedem ação. A criança não tem culpa de nada disso, e o que mais protege é ela saber que pode contar sem levar bronca.',
  },
  {
    id: 't7_o_que_fazer',
    tipo: 'ordenar',
    titulo: 'O que fazer agora',
    enunciado: 'O Theo mostrou a conversa. Coloque na ordem certa o que a família faz a seguir.',
    passos: [
      'Dizer ao Theo que ele não está encrencado e que fez muito bem em contar',
      'Não responder mais o desconhecido e não apagar a conversa',
      'Tirar print de tudo, com o nome de usuário, a data e a hora',
      'Denunciar o perfil no próprio jogo e depois bloquear',
      'Levar as provas à delegacia ou registrar no canal oficial de denúncia de crimes contra crianças na internet',
    ],
    explicacao:
      'Primeiro a criança: se ela sentir que fez algo errado, da próxima vez não conta. Depois, parar o contato sem destruir nada, porque apagar a conversa apaga a prova. O print precisa mostrar quem, quando e onde. A denúncia na plataforma ajuda a derrubar o perfil e proteger outras crianças; o bloqueio vem depois, para a denúncia ser feita enquanto o perfil ainda aparece. Por fim, a delegacia ou o canal oficial de denúncia, com as provas. Não responda fingindo ser a criança e não tente investigar sozinha.',
  },
  {
    id: 't8_regras',
    tipo: 'formulario',
    titulo: 'As regras da família',
    enunciado: 'Escreva com o Theo as regras do celular, depois de tudo o que aconteceu no bimestre. Escolha o combinado mais seguro e mais justo em cada linha.',
    visual: 'documento',
    campos: [
      {
        rotulo: 'Onde o celular dorme',
        opcoes: ['Carregando na sala, fora do quarto', 'Debaixo do travesseiro, para despertar', 'Onde ele quiser, se prometer não usar'],
        certa: 0,
        porque: 'De noite é quando chega mensagem de quem não deveria. Celular fora do quarto protege o sono e tira a conversa escondida da madrugada.',
      },
      {
        rotulo: 'Compras no jogo',
        opcoes: ['Só com aprovação de um adulto e sem cartão salvo', 'Livre até cinquenta reais por mês', 'Com o cartão salvo, para não precisar pedir'],
        certa: 0,
        porque: 'Cartão salvo transforma qualquer toque em compra. Aprovação de adulto faz cada compra virar uma conversa.',
      },
      {
        rotulo: 'Fotos e postagens',
        opcoes: ['Pode tudo, se for só para os amigos', 'Sem uniforme, sem localização e com perfil privado', 'Proibido postar qualquer coisa, para sempre'],
        certa: 1,
        porque: 'Uniforme e localização dizem onde a criança está. Perfil privado limita quem vê. Proibir tudo só empurra para o escondido.',
      },
      {
        rotulo: 'Se um desconhecido puxar conversa',
        opcoes: ['Responder educado e depois bloquear', 'Apagar a conversa para não dar problema', 'Não responder, mostrar para a mãe, e contar nunca dá bronca'],
        certa: 2,
        porque: 'Apagar some com a prova e responder alimenta o contato. A parte "contar nunca dá bronca" é a que faz a regra funcionar.',
      },
      {
        rotulo: 'Zoação no grupo',
        opcoes: ['Não repassar, guardar print e contar para um adulto', 'Sair do grupo e esquecer', 'Responder à altura para ninguém mais zoar'],
        certa: 0,
        porque: 'Não repassar corta a corrente da humilhação, o print guarda a prova e o adulto leva o caso para a escola.',
      },
      {
        rotulo: 'Controle dos pais',
        opcoes: ['Instalado escondido, para ver tudo', 'Combinado às claras e revisado juntos de vez em quando', 'Nenhum, para mostrar confiança'],
        certa: 1,
        porque: 'Controle combinado protege e ensina. Escondido protege até ser descoberto, e aí quebra a confiança. Nenhum deixa a criança sozinha num mundo de adultos.',
      },
    ],
    minimo: 4,
    explicacao:
      'Boa regra de família é curta, escrita junto, explica o porquê e diz o que fazer quando algo dá errado. Proibição sem explicação dura até a primeira oportunidade de burlar. A regra mais importante não é técnica: é a criança saber que contar nunca dá bronca.',
  },
];

export const notas: Nota[] = [
  {
    id: 't5_guardar_prova',
    titulo: 'Guardar prova de zoação',
    texto: 'Print só serve como prova se mostrar onde foi, quem mandou e quando. Mensagem apagada não volta.',
    exemplo: 'O Enzo posta a montagem do unicórnio no grupo e apaga no dia seguinte. Sem print, vira a palavra do Theo contra a dele.',
    defesa:
      'Tire print com o nome do grupo, o nome de quem mandou, a data e a hora. Guarde numa pasta separada. Não encaminhe para ninguém e mostre para um adulto de confiança, que leva para a escola.',
  },
  {
    id: 't5_nao_compartilhar',
    titulo: 'Zoação: não repassar',
    texto:
      'Cada risada, figurinha ou encaminhamento aumenta o tamanho da humilhação. Em grupo, quem fica quieto ou diz "para" muda mais do que parece.',
    exemplo: 'Catorze reações de risada na montagem do Davi Lucas. Três pessoas tirando a reação já mostram que o grupo não está todo do lado da zoação.',
    defesa:
      'Não ria, não repasse, não revide com outra montagem. Se puder, diga "para" ou mande apoio no privado para quem foi zoado. Guarde prova e conte para um adulto e para a escola.',
  },
  {
    id: 't6_alerta_falso',
    titulo: 'Alerta falso no grupo',
    texto: 'Corrente de pânico mistura um perigo real com números sem fonte, autoridade sem link e pedido de "repassem urgente".',
    exemplo: '"47 crianças internadas, a polícia confirmou, o vírus liga a câmera sozinho. Repassem!" Boato antigo, de outro estado.',
    defesa:
      'Antes de repassar: veja a data, procure o texto num site de checagem de notícias, procure no canal oficial do órgão citado, pergunte à escola pelo canal da escola. Não clique em link encurtado de corrente.',
  },
  {
    id: 't6_conversar_sem_panico',
    titulo: 'Desafio viral: conversar sem pânico',
    texto:
      'Desafios perigosos para a saúde circulam entre crianças em vídeos curtos. Proibir no grito ensina a criança a não perguntar mais.',
    exemplo: 'O Theo pergunta "o que é esse desafio?". Se a resposta é "acabou celular!", na próxima vez ele pergunta para o Enzo.',
    defesa:
      'Pergunte o que ele já sabe antes de explicar. Diga com clareza que é perigoso para a saúde, sem mostrar o vídeo e sem detalhes. Dê uma saída para a pressão do grupo ("minha mãe me mata") e avise a escola pelo canal oficial.',
  },
  {
    id: 't7_sinais_alerta',
    titulo: 'Sinais de alerta de adulto desconhecido',
    texto:
      'Elogio exagerado, presentes ou moedas, perguntas sobre escola, bairro e horários em que a criança está sozinha, pedido para mudar de aplicativo, pedido de segredo e pedido de foto.',
    exemplo: 'Kaio_Pro_2009 elogia o castelo, dá cinco mil moedas, pergunta a escola, chama para outro aplicativo e diz "não conta pros teus pais".',
    defesa:
      'Ensine à criança que segredo pedido por adulto é sinal de perigo e que contar nunca dá bronca. Jogo com chat restrito a amigos aprovados e perfil sem dados pessoais diminuem a exposição.',
  },
  {
    id: 't7_o_que_fazer',
    titulo: 'Desconhecido no chat: o que fazer',
    texto: 'Acolher, parar o contato, guardar prova, denunciar, bloquear e procurar ajuda oficial.',
    exemplo: 'A primeira vontade da mãe é apagar tudo. Apagar é justamente o que apaga a prova.',
    defesa:
      'Diga à criança que ela fez certo. Não responda e não apague. Tire print com nome de usuário, data e hora. Denuncie o perfil na própria plataforma e depois bloqueie. Leve as provas à delegacia ou registre no canal oficial de denúncia de crimes contra crianças na internet. Não finja ser a criança e não investigue sozinha.',
  },
  {
    id: 't7_espiar_ou_combinar',
    titulo: 'Espiar escondido ou combinar às claras',
    texto:
      'Aplicativo de vigilância escondido pode mostrar um perigo a tempo, e o medo que leva a isso é compreensível. Mas, quando a criança descobre, ela aprende a esconder melhor.',
    exemplo: '"Você leu TUDO? As minhas conversas com o Gui também?" A partir daí, cada conversa tem uma pergunta no meio.',
    defesa:
      'Prefira controle dos pais combinado: a criança sabe o que é acompanhado e por quê, e vocês revisam juntos. Se já instalou escondido, conte, desinstale ou transforme em combinado. A segurança que dura é a criança vir contar.',
  },
  {
    id: 't8_regras_familia',
    titulo: 'Regras da família',
    texto: 'Regras curtas, escritas junto com a criança, com o porquê de cada uma e o que fazer quando algo der errado.',
    exemplo: 'Celular dorme na sala. Compra só com aprovação. Foto sem uniforme e sem localização. Zoação não se repassa. Desconhecido: conta pra mãe, sem bronca.',
    defesa: 'Escreva, assinem juntos, prendam num lugar visível e revisem quando algo mudar. Regra combinada se cumpre até quando ninguém está olhando.',
  },
  {
    id: 't8_canal_seguro',
    titulo: 'Criança criando conteúdo',
    texto: 'Querer ter canal é comum. O risco está no que o vídeo mostra sem querer: rosto, uniforme, casa, rua, localização.',
    exemplo: 'O primeiro vídeo do Theo mostra só as mãos, a tela do jogo e a voz. Nada de escola, de janela ou de nome completo.',
    defesa:
      'Sem rosto, sem uniforme, sem nada que identifique casa ou escola, localização desligada, comentários moderados e um adulto assistindo antes de publicar. Revisem as regras do canal juntos.',
  },
  {
    id: 't8_confianca',
    titulo: 'Confiança é a melhor ferramenta',
    texto:
      'Nenhuma configuração protege tanto quanto a criança vir contar. Ela conta quando sabe que vai ser ouvida e que contar não dá castigo.',
    exemplo: 'O Theo contou do Kaio na mesma noite porque, uma semana antes, a mãe pediu desculpa por ter gritado.',
    defesa:
      'Escute antes de reagir, explique em vez de só proibir, admita quando errar, não exponha a criança para outras pessoas e nunca castigue quem contou. Celular na gaveta protege o aparelho; a conversa protege o filho.',
  },
];
