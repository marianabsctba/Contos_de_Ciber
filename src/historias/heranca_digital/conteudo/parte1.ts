import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'h1_celular_do_pai',
    tipo: 'quiz',
    titulo: 'O celular do pai',
    enunciado:
      'O celular do Seu Valter está bloqueado, com 23% de bateria. Ninguém sabe a senha. A Tainá quer tentar o aniversário da mãe, o dela e o ano do casamento. O que fazer agora?',
    opcoes: [
      'Chutar todas as datas da família até acertar: uma hora vai.',
      'Não ficar chutando senha, guardar o aparelho com cuidado e resolver as contas pelo caminho oficial de cada serviço.',
      'Levar amanhã numa assistência para resetar, assim ele vira um aparelho novo para a mãe.',
    ],
    certa: 1,
    explicacao:
      'Cada tentativa errada costuma travar o aparelho por mais tempo e, em alguns modelos ou configurações, muitas tentativas podem apagar tudo. Resetar também apaga o que estiver só no aparelho, como fotos sem cópia. O melhor é guardar o celular, sem chutar senha, e cuidar das contas pelo caminho oficial de cada serviço, com a certidão de óbito. Algumas coisas talvez fiquem lá dentro, e tudo bem.',
  },
  {
    id: 'h2_cartao_bloqueado',
    tipo: 'achar',
    titulo: 'Cartão bloqueado no dia do velório',
    enunciado: 'Chegou esta mensagem no celular do Seu Valter, um dia depois que ele morreu. Marque os trechos que mostram que é golpe.',
    visual: 'mensagem',
    trechos: [
      { texto: 'Remetente: 28451' },
      { texto: 'BCO SEGURANCA: Prezado cliente VALTER,', suspeito: true, porque: 'Nome de banco genérico e o nome em maiúsculas: mensagem em massa ou montada com dado do obituário. Saber o nome não prova nada.' },
      { texto: 'seu cartao final 4471 foi BLOQUEADO por suspeita de uso indevido.', suspeito: true, porque: 'Susto logo na primeira frase, para a pessoa agir sem pensar.' },
      { texto: 'Regularize em ate 2 horas ou sua conta sera encerrada.', suspeito: true, porque: 'Prazo curto e ameaça: pressa é a ferramenta preferida do golpista.' },
      { texto: 'Acesse: desbloqueio-cliente-seguro.com/valter', suspeito: true, porque: 'Endereço que não é o do banco. Banco não manda link para "desbloquear".' },
      { texto: 'Tenha em maos senha do cartao e o codigo que voce recebera por SMS.', suspeito: true, porque: 'Banco não pede senha nem código por mensagem. Quem pede código quer entrar na conta.' },
    ],
    minimo: 3,
    explicacao:
      'Golpistas mandam mensagens em massa e também leem obituários e redes sociais para mirar famílias enlutadas. Susto, prazo curto, link estranho e pedido de senha ou código são sinais clássicos. Não clique. Se houver dúvida sobre um cartão ou uma conta, ligue para o número que está atrás do cartão ou vá à agência.',
  },
  {
    id: 'h3_guia_doutor',
    tipo: 'achar',
    titulo: 'A guia do Dr. Ricardo',
    enunciado: 'O "Dr. Ricardo Inventários" mandou esta mensagem para a Dona Lúcia. Marque os trechos que mostram que é golpe.',
    visual: 'mensagem',
    trechos: [
      { texto: 'Prezada Sra. Lúcia, meus sentimentos pelo falecimento do Sr. Valter Aparecido.' },
      { texto: 'Identificamos valores em nome do falecido que podem ficar retidos por anos.', suspeito: true, porque: 'Medo inventado. Os bens de quem morreu ficam guardados para o inventário, não "presos" esperando um salvador.' },
      { texto: 'Com nosso procedimento de LIBERAÇÃO RÁPIDA, a senhora recebe em 48h, sem precisar de inventário.', suspeito: true, porque: 'O que era do falecido é herança e é dividido pelo inventário, com advogado. Não existe atalho vendido por telefone.' },
      { texto: 'Basta a taxa de custas antecipadas de R$ 1.870,00 via Pix.', suspeito: true, porque: 'Ninguém libera herança mediante taxa pelo telefone ou por mensagem.' },
      { texto: 'Chave Pix: Marcos V. Soares ME', suspeito: true, porque: 'O pagamento vai para uma empresa com outro nome, que não é o do "doutor".' },
      { texto: 'Condição especial válida só até hoje às 17h.', suspeito: true, porque: 'Urgência para a viúva decidir sozinha, sem conferir.' },
      { texto: 'Não precisa incomodar os outros herdeiros, eu cuido de tudo.', suspeito: true, porque: 'Isolar a vítima da família é tática de golpe. Inventário envolve todos os herdeiros.' },
      { texto: 'Atenciosamente, Dr. Ricardo' },
    ],
    minimo: 4,
    explicacao:
      'Golpistas leem obituários e redes sociais e ligam para a família sabendo nome, idade e local do velório. Promessa de liberar herança sem inventário, taxa por Pix para outra pessoa, prazo curto e pedido para não falar com os outros herdeiros são sinais de golpe. Advogado de verdade se confere no cadastro oficial da OAB, pelo nome e pelo número de inscrição, e quem escolhe o advogado é a família.',
  },
  {
    id: 'h4_cofre_primeiras',
    tipo: 'formulario',
    titulo: 'Cofre de contas: as primeiras linhas',
    enunciado: 'Comece a lista das contas do Seu Valter pelas que estão pedindo atenção hoje. Escolha a ação certa para cada uma.',
    visual: 'cofre',
    campos: [
      {
        rotulo: 'Rede social do Valter',
        opcoes: [
          'Entrar com a senha que a Tainá acha que sabe e continuar postando por ele',
          'Pedir memorial ou encerramento pelo caminho oficial da plataforma, com a certidão de óbito',
          'Deixar como está, ativa e sem ninguém cuidando',
        ],
        certa: 1,
        porque:
          'A família pede pelo canal oficial da plataforma, com documentos. Entrar com a senha de quem morreu pode violar os termos do serviço e expõe conversas de outras pessoas. Conta ativa e abandonada é alvo de invasão.',
      },
      {
        rotulo: 'Aplicativo de bom dia automático',
        opcoes: [
          'Contar à plataforma, no mesmo pedido oficial, que um aplicativo de terceiros publica sozinho, e cancelar a assinatura pelo atendimento do aplicativo',
          'Entrar na conta do pai com a senha adivinhada para tirar a permissão',
          'Responder cada bom dia avisando nos comentários que ele morreu',
        ],
        certa: 0,
        porque:
          'O pedido oficial resolve a conta inteira, inclusive o que está conectado a ela. A assinatura paga se cancela pelo atendimento do serviço, com a certidão, sem usar a senha dele.',
      },
      {
        rotulo: 'E-mail do Valter',
        opcoes: [
          'Tentar a data do casamento como senha, só para dar uma olhada',
          'Mandar uma mensagem do e-mail dele para todos os contatos avisando',
          'Não mexer agora: anotar na lista e, quando precisar, usar o pedido oficial do serviço para familiares',
        ],
        certa: 2,
        porque:
          'O e-mail costuma ser a chave de recuperação de outras contas e guarda conversas de terceiros. Fica anotado e protegido até a família saber do que precisa. Os serviços têm caminhos próprios para familiares, com documentos.',
      },
    ],
    minimo: 2,
    explicacao:
      'Herança digital se organiza como um cofre: uma lista de todas as contas, sem a senha de nenhuma, e ao lado a ação certa para cada uma. Rede social vira memorial ou é encerrada pelo caminho oficial, assinaturas são canceladas pelo atendimento, e o que não é urgente fica quieto e anotado. Nada de chute de senha, nada de apagar no susto.',
  },
];

export const notas: Nota[] = [
  {
    id: 'h1_celular_bloqueado',
    titulo: 'Celular bloqueado de quem morreu',
    texto:
      'Chutar senha no celular de quem morreu costuma travar o aparelho por cada vez mais tempo e, em alguns modelos ou configurações, muitas tentativas erradas podem apagar tudo. Resetar também apaga o que estiver só no aparelho.',
    exemplo: 'A Tainá tentou três datas da família no celular do Seu Valter. Na terceira, ele travou.',
    defesa:
      'Guarde o aparelho, sem chutar senha. As contas se resolvem pelo caminho oficial de cada serviço e do fabricante, com a certidão de óbito. E aceite que algumas coisas podem ficar lá dentro.',
  },
  {
    id: 'h1_heranca_digital',
    titulo: 'Herança digital',
    texto:
      'Herança digital é tudo o que uma pessoa deixa em contas e aparelhos: banco, e-mail, redes sociais, fotos na nuvem, assinaturas, o chip e as conversas. Muitas vezes tudo depende de um único celular, com uma senha que só ela sabia.',
    exemplo: 'No celular do Seu Valter estavam o banco, a verificação em duas etapas de todas as contas, 4.312 fotos de pôr do sol e o chip.',
    defesa: 'Em vida, faça uma lista das contas, guarde as senhas num gerenciador com acesso de emergência e combine com alguém de confiança o que fazer.',
  },
  {
    id: 'h2_golpe_no_luto',
    titulo: 'Golpe que mira família de luto',
    texto:
      'Golpistas leem obituários, sites de funerária e redes sociais. Mandam mensagens para o celular de quem morreu e para a família: cartão bloqueado, seguro de vida liberado, atualização de cadastro. Contam com a distração e a dor de quem acabou de perder alguém.',
    exemplo: 'Um dia depois da morte do Seu Valter, chegou no celular dele "seu cartão foi bloqueado, regularize em 2 horas" com um link.',
    defesa: 'Não clique, não responda e não passe dado. Se o obituário for publicado, avise a família de que golpes vão chegar nos próximos dias.',
  },
  {
    id: 'h2_conferir_canal_oficial',
    titulo: 'Conferir pelo canal oficial',
    texto:
      'Banco não manda link para desbloquear cartão e não pede senha nem código por mensagem. Seguro de vida não avisa por link. Quem quer confirmar alguma coisa usa o canal oficial: o número atrás do cartão, a agência, o telefone da seguradora que está na apólice ou no site digitado à mão.',
    exemplo: 'A filha do meio anotou num papel cada mensagem estranha que chegou no celular do pai, com dia e hora, para mostrar ao banco.',
    defesa: 'Guarde as mensagens suspeitas sem abrir os links. Elas ajudam o banco e um eventual boletim de ocorrência.',
  },
  {
    id: 'h3_falso_advogado',
    titulo: 'O falso advogado do inventário',
    texto:
      'O golpista liga para a viúva ou para os filhos sabendo nome, idade e local do velório, tudo tirado do obituário. Oferece "liberação rápida" de valores do falecido, sem inventário, mediante uma taxa por Pix. Depois da primeira taxa, sempre vem a segunda.',
    exemplo: 'O "Dr. Ricardo Inventários" pediu R$ 1.870 de "custas antecipadas" para uma empresa com outro nome e disse para não incomodar os outros herdeiros.',
    defesa:
      'Ninguém libera herança mediante taxa por telefone. Se já pagou, avise o banco na hora, pelo canal oficial, pedindo a contestação por golpe, e faça boletim de ocorrência com os prints e o comprovante. Não pague a segunda taxa.',
  },
  {
    id: 'h3_conferir_oab',
    titulo: 'Advogado se confere',
    texto:
      'Todo advogado tem inscrição na OAB, com número e estado. Dá para conferir no cadastro oficial de advogados, no site da OAB, pelo nome e pelo número de inscrição. Golpista costuma inventar número ou usar o de outra pessoa.',
    exemplo: 'O número que o "Dr. Ricardo" deu pertencia a uma advogada chamada Maria das Graças, de outro estado.',
    defesa:
      'Digite o endereço do site oficial, sem clicar em link de ninguém. Se o nome existir, ligue para o telefone do cadastro, não para o que a pessoa deu. E lembre que a família escolhe o próprio advogado.',
  },
  {
    id: 'h3_inventario',
    titulo: 'Inventário, em poucas palavras',
    texto:
      'Depois da morte, o que era da pessoa, como dinheiro na conta, carro e casa, faz parte da herança e é dividido entre os herdeiros pelo inventário. Ele pode ser feito na Justiça ou em cartório, dependendo do caso, e sempre com advogado. Existem caminhos para despesas urgentes e valores pequenos, que um advogado de confiança orienta.',
    exemplo: 'O Tio Nelson ligou para a advogada que fez o inventário da mãe dele, escolhida pela família.',
    defesa: 'Ninguém mexe na conta de quem morreu por conta própria, nem com a senha e boa intenção. Isso pode gerar problema sério entre herdeiros e com o banco.',
  },
  {
    id: 'h4_privacidade',
    titulo: 'A privacidade de quem morreu e de quem conversava com ele',
    texto:
      'Entrar na conta de quem morreu usando a senha dele pode violar os termos do serviço. E as conversas lá dentro são também de outras pessoas, que contaram coisas para ele, não para a família dele.',
    exemplo: 'Para desligar um aplicativo, a Tainá passou pela caixa de mensagens do pai e leu o desabafo de um amigo que não tinha contado para mais ninguém.',
    defesa: 'Use o caminho oficial da plataforma para a família. E lembre: se a senha era fácil de adivinhar para a filha, era fácil para qualquer um.',
  },
  {
    id: 'h4_app_terceiros',
    titulo: 'Aplicativos que continuam funcionando',
    texto:
      'Muita gente autoriza aplicativos de terceiros a postar ou agir pela própria conta: mensagens automáticas de bom dia, jogos, agendadores. Eles continuam funcionando depois da morte, e a assinatura continua cobrando.',
    exemplo: 'O perfil do Seu Valter postou "Bom dia, família!" às 6h00 de sexta, três dias depois do enterro, pelo aplicativo que ele assinava.',
    defesa: 'Antes de pensar em invasão, procure o padrão: horário fixo, aviso do aplicativo na tela de bloqueio. Informe a plataforma no pedido oficial e cancele a assinatura pelo atendimento do serviço.',
  },
  {
    id: 'h4_memorial',
    titulo: 'Memorial ou encerramento',
    texto:
      'Algumas redes sociais permitem transformar o perfil de quem morreu em memorial: as fotos e mensagens ficam, mas ninguém entra nem posta. Outras permitem pedir a remoção da conta. Algumas deixam a pessoa indicar em vida um contato para cuidar do memorial. O pedido é feito pelo caminho oficial da plataforma, com documentos como a certidão de óbito.',
    exemplo: 'A Tainá queria um lugar para continuar escrevendo para o pai. O Rodrigo queria segurança. O memorial dava as duas coisas.',
    defesa: 'Conta ativa e sem ninguém cuidando é alvo. Decida em família e faça o pedido logo. E, em vida, indique o seu contato de confiança onde a plataforma permitir.',
  },
];
