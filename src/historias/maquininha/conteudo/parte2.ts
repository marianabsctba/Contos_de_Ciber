import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'm5_boleto_queijo',
    tipo: 'achar',
    visual: 'boleto',
    titulo: 'O boleto do queijo',
    enunciado:
      'Este é o boleto que chegou por e-mail "do Seu Osvaldo". Ao lado, a pasta azul com as notas fiscais do queijo dos últimos meses. Toque em tudo o que não bate.',
    trechos: [
      { texto: 'Banco: 999 BANCO DIGITAL S.A.', suspeito: true, porque: 'O Seu Osvaldo recebe pelo mesmo banco há quinze anos. Boleto de fornecedor antigo que de repente vem de outro banco pede confirmação antes do pagamento.' },
      { texto: 'Linha digitável: 99990.12345 67890.123456 78901.234567 8 00000138000' },
      { texto: 'Beneficiário: OSV DISTRIBUIDORA DIGITAL LTDA', suspeito: true, porque: 'O nome do beneficiário é quem recebe o dinheiro. Nas notas fiscais e nos boletos antigos é o laticínio do Seu Osvaldo, não uma "distribuidora digital".' },
      { texto: 'CNPJ do beneficiário: 12.345.678/0001-90', suspeito: true, porque: 'O CNPJ não é o mesmo que está na nota fiscal do queijo. CNPJ diferente quer dizer outra empresa recebendo.' },
      { texto: 'Referência: muçarela em peça, 35 kg' },
      { texto: 'Vencimento: 20/11/2026' },
      { texto: 'Valor do documento: R$ 1.380,00', suspeito: true, porque: 'Todo mês o boleto é de R$ 1.240,00. "Reajuste" que ninguém avisou por telefone é mais um motivo para confirmar com o fornecedor.' },
      { texto: 'Instruções: dados bancários atualizados. Desconsiderar boletos anteriores.', suspeito: true, porque: 'Pedir para ignorar os boletos antigos é a forma de fazer você pagar o falso no lugar do verdadeiro. Mudança de dados bancários se confirma com o fornecedor, por um telefone que você já tem.' },
    ],
    minimo: 3,
    explicacao:
      'Boleto adulterado parece de verdade: logotipo, vaquinha, código de barras que funciona. O que denuncia é quem recebe. Antes de pagar, olhe na tela de confirmação do aplicativo do banco o nome do beneficiário, o CNPJ e o valor, e compare com a nota fiscal e com os boletos anteriores. Se algo mudou, ligue para o fornecedor por um telefone que você já conhecia, nunca pelo número que veio no próprio e-mail.',
  },
  {
    id: 'm6_pedido_grande',
    tipo: 'achar',
    visual: 'mensagem',
    titulo: 'O pedido do "Rodrigo do RH"',
    enunciado: 'Este é o resumo da encomenda que chegou por mensagem. Toque em tudo o que é sinal de risco.',
    trechos: [
      { texto: 'Boa tarde! Rodrigo do RH 😊 Segue o pedido da confraternização:' },
      { texto: '200 pastéis (100 carne, 100 queijo) para hoje às 19h' },
      { texto: 'Pagamento: cartão corporativo, a senhora digita aí, sem o cartão presente', suspeito: true, porque: 'Venda com cartão digitado, sem o cartão e sem a senha do dono, é a que tem mais risco de contestação. E o risco fica com quem vendeu.' },
      { texto: 'Titular do cartão: Marlene S. (dona da empresa)', suspeito: true, porque: 'Quem compra não é quem aparece no cartão. Se a titular não reconhecer a compra, ela contesta, e o dinheiro volta para ela.' },
      { texto: 'Se não passar, tenho mais um cartão aqui', suspeito: true, porque: 'Ter vários cartões à mão "se não passar" é comum em quem está testando cartões que não são seus.' },
      { texto: 'Preciso confirmar em 30 minutos, senão o diretor fecha com outro lugar', suspeito: true, porque: 'Pressa para você não pensar, não conferir e não perguntar.' },
      { texto: 'O motoboy da empresa retira, não precisa de endereço', suspeito: true, porque: 'Sem endereço, sem CNPJ, sem nota fiscal: não sobra nenhum dado que leve até quem pediu.' },
      { texto: 'Se der valor a mais, a senhora me devolve a diferença no Pix', suspeito: true, porque: 'Pedir "devolução" por Pix de uma compra no cartão é transformar o cartão de outra pessoa em dinheiro na mão do golpista, com você no meio.' },
      { texto: 'Obrigado, a equipe vai amar! 🥟🎉' },
    ],
    minimo: 3,
    explicacao:
      'Encomenda grande de quem você nunca viu, com pressa, cartão digitado no nome de outra pessoa e pedido de "devolver diferença" por Pix: é o retrato da venda com alto risco de contestação. Pergunte CNPJ, endereço e nome de quem paga. Para pedido grande de desconhecido, o mais seguro é pagamento antecipado (ou um sinal) por Pix na conta da loja, conferido no extrato antes de comprar o primeiro quilo de carne.',
  },
  {
    id: 'm6_venda_nao_presencial',
    tipo: 'quiz',
    titulo: 'Aprovado é pago?',
    enunciado:
      'Você digita o cartão que o Rodrigo ditou, a venda é aprovada e os pastéis saem. Semanas depois, a verdadeira titular diz que não fez essa compra. O que costuma acontecer?',
    opcoes: [
      'Nada: a venda foi aprovada, então o dinheiro é da pastelaria',
      'O banco da titular cobre o prejuízo e a pastelaria fica com o dinheiro',
      'A compra é contestada, o valor volta para a titular e, como a venda foi sem o cartão presente, quem costuma arcar é a pastelaria',
      'O Rodrigo é obrigado a pagar, porque deu o nome dele',
    ],
    certa: 2,
    explicacao:
      'Aprovação só diz que os dados do cartão eram válidos e havia limite naquela hora. Quando a titular contesta uma compra que não fez, o emissor devolve o valor para ela e a empresa da maquininha desconta de quem vendeu. Na venda digitada, sem o cartão e sem a senha, quem vende tem pouca defesa. Por isso, para encomenda grande de desconhecido, peça pagamento antecipado por Pix na conta da loja e só comece quando o dinheiro aparecer no extrato.',
  },
  {
    id: 'm7_senha_delivery',
    tipo: 'senha',
    titulo: 'Adeus, Pastel2019',
    enunciado:
      'A senha antiga era a mesma do e-mail, do banco, do atacado e do aplicativo. Crie a senha nova da conta de lojista: longa, só desta conta, impossível de adivinhar olhando a fachada da loja. Dica do Jefferson: quatro ou cinco palavras que não combinam entre si.',
    minimoBits: 60,
    explicacao:
      'Senha forte é longa e imprevisível: uma frase com várias palavras sem relação ("tamanco girassol trovão chapa") vale mais que "Pastel@2019". Nome da loja, ano de inauguração e data de aniversário são as primeiras coisas que alguém tenta. E o mais importante: uma senha diferente para cada conta. Quando um site vaza, quem pegou a lista testa a mesma senha em outros lugares. Guarde as senhas num gerenciador e ligue a verificação em duas etapas.',
  },
  {
    id: 'm7_acessos_delivery',
    tipo: 'formulario',
    titulo: 'Arrumando as chaves da casa',
    enunciado: 'Configure a conta de lojista do aplicativo de delivery depois da invasão.',
    campos: [
      {
        rotulo: 'Senha da conta',
        opcoes: ['A mesma de sempre, que todo mundo já sabe', 'Uma frase longa, só desta conta, guardada no gerenciador de senhas', 'A data de inauguração da loja'],
        certa: 1,
        porque: 'Senha única e longa. Se outro site vazar, esta conta continua fechada.',
      },
      {
        rotulo: 'Verificação em duas etapas',
        opcoes: ['Desligada, porque dá trabalho', 'Ligada, com o código chegando no celular da dona', 'Ligada, e o código passado para quem pedir no chat'],
        certa: 1,
        porque: 'Com as duas etapas, a senha sozinha não basta. E o código não se passa para ninguém, nem para quem diz ser do suporte.',
      },
      {
        rotulo: 'Acesso do Jefferson',
        opcoes: ['O login e a senha da dona', 'Um usuário próprio, só com permissão para ver e marcar pedidos', 'Uma cópia da senha num papel do lado da chapa'],
        certa: 1,
        porque: 'Cada pessoa com o próprio acesso e só com o que precisa. Assim ninguém mexe em conta bancária sem querer, e dá para saber quem fez o quê.',
      },
      {
        rotulo: 'Conta bancária de repasse',
        opcoes: ['Conferir com frequência se é a da pastelaria e ficar atenta aos avisos de alteração', 'Nunca olhar, o aplicativo cuida disso', 'Deixar qualquer funcionário alterar'],
        certa: 0,
        porque: 'A primeira coisa que um invasor troca é para onde vai o dinheiro. Aviso de "dados bancários alterados" que você não fez é emergência.',
      },
      {
        rotulo: 'Quando alguém sai da equipe',
        opcoes: ['Remover o usuário da pessoa no mesmo dia e trocar qualquer senha que ela conhecia', 'Deixar o acesso, vai que ela volta', 'Trocar só no fim do ano'],
        certa: 0,
        porque: 'Acesso esquecido é porta aberta. Com usuário individual, basta apagar o dela, sem mexer no de mais ninguém.',
      },
    ],
    minimo: 4,
    explicacao:
      'Conta de loja em aplicativo é como a chave da porta: senha forte e única, verificação em duas etapas, cada funcionário com o próprio acesso e só com o que precisa, atenção aos avisos de alteração de dados bancários e remoção do acesso de quem sai. Em caso de invasão, use só o canal oficial do aplicativo, digitado no navegador ou dentro do próprio aplicativo.',
  },
  {
    id: 'm8_taxa_feira',
    tipo: 'achar',
    visual: 'mensagem',
    titulo: 'A taxa do concurso',
    enunciado: 'Esta mensagem chegou de um número desconhecido na manhã da Feira da Cidade. A inscrição já foi paga na tenda, com recibo. Toque nos sinais de golpe.',
    trechos: [
      { texto: 'Olá, expositor(a)! Aqui é a Comissão Organizadora da Feira da Cidade 🏆' },
      { texto: 'Identificamos uma pendência na sua taxa de inscrição do concurso.', suspeito: true, porque: 'A inscrição foi paga na tenda da prefeitura, com recibo. "Pendência" inventada é o gancho para cobrar de novo.' },
      { texto: 'Regularize até as 10h ou seu pastel será desclassificado.', suspeito: true, porque: 'Prazo curto e ameaça para você pagar sem conferir.' },
      { texto: 'Valor: R$ 150,00 no Pix. Chave: celular em nome de pessoa física', suspeito: true, porque: 'Organização de evento recebe em conta da própria organização, e cobra no lugar oficial. Pix para pessoa qualquer é sinal claro.' },
      { texto: 'Não precisa vir até a tenda, está muito cheia.', suspeito: true, porque: 'Quem tenta impedir você de confirmar no lugar de verdade sabe que a confirmação derruba o golpe.' },
      { texto: 'Boa sorte no concurso! 🥟' },
    ],
    minimo: 3,
    explicacao:
      'É o mesmo golpe de sempre com outra roupa: uma cobrança que não existe, pressa, ameaça e uma chave Pix de uma pessoa qualquer. Confirme no canal de verdade, aqui a tenda da organização a trinta metros, com o recibo na mão. E antes de qualquer Pix, olhe o nome do recebedor na tela.',
  },
];

export const notas: Nota[] = [
  {
    id: 'm5_boleto_conferir',
    titulo: 'Boleto se confere campo por campo',
    texto: 'Boleto adulterado pode ter logotipo, desenho e código de barras que funciona. O que muda é quem recebe o dinheiro.',
    exemplo: 'O boleto "do Seu Osvaldo" vinha de outro banco, com outro beneficiário, outro CNPJ, valor maior e o pedido de desconsiderar os anteriores.',
    defesa: 'Na tela de confirmação do banco, antes de pagar, confira nome do beneficiário, CNPJ e valor. Compare com a nota fiscal e com os boletos antigos.',
  },
  {
    id: 'm5_telefone_conhecido',
    titulo: 'Confirme pelo telefone que você já tinha',
    texto: 'O número que vem dentro do e-mail suspeito confirma o próprio e-mail. Quem atende ali é quem mandou.',
    exemplo: 'O "financeiro" do e-mail disse que estava tudo certo. O fixo do laticínio, o de quinze anos, disse que o Seu Osvaldo nunca mudou de banco.',
    defesa: 'Mudança de dados bancários de fornecedor só vale depois de confirmada por um telefone ou contato que você já conhecia, ou pessoalmente.',
  },
  {
    id: 'm5_boleto_pago',
    titulo: 'Pagou um boleto falso? Aja rápido',
    texto: 'Boleto pago não volta com um clique, mas avisar rápido aumenta a chance de alguma coisa ser feita e ajuda a pegar quem fez.',
    exemplo: 'Ela ligou para o banco pelo número do aplicativo, registrou o código de barras e o beneficiário, e fez o boletim de ocorrência com o e-mail e o comprovante.',
    defesa: 'Avise o seu banco pelo canal oficial na hora, faça o boletim de ocorrência e avise o fornecedor de verdade, que pode estar com o e-mail invadido.',
  },
  {
    id: 'm6_venda_nao_presencial',
    titulo: 'Cartão digitado: aprovado não é garantido',
    texto: 'Na venda sem o cartão presente e sem a senha, se o titular disser que não comprou, o valor volta para ele e quem vendeu costuma arcar com a perda.',
    exemplo: 'Duzentos pastéis no cartão da "Marlene", digitado por telefone. Vinte e três dias depois, a contestação levou os R$ 1.600.',
    defesa: 'Desconfie de encomenda grande de desconhecido, com pressa, cartão de terceiro ou vários cartões. Peça CNPJ, endereço e nome de quem paga.',
  },
  {
    id: 'm6_pagamento_antecipado',
    titulo: 'Encomenda grande: dinheiro antes do óleo',
    texto: 'Para pedido grande de quem você não conhece, pagamento antecipado ou um sinal na conta da loja reduz muito o risco.',
    exemplo: 'Quando ela pediu Pix antecipado conferido no extrato, o "Rodrigo do RH" sumiu. A irmã Socorro mandou o sinal na hora.',
    defesa: 'Só comece a produzir quando o pagamento aparecer no extrato da sua conta, com o nome de quem pagou. Comprovante na tela não vale.',
  },
  {
    id: 'm6_contestacao_lojista',
    titulo: 'Chegou contestação? Registre tudo',
    texto: 'A contestação de compra protege o titular do cartão, que também é vítima. Para a loja, o que resta é se defender com o que tiver.',
    exemplo: 'Ela juntou as mensagens, o horário da retirada e fez o boletim. A chance de reverter era pequena, mas o registro ajuda a investigação.',
    defesa: 'Responda pelo canal oficial da empresa da maquininha, envie as provas que tiver e faça o boletim de ocorrência.',
  },
  {
    id: 'm7_falso_suporte',
    titulo: 'Suporte que pede código não é suporte',
    texto: 'Depois de uma reclamação pública, aparecem perfis "oficiais" oferecendo ajuda no privado. Eles querem o código que chega por SMS.',
    exemplo: 'O "Suporte Delivery Oficial ✔️" tinha o selo escrito no nome e pediu o código. O código era do e-mail dela.',
    defesa: 'Código de verificação não se passa para ninguém. Procure ajuda só pelo site ou aplicativo oficial, entrando por conta própria.',
  },
  {
    id: 'm7_senha_unica',
    titulo: 'Uma senha para cada porta',
    texto: 'Quando um site vaza, a lista de e-mails e senhas é testada em outros serviços. Quem repete a senha perde tudo de uma vez.',
    exemplo: '"Pastel2019" era a senha do e-mail, do banco, do atacado e do aplicativo de delivery.',
    defesa: 'Senha longa e única em cada conta, guardada num gerenciador de senhas. Comece trocando a do e-mail, que é a chave das outras.',
  },
  {
    id: 'm7_duas_etapas',
    titulo: 'Verificação em duas etapas',
    texto: 'Além da senha, o serviço pede um código que chega no seu celular quando alguém entra de um aparelho novo.',
    exemplo: 'Com as duas etapas ligadas, a senha vazada sozinha já não abre a conta da pastelaria.',
    defesa: 'Ligue nas contas que importam: e-mail, banco, aplicativo de delivery. E nunca passe o código para ninguém.',
  },
  {
    id: 'm7_acesso_individual',
    titulo: 'Cada um com a sua chave',
    texto: 'Senha dividida é senha sem dono: ninguém sabe quem fez o quê, e para tirar o acesso de alguém é preciso trocar tudo.',
    exemplo: 'O Jefferson usava a senha da dona no celular dele e até no e-mail dele. Pediu um usuário próprio em março.',
    defesa: 'Crie um usuário para cada funcionário, só com o que ele precisa. Quando alguém sai, remova o acesso no mesmo dia.',
  },
  {
    id: 'm8_registrar_tudo',
    titulo: 'Bloquear, contestar, registrar',
    texto: 'Depois de um golpe com cartão, a rapidez conta: bloquear o cartão, contestar a compra com o emissor e fazer o boletim de ocorrência.',
    exemplo: 'O desfecho do dinheiro da Dona Fátima dependeu do que foi feito naquela sexta à noite.',
    defesa: 'Bloqueie pelo aplicativo ou pelo telefone do verso do cartão, conteste logo e guarde tudo: horário, valor, prints e o número do boletim.',
  },
  {
    id: 'm8_taxa_falsa',
    titulo: 'Cobrança que ninguém fez',
    texto: 'Golpista aproveita evento, concurso e inscrição para inventar "pendência" e cobrar por Pix com pressa.',
    exemplo: 'A "Comissão Organizadora" pediu R$ 150 até as 10h, para uma chave de pessoa física, e disse para não ir até a tenda.',
    defesa: 'Confirme no lugar ou canal oficial, com o recibo na mão. Antes de qualquer Pix, confira o nome do recebedor.',
  },
  {
    id: 'm8_rede_de_alerta',
    titulo: 'A rua avisa a rua',
    texto: 'O mesmo golpe passa de loja em loja. Quem avisa rápido protege o vizinho, e os boletins juntos ajudam a investigação.',
    exemplo: 'O "Rodrigo do RH" ligou para catorze lojas. A padaria não caiu porque desconfiou a tempo.',
    defesa: 'Grupo de alerta sem vergonha de contar, cartilha no balcão e boletim de ocorrência para todo golpe, mesmo pequeno.',
  },
];
