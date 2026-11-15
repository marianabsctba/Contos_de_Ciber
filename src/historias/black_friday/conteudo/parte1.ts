import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'b1_site_clone',
    tipo: 'achar',
    titulo: 'A TV de R$ 899',
    enunciado:
      'Esta é a página que abriu pelo anúncio patrocinado. Parece a MegaLar inteirinha. Toque em tudo o que mostra que não é a loja de verdade, ou que é uma armadilha.',
    visual: 'navegador',
    trechos: [
      {
        texto: 'www.megalar-ofertas.shop/tv-65-polegadas',
        suspeito: true,
        porque:
          'O site oficial é www.megalar.com.br. Aqui o nome vem com um traço, "ofertas", e termina em ".shop". Endereço parecido não é endereço igual: confira letra por letra, até o fim.',
      },
      { texto: 'Smart TV 65 polegadas 4K UHD' },
      {
        texto: 'De R$ 4.999,00 por R$ 899,00',
        suspeito: true,
        porque:
          'Mais de 80% de desconto numa TV nova não é promoção, é isca. Preço muito abaixo do que as lojas de verdade cobram é o primeiro sinal de golpe.',
      },
      {
        texto: '⏳ Termina em 00:19:42 · Restam 3 unidades',
        suspeito: true,
        porque:
          'Contador regressivo e "últimas unidades" existem para você pagar antes de pensar. Oferta honesta aguenta cinco minutos de conferência.',
      },
      { texto: 'Frete grátis para todo o Brasil' },
      {
        texto: '🔒 Site 100% seguro',
        suspeito: true,
        porque:
          'Qualquer um cola um selo na página. E o cadeado do navegador só mostra que a conexão é cifrada, não que a loja é honesta. Site de golpe também tem cadeado.',
      },
      {
        texto: 'Pagamento somente via Pix: 5% OFF',
        suspeito: true,
        porque:
          'Loja grande aceita cartão. Só Pix, para uma loja que você não conferiu, quer dizer dinheiro que sai em segundos e é difícil de reaver.',
      },
      { texto: '⭐ 4,8 · Mais de 2 mil clientes satisfeitos' },
    ],
    minimo: 3,
    explicacao:
      'Site clonado copia a logo, as cores e as fotos da loja de verdade. O que não dá para copiar é o endereço oficial. Desconfie de anúncio patrocinado com preço impossível, contador regressivo, selo de "100% seguro" e pagamento só por Pix. Feche a página e digite você mesma o endereço oficial da loja: se a oferta existir, ela vai estar lá.',
  },
  {
    id: 'b2_boleto_desconto',
    tipo: 'achar',
    titulo: 'O boleto com 15% de desconto',
    enunciado:
      'Este é o boleto que a "OutletTech Brasil" gerou para a TV de 65. Toque em tudo o que mostra que o dinheiro não vai para a loja, ou que a pressa é a armadilha.',
    visual: 'boleto',
    trechos: [
      { texto: 'Banco: 998 BANCO DIGITAL S.A.' },
      { texto: 'Linha digitável: 99890.12345 67890.123456 78901.234567 1 00000119000' },
      {
        texto: 'Beneficiário: J. C. SANTOS PAGAMENTOS',
        suspeito: true,
        porque:
          'A loja se chama OutletTech, mas quem recebe é outro nome. No boleto, o beneficiário é quem fica com o dinheiro. Ele tem que ser a própria loja.',
      },
      {
        texto: 'CPF/CNPJ do beneficiário: ***.482.***-**',
        suspeito: true,
        porque:
          'Isso é um CPF, de pessoa física, e não o CNPJ da loja. Confira o nome e o documento do beneficiário na tela do aplicativo do banco antes de pagar e compare com o CNPJ do rodapé do site.',
      },
      { texto: 'Pagador: CLIENTE OUTLETTECH' },
      {
        texto: 'Valor do documento: R$ 1.190,00',
        suspeito: true,
        porque:
          'É um terço do preço da TV nas lojas de verdade. Preço "só um pouco bom demais" é feito para parecer negócio, e não milagre.',
      },
      {
        texto: 'Instruções: desconto de 15% válido por 60 minutos. Após, pedido cancelado.',
        suspeito: true,
        porque:
          'Prazo de uma hora é pressa para você não pesquisar a loja. E boleto pago para desconhecido não tem botão de desfazer.',
      },
    ],
    minimo: 3,
    explicacao:
      'Boleto não é mais seguro só porque não usa cartão. O dinheiro vai para quem está escrito como beneficiário, e é muito difícil de reaver depois de pago. Antes de pagar, confira na tela de confirmação do aplicativo do banco o nome e o CPF ou CNPJ do beneficiário: tem que ser a loja. Pesquise o CNPJ e a reputação da loja e desconfie de desconto que só vale por uma hora.',
  },
  {
    id: 'b3_sms_cupom',
    tipo: 'achar',
    titulo: 'O cupom de R$ 500',
    enunciado: 'Este SMS chegou no ponto de ônibus. Toque em tudo o que é sinal de golpe.',
    visual: 'mensagem',
    trechos: [
      {
        texto: 'MEGALAR: {nome}, voce foi selecionada!',
        suspeito: true,
        porque:
          'O nome que aparece no SMS pode ser imitado, e o seu nome circula em vazamentos de dados. Mensagem que sabe o seu nome não prova que é da loja.',
      },
      {
        texto: 'Cupom de R$500 em TVs para clientes especiais.',
        suspeito: true,
        porque:
          'Cupom gigante para "cliente especial" é isca. Se a loja quisesse dar um cupom, ele estaria na sua conta, dentro do aplicativo ou do site oficial.',
      },
      {
        texto: 'Expira HOJE.',
        suspeito: true,
        porque: 'Prazo curto é para você clicar antes de pensar e antes de perguntar para alguém.',
      },
      {
        texto: 'Resgate: curt.ink/MgL500',
        suspeito: true,
        porque:
          'Link encurtado esconde para onde você vai. Não clique em link de SMS: abra o aplicativo ou digite o endereço oficial da loja.',
      },
      { texto: 'Responda SAIR para nao receber' },
    ],
    minimo: 3,
    explicacao:
      'SMS com cupom milagroso, prazo curto e link encurtado é um dos golpes mais comuns da Black Friday. A mensagem pode trazer o seu nome e o nome da loja, e mesmo assim ser falsa. Não clique: abra o aplicativo oficial da loja, ou digite o endereço, e veja se o cupom existe na sua conta. Pode denunciar o número como spam e apagar a mensagem.',
  },
  {
    id: 'b3_pagina_cupom',
    tipo: 'achar',
    titulo: 'Resgate o seu cupom',
    enunciado:
      'O link do SMS abriu esta página. Toque em tudo o que mostra que você não deve digitar nada aqui.',
    visual: 'navegador',
    trechos: [
      {
        texto: 'megalar.promo-oficial.online/resgate-cupom',
        suspeito: true,
        porque:
          'O endereço de verdade termina em "promo-oficial.online". O "megalar" no começo é só um enfeite antes do ponto. O site oficial é www.megalar.com.br.',
      },
      { texto: 'PARABÉNS! Seu cupom de R$ 500 está reservado' },
      {
        texto: '⏳ Cupom reservado por 14:59',
        suspeito: true,
        porque: 'Mais um relógio. A página precisa que você digite rápido, antes de reparar no endereço.',
      },
      {
        texto: 'Entre com o seu e-mail e a senha da MegaLar',
        suspeito: true,
        porque:
          'A sua senha só se digita no site ou no aplicativo oficial. Numa página falsa, ela vai direto para quem montou a página, e a sua conta fica aberta para ele.',
      },
      {
        texto: 'Valide o cartão: número, validade e código de segurança',
        suspeito: true,
        porque:
          'Ninguém precisa do código de segurança do seu cartão para dar um cupom. Com número, validade e código, dá para fazer compra pela internet no seu nome.',
      },
      { texto: 'Nenhum valor será cobrado' },
      {
        texto: '🔒 Ambiente seguro e criptografado',
        suspeito: true,
        porque:
          'Conexão cifrada quer dizer que ninguém no meio do caminho lê o que você digita. Mas quem recebe, na ponta, é o próprio golpista.',
      },
    ],
    minimo: 3,
    explicacao:
      'Página de resgate de cupom que pede login e dados do cartão é uma página de roubo de dados. Não digite nada. Se já digitou a senha, troque no site oficial e ligue a verificação em duas etapas. Se digitou o cartão, bloqueie pelo aplicativo do banco na hora, peça um cartão novo e conteste qualquer compra que não reconhecer.',
  },
  {
    id: 'b4_anuncio_vendedor',
    tipo: 'achar',
    titulo: 'O anúncio do Vendedor Top 5 Estrelas',
    enunciado:
      'Este anúncio está dentro do marketplace de verdade, com o endereço certo. Mesmo assim, toque em tudo o que mostra que o vendedor é um risco.',
    visual: 'navegador',
    trechos: [
      { texto: 'www.vitrinao.com.br/anuncio/smart-tv-65-4k' },
      { texto: 'Smart TV 65 polegadas 4K, nova, lacrada' },
      {
        texto: 'R$ 1.890,00 à vista',
        suspeito: true,
        porque:
          'Nas lojas, essa TV custa perto de R$ 4.000. Preço muito abaixo dentro do marketplace também é sinal de alerta.',
      },
      {
        texto: 'Vendedor: Top 5 Estrelas · na plataforma há 6 dias',
        suspeito: true,
        porque: 'Conta criada há poucos dias, vendendo produto caro e barato demais, é o perfil típico de quem vai sumir.',
      },
      {
        texto: '⭐ 5,0 (3 avaliações)',
        suspeito: true,
        porque:
          'Cinco estrelas com três avaliações não diz quase nada. Olhe quantas vendas o vendedor tem, há quanto tempo está lá e o que dizem as avaliações.',
      },
      {
        texto: 'Descrição: me chama no aplicativo de conversa que faço desconto: 11 9••••-••••',
        suspeito: true,
        porque:
          'Telefone na descrição é convite para sair da plataforma. Fora dela, você perde a proteção do pagamento, o registro da conversa e a mediação se der errado.',
      },
      { texto: 'Compra garantida: pague pelo site e receba o produto ou o seu dinheiro de volta' },
      {
        texto: 'SÓ HOJE ATÉ 16H',
        suspeito: true,
        porque: 'Pressa de novo. Quem vende uma TV de verdade não precisa que você feche em meia hora.',
      },
    ],
    minimo: 3,
    explicacao:
      'Marketplace de verdade pode ter vendedor desonesto. Olhe o tempo de conta, o número de vendas e as avaliações, e compare o preço com as lojas. E nunca feche a compra fora da plataforma: o "desconto para pagar por fora" serve para tirar do meio do caminho a proteção que o marketplace dá a quem compra.',
  },
];

export const notas: Nota[] = [
  {
    id: 'b1_anuncio_patrocinado',
    titulo: 'Anúncio patrocinado e site clonado',
    texto:
      'Anúncio patrocinado é só um anúncio que alguém pagou para aparecer. Ele pode levar para um site clonado: mesma logo, mesmas cores, mesmas fotos da loja de verdade, com um endereço parecido.',
    exemplo: 'www.megalar-ofertas.shop, megalar.promo-oficial.online, rnegalar.com.br (com "rn" no lugar do "m"). O oficial é www.megalar.com.br.',
    defesa:
      'Não compre pelo anúncio. Feche e digite você mesma o endereço oficial da loja. Confira o endereço letra por letra, até o fim. Se o anúncio for golpe, denuncie o anúncio na rede social e a página no navegador.',
  },
  {
    id: 'b1_cadeado',
    titulo: 'O cadeado não prova que a loja é honesta',
    texto:
      'O cadeado na barra do navegador quer dizer que a conexão é cifrada: ninguém no meio do caminho lê o que você digita. Não diz nada sobre quem está do outro lado. Site de golpe também tem cadeado. E selo de "Site 100% seguro" na página é só uma imagem.',
    exemplo: 'A página da TV de R$ 899 tinha cadeado, selo de segurança e avaliações de clientes. Não tinha a MegaLar.',
    defesa:
      'Use o cadeado como o mínimo, não como garantia. O que diz quem é a loja é o endereço oficial, o CNPJ e a razão social, e a reputação dela.',
  },
  {
    id: 'b1_pagamento_seguro',
    titulo: 'Pix para desconhecido e o pagamento mais seguro',
    texto:
      'Pix cai em segundos e, depois de pago, é difícil de reaver. Na tela de confirmação, o aplicativo do banco mostra quem vai receber o dinheiro, e é esse nome que importa, não a logo do site.',
    exemplo: 'Site "MegaLar", Pix para "RM SOLUÇÕES DIGITAIS". Pagamento "somente via Pix" numa Black Friday.',
    defesa:
      'Antes de confirmar qualquer Pix, leia o nome do recebedor: tem que ser a loja. Desconfie de loja que só aceita Pix ou boleto. Em compra pela internet, prefira cartão de crédito, de preferência o cartão virtual, que permite contestar a compra com o banco. Se cair, avise o banco na hora pelo canal oficial e peça a devolução do Pix.',
  },
  {
    id: 'b1_contador',
    titulo: 'Preço impossível e contador regressivo',
    texto:
      'O preço muito abaixo do mercado chama, e o contador regressivo empurra. Juntos, eles fazem você pagar antes de conferir. Em muitos sites falsos, o contador simplesmente recomeça quando chega a zero.',
    exemplo: 'Meia-noite: "Termina em 00:00:00". Meia-noite e um segundo: "Termina em 00:20:00. Restam 3 unidades."',
    defesa:
      'Compare o preço com o de lojas conhecidas. Se a oferta só vale se você não tiver tempo de pensar, ela não vale. Conferir custa minutos; pagar com pressa pode custar a economia inteira.',
  },
  {
    id: 'b2_reputacao_cnpj',
    titulo: 'CNPJ, razão social e reputação da loja',
    texto:
      'Loja de verdade mostra no rodapé o CNPJ, a razão social e o endereço. Com o CNPJ, dá para ver numa consulta pública desde quando a empresa existe e com o que ela trabalha. E sites de reclamação de consumidores mostram o que acontece com quem já comprou.',
    exemplo: 'OutletTech Brasil: empresa aberta há três semanas como salão de beleza, 47 reclamações de "paguei e não recebi" desde quinta.',
    defesa:
      'Antes de comprar numa loja que você não conhece, confira o CNPJ e a razão social do rodapé, pesquise a reputação e veja se o nome bate com quem vai receber o pagamento. Rodapé sem CNPJ e sem endereço é sinal para não comprar.',
  },
  {
    id: 'b2_boleto_beneficiario',
    titulo: 'Boleto: quem recebe é o beneficiário',
    texto:
      'O boleto pode ter logo da loja, código de barras que funciona e banco de verdade. Quem fica com o dinheiro é o beneficiário escrito nele, que aparece na tela de confirmação do aplicativo do banco.',
    exemplo: 'Loja "OutletTech Brasil". Beneficiário "J. C. SANTOS PAGAMENTOS", com CPF de pessoa física.',
    defesa:
      'Antes de pagar, leia na tela do aplicativo do banco o nome e o CPF ou CNPJ do beneficiário. Tem que ser a loja, com o mesmo CNPJ do site. Se for outro nome, não pague.',
  },
  {
    id: 'b2_boleto_nao_volta',
    titulo: 'Boleto não tem botão de desfazer',
    texto:
      'Boleto parece seguro porque não envolve cartão. Mas, pago para uma loja falsa, o dinheiro vai direto para quem está no boleto, e não existe contestação como a do cartão de crédito.',
    exemplo: '"Boleto com 15% de desconto, válido por 60 minutos." Depois dos 60 minutos, a página gera outro boleto com outro prazo de 60 minutos.',
    defesa:
      'Para loja que você não conhece, evite boleto e Pix. Desconto que vence em uma hora é pressão. Se já pagou e desconfia, avise o banco na hora, guarde o comprovante, faça boletim de ocorrência e denuncie a loja.',
  },
  {
    id: 'b3_sms_cupom',
    titulo: 'SMS com cupom e link encurtado',
    texto:
      'Na Black Friday, chegam SMS com cupons enormes, "para clientes selecionados", com prazo curto e link encurtado. O remetente pode aparecer com o nome da loja, e a mensagem pode até trazer o seu nome.',
    exemplo: '"MEGALAR: voce foi selecionada! Cupom de R$500 em TVs. Expira HOJE. Resgate: curt.ink/MgL500"',
    defesa:
      'Não clique em link de SMS. Abra você mesma o aplicativo da loja, ou digite o endereço oficial, e veja se o cupom aparece na sua conta. Denuncie o número como spam e apague.',
  },
  {
    id: 'b3_dados_do_cartao',
    titulo: 'Página que pede login e dados do cartão',
    texto:
      'O link do cupom leva a uma página idêntica à da loja que pede e-mail e senha e, depois, número do cartão, validade e código de segurança "para validar". Quem preenche entrega a conta e o cartão.',
    exemplo: 'Primeiro, uma compra pequena de teste, de R$ 12,90. Se passar, vêm as grandes.',
    defesa:
      'Nunca digite senha ou dados do cartão numa página aberta por link de mensagem. Se digitou: bloqueie o cartão na hora pelo aplicativo do banco, peça um cartão novo, conteste as compras que não reconhecer, troque a senha da loja no site oficial e ligue a verificação em duas etapas.',
  },
  {
    id: 'b3_entrar_pelo_oficial',
    titulo: 'Entre sempre pelo caminho oficial',
    texto:
      'A loja que quer dar um cupom pode colocá-lo direto na sua conta. Ela não precisa de SMS com link encurtado nem de pedir o seu cartão de novo.',
    exemplo: 'No aplicativo oficial da MegaLar: um cupom de frete grátis e um de 5% em pequenos eletrodomésticos. Nenhum de R$ 500.',
    defesa:
      'Use o aplicativo baixado da loja oficial de aplicativos do celular, ou digite o endereço do site. Para o banco, a mesma coisa: abra o aplicativo pelo ícone, nunca por link de mensagem.',
  },
  {
    id: 'b4_perfil_vendedor',
    titulo: 'Vendedor de marketplace: confira o perfil',
    texto:
      'O marketplace pode ser de verdade e o vendedor, não. Conta recém-criada, poucas avaliações, preço muito abaixo das lojas e pressa no anúncio são sinais de risco.',
    exemplo: '"Vendedor Top 5 Estrelas": na plataforma há 6 dias, 3 avaliações, TV de 65 por R$ 1.890, "só hoje até 16h".',
    defesa:
      'Veja há quanto tempo o vendedor está na plataforma, quantas vendas tem e o que dizem as avaliações. Compare o preço. Na dúvida, compre de vendedor com histórico ou da loja oficial dentro do marketplace.',
  },
  {
    id: 'b4_fora_da_plataforma',
    titulo: 'Nunca feche a compra fora da plataforma',
    texto:
      'Dentro do marketplace, a conversa e o pagamento ficam registrados e, em geral, o dinheiro fica com a plataforma até você confirmar que recebeu. Se der errado, existe reclamação e mediação. Fora dela, sobra só um nome numa chave Pix.',
    exemplo: '"Pelo site a taxa come meu lucro. Me chama no aplicativo de conversa que eu faço por 1.590. Só um sinal de 300 no Pix."',
    defesa:
      'Converse e pague só pelo próprio marketplace. Recuse desconto para pagar por fora e denuncie o vendedor para a plataforma. Se já pagou fora, avise o banco na hora, peça a devolução do Pix, guarde os prints e faça boletim de ocorrência.',
  },
  {
    id: 'b4_conferir_antes_de_mandar',
    titulo: 'Antes de encaminhar uma oferta',
    texto:
      'Golpe de oferta se espalha por quem quer ajudar: o primo dos cupons, o grupo de promoção, a família. Cada encaminhamento leva o golpe para mais gente que confia em você.',
    exemplo: 'O Kevin mandou a TV de R$ 899 para 800 seguidores antes de mandar para a família.',
    defesa:
      'Antes de encaminhar, confira o endereço letra por letra, compare o preço com lojas conhecidas e veja quem recebe o pagamento. Se não conseguir conferir, não encaminhe. Se já encaminhou um golpe, apague e avise.',
  },
];
