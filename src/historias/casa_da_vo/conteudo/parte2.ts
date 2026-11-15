import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'v5_mensagem_suporte',
    tipo: 'achar',
    titulo: 'O suporte que ninguém chamou',
    enunciado:
      'A vó encaminhou a mensagem que o "Suporte Casa Conectada" mandou enquanto ele esperava na linha. Toque em tudo o que mostra que não é a empresa.',
    visual: 'mensagem',
    trechos: [
      {
        texto: 'Suporte Casa Conectada ✅ Atendimento Oficial',
        suspeito: true,
        porque:
          'Nome bonito e selinho de emoji qualquer um escreve no perfil. O número não está nos contatos da vó e não é o que aparece na caixa nem no manual do aparelho.',
      },
      {
        texto: 'Detectamos INVASÃO na câmera da sua sala às 09:52.',
        suspeito: true,
        porque:
          'É um alarme para assustar. Empresa nenhuma fica olhando a sua câmera e liga para avisar de invasão. O medo é para você agir sem pensar.',
      },
      {
        texto: 'Para sua proteção, instale o aplicativo de suporte remoto pelo link abaixo.',
        suspeito: true,
        porque:
          'Aplicativo de acesso remoto deixa outra pessoa ver a tela e mexer no celular de longe. Instalado a pedido de um desconhecido, é entregar o celular, o banco e as senhas para ele.',
      },
      {
        texto: 'Depois informe ao técnico o código de 6 dígitos que aparecer na tela.',
        suspeito: true,
        porque:
          'O código é a chave que libera a entrada. Código que aparece no seu celular é só seu e não se lê para ninguém, nem para quem diz ser da empresa.',
      },
      {
        texto: 'Não desligue a ligação, ou a proteção será cancelada.',
        suspeito: true,
        porque:
          'Manter a vítima na linha impede que ela pense, pergunte para alguém ou ligue para o número oficial. Quem pede para não desligar é exatamente quem você deve desligar.',
      },
      { texto: 'Protocolo: 2026-118-447' },
      { texto: 'Atendimento 24 horas, todos os dias.' },
      { texto: 'Obrigado por escolher a Casa Conectada!' },
    ],
    minimo: 3,
    explicacao:
      'No golpe do falso suporte, alguém liga dizendo que detectou invasão ou problema, pede para instalar um aplicativo de acesso remoto e para ler um código. Às vezes chega antes um SMS "avisando" da ligação, para parecer oficial. Empresa séria não liga oferecendo conserto que ninguém pediu. Desligue e ligue você para o número oficial, que está na caixa, no manual ou no site do fabricante. Se já instalou, desligue a internet do celular, avise o banco por outro aparelho e peça ajuda.',
  },
  {
    id: 'v6_roteador',
    tipo: 'formulario',
    titulo: 'O painel do roteador',
    enunciado:
      'O roteador da vó mora embaixo de um paninho de crochê e de um Santo Antônio. Escolha a configuração certa para cada item do painel.',
    visual: 'documento',
    campos: [
      {
        rotulo: 'Senha do painel de administração',
        opcoes: ['A da etiqueta de fábrica, que já funciona', 'Uma senha longa e única, anotada no caderno da vó, guardado na gaveta', '1949, o ano em que a vó nasceu'],
        certa: 1,
        porque:
          'A senha de fábrica do painel é igual em muitos aparelhos do mesmo modelo e aparece em listas na internet. Quem entra no painel muda tudo na rede. Senha longa e única, guardada em casa longe do roteador.',
      },
      {
        rotulo: 'Senha do Wi-Fi',
        opcoes: ['zila1949', 'Uma frase longa que a vó escolheu e consegue lembrar', '12345678'],
        certa: 1,
        porque:
          'Nome e data de nascimento qualquer vizinho adivinha. Uma frase longa, que só faz sentido para a vó, é fácil de lembrar e difícil de adivinhar.',
      },
      {
        rotulo: 'Proteção da rede sem fio',
        opcoes: ['WPA2 ou WPA3, o mais forte que todos os aparelhos aceitarem', 'Rede aberta, sem senha, para a visita não precisar pedir', 'WEP, que veio marcado no aparelho antigo'],
        certa: 0,
        porque: 'WEP é antigo e fraco, e rede aberta deixa qualquer um entrar. Use WPA3 se todos os aparelhos aceitarem, ou WPA2.',
      },
      {
        rotulo: 'Atualização do roteador',
        opcoes: ['Instalar a atualização agora e ligar a atualização automática, se houver', 'Não mexer enquanto estiver funcionando', 'Atualizar só quando der problema'],
        certa: 0,
        porque:
          'A atualização corrige falhas de segurança conhecidas. Roteador que o fabricante não atualiza mais é candidato a ser trocado.',
      },
      {
        rotulo: 'Acesso ao painel pela internet (gerenciamento remoto)',
        opcoes: ['Desligado; o painel só se acessa de dentro de casa', 'Ligado, para o Caíque mexer de qualquer lugar', 'Ligado, com a senha da etiqueta'],
        certa: 0,
        porque:
          'Com o gerenciamento remoto ligado, o painel fica exposto para a internet inteira. Para uma casa, quase nunca é necessário.',
      },
    ],
    minimo: 4,
    explicacao:
      'O roteador é a porta de entrada de todos os aparelhos da casa. Troque a senha do painel de administração e a do Wi-Fi no primeiro dia, use a proteção mais forte que os aparelhos aceitarem (WPA3 ou WPA2), mantenha o roteador atualizado e deixe desligado o acesso ao painel pela internet.',
  },
  {
    id: 'v6_planta_final',
    tipo: 'achar',
    titulo: 'A última volta pela casa',
    enunciado:
      'Antes de ir embora, a última volta pela casa com a lista de aparelhos conectados aberta no painel do roteador. Toque no que ainda precisa de atenção.',
    visual: 'casa',
    trechos: [
      {
        texto: '📺 Sala: TV inteligente sem atualização há oito meses, com o microfone do controle sempre ligado',
        suspeito: true,
        porque:
          'Aparelho sem atualização carrega falhas já conhecidas. E microfone que não precisa ficar ligado pode ser desligado nas configurações.',
      },
      {
        texto: '🖨️ Quartinho: impressora Wi-Fi do vô, ligada desde 2014, que o fabricante não atualiza mais',
        suspeito: true,
        porque:
          'Aparelho sem suporte do fabricante não recebe mais correção de segurança e ninguém usa. É candidato a sair da tomada ou da rede.',
      },
      {
        texto: '⚖️ Banheiro: balança que manda o peso para o aplicativo de um fabricante que fechou',
        suspeito: true,
        porque:
          'Fabricante que fechou não corrige mais nada, e o peso da vó vai para um aplicativo que ninguém cuida. Se ela não usa, sai da rede.',
      },
      {
        texto: '🔌 Cozinha: tomada da cafeteira com acesso para um celular que o Caíque perdeu no Carnaval',
        suspeito: true,
        porque:
          'Quem achou aquele celular controla a tomada da casa. Revise a lista de acessos de cada aplicativo e remova aparelhos e pessoas que não deveriam estar lá.',
      },
      { texto: '💡 Varanda: lâmpada colorida atualizada, controlada só pelo celular da vó' },
      { texto: '📻 Quarto da costura: rádio de pilha do vô, sem Wi-Fi nenhum' },
      { texto: '🚪 Portão: interfone antigo de fio, sem internet' },
      { texto: '📱 Mesa da sala: tablet da vó com atualização automática ligada' },
    ],
    minimo: 3,
    explicacao:
      'Uma volta pela casa com a lista de aparelhos conectados do roteador mostra o que ninguém lembrava: aparelho sem atualização, aparelho sem suporte do fabricante, acesso esquecido de um celular perdido. Atualize o que fica, revise quem tem acesso e desligue o que não precisa. Aparelho sem internet, como o rádio de pilha, não é problema.',
  },
  {
    id: 'v7_botao',
    tipo: 'formulario',
    titulo: 'O botão de emergência da vó',
    enunciado:
      'A vó lê cada pergunta do aplicativo do botão de emergência, você explica e ela responde. Escolha a configuração que cuida sem vigiar.',
    visual: 'documento',
    campos: [
      {
        rotulo: 'Quem decide se o botão fica',
        opcoes: ['A vó', 'O Tio Mauro, que pagou', 'A neta, que configurou'],
        certa: 0,
        porque: 'O aparelho fica no pulso dela e na casa dela. Quem decide usar, tirar ou trocar é ela.',
      },
      {
        rotulo: 'Quem recebe o alerta',
        opcoes: ['As pessoas que a vó escolheu, e ela pode mudar a lista quando quiser', 'Só o Tio Mauro', 'O grupo inteiro da família e a vila'],
        certa: 0,
        porque: 'A lista é dela. Ela escolhe quem chega rápido e em quem confia, e pode mudar.',
      },
      {
        rotulo: 'Localização',
        opcoes: ['Enviada só quando ela aperta o botão', 'Ligada o tempo todo, para a família acompanhar', 'Compartilhada com outros aplicativos do celular'],
        certa: 0,
        porque: 'Para pedir socorro, basta mandar a localização na hora do alerta. Localização ligada o tempo todo vira rastreamento.',
      },
      {
        rotulo: 'Câmera e microfone',
        opcoes: ['Nada gravando; se tiver viva voz, ele só abre a ligação quando ela aperta', 'Microfone sempre ligado para ouvir a casa', 'Câmera no quarto para conferir cada alerta'],
        certa: 0,
        porque: 'O botão serve para chamar ajuda, não para ouvir nem filmar a casa. Nada fica gravando.',
      },
      {
        rotulo: 'Detecção de queda (se o aparelho tiver)',
        opcoes: ['A vó decide se liga, sabendo que pode dar alarme falso de vez em quando', 'Ligar escondido, sem contar para ela', 'Nunca falar disso com ela'],
        certa: 0,
        porque: 'É uma escolha dela, com a informação completa: ajuda se ela cair e não conseguir apertar, mas às vezes dispara sem queda.',
      },
      {
        rotulo: 'Teste e bateria',
        opcoes: ['Testar junto com a vó uma vez por mês e conferir a bateria', 'Nunca testar, para não incomodar ninguém', 'Testar só quando der problema'],
        certa: 0,
        porque: 'Botão que nunca foi testado ou está sem bateria não ajuda na hora que precisa.',
      },
    ],
    minimo: 4,
    explicacao:
      'Um botão de emergência cuida sem vigiar quando quem usa decide: se quer o aparelho, quem recebe o alerta, se a detecção de queda fica ligada. A localização vai só no alerta, nada grava nem filma, e o teste e a bateria entram na rotina. Câmera escondida não é cuidado: é vigilância sem consentimento.',
  },
  {
    id: 'v8_casa_jura',
    tipo: 'achar',
    titulo: 'A casa da Dona Jura',
    enunciado:
      'A vó desenhou no caderno a planta da casa da Dona Jura, com os trecos de cada cômodo. Toque no que a vó precisa ensinar a Dona Jura a arrumar.',
    visual: 'casa',
    trechos: [
      {
        texto: '🔔 Portão: campainha com vídeo nova, na senha da caixa, gravando a calçada inteira da vila',
        suspeito: true,
        porque:
          'Senha de fábrica tem que ser trocada no primeiro uso. E a câmera da campainha deve mirar a porta dela, não a calçada e a casa dos vizinhos.',
      },
      {
        texto: '📷 Quintal: câmera que o genro instalou, com acesso para o genro, a ex-nora e um tal de "visitante1"',
        suspeito: true,
        porque:
          'Quem tem acesso no aplicativo vê as imagens. Revise a lista, remova quem não deveria estar lá e deixe cada pessoa com o próprio acesso.',
      },
      {
        texto: '📶 Sala: senha do Wi-Fi escrita num papel colado na janela, virada para a rua',
        suspeito: true,
        porque: 'Senha anotada em papel pode, desde que guardada dentro de casa. Colada na janela, a rua inteira lê.',
      },
      {
        texto: '🗣️ Cozinha: assistente de voz com compra por voz ligada e sem confirmação',
        suspeito: true,
        porque: 'Sem código ou confirmação, qualquer voz, até a da TV, faz pedido. Ligue a confirmação ou desligue a compra por voz.',
      },
      { texto: '💡 Quarto: lâmpada colorida atualizada, ligada só ao celular da Dona Jura' },
      { texto: '📻 Varanda: rádio de pilha sintonizado no AM' },
      { texto: '🔒 Porta: fechadura comum de chave, com cópia com a filha' },
      { texto: '📺 Sala: TV com atualização automática ligada' },
    ],
    minimo: 3,
    explicacao:
      'Os mesmos cuidados valem para qualquer casa: trocar a senha de fábrica no primeiro uso, revisar quem tem acesso aos aplicativos, não deixar senha à vista, pedir confirmação nas compras por voz e lembrar da privacidade dos vizinhos. Ensinar a pessoa a mexer vale mais do que mexer por ela.',
  },
];

export const notas: Nota[] = [
  {
    id: 'v5_falso_suporte',
    titulo: 'Falso suporte técnico',
    texto:
      'Alguém liga ou manda mensagem dizendo ser do suporte de uma empresa, avisa de uma "invasão" ou de um problema urgente e oferece conserto de graça. Às vezes chega um SMS antes, "avisando" da ligação, para parecer oficial.',
    exemplo: '"Detectamos invasão na sua câmera. Instale o aplicativo de suporte e me informe o código. Não desligue."',
    defesa:
      'Empresa séria não liga oferecendo atualização remota nem pede para instalar aplicativo ou ler código. Desligue e ligue você para o número oficial, que está na caixa, no manual ou no site do fabricante, nunca para o número que a pessoa passar.',
  },
  {
    id: 'v5_instalou_e_agora',
    titulo: 'Instalei o aplicativo do golpista. E agora?',
    texto:
      'Aplicativo de acesso remoto deixa outra pessoa ver a tela e mexer no celular de longe. O golpista costuma pedir para a vítima abrir o banco "para conferir".',
    exemplo: '"Estou quase terminando, abra o aplicativo do banco para eu verificar se o invasor entrou."',
    defesa:
      'Desligue a internet do celular (Wi-Fi e dados) ou desligue o aparelho. Não abra o banco. Ligue para o banco por outro telefone, no número atrás do cartão. Depois, com ajuda, desinstale o aplicativo, troque as senhas a partir de outro aparelho, faça o boletim de ocorrência e, se saiu dinheiro, peça a contestação ao banco.',
  },
  {
    id: 'v5_codigo',
    titulo: 'Código não se lê para ninguém',
    texto:
      'Códigos que chegam por SMS, aplicativo ou aparecem na tela servem para confirmar que é você. Quem pede o código quer entrar no lugar de você.',
    exemplo: '"Pode ler para mim o número de seis dígitos que apareceu?"',
    defesa:
      'Não leia nem mande código para ninguém, nem para quem diz ser da empresa, do banco ou da família. Se alguém pedir, desligue. Na dúvida, combine com a família uma palavra secreta para ligações estranhas.',
  },
  {
    id: 'v6_roteador',
    titulo: 'O roteador é a porta da casa',
    texto:
      'Todos os aparelhos conectados passam pelo roteador. Se o painel dele fica com a senha de fábrica ou acessível pela internet, quem entrar muda a rede inteira.',
    exemplo: 'Etiqueta embaixo do roteador com a senha do painel, Wi-Fi com nome e ano de nascimento da dona da casa.',
    defesa:
      'Troque a senha do painel de administração e a do Wi-Fi. Use WPA3 ou WPA2. Atualize o roteador e ligue a atualização automática, se houver. Desligue o acesso ao painel pela internet. Guarde as senhas anotadas dentro de casa, longe do aparelho.',
  },
  {
    id: 'v6_rede_separada',
    titulo: 'Rede separada para os aparelhos',
    texto:
      'Câmera, lâmpada, campainha, assistente de voz e tomada inteligente não precisam ficar na mesma rede do celular e do computador onde estão o banco e as fotos.',
    exemplo: 'Uma rede "ZILA_GENTE" para o celular e o notebook, outra "ZILA_TRECOS" para os aparelhos.',
    defesa:
      'Use a rede de convidados ou a rede de dispositivos do roteador para os aparelhos inteligentes, com senha própria e, quando o roteador oferecer, isolada da rede principal. Se um aparelho tiver uma falha, o estrago fica longe das coisas importantes.',
  },
  {
    id: 'v6_sem_suporte',
    titulo: 'Atualizar ou tirar da tomada',
    texto:
      'Aparelho conectado precisa de atualização para corrigir falhas. Quando o fabricante para de atualizar ou fecha, o aparelho continua ligado com as falhas que já se conhecem.',
    exemplo: 'Impressora Wi-Fi ligada desde 2014, balança de um fabricante que fechou, TV sem atualização há meses.',
    defesa:
      'Atualize aparelho e aplicativo, e ligue a atualização automática. Revise a lista de aparelhos conectados no roteador e os acessos de cada aplicativo. O que não tem mais suporte e não é usado sai da rede ou da tomada.',
  },
  {
    id: 'v7_camera_dentro',
    titulo: 'Câmera dentro de casa',
    texto:
      'Câmera dentro de casa filma a intimidade de quem mora e de quem visita. Câmera escondida, sem a pessoa saber, não é cuidado: é vigilância.',
    exemplo: 'Uma câmera disfarçada de carregador de tomada no quarto da vó "para ver se ela cai".',
    defesa:
      'Quem mora decide se haverá câmera, onde e quem vê as imagens. Quarto e banheiro não precisam de câmera. Avise as visitas. Para pedir ajuda numa queda existem soluções que não filmam, como o botão de emergência.',
  },
  {
    id: 'v7_botao_emergencia',
    titulo: 'Botão de emergência que ela controla',
    texto: 'Um botão no pulso ou no pescoço que, apertado, avisa as pessoas escolhidas e manda a localização naquele momento.',
    exemplo: 'A vó aperta e chegam alertas no celular da neta, do Caíque, da Dona Jura e do Tio Mauro, na ordem que ela escolheu.',
    defesa:
      'Quem usa decide a lista de contatos e se liga a detecção de queda. Localização só no alerta, nada gravando nem filmando. Teste uma vez por mês e confira a bateria.',
  },
  {
    id: 'v7_autonomia',
    titulo: 'Quem decide é a dona da casa',
    texto:
      'Cuidar de uma pessoa idosa não é decidir por ela. Instalar coisa sem perguntar, esconder aparelho ou falar por ela tira a autonomia de quem ainda decide muito bem.',
    exemplo: '"A vó quer o botão." "Quem decidiu?"',
    defesa: 'Explique as opções, os riscos e os benefícios, e deixe a pessoa escolher. Pergunte antes de instalar, de desligar e de mudar a casa dela.',
  },
  {
    id: 'v8_ensinar_vizinha',
    titulo: 'Ensinar em vez de fazer',
    texto: 'Quem só recebe a casa configurada não sabe o que tem nem como desligar. Quem aprende a mexer cuida dos próximos aparelhos sozinho.',
    exemplo: 'A vó desenha a planta da casa da Dona Jura e pergunta, cômodo por cômodo, o que cada treco faz.',
    defesa:
      'Mostre o caminho e deixe a pessoa fazer: trocar a senha de fábrica, revisar quem tem acesso, ligar a confirmação de compra. Nunca mexa nem olhe a câmera de outra pessoa sem ela pedir e estar junto.',
  },
  {
    id: 'v8_quem_decide',
    titulo: 'Segurança também é escolher o que sai',
    texto: 'Às vezes a pessoa se assusta e quer tirar tudo da tomada. A casa fica segura, mas pode ir junto o que ajudava.',
    exemplo: '"Eu quero tirar tudo da tomada. Tudo."',
    defesa: 'Respeite a decisão, explique sem pressionar o que cada aparelho faz e deixe a porta aberta para voltar atrás no tempo dela.',
  },
  {
    id: 'v8_revisao',
    titulo: 'Revisão de mês em mês',
    texto: 'Casa conectada não se configura uma vez só. Aparelho novo, acesso novo e atualização pendente aparecem todo mês.',
    exemplo: 'Primeiro sábado do mês: testar o botão, trocar a pilha da fechadura, conferir os aparelhos conectados.',
    defesa:
      'Uma vez por mês: confira a lista de aparelhos no roteador, os acessos dos aplicativos, as atualizações, as gravações da assistente de voz e a bateria da fechadura. Aparelho novo só entra com senha nova e na rede dos aparelhos.',
  },
];
