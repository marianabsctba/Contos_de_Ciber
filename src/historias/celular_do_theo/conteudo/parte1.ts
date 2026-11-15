import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 't1_configuracao',
    tipo: 'formulario',
    titulo: 'Revisão do celular do Theo',
    enunciado: 'Antes de entregar o celular de vez, revise a configuração item por item. Escolha a opção certa em cada campo.',
    campos: [
      {
        rotulo: 'O celular herdado da Júlia',
        opcoes: [
          'Restaurado de fábrica antes de entrar na conta do Theo',
          'Do jeito que veio, só apagando as fotos dela',
          'Desligar e ligar de novo para "zerar"',
        ],
        certa: 0,
        porque:
          'Celular usado pode chegar com contas, senhas salvas, mensagens e até cartão da dona anterior. Restaurar de fábrica apaga tudo e começa do zero.',
      },
      {
        rotulo: 'A conta do aparelho',
        opcoes: [
          'Conta de adulto, com uma data de nascimento inventada',
          'Conta de criança, ligada à conta da mãe',
          'A própria conta da mãe, que já tem tudo configurado',
        ],
        certa: 1,
        porque:
          'A conta de criança ligada à do responsável permite aprovar compras e aplicativos e ajustar o que é adequado para a idade. Inventar idade tira essas proteções.',
      },
      {
        rotulo: 'Senha de bloqueio',
        opcoes: [
          'A data de aniversário do Theo, para ele não esquecer',
          'Sem senha, porque é celular de criança',
          'Seis números escolhidos pelo Theo, que só ele e a mãe sabem',
        ],
        certa: 2,
        porque:
          'Aniversário é a primeira coisa que alguém tenta, e a escola até publica a data. Sem senha, qualquer um que pegar o celular entra em tudo.',
      },
      {
        rotulo: 'Compras e aplicativos novos',
        opcoes: [
          'Pedem aprovação da mãe, e não tem cartão salvo no aparelho',
          'Cartão salvo, para ele não precisar pedir toda hora',
          'Liberados, ele já sabe o que faz',
        ],
        certa: 0,
        porque:
          'Com aprovação, cada compra passa pela mãe antes. Cartão salvo sem senha transforma qualquer botão "comprar" em dinheiro de verdade.',
      },
      {
        rotulo: 'Localização',
        opcoes: [
          'Ligada em tudo: quanto mais, mais seguro',
          'Compartilhada só com a família; desligada na câmera e nas postagens',
          'Ligada só nas fotos, que é onde ela é útil',
        ],
        certa: 1,
        porque:
          'Compartilhar com a família ajuda a saber que ele chegou. Na câmera e nas postagens, a localização mostra para qualquer pessoa onde ele estuda, mora e passa o dia.',
      },
    ],
    minimo: 4,
    explicacao:
      'Primeiro celular bem configurado: aparelho restaurado de fábrica, conta de criança ligada à do responsável, senha de bloqueio que não seja data de aniversário, compras e aplicativos com aprovação e sem cartão salvo, e localização só com a família. E, junto com a configuração, a conversa: o que estiver ligado, a criança sabe.',
  },
  {
    id: 't2_print_zoacao',
    tipo: 'quiz',
    titulo: 'O print da Duda',
    enunciado: 'Alguém mandou no grupo da sala um print para zoar uma colega, e ela saiu do grupo. O que ajuda de verdade?',
    opcoes: [
      'Repassar só para o melhor amigo, que não conta pra ninguém',
      'Responder com uma zoação ainda pior, pra quem começou sentir na pele',
      'Não repassar, não rir junto, apoiar a colega e, se continuar, contar para um adulto',
      'Sair do grupo e apagar o aplicativo',
    ],
    certa: 2,
    explicacao:
      'Cada repasse, mesmo para uma pessoa só, faz a zoação andar mais um pouco. Rir junto também conta como participar. O que ajuda é não espalhar, ficar do lado de quem foi zoado (no grupo ou no privado) e, se continuar, contar para um adulto de confiança ou para a escola. Guardar print serve para provar o que aconteceu, nunca para mandar adiante.',
  },
  {
    id: 't3_moeda_gratis',
    tipo: 'achar',
    titulo: 'Moedas grátis',
    enunciado:
      'Este é o site que o Theo abriu pelo link do grupo da sala. Tem a logo e as cores do BlocoVerso. Toque em tudo o que mostra que é golpe.',
    visual: 'navegador',
    trechos: [
      {
        texto: 'www.blocoverso-moedas-gratis.net/gerador',
        suspeito: true,
        porque:
          'Não é o endereço oficial do jogo. Moeda de jogo só existe dentro do próprio jogo ou da loja oficial, nunca num site de fora.',
      },
      { texto: 'Logo e cores do BlocoVerso no topo da página' },
      {
        texto: '🎁 Gerador de moedas grátis: até 50.000 moedas!',
        suspeito: true,
        porque: 'Não existe "gerador de moedas". Quem promete moeda de graça fora do jogo quer outra coisa em troca.',
      },
      {
        texto: 'Digite seu usuário e a SENHA da sua conta BlocoVerso',
        suspeito: true,
        porque:
          'Esse é o golpe. Com a sua senha, eles entram na conta, trocam a senha e o e-mail, e você perde tudo o que construiu. Senha do jogo só se digita no próprio jogo.',
      },
      { texto: 'Escolha a quantidade: 1.000 · 10.000 · 50.000' },
      {
        texto: '⏳ Válido só hoje para os 100 primeiros',
        suspeito: true,
        porque: 'Pressa é para você não parar e perguntar para alguém. Promessa boa de verdade não acaba em dez minutos.',
      },
      {
        texto: 'Para liberar, compartilhe este link com 5 amigos',
        suspeito: true,
        porque:
          'É assim que o golpe se espalha: cada vítima manda para mais cinco. Por isso o link chegou pelo grupo da sala, mandado por um colega que provavelmente também caiu.',
      },
      {
        texto: '✅ Verificado pelos criadores do BlocoVerso',
        suspeito: true,
        porque: 'Selo de "verificado" qualquer um cola numa página. Não prova nada.',
      },
    ],
    minimo: 3,
    explicacao:
      'Site de moedas ou itens grátis é um dos golpes mais comuns contra crianças que jogam. Ele copia a cara do jogo, promete muito, tem pressa, pede para espalhar o link e, no fim, pede a senha da conta. Moeda grátis não existe fora do jogo. Se a senha já foi digitada: troque a senha pelo aplicativo oficial na hora, saia de todos os aparelhos e ligue a verificação em duas etapas. Se a conta já foi tomada, use a recuperação de conta oficial do jogo.',
  },
  {
    id: 't4_foto_expoe',
    tipo: 'achar',
    titulo: 'O que a foto conta',
    enunciado:
      'Esta é a postagem do Theo, do jeito que o perfil de fofoca repostou. Olhe como um estranho olharia. Toque em tudo o que entrega a rotina dele.',
    visual: 'mensagem',
    trechos: [
      {
        texto: '@theo.blocoverso.2014',
        suspeito: true,
        porque: 'O nome de usuário entrega o primeiro nome e o ano de nascimento. Dá para saber a idade sem perguntar.',
      },
      {
        texto: '[foto] Theo de uniforme, com o nome da escola bordado no peito',
        suspeito: true,
        porque: 'O uniforme diz em que escola ele estuda, mesmo sem marcar local nenhum.',
      },
      {
        texto: '📍 Escola Professora Iracema Lopes',
        suspeito: true,
        porque: 'Local marcado mostra no mapa exatamente onde ele está todos os dias.',
      },
      {
        texto: 'Ao fundo, o ponto de ônibus com o número da linha',
        suspeito: true,
        porque: 'O ponto e a linha mostram por onde ele passa no caminho de casa para a escola.',
      },
      {
        texto: '"Primeira semana na escola nova 🏫 busão das 6h40 todo dia sozinho 😎"',
        suspeito: true,
        porque: 'Horário e "sozinho" contam quando ele está sem nenhum adulto por perto. É a parte mais perigosa da postagem.',
      },
      { texto: 'Filtro de brilho no olho' },
      { texto: '❤️ 41 curtidas' },
    ],
    minimo: 3,
    explicacao:
      'Cada detalhe sozinho parece bobo. Juntos, eles desenham a rotina da criança para quem não devia saber: nome, idade, escola, caminho, horário e quando está sem adulto. Antes de postar, a pergunta é: o que um estranho descobre com esta foto? Evite uniforme com nome da escola, local marcado na hora e legenda com horário. E deixe o perfil privado, com seguidores que a criança conhece de verdade.',
  },
];

export const notas: Nota[] = [
  {
    id: 't1_configuracao',
    titulo: 'Primeiro celular: configuração',
    texto:
      'Celular usado precisa ser restaurado de fábrica. Depois: conta de criança ligada à do responsável, senha de bloqueio que não seja aniversário, compras e aplicativos com aprovação, nenhum cartão salvo no aparelho e localização compartilhada só com a família.',
    exemplo: 'O celular da Júlia chegou com as fotos, as conversas e a conta da loja de aplicativos dela ainda logada.',
    defesa: 'Configure junto com a criança, explicando cada item. O que estiver ligado, ela sabe.',
  },
  {
    id: 't1_controle_combinado',
    titulo: 'Controle dos pais: às claras ou escondido',
    texto:
      'O controle dos pais combinado (tempo de tela, aprovação de aplicativos, filtro de conteúdo, localização com a família) protege e a criança sabe o que está ligado. O aplicativo que vigia escondido parece mais seguro, mas quando a criança descobre, e ela costuma descobrir, a confiança vai embora junto.',
    exemplo: 'O Theo perguntou se a mãe ia ler as conversas dele. A resposta que ela der vale mais que qualquer aplicativo.',
    defesa:
      'Diga o que você vai ver e o que não vai. Combine que, se um dia precisar olhar algo, vocês olham juntos. Ter medo é normal; esconder é que cobra o preço depois.',
  },
  {
    id: 't1_regras',
    titulo: 'Regras combinadas por escrito',
    texto:
      'Regra que a criança ajudou a escrever é regra que ela lembra. Poucas, claras, valendo para os dois lados, e num lugar que todo mundo vê.',
    exemplo: 'Na geladeira: o celular dorme na cozinha; a senha é só nossa; comprar só pedindo; pensar antes de postar; quem contar não leva bronca.',
    defesa: 'A regra mais importante é a de contar: se alguém pedir segredo ou mandar algo estranho, a criança conta e ninguém briga com ela por isso.',
  },
  {
    id: 't2_zoacao',
    titulo: 'Zoação no grupo da sala',
    texto:
      'Quando alguém é zoado no grupo, quem ri junto ou repassa também participa. Um print anda sozinho: cada pessoa manda para "só mais uma", e a zoação chega muito longe.',
    exemplo: 'O print do áudio da Duda saiu do grupo da família dela e foi parar no grupo da sala. Ela saiu do grupo.',
    defesa:
      'Não repasse e não ria junto. Apoie quem foi zoado, no grupo ou no privado. Guarde print só como prova. Se continuar, conte para um adulto de confiança e para a escola.',
  },
  {
    id: 't2_quem_pode_ver',
    titulo: 'Quem pode ver?',
    texto:
      'Toda postagem tem um "quem pode ver", e muitos aplicativos repetem a escolha da última vez sem avisar. Atalho é só o caminho mais rápido, não o mais seguro.',
    exemplo: 'O Theo postou a foto do primeiro dia com o local da escola marcado, sem olhar para quem ia.',
    defesa: 'Antes de publicar, olhe o "quem pode ver" e o local marcado. Se tiver dúvida, mostre para um adulto antes.',
  },
  {
    id: 't3_compras',
    titulo: 'Compras no jogo e cartão salvo',
    texto:
      'Para uma criança, "comprar moeda" no jogo parece de mentira. Num aparelho com cartão salvo e sem senha para compras, cada toque é dinheiro de verdade. Vale para o tablet da sala, o celular velho e qualquer aparelho com a conta de um adulto.',
    exemplo: 'O tablet da sala tinha a conta da mãe e o cartão salvo. Em uma tarde de plantão: R$ 299,40 em moedas e uma vaca de diamante.',
    defesa:
      'Tire o cartão salvo, peça senha ou aprovação para qualquer compra em todos os aparelhos da casa e explique para a criança que moeda de jogo custa dinheiro de verdade. Compra feita sem querer pode ter reembolso pedido na loja de aplicativos, mas não é garantido.',
  },
  {
    id: 't3_moeda_gratis',
    titulo: 'Golpe da moeda grátis',
    texto:
      'Sites de "moedas grátis" ou "itens grátis" copiam a cara do jogo, prometem muito, têm pressa, pedem para espalhar o link e, no fim, pedem a senha da conta. Com ela, o golpista toma a conta.',
    exemplo: 'O link chegou pelo grupo da sala. A página tinha a logo do BlocoVerso e pedia usuário e senha.',
    defesa:
      'Moeda grátis fora do jogo não existe. Senha do jogo só se digita no próprio jogo. Se digitou em outro lugar, troque a senha pelo aplicativo oficial na hora e saia de todos os aparelhos.',
  },
  {
    id: 't3_senha_jogo',
    titulo: 'Senha do jogo e duas etapas',
    texto:
      'A conta do jogo merece senha própria, longa, que não seja usada em mais nada, e verificação em duas etapas com o celular ou o e-mail do responsável. Assim, mesmo que a senha vaze, ninguém entra sem o código.',
    exemplo: 'A frase-senha da Vó Cida: comprida, engraçada e só da família.',
    defesa:
      'Nunca repita a senha do seu e-mail no jogo: o e-mail recupera todas as outras contas. Se a conta já foi tomada, use a recuperação oficial do jogo e denuncie o site pelo próprio jogo.',
  },
  {
    id: 't4_foto_uniforme',
    titulo: 'Foto com uniforme e localização',
    texto:
      'Uniforme com nome da escola, local marcado, ponto de ônibus ao fundo e legenda com horário: cada detalhe sozinho parece bobo; juntos, desenham a rotina da criança para qualquer pessoa.',
    exemplo: '"Primeira semana na escola nova, busão das 6h40 todo dia sozinho", com a escola marcada no mapa.',
    defesa:
      'Antes de postar, olhe a foto como um estranho olharia. Sem uniforme com nome da escola, sem local marcado na hora, sem horário de quando está sozinho. Se quiser, poste depois, em casa.',
  },
  {
    id: 't4_perfil_privado',
    titulo: 'Perfil privado',
    texto:
      'No perfil privado, só vê quem a criança aprovou. Vale revisar os seguidores juntos: quem ela não conhece de verdade sai da lista.',
    exemplo: 'O Theo e a mãe, no sofá, removendo um por um os seguidores que ele não sabia quem eram.',
    defesa:
      'Configure junto, sem pegar o celular escondido. Apagar o aplicativo não apaga o perfil: a conta continua lá, aberta, sem ninguém cuidando.',
  },
  {
    id: 't4_print_escapa',
    titulo: 'Print passa por cima da configuração',
    texto:
      'Perfil privado e lista de amigos próximos diminuem quem vê, mas não são cofre. Qualquer pessoa que vê pode tirar print e mandar para onde quiser.',
    exemplo: 'A foto foi postada só para a sala, e mesmo assim apareceu num perfil de fofoca com 2.300 seguidores.',
    defesa:
      'Poste pensando que pode sair dali. Se for exposto: guarde prints com data e endereço, denuncie na própria plataforma, avise a escola e peça para ninguém repassar, nem para avisar.',
  },
];
