import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'h5_agencia',
    tipo: 'ordenar',
    titulo: 'Na agência, com a certidão',
    enunciado: 'Coloque na ordem o que a família faz no guichê, do primeiro passo ao último.',
    passos: [
      'Comunicar o falecimento, entregando a certidão de óbito e o documento de quem está informando',
      'Pedir o bloqueio dos cartões e do acesso ao aplicativo e às senhas do titular',
      'Pedir a lista de débitos automáticos e de produtos: seguros, consórcios, previdência',
      'Perguntar quais documentos o banco vai pedir para o inventário e anotar o protocolo',
      'Levar tudo ao advogado escolhido pela família, que orienta sobre inventário e despesas do funeral',
    ],
    explicacao:
      'Primeiro o banco fica sabendo, com documento. Depois fecha a porta para quem quiser usar as senhas e os cartões. Em seguida, a família descobre o que a conta pagava sozinha, para trocar a titularidade do que precisa continuar (luz, água) e não ter surpresa. Por fim, o protocolo e a lista vão para o advogado que a família escolheu. O saldo não se movimenta com a senha do falecido: ele faz parte da herança e é dividido no inventário.',
  },
  {
    id: 'h6_cofre_completo',
    tipo: 'formulario',
    visual: 'cofre',
    titulo: 'O cofre do Seu Valter',
    enunciado: 'Para cada conta do pai, escolha o destino certo. Sem senha adivinhada e sem cancelar o que guarda fotos antes de salvar.',
    campos: [
      {
        rotulo: 'Conta no banco',
        opcoes: [
          'Deixar bloqueada, como o banco fez, e tratar o saldo no inventário com o advogado da família',
          'Fazer um Pix para a conta da mãe, que é a viúva e vai precisar',
          'Entrar no aplicativo com a senha e tirar o extrato todo mês, como ele fazia',
        ],
        certa: 0,
        porque:
          'Depois da morte, o dinheiro da conta é herança. Movimentar com a senha do titular, mesmo para a viúva, pode virar problema entre herdeiros e com o banco. O caminho é o inventário, com advogado.',
      },
      {
        rotulo: 'Cartão de crédito',
        opcoes: [
          'Deixar ativo até o fim do mês para não atrapalhar as assinaturas',
          'Comunicar o óbito à administradora pelo canal oficial, com a certidão, e pedir o cancelamento',
          'Usar o limite para pagar as despesas do velório',
        ],
        certa: 1,
        porque:
          'Cartão de quem morreu deve ser comunicado e cancelado pelo canal oficial. Usar o limite é usar crédito em nome de quem não pode mais responder por ele.',
      },
      {
        rotulo: 'Streaming',
        opcoes: [
          'Entrar com a senha salva e trocar o e-mail da conta para o seu',
          'Deixar pagando, a mãe gosta da novela',
          'Cancelar pelo canal do serviço informando o óbito; se a mãe quiser continuar, ela assina no nome dela',
        ],
        certa: 2,
        porque:
          'Tomar a conta para si é entrar no lugar dele. O certo é encerrar o que era dele e, se alguém quer o serviço, abrir uma conta no próprio nome.',
      },
      {
        rotulo: 'Aplicativo de transporte',
        opcoes: [
          'Encerrar o plano de assinatura e pedir o encerramento da conta pelo suporte, com a certidão',
          'Usar a conta dele para as corridas da família, já que tem desconto',
          'Apagar o aplicativo do seu celular e pronto',
        ],
        certa: 0,
        porque:
          'Apagar o aplicativo não cancela cobrança nenhuma. E usar a conta de quem morreu deixa cartão e cadastro dele ativos. Encerrar pelo suporte resolve as duas coisas.',
      },
      {
        rotulo: 'Nuvem de fotos',
        opcoes: [
          'Cancelar junto com o cartão, para parar de pagar logo',
          'Manter paga por enquanto e pedir o acesso de familiar pelo caminho oficial do serviço; só pensar em cancelar depois das fotos salvas',
          'Entrar com a senha que a Tainá acha que sabe e baixar tudo hoje',
        ],
        certa: 1,
        porque:
          'Cancelar antes de salvar pode deixar arquivos indisponíveis. Entrar com senha adivinhada pode violar os termos do serviço e expõe também o que é de outras pessoas. O caminho oficial para familiares demora, mas é o certo.',
      },
      {
        rotulo: 'Jogo de paciência premium',
        opcoes: [
          'Continuar pagando para não perder o recorde',
          'Cancelar a assinatura pelo canal do serviço; o recorde fica num print',
          'Jogar com a conta dele, para manter a sequência',
        ],
        certa: 1,
        porque:
          'O recorde é memória, e memória cabe num print. A assinatura é cobrança, e cobrança de quem morreu se cancela.',
      },
      {
        rotulo: 'Revista de pesca',
        opcoes: [
          'Esperar vencer a assinatura sozinha',
          'Mandar e-mail para o endereço que veio na última cobrança, sem conferir',
          'Contatar a editora pelos canais do site oficial, informar o óbito e pedir o cancelamento e a não renovação',
        ],
        certa: 2,
        porque:
          'Assinatura costuma renovar sozinha. E canal de atendimento se confere no site oficial, não no e-mail que chegou, porque cobrança falsa também chega.',
      },
      {
        rotulo: 'Linha do celular',
        opcoes: [
          'Cancelar hoje na operadora, são R$ 49 por mês',
          'Trocar antes o telefone de recuperação das contas que importam e só então pedir a troca de titularidade ou o cancelamento, com a certidão',
          'Tirar o chip e colocar no seu celular para receber os códigos',
        ],
        certa: 1,
        porque:
          'Com o tempo, a operadora pode reaproveitar o número de uma linha cancelada, e quem ficar com ele pode receber códigos de verificação. Primeiro os números de recuperação vão para quem está vivo; depois a linha se encerra com cuidado.',
      },
    ],
    minimo: 6,
    explicacao:
      'Cada conta tem um destino legítimo: o banco fica com o inventário; cartão e assinaturas são comunicados e cancelados pelo canal oficial de cada serviço; a nuvem de fotos espera as fotos estarem salvas e o acesso de familiar é pedido pelo caminho oficial; e a linha só se encerra depois que nenhuma conta importante depende do número dele. Em nenhum caso a família entra no lugar dele.',
  },
  {
    id: 'h7_email_fotos',
    tipo: 'achar',
    visual: 'email',
    titulo: 'As fotos serão apagadas?',
    enunciado: 'Chegou no e-mail da Dona Lúcia. Marque o que entrega o golpe.',
    trechos: [
      { texto: 'De: suporte-fotos-nuvem@seguranca-conta-familia.com', suspeito: true, porque: 'O remetente não é do domínio do serviço. É um endereço qualquer com palavras bonitas no meio.' },
      { texto: 'Assunto: URGENTE: ARQUIVOS DE VALTER SERÃO EXCLUÍDOS EM 24H', suspeito: true, porque: 'Pressa e letras maiúsculas para não dar tempo de pensar.' },
      { texto: 'Prezado(a) familiar,' },
      { texto: 'Identificamos o falecimento do titular desta conta e lamentamos sua perda.' },
      { texto: 'Para evitar a exclusão permanente de 38.406 fotos, restaure o acesso agora.' },
      { texto: 'Clique em RESTAURAR ACESSO e informe o e-mail e a senha do titular.', suspeito: true, porque: 'Nenhum serviço pede a senha de quem morreu. O caminho oficial para familiares pede documentos, não senha.' },
      { texto: 'Taxa única de restauração: R$ 49,90, via Pix.', suspeito: true, porque: 'Pedido de dinheiro para "liberar" coisa de quem morreu é o mesmo golpe do falso advogado.' },
      { texto: 'Atenciosamente, Equipe de Segurança.' },
    ],
    minimo: 3,
    explicacao:
      'Golpista lê obituário e sabe que a família quer as fotos. Remetente de fora do domínio oficial, prazo curto, pedido de senha e taxa por Pix: quatro sinais. O pedido de familiares se faz pelo site oficial do serviço, digitando o endereço, com certidão de óbito e documentos.',
  },
  {
    id: 'h8_plano',
    tipo: 'formulario',
    titulo: 'Plano da Dona Lúcia',
    enunciado: 'Monte o plano de herança digital da Dona Lúcia. Uma resposta por linha.',
    campos: [
      {
        rotulo: 'Senhas',
        opcoes: [
          'Um caderninho na gaveta com todas as senhas',
          'Um gerenciador de senhas com acesso de emergência configurado para uma pessoa de confiança',
          'A mesma senha em tudo, para ninguém esquecer',
        ],
        certa: 1,
        porque:
          'Caderninho é a primeira coisa que qualquer um acha, e senha repetida cai toda junto. O acesso de emergência do gerenciador entrega o cofre só para quem foi escolhido, do jeito previsto.',
      },
      {
        rotulo: 'Contato de confiança',
        opcoes: [
          'Uma pessoa escolhida por ela, avisada e de acordo',
          'Quem pedir primeiro',
          'Ninguém, para não dar briga',
        ],
        certa: 0,
        porque:
          'O contato de confiança precisa saber que é o contato. Escolher em vida evita exatamente a briga.',
      },
      {
        rotulo: 'Lista de contas',
        opcoes: [
          'Não precisa, o celular tem tudo',
          'Uma lista com cada conta e o que fazer com ela, sem as senhas',
          'Uma lista com as contas e as senhas ao lado',
        ],
        certa: 1,
        porque:
          'O celular trancado foi o problema desta família. A lista diz o que existe e o que fazer; as senhas ficam no gerenciador.',
      },
      {
        rotulo: 'Fotos',
        opcoes: [
          'Cópia em dois lugares diferentes, um deles em nome de outra pessoa da família',
          'Só no celular, que é mais prático',
          'Só na nuvem, que nunca falha',
        ],
        certa: 0,
        porque:
          'Um lugar só não é cópia de segurança. Dois lugares, e um deles acessível à família, é o que faz as fotos sobreviverem.',
      },
      {
        rotulo: 'Redes sociais',
        opcoes: [
          'Deixar para os filhos resolverem depois',
          'Dar a senha para a Tainá',
          'Escolher em vida, nas opções da própria plataforma, memorial ou remoção e, se existir, indicar um contato herdeiro',
        ],
        certa: 2,
        porque:
          'Algumas plataformas permitem escolher em vida o que acontece com o perfil. Dar a senha não resolve: quem entra com a senha de outra pessoa entra no lugar dela.',
      },
      {
        rotulo: 'Bens e dinheiro',
        opcoes: [
          'Um bilhete com a senha do banco para quem for cuidar',
          'Conversar com um advogado de confiança, conferido na OAB, e fazer testamento se quiser',
          'Fazer Pix para os filhos antes, para evitar inventário',
        ],
        certa: 1,
        porque:
          'Dinheiro e bens seguem regras de herança. Quem orienta é um advogado escolhido pela família e conferido no cadastro oficial da OAB. Bilhete com senha só repete o problema do Pix.',
      },
    ],
    minimo: 5,
    explicacao:
      'Plano de herança digital é conversa em vida: lista das contas, gerenciador de senhas com acesso de emergência, contato de confiança avisado, fotos em dois lugares, escolha sobre as redes sociais e orientação de advogado para o que é herança. Ninguém precisa saber a senha de ninguém. Precisa saber o caminho.',
  },
];

export const notas: Nota[] = [
  {
    id: 'h5_conta_do_falecido',
    titulo: 'A senha do pai não é autorização',
    texto:
      'Depois da morte, o dinheiro da conta faz parte da herança e é dividido no inventário, judicial ou em cartório, sempre com advogado. Usar a senha de quem morreu para movimentar a conta, mesmo com boa intenção e para pagar o enterro, pode gerar problema sério entre herdeiros e com o banco.',
    exemplo: 'O Rodrigo queria fazer um Pix de R$ 9.800 da conta do pai para a funerária com a senha que a mãe sabia. Era "o mesmo dinheiro", mas sem os outros herdeiros saberem.',
    defesa:
      'Não movimente a conta. Guarde as notas das despesas do funeral e leve ao advogado que a família escolher: existem caminhos para despesas e para valores pequenos, e é ele quem diz qual serve no seu caso.',
  },
  {
    id: 'h5_banco_obito',
    titulo: 'Banco se avisa com certidão',
    texto:
      'O banco é comunicado do falecimento com a certidão de óbito e o documento de quem informa. Ele bloqueia cartões e acessos e passa a tratar a conta como parte de uma herança. Aproveite a visita para pedir a lista de produtos e anotar o protocolo.',
    exemplo: 'A atendente pediu a certidão, a identidade da Dona Lúcia e foi listando com calma: cartões, aplicativo, débitos, seguro, consórcio de uma moto que ninguém sabia.',
    defesa:
      'Vá à agência ou use o canal oficial. Desconfie de qualquer mensagem "do banco" com link para "liberar o saldo aos herdeiros": banco não manda link pedindo senha, e saldo de herança não se libera por mensagem.',
  },
  {
    id: 'h5_debitos_automaticos',
    titulo: 'O que a conta pagava sozinha',
    texto:
      'Contas de luz, água, seguros e consórcios costumam estar em débito automático. Com a conta bloqueada, o débito para, e o que precisa continuar pode atrasar.',
    exemplo: 'A luz e a água da casa estavam no nome do Seu Valter, em débito na conta dele.',
    defesa:
      'Peça ao banco a lista de débitos e produtos. Troque a titularidade das contas da casa na companhia de luz e de água, com a certidão, e informe o advogado sobre seguros e consórcios.',
  },
  {
    id: 'h6_assinaturas',
    titulo: 'Assinatura não sabe que a pessoa morreu',
    texto:
      'Streaming, aplicativo de transporte, nuvem, jogos e revistas continuam cobrando no cartão. Cada serviço tem um canal para informar o óbito e encerrar. O cartão também precisa ser comunicado à administradora.',
    exemplo: 'O cartão do Seu Valter pagava streaming, transporte, nuvem de fotos, paciência sem anúncios e uma revista de pesca, de um homem que pescou uma vez.',
    defesa:
      'Faça a lista pelas faturas e e-mails de cobrança. Cancele pelo canal oficial de cada serviço, sem entrar na conta com a senha dele. O que guarda fotos e documentos fica pago até tudo estar salvo.',
  },
  {
    id: 'h6_chip_recuperacao',
    titulo: 'O número dele recebe os códigos',
    texto:
      'O número de quem morreu costuma ser o telefone de recuperação de várias contas, inclusive de outras pessoas da casa. Uma linha cancelada pode, com o tempo, ser reaproveitada pela operadora, e quem ficar com o número pode receber códigos de verificação.',
    exemplo: 'O e-mail da Dona Lúcia, o aplicativo da farmácia e o do posto de saúde mandavam código para o celular do Seu Valter.',
    defesa:
      'Antes de encerrar a linha, troque o telefone de recuperação das contas que importam para o número de alguém vivo. Depois peça à operadora, com a certidão, a troca de titularidade ou o cancelamento.',
  },
  {
    id: 'h7_golpe_fotos',
    titulo: '"Suas fotos serão apagadas"',
    texto:
      'Golpistas sabem que a família quer as fotos e mandam e-mails com prazo curto pedindo a senha do falecido ou uma "taxa de restauração".',
    exemplo: 'Remetente de fora do domínio do serviço, 24 horas de prazo, botão pedindo senha e Pix de R$ 49,90.',
    defesa:
      'Não clique. Abra o site oficial digitando o endereço e procure a ajuda para familiares de usuário falecido. Nenhum serviço sério pede a senha de quem morreu.',
  },
  {
    id: 'h7_fotos_familiares',
    titulo: 'Fotos pelo caminho oficial',
    texto:
      'Serviços de fotos e de e-mail costumam ter um pedido próprio para familiares de quem faleceu, com certidão de óbito, documento e comprovação de vínculo; alguns pedem decisão judicial. Leva semanas. Entrar com a senha adivinhada pode violar os termos do serviço e expor o que é de outras pessoas.',
    exemplo: 'A Tainá preencheu o formulário oficial com a certidão escaneada. Prazo de quatro a seis semanas.',
    defesa:
      'Faça o pedido oficial e, enquanto espera, junte o que já está com a família: computador antigo, pendrives, fotos de papel e as fotos que os parentes têm no celular.',
  },
  {
    id: 'h7_backup',
    titulo: 'Um lugar só não é cópia',
    texto:
      'Cópia de segurança de verdade fica em pelo menos dois lugares diferentes, e um deles acessível a mais de uma pessoa da família. Computador antigo não é backup, é relíquia.',
    exemplo: 'HD externo com a Dona Lúcia, pasta compartilhada da família na nuvem em nome dela e, de quebra, a caixa de sapato de 1988.',
    defesa:
      'Copie para um HD e para uma nuvem no nome de quem está vivo. Confira de tempos em tempos se as cópias abrem.',
  },
  {
    id: 'h7_privacidade',
    titulo: 'Quem morreu também tem privacidade',
    texto:
      'Conversas, e-mails e arquivos pessoais de quem morreu guardam também a vida de quem conversava com ele, que está viva e não autorizou ninguém a ler. Nem tudo que a família consegue abrir é da família.',
    exemplo: 'Na pasta "PARTICULAR", as conversas do Seu Valter com o Zé contavam muito mais do Zé do que dele.',
    defesa:
      'Na dúvida, não leia. Guarde lacrado, com uma pessoa responsável, e decida com calma. Se procurar algo específico, como uma dívida, peça orientação ao advogado.',
  },
  {
    id: 'h8_golpe_missa',
    titulo: 'Golpista lê o mural da paróquia',
    texto:
      'Obituário, convite de missa e postagens de despedida dizem nome, data e família. Golpistas usam isso para ligar oferecendo advogado, cartório, seguro ou "liberação de herança".',
    exemplo: 'O Padre Jonas parou de publicar o nome completo no site da paróquia depois de ver viúva atrás de viúva receber ligação.',
    defesa:
      'Publique o mínimo. Combine com a família: ninguém aceita oferta de dinheiro por telefone. Advogado de verdade se confere no cadastro oficial da OAB, pelo nome e pela inscrição.',
  },
  {
    id: 'h8_plano_heranca',
    titulo: 'Plano de herança digital',
    texto:
      'É uma conversa em vida: lista de contas, gerenciador de senhas com acesso de emergência, contato de confiança avisado, cópia das fotos, escolha sobre as redes sociais e orientação de advogado para testamento e bens.',
    exemplo: 'A Dona Lúcia foi a primeira, "pra não dar trabalho pra vocês". Depois o Tio Nelson, que descobriu um quarto banco.',
    defesa:
      'Faça o seu e revise quando trocar de celular ou de número. Ninguém precisa saber a senha de ninguém; precisa saber o caminho.',
  },
];
