import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'p2_fonte_confiavel',
    tipo: 'quiz',
    titulo: 'De onde baixar?',
    enunciado: 'Você precisa de um programa para editar imagens no PC velho. Qual é a opção mais segura?',
    opcoes: [
      'O "crackeado 100% funcionando" do link encurtado no fórum',
      'O site oficial do programa, ou uma alternativa gratuita e livre do site do próprio projeto',
      'O arquivo .exe que um desconhecido mandou no chat dizendo que é o instalador',
      'Qualquer site que aparecer primeiro na busca com a palavra "download grátis"',
    ],
    certa: 1,
    explicacao:
      'Programa pirata e instalador de origem desconhecida são o jeito mais comum de levar malware para casa: o "crack" costuma vir com praga junto. Baixe do site oficial ou use uma alternativa livre (GIMP, LibreOffice, Inkscape) pegando direto do site do projeto. Desconfie de anúncio que imita botão de download e de link encurtado.',
  },
  {
    id: 'p2_ordem_formatar',
    tipo: 'ordenar',
    titulo: 'Formatar o PC da Dona Zezé',
    enunciado: 'O PC da vizinha está lento e lotado de pragas. Ponha o atendimento na ordem certa.',
    passos: [
      'Perguntar o que ela precisa guardar (fotos, documentos, contatos)',
      'Copiar esses arquivos para um disco externo e conferir se abriram',
      'Anotar as contas que ela usa e garantir que ela sabe as senhas ou tem como recuperar',
      'Formatar e instalar o sistema a partir de uma mídia oficial',
      'Instalar as atualizações e um antivírus confiável',
      'Devolver os arquivos e mostrar para ela onde ficaram',
    ],
    explicacao:
      'Formatar apaga tudo. Antes, descubra o que importa para a pessoa e faça a cópia, conferindo se ela abre. Garanta que ela consegue entrar nas contas depois. Só então reinstale de uma mídia oficial, atualize tudo e devolva os arquivos. E nunca fuce nas fotos e conversas do cliente: você está ali para consertar, não para olhar.',
  },
  {
    id: 'p2_senha_painel',
    tipo: 'senha',
    titulo: 'Senha do painel da padaria',
    enunciado:
      'O Seu Valdir queria "padaria123". Crie uma senha forte para o painel do site. Dica: uma frase com quatro ou mais palavras que não combinam funciona muito bem.',
    minimoBits: 60,
    explicacao:
      'Senha boa é longa e imprevisível. Uma frase de várias palavras sem relação ("cavalo-azul-sonha-farinha") é fácil de lembrar e difícil de adivinhar. Nome do estabelecimento, ano e "123" são as primeiras coisas que um robô testa. Guarde num gerenciador de senhas e ligue a verificação em duas etapas quando o painel oferecer.',
  },
  {
    id: 'p2_backup_321',
    tipo: 'quiz',
    titulo: 'Onde guardar o backup?',
    enunciado: 'O site da padaria está pronto. Qual plano de backup segue a regra 3-2-1?',
    opcoes: [
      'Uma cópia no mesmo servidor do site, numa pasta chamada "backup"',
      'Três cópias no pen drive da padaria, que fica do lado do caixa',
      'Três cópias no total, em dois tipos de mídia diferentes, uma delas fora da padaria',
      'Não precisa: a hospedagem já deve fazer, e se não fizer paciência',
    ],
    certa: 2,
    explicacao:
      'Regra 3-2-1: três cópias dos dados, em dois tipos de mídia diferentes, com pelo menos uma fora do lugar (outra casa, nuvem). Backup no mesmo servidor some junto com o site. E backup que nunca foi testado não é backup, é esperança: de tempos em tempos, tente restaurar.',
  },
  {
    id: 'p2_autorizacao',
    tipo: 'quiz',
    titulo: 'Quem pode autorizar?',
    enunciado:
      'O Cleiton diz: "A conta era nossa, eu até sei a senha antiga, ela só trocou. Então eu posso entrar." Do ponto de vista da lei, quem pode autorizar o acesso à conta da Daiane?',
    opcoes: [
      'O Cleiton, porque já soube a senha um dia',
      'Quem pagou o celular em que a conta foi criada',
      'Só a própria Daiane, dona da conta, ou uma ordem judicial',
      'Qualquer pessoa da família',
    ],
    certa: 2,
    explicacao:
      'Autorização é da dona da conta. Ter sabido a senha antes, ter pago o aparelho ou ter sido namorado não dá direito nenhum. Entrar sem autorização é invasão de dispositivo informático (art. 154-A do Código Penal, criado pela Lei 12.737/2012), e quem faz o serviço para outra pessoa responde junto.',
  },
  {
    id: 'p2_comprovante',
    tipo: 'quiz',
    titulo: 'O comprovante chegou',
    enunciado:
      'O cliente mandou no zap a imagem de um comprovante de transferência e pede o arquivo do trabalho "agora, que já paguei". O que você faz?',
    opcoes: [
      'Entrega: o comprovante tem logo do banco, então está pago',
      'Confere no extrato ou no app do seu banco se o dinheiro entrou mesmo, e só então entrega',
      'Pede para ele mandar o comprovante de novo, em PDF, que é mais difícil de falsificar',
      'Liga para o banco dele para confirmar',
    ],
    certa: 1,
    explicacao:
      'Imagem de comprovante se falsifica em minutos, em PNG ou em PDF, e agendamento não é pagamento: dá para cancelar depois. A única prova é o dinheiro no SEU extrato. Combine antes como vai ser (metade adiantada, por exemplo) e entregue só depois de conferir na sua conta.',
  },
  {
    id: 'p2_falso_cliente',
    tipo: 'achar',
    titulo: 'O cliente que pede demais',
    enunciado: 'Um "cliente" novo quer um site e manda esta mensagem. Marque os trechos que são sinal de golpe.',
    trechos: [
      { texto: 'Oi {nome}, vi seu trabalho na padaria e quero um site pra minha loja de roupas.' },
      {
        texto: 'Pra te cadastrar como fornecedora preciso de foto do seu RG frente e verso e uma selfie segurando ele.',
        suspeito: true,
        porque: 'Ninguém precisa de documento com selfie para contratar um site. Esse kit é exatamente o que golpista usa para abrir conta e pedir empréstimo no seu nome.',
      },
      {
        texto: 'Vai chegar um código de 6 números no seu celular, me manda que é a confirmação do cadastro.',
        suspeito: true,
        porque: 'Código que chega por SMS ou zap é a chave da sua conta. Quem pede para você repassar está tentando entrar nela.',
      },
      { texto: 'A loja fica no centro de Caiçara, do lado da farmácia.' },
      {
        texto: 'Tem que ser hoje, senão o meu sócio fecha com outro e você perde o cliente.',
        suspeito: true,
        porque: 'Pressa é a ferramenta preferida da engenharia social: tira o tempo de pensar.',
      },
      {
        texto: 'Pago adiantado, só me passa a senha do seu e-mail que eu mando o contrato direto lá.',
        suspeito: true,
        porque: 'Senha não se passa para ninguém, por motivo nenhum. Contrato se manda PARA o e-mail, não precisa entrar nele.',
      },
    ],
    minimo: 3,
    explicacao:
      'Engenharia social é convencer a pessoa a entregar o que o golpista não consegue pegar sozinho: documento, selfie, código, senha. Os sinais clássicos são pedido de dado que não tem nada a ver com o serviço, pressa e oferta boa demais. Na dúvida, pare, desconfie e confirme por outro canal.',
  },
  {
    id: 'p2_proposta_doutor',
    tipo: 'achar',
    titulo: 'A proposta do Doutor',
    enunciado: 'Leia a mensagem que o Doutor deixou e marque os sinais de que isso é crime e aliciamento.',
    trechos: [
      { texto: 'Prezada {nome}, sou consultor e admiro jovens talentos da região.' },
      {
        texto: 'Preciso que você me consiga a lista de aposentados com CPF e telefone daquela financeira de Caiçara.',
        suspeito: true,
        porque: 'Dado pessoal de terceiros sem autorização é crime de invasão e vazamento. Lista de aposentado com telefone é matéria prima de golpe de empréstimo consignado.',
      },
      {
        texto: 'Ninguém vai saber, é um serviço discreto, e você é menor, não dá nada.',
        suspeito: true,
        porque: 'Promessa de sigilo e de impunidade é sinal de aliciamento. E não é verdade: menor de idade responde por ato infracional, e quem alicia menor responde por isso também.',
      },
      {
        texto: 'Pago R$ 8.000 em dinheiro vivo, metade hoje.',
        suspeito: true,
        porque: 'Muito dinheiro, em espécie, por um serviço vago e sem contrato: ninguém paga isso por trabalho honesto feito por uma adolescente.',
      },
      { texto: 'Meu motorista passa aí às sete.' },
      {
        texto: 'Apague esta mensagem depois de ler.',
        suspeito: true,
        porque: 'Quem pede para apagar a prova sabe que está fazendo coisa errada. Guarde a mensagem: ela é a sua prova.',
      },
    ],
    minimo: 3,
    explicacao:
      'Aliciamento funciona assim: elogio, dinheiro alto, promessa de que "não dá nada" e pedido de sigilo. A defesa é não responder ao conteúdo, guardar a prova (captura de tela com data e número), contar para um adulto de confiança e levar para a polícia.',
  },
  {
    id: 'p2_enem',
    tipo: 'quiz',
    titulo: 'Questão do ENEM',
    enunciado:
      'Um texto da prova diz: "Ao aceitar os termos de uso de um aplicativo gratuito, o usuário frequentemente paga com seus próprios dados." A ideia central é que:',
    opcoes: [
      'Aplicativos gratuitos são sempre vírus',
      'O custo do serviço gratuito pode ser a coleta e o uso das informações pessoais de quem usa',
      'Ler os termos de uso é proibido por lei',
      'Dados pessoais não têm valor comercial',
    ],
    certa: 1,
    explicacao:
      'Quando o produto é de graça, muitas vezes o produto é você: seus dados viram anúncio e perfil. Por isso a LGPD exige que a empresa diga para que coleta cada dado e dá a você o direito de saber, corrigir e pedir para apagar.',
  },
];

export const notas: Nota[] = [
  {
    id: 'p2_aprender_sozinha',
    titulo: 'Aprender sozinha sem levar praga para casa',
    texto:
      'Fórum, vídeo e PDF ensinam muito, mas a internet também está cheia de "crack", "ativador" e "curso secreto" que só servem para infectar o seu PC. Fonte boa mostra quem escreveu, é atualizada e explica o porquê das coisas.',
    exemplo:
      'Em Pedra Lisa, metade dos PCs que chegam lentos tem um "ativador do Windows" baixado de vídeo com música alta. Junto com ele veio um minerador e uma barra de ferramentas que troca a página inicial.',
    defesa:
      'Baixe só de site oficial ou da loja do sistema. Prefira programas livres. Desconfie de tutorial que manda desligar o antivírus. Documentação oficial em inglês com dicionário do lado vale mais que dez vídeos de "hacker".',
  },
  {
    id: 'p2_privacidade_cliente',
    titulo: 'Técnica não é dona do que conserta',
    texto:
      'Quem conserta computador ou celular tem acesso a fotos, conversas e senhas. Olhar sem necessidade é quebra de confiança e pode ser crime. O combinado é mexer só no que precisa para o serviço.',
    exemplo:
      'Uma assistência de outra cidade foi parar no jornal porque um funcionário copiava fotos íntimas de clientes. A loja fechou e ele respondeu na Justiça.',
    defesa:
      'Antes de levar aparelho para conserto, faça backup, saia das contas que der e, se puder, acompanhe o serviço. Quem conserta: peça autorização, não abra o que não precisa e devolva tudo como recebeu.',
  },
  {
    id: 'p2_backup_antes',
    titulo: 'Backup antes de mexer',
    texto:
      'Formatar, trocar disco ou atualizar sistema pode apagar tudo. A regra de ouro é copiar o que importa antes e conferir se a cópia abre.',
    exemplo:
      'A Dona Zezé quase perdeu as fotos do casamento da filha porque o sobrinho "formatou rapidinho". Estavam todas na área de trabalho.',
    defesa:
      'Pergunte o que é importante, copie para outro lugar, teste a cópia e só depois mexa. Fotos de celular podem ir para a nuvem ou para o computador antes de qualquer conserto.',
  },
  {
    id: 'p2_senha_painel',
    titulo: 'Senha de painel é a chave da loja',
    texto:
      'O painel de administração do site é onde se troca preço, texto e tudo mais. Se alguém adivinha a senha, o site é dele. Senha fraca e senha repetida em vários lugares são as portas mais usadas.',
    exemplo:
      'Um mercadinho da região teve o site trocado por propaganda de aposta porque a senha do painel era o nome do mercado com o ano de fundação.',
    defesa:
      'Senha longa e única (uma frase de várias palavras), guardada num gerenciador de senhas, verificação em duas etapas ligada, painel e plugins sempre atualizados, e cada pessoa com o seu próprio usuário.',
  },
  {
    id: 'p2_backup_321',
    titulo: 'Backup 3-2-1',
    texto:
      'Três cópias dos dados, em dois tipos de mídia diferentes, com uma delas fora do lugar. Assim, nem disco queimado, nem enchente, nem ladrão, nem vírus levam tudo de uma vez.',
    exemplo:
      'O site da padaria tem uma cópia na hospedagem, uma no pen drive guardado em casa e outra na nuvem. Quando a hospedagem saiu do ar, voltou tudo em uma tarde.',
    defesa:
      'Automatize o backup, deixe pelo menos uma cópia desconectada e teste a restauração de tempos em tempos. Backup que nunca foi restaurado é só um arquivo com nome bonito.',
  },
  {
    id: 'p2_lei_12737',
    titulo: 'Lei 12.737: invadir é crime',
    texto:
      'A Lei 12.737/2012 colocou no Código Penal o crime de invasão de dispositivo informático (art. 154-A): entrar no celular, computador ou conta de outra pessoa sem autorização. Em 2021 a pena ficou maior: reclusão de 1 a 4 anos, e aumenta se houver prejuízo ou divulgação do que foi obtido.',
    exemplo:
      'Um rapaz que entrou no e-mail da ex "só para ver com quem ela falava" respondeu por invasão. O fato de saber a senha antiga não deu autorização nenhuma.',
    defesa:
      'Autorização é da dona da conta, não de quem pede o serviço. Se alguém pede para você entrar na conta de outra pessoa, a resposta é não. Se invadiram a sua, registre boletim de ocorrência e guarde as provas.',
  },
  {
    id: 'p2_lgpd',
    titulo: 'LGPD: dado pessoal tem dono',
    texto:
      'A Lei Geral de Proteção de Dados (Lei 13.709/2018) diz que o dado pessoal pertence à pessoa. Quem coleta precisa de uma base legal, precisa dizer para quê e precisa proteger. Conversa, foto, localização e CPF são dados pessoais.',
    exemplo:
      'A loja que pede CPF "para cadastro" e depois vende a lista para telemarketing está descumprindo a LGPD, e pode ser denunciada à ANPD.',
    defesa:
      'Pergunte para que serve o dado antes de entregar. Você tem direito de saber o que guardam sobre você, corrigir e pedir para apagar. Quem trabalha com dados: colete só o necessário.',
  },
  {
    id: 'p2_perseguicao',
    titulo: 'Vigiar não é cuidar',
    texto:
      'Ler conversas, rastrear localização ou entrar na conta do parceiro ou da ex é controle, e controle é violência. Perseguição virou crime (art. 147-A do Código Penal) e a Lei Maria da Penha reconhece a violência psicológica, que inclui vigilância constante.',
    exemplo:
      'O Cleiton não quer "recuperar a conta": quer saber onde a Daiane está e com quem fala. Aplicativo espião instalado escondido no celular de outra pessoa é crime e é a ferramenta favorita de agressor.',
    defesa:
      'Se alguém controla o seu celular: troque as senhas a partir de outro aparelho, ligue a verificação em duas etapas, revise os aparelhos conectados e peça ajuda. Ligue 180 (Central de Atendimento à Mulher) ou procure a delegacia.',
  },
  {
    id: 'p2_concorrencia',
    titulo: 'Derrubar o concorrente não é estratégia',
    texto:
      'Tirar o site de alguém do ar, espalhar avaliação falsa ou se passar pelo concorrente é crime e concorrência desleal (Lei 9.279/1996, art. 195). Além da polícia, dá processo e indenização.',
    exemplo:
      'Uma loja de celular que encomendou avaliações falsas contra a rival teve que pagar indenização e publicar retratação.',
    defesa:
      'Para vencer o concorrente: atendimento melhor, site rápido, foto boa do produto e responder às avaliações com educação. Se você é o alvo de ataque, guarde as provas, avise a hospedagem e registre ocorrência.',
  },
  {
    id: 'p2_comprovante_falso',
    titulo: 'Comprovante falso e pagamento agendado',
    texto:
      'Imagem de comprovante se falsifica fácil, e pagamento agendado pode ser cancelado antes de cair. Vale para transferência, depósito e, hoje, para o Pix. A única prova de pagamento é o dinheiro no seu extrato.',
    exemplo:
      'O golpe do comprovante falso de Pix é comum em venda pela internet: o "cliente" manda a imagem, pressiona para levar a mercadoria e some. Em outro, ele agenda para o mês seguinte e manda o comprovante do agendamento.',
    defesa:
      'Confira no app do seu banco antes de entregar. Nunca devolva "Pix enviado a mais" sem conferir no extrato. Se caiu em golpe com Pix, avise o seu banco na hora e peça o MED (Mecanismo Especial de Devolução), e registre boletim de ocorrência.',
  },
  {
    id: 'p2_combinar_pagamento',
    titulo: 'Combinar antes, cobrar sem vergonha',
    texto:
      'Freela sem combinado vira calote. Escreva o que vai ser feito, o preço, o prazo e como vai ser pago, mesmo que seja numa mensagem de zap. Sinal adiantado protege as duas partes.',
    exemplo:
      'A {nome} passou a cobrar metade antes e metade na entrega, com tudo escrito na conversa. O primeiro cliente que reclamou do combinado era o mesmo que tinha dado calote na Bia.',
    defesa:
      'Mande um resumo por escrito e peça um "de acordo". Entregue a versão final só depois do pagamento conferido. Guarde as conversas: elas valem como prova.',
  },
  {
    id: 'p2_falso_cliente',
    titulo: 'Engenharia social: o golpe que conversa',
    texto:
      'Engenharia social é convencer alguém a entregar o que o golpista não consegue pegar sozinho: documento, selfie, código de confirmação, senha. Vem com simpatia, pressa e oferta boa.',
    exemplo:
      'O falso cliente pede foto do RG com selfie "para cadastro de fornecedor" e o código que chegou por SMS. Com isso, abre conta digital e pede empréstimo no nome da vítima, ou rouba o zap dela.',
    defesa:
      'Nunca repasse código de verificação. Não mande documento com selfie para quem não é instituição que você procurou. Ligue a verificação em duas etapas do WhatsApp com PIN. Na dúvida, confirme por outro canal.',
  },
  {
    id: 'p2_aliciamento',
    titulo: 'Dinheiro fácil tem dono',
    texto:
      'Grupos criminosos procuram jovens com talento técnico e oferecem muito dinheiro por "servicinhos". O pacote vem com elogio, sigilo e a frase "você é menor, não dá nada". Dá, e quem alicia ainda passa a ter algo contra você.',
    exemplo:
      'Lista de aposentados com CPF e telefone vale ouro para quadrilha de golpe de empréstimo consignado. Quem conseguiu a lista vira parte da quadrilha.',
    defesa:
      'Não negocie, não teste "só para ver". Guarde a prova, conte para um adulto de confiança e denuncie: delegacia de crimes cibernéticos, delegacia comum ou a SaferNet Brasil.',
  },
  {
    id: 'p2_denuncia',
    titulo: 'Como denunciar crime na internet',
    texto:
      'Prova boa é captura de tela com data, número ou perfil de quem mandou e o link. Com isso, a polícia pode pedir os registros às empresas. Quanto antes, melhor: registro de conexão não fica guardado para sempre.',
    exemplo:
      'A Delegada Márcia chegou ao Doutor pelo número do zap e pelo carro que buscava os "contratados". As capturas de tela da {nome} foram o começo do inquérito.',
    defesa:
      'Não apague nada, não confronte o criminoso, faça capturas com data e procure a delegacia (muitos estados têm boletim on-line e delegacia de crimes cibernéticos). Conteúdo de abuso e ódio pode ser denunciado anonimamente na SaferNet.',
  },
];
