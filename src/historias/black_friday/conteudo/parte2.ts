import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'b5_sms_reentrega',
    tipo: 'achar',
    titulo: 'A taxa de reentrega',
    enunciado:
      'Domingo, 7h12. Chegou esta mensagem de texto de um número desconhecido. Toque em tudo o que mostra que não é uma entrega de verdade.',
    visual: 'mensagem',
    trechos: [
      {
        texto: 'De: +55 11 9####-#### (número desconhecido)',
        suspeito: true,
        porque:
          'Aviso de entrega de verdade aparece no aplicativo ou no site de quem vendeu, ligado ao seu pedido. Um número de celular qualquer não prova que é transportadora.',
      },
      {
        texto: 'TRANSPORTADORA: Sua entrega NAO FOI CONCLUIDA',
        suspeito: true,
        porque:
          'Não diz qual transportadora, qual loja, qual pedido nem qual código de rastreio. Quem entrega de verdade sabe o que está entregando.',
      },
      { texto: 'por endereço incompleto.' },
      {
        texto: 'Pague a taxa de reentrega de R$ 19,00 em ate 30 min.',
        suspeito: true,
        porque:
          'Valor pequeno e prazo curto são a combinação que faz a pessoa pagar sem conferir. Uma cobrança de entrega de verdade é consultada no site ou aplicativo de quem vendeu, com o código da compra.',
      },
      {
        texto: 'Apos o prazo o objeto sera devolvido ao remetente.',
        suspeito: true,
        porque: 'Ameaça de perder a encomenda é pressão para você agir antes de pensar.',
      },
      {
        texto: 'Acesse: encurta.li/rEntr3g4',
        suspeito: true,
        porque:
          'Link encurtado esconde para onde você vai. Não toque: entre pelo aplicativo ou digite o endereço oficial da loja onde você comprou.',
      },
    ],
    minimo: 3,
    explicacao:
      'A mensagem de taxa de reentrega chega para quem comprou e para quem não comprou nada, porque é enviada a muita gente ao mesmo tempo. A defesa: não toque no link, abra o aplicativo ou digite o site de quem vendeu e consulte o pedido com o código de rastreio da compra real. Se não existe pedido, não existe entrega. Se pagou, avise o banco na hora e peça a devolução do Pix.',
  },
  {
    id: 'b5_pagina_rastreio',
    tipo: 'achar',
    titulo: 'A página do caminhãozinho',
    enunciado:
      'O link abriu esta página, com um caminhãozinho animado e a palavra RASTREIO bem grande. Toque em tudo o que mostra que não é uma página de entrega de verdade.',
    visual: 'navegador',
    trechos: [
      {
        texto: 'rastreio-entregas-brasil.online/pendencia',
        suspeito: true,
        porque:
          'O endereço não é da loja onde você comprou nem de uma transportadora que você conheça. O cadeado ao lado só mostra que a conexão é cifrada; não diz quem é o dono da página.',
      },
      { texto: 'RASTREIO DE OBJETOS' },
      {
        texto: 'Seu objeto está retido: pendência de R$ 19,00',
        suspeito: true,
        porque: '"Seu objeto" sem dizer qual objeto, de qual loja e de qual pedido. A página não sabe o que você comprou porque não sabe nada da sua compra.',
      },
      {
        texto: 'Informe seu CPF para liberar a entrega',
        suspeito: true,
        porque: 'A página começa pedindo os seus dados antes de mostrar qualquer informação da encomenda. Dado pessoal não se entrega para página que chegou por link desconhecido.',
      },
      {
        texto: 'Pagamento via Pix: favorecido J. R. S. PEREIRA',
        suspeito: true,
        porque: 'Quem recebe é uma pessoa física, não uma transportadora nem a loja. Confira sempre o nome de quem vai receber antes de confirmar um Pix.',
      },
      {
        texto: 'Pague em 04:59 ou o objeto será devolvido',
        suspeito: true,
        porque: 'Mais um contador. A pressa é a ferramenta da página; conferir é a sua.',
      },
      { texto: 'Atendimento: seg. a sex., 8h às 18h' },
    ],
    minimo: 3,
    explicacao:
      'Página de "rastreio" que chega por link de mensagem, com endereço desconhecido, sem dizer qual é a sua encomenda e com Pix para pessoa física, não é rastreio. O rastreio de verdade está no aplicativo ou no e-mail da loja onde você comprou, com o código do seu pedido. Feche a aba e confira por lá.',
  },
  {
    id: 'b6_perfil_falso',
    tipo: 'achar',
    titulo: 'O perfil do Atendimento Oficial',
    enunciado:
      'Você abriu o perfil de quem respondeu a sua reclamação em quarenta segundos. Toque em tudo o que mostra que não é o perfil oficial da loja.',
    visual: 'navegador',
    trechos: [
      {
        texto: 'redesocial.com/megalar.atendimento.oficial_',
        suspeito: true,
        porque:
          'Nome de usuário com palavras a mais, ponto e sublinhado. Perfil oficial costuma ter o nome simples da marca, e o certo é conferir o perfil que o próprio site da loja indica.',
      },
      {
        texto: 'MegaLar Atendimento Oficial ✔ (selo dentro da foto)',
        suspeito: true,
        porque:
          'O selo azul está desenhado dentro da foto do perfil. Selo de verificação de verdade é colocado pela rede social ao lado do nome, não faz parte da imagem. E nem o selo sozinho é garantia.',
      },
      {
        texto: 'Perfil criado em novembro de 2026',
        suspeito: true,
        porque: 'Uma loja com mais de vinte anos não abre o perfil de atendimento na semana da Black Friday.',
      },
      {
        texto: '312 seguidores · 0 publicações',
        suspeito: true,
        porque: 'Perfil oficial de loja grande tem histórico, publicações e muitos seguidores. Este só existe para responder reclamação dos outros.',
      },
      {
        texto: 'Link: megalar-estorno.online',
        suspeito: true,
        porque: 'O site oficial da loja é www.megalar.com.br. Qualquer outro endereço é de outra pessoa.',
      },
      { texto: 'Responde em até 1 minuto' },
      {
        texto: 'Atendimento exclusivo pelo privado',
        suspeito: true,
        porque:
          'Loja de verdade responde em público e manda para os canais oficiais. Quem quer tudo no privado quer conversar longe de quem poderia avisar você.',
      },
    ],
    minimo: 3,
    explicacao:
      'Perfis falsos de atendimento procuram quem reclama de uma loja na rede social e respondem antes da loja. A defesa: conferir o perfil oficial pela lista de canais do site da própria loja, digitando o endereço; desconfiar de perfil novo, com poucos seguidores e selo desenhado; e lembrar que empresa não pede senha, código nem dados completos do cartão por mensagem. Denuncie o perfil na própria rede social.',
  },
  {
    id: 'b6_codigo_sms',
    tipo: 'quiz',
    titulo: 'O código do estorno',
    enunciado:
      'Chegou do banco um SMS com um código de verificação e o aviso "não compartilhe este código com ninguém". A "Jéssica" do Atendimento Oficial pede esse código para "confirmar o estorno". O que fazer?',
    opcoes: [
      'Passar o código, porque o estorno é do interesse da própria cliente',
      'Passar só metade do código, por segurança',
      'Não passar o código, encerrar a conversa e ligar para o banco pelo número do verso do cartão',
      'Pedir para a Jéssica mandar o código por e-mail antes',
    ],
    certa: 2,
    explicacao:
      'Código de verificação serve para confirmar que é você quem está fazendo alguma coisa, como entrar numa conta ou autorizar o cartão num aparelho. Estorno de verdade não depende de código seu. Quem pede o código quer fazer alguma coisa no seu nome. Não passe para ninguém; se já passou dados do cartão, ligue para o banco pelo número do verso e bloqueie o cartão.',
  },
  {
    id: 'b7_quando_cai',
    tipo: 'ordenar',
    titulo: 'Caiu. E agora?',
    enunciado: 'A Paty quer a ordem certa do que fazer depois de cair num golpe de compra. Coloque os passos na ordem.',
    passos: [
      'Avisar o banco na hora, pelo aplicativo ou pelo número do verso do cartão, e bloquear o cartão se ele foi exposto',
      'Contestar as compras no cartão e pedir a devolução do Pix ao seu banco',
      'Guardar prints, comprovantes, endereços dos sites, números e protocolos',
      'Registrar o boletim de ocorrência, de preferência pela delegacia online',
      'Denunciar a página, o anúncio e o perfil falso nas próprias plataformas',
    ],
    explicacao:
      'O banco vem primeiro porque cada hora conta: no Pix, o banco de quem recebeu só consegue bloquear o que ainda estiver na conta; no cartão, bloquear cedo impede novas compras. Depois, contestar e pedir a devolução, juntar as provas, registrar o boletim e denunciar. Não há garantia de reaver tudo, mas agir rápido dá a melhor chance.',
  },
  {
    id: 'b7_antes_de_comprar',
    tipo: 'formulario',
    titulo: 'Antes de clicar em comprar',
    enunciado: 'A Paty montou a lista do jeito chato. Escolha a resposta certa em cada item.',
    campos: [
      {
        rotulo: 'Como chegar ao site da loja',
        opcoes: [
          'Digitar o endereço oficial na barra, letra por letra',
          'Tocar no primeiro anúncio patrocinado da busca',
          'Abrir o link que o Kevin mandou no grupo',
        ],
        certa: 0,
        porque: 'Anúncio patrocinado e link de terceiros podem levar a um site clonado com endereço parecido. Digitando, você sabe onde está.',
      },
      {
        rotulo: 'O cadeado ao lado do endereço',
        opcoes: [
          'Prova que a loja é honesta',
          'Só mostra que a conexão é cifrada; não diz quem é o dono do site',
          'Só aparece em loja grande',
        ],
        certa: 1,
        porque: 'Site de golpe também tem cadeado. Ele protege a conversa entre você e o site, seja quem for o site.',
      },
      {
        rotulo: 'O preço',
        opcoes: [
          'Quanto mais barato, melhor a loja',
          'Pode ser muito abaixo do mercado, se tiver contador',
          'Desconto que faz sentido, parecido com o de outras lojas grandes',
        ],
        certa: 2,
        porque: 'Preço impossível, contador regressivo e "últimas unidades" são as marcas da loja falsa.',
      },
      {
        rotulo: 'O rodapé',
        opcoes: [
          'CNPJ e razão social que existem e batem com quem recebe o pagamento',
          'Não importa, ninguém lê rodapé',
          'Basta ter um selo de "site seguro"',
        ],
        certa: 0,
        porque: 'Selo qualquer um desenha. CNPJ se confere na consulta pública e o nome tem que ser o mesmo que aparece na hora de pagar.',
      },
      {
        rotulo: 'A forma de pagamento',
        opcoes: [
          'Pix para a pessoa física que o site indicar',
          'Cartão de crédito, de preferência virtual',
          'Boleto com 15% de desconto de outra empresa',
        ],
        certa: 1,
        porque: 'Cartão de crédito permite contestar a compra, e o virtual pode ser apagado se o número vazar. Pix e boleto para loja desconhecida são difíceis de reaver.',
      },
      {
        rotulo: 'Se a TV chegar e você se arrepender',
        opcoes: [
          'Não tem jeito, comprou é seu',
          'Só se tiver defeito',
          'Compra fora da loja física: sete dias a partir do recebimento para desistir',
        ],
        certa: 2,
        porque: 'O Código de Defesa do Consumidor, no artigo 49, dá sete dias para desistir da compra feita fora do estabelecimento comercial, como pela internet, com devolução do que foi pago.',
      },
    ],
    minimo: 4,
    explicacao:
      'Comprar seguro é chato e rápido: endereço digitado, preço que faz sentido, CNPJ que bate com quem recebe, cartão de crédito (de preferência virtual), nota fiscal guardada e o direito de arrependimento de sete dias em compra fora da loja. O cadeado só diz que a conexão é cifrada.',
  },
  {
    id: 'b8_roteiro_kevin',
    tipo: 'quiz',
    titulo: 'A primeira dica do vídeo',
    enunciado: 'O Kevin quer abrir o vídeo anti golpe com uma frase certeira. Qual destas está correta?',
    opcoes: [
      'Tem cadeado no navegador? Então a loja é segura.',
      'Anúncio patrocinado é verificado, pode confiar.',
      'Cadeado só mostra que a conexão é cifrada. Confira o endereço letra por letra, digitado por você.',
      'Se o preço tem contador regressivo, compre logo antes que acabe.',
    ],
    certa: 2,
    explicacao:
      'O cadeado indica conexão cifrada, e site de golpe também tem. Anúncio patrocinado também pode ser de golpe. Contador regressivo é pressão. O que protege é digitar o endereço oficial, conferir letra por letra, desconfiar de preço impossível e pagar de um jeito que dê para contestar.',
  },
];

export const notas: Nota[] = [
  {
    id: 'b5_taxa_falsa',
    titulo: 'Taxa de entrega por mensagem',
    texto:
      'Mensagens de "entrega não concluída" cobram uma taxa pequena com prazo curto e um link. Chegam até para quem não comprou nada.',
    exemplo: '"TRANSPORTADORA: pague R$ 19,00 de reentrega em até 30 min: encurta.li/..."',
    defesa:
      'Não toque no link. Abra o aplicativo ou digite o site de quem vendeu e consulte o pedido com o código de rastreio da compra real. Sem pedido, sem entrega.',
  },
  {
    id: 'b5_rastreio_oficial',
    titulo: 'Onde mora o rastreio de verdade',
    texto:
      'O código de rastreio vem no e-mail ou no aplicativo da loja onde você comprou, ligado ao número do pedido. É por lá que se acompanha a entrega e se resolve qualquer pendência.',
    exemplo: 'O aplicativo da MegaLar mostra "Saiu para entrega" e o mapinha do caminhão. Nenhum link chegou por SMS.',
    defesa:
      'Consulte sempre pelo canal de quem vendeu. Desconfie de qualquer página de rastreio que não sabe qual é a sua encomenda e pede CPF ou Pix.',
  },
  {
    id: 'b5_devolucao_pix',
    titulo: 'Pix para golpista? Peça a devolução',
    texto:
      'Quem fez um Pix num golpe pode pedir ao próprio banco a devolução pelo Mecanismo Especial de Devolução. O banco avisa o banco de quem recebeu, que pode bloquear o valor que ainda estiver na conta.',
    exemplo: 'O protocolo da contestação do Pix da taxa de reentrega, guardado em print.',
    defesa:
      'Peça o quanto antes, pelo aplicativo ou pela central do banco, com data, hora e valor. Não é garantia de reaver tudo: se o dinheiro já saiu da conta de quem recebeu, pode voltar pouco ou nada.',
  },
  {
    id: 'b6_selo_desenhado',
    titulo: 'Atendimento Oficial que não é oficial',
    texto:
      'Perfis falsos de loja respondem reclamações na rede social em segundos e chamam para o privado. Usam nome parecido, a logo da loja e um selo de verificado desenhado dentro da foto.',
    exemplo: '"@megalar.atendimento.oficial_", criado este mês, 312 seguidores, link para megalar-estorno.online.',
    defesa:
      'Confira o perfil oficial na lista de canais do site da loja, digitando o endereço. Desconfie de perfil novo, com poucos seguidores e atendimento só pelo privado. Denuncie na própria rede social.',
  },
  {
    id: 'b6_empresa_nao_pede',
    titulo: 'Empresa não pede senha nem código',
    texto:
      'Atendimento de verdade não pede senha, código de verificação, número completo do cartão, validade nem os três números de trás por mensagem. Estorno se faz no pedido, no sistema da loja.',
    exemplo: '"Me passe o código que chegou por SMS para eu confirmar o estorno."',
    defesa:
      'Não passe. Se já passou dados do cartão, ligue para o banco pelo número do verso, bloqueie o cartão e conteste qualquer compra que não for sua.',
  },
  {
    id: 'b7_caiu_e_agora',
    titulo: 'Caiu num golpe de compra: o que fazer',
    texto:
      'Avisar o banco na hora pelo canal oficial, contestar as compras no cartão, pedir a devolução do Pix, guardar as provas, registrar o boletim de ocorrência e denunciar a página, o anúncio e o perfil.',
    exemplo: 'Uma pasta no celular com prints, comprovantes, endereços dos sites e protocolos do banco.',
    defesa:
      'Agir no mesmo dia dá a melhor chance. Vergonha atrasa; quem avisa rápido também ajuda a tirar o golpe do ar antes que pegue outra pessoa.',
  },
  {
    id: 'b7_cartao_virtual',
    titulo: 'Cartão virtual e o jeito chato de comprar',
    texto:
      'O cartão virtual é gerado no aplicativo do banco, com número, validade e código próprios. Se vazar, você apaga e o cartão físico continua inteiro. Sendo crédito, permite contestar a compra.',
    exemplo: 'TV comprada em www.megalar.com.br, digitado, CNPJ do rodapé igual ao nome na tela de pagamento, pago no cartão virtual.',
    defesa:
      'Digite o endereço, desconfie de preço impossível, confira CNPJ e razão social, pesquise a reputação da loja e pague com cartão, de preferência virtual. Pix e boleto para loja desconhecida são difíceis de reaver.',
  },
  {
    id: 'b7_arrependimento',
    titulo: 'Sete dias para se arrepender',
    texto:
      'Em compra feita fora do estabelecimento comercial, como pela internet ou por telefone, o consumidor pode desistir em até sete dias, contados da assinatura ou do recebimento do produto, e recebe de volta o que pagou. Está no Código de Defesa do Consumidor, artigo 49.',
    exemplo: 'A TV chegou no domingo. Até o domingo seguinte, dá para desistir, mesmo sem defeito nenhum.',
    defesa:
      'Guarde o pedido, a nota fiscal e o termo de garantia. Para desistir, use os canais oficiais da loja e guarde o protocolo.',
  },
  {
    id: 'b8_entrega_de_verdade',
    titulo: 'Como é uma entrega de verdade',
    texto:
      'Na entrega de verdade, você sabe o que comprou e de quem, acompanha pelo aplicativo da loja e não paga taxa nenhuma na porta ou por link.',
    exemplo: 'O entregador confere o nome e o número do pedido. A caixa chega lacrada, com a nota fiscal.',
    defesa:
      'Confira a caixa e o modelo antes de assinar. Guarde a nota fiscal: é ela que garante a garantia.',
  },
  {
    id: 'b8_avisar_os_outros',
    titulo: 'Aviso também viaja',
    texto:
      'Golpe se espalha por link em grupo de família. Aviso pode se espalhar do mesmo jeito: contar o que aconteceu, sem vergonha, protege quem ainda não viu a mensagem.',
    exemplo: 'Um vídeo de um minuto: endereço digitado, cartão virtual, taxa se confere no aplicativo da loja, atendimento de verdade não pede código.',
    defesa:
      'Antes de repassar uma oferta, confira o endereço e a loja. Se cair ou quase cair, avise o grupo e denuncie a página.',
  },
];
