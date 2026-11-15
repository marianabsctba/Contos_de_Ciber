import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'm1_maquininha_mae',
    tipo: 'achar',
    titulo: 'A maquininha do motoboy',
    enunciado:
      'A Dona Fátima desenhou num guardanapo a tela da maquininha do motoboy, do jeito que lembra. Toque em tudo o que devia ter feito ela parar antes de digitar a senha.',
    visual: 'maquininha',
    trechos: [
      { texto: 'CRÉDITO À VISTA' },
      {
        texto: 'VALOR: R$ 5.99▓,▓▓',
        suspeito: true,
        porque:
          'O visor rachado passa bem em cima do valor. Se você não consegue ler o valor inteiro, com vírgula e centavos, não digite a senha. Peça outra forma de pagamento ou não pague.',
      },
      {
        texto: 'APROXIMAÇÃO INDISPONÍVEL',
        suspeito: true,
        porque:
          'Sozinho isso pode acontecer, mas junto com o visor escondido é um jeito de fazer você inserir o cartão e digitar a senha sem conseguir ver o valor. Na dúvida, pague de outro jeito.',
      },
      { texto: 'INSIRA O CARTÃO' },
      { texto: 'DIGITE A SENHA' },
      {
        texto: 'ERRO: TENTE NOVAMENTE',
        suspeito: true,
        porque:
          'O "não passou, deixa eu tentar de novo" é a desculpa para o cartão sair da sua mão. O cartão não deve sair da sua mão, e o que volta tem que ser conferido: nome, final do número, tudo.',
      },
      {
        texto: 'SEM BOBINA: VIA NÃO IMPRESSA',
        suspeito: true,
        porque:
          'Sem comprovante impresso, você sai sem nenhuma prova do valor cobrado. Peça o comprovante ou confira o valor na notificação do banco antes de o entregador ir embora.',
      },
      { texto: 'RETIRE O CARTÃO' },
    ],
    minimo: 3,
    explicacao:
      'No golpe da maquininha com visor danificado, a vítima digita a senha sem ver o valor e, muitas vezes, recebe de volta um cartão que não é o dela. A defesa: confira o valor no visor antes de digitar a senha, não pague em maquininha com visor rachado ou escondido, não deixe o cartão sair da sua mão e confira se o cartão devolvido é o seu. Se acontecer, bloqueie o cartão na hora pelo aplicativo do banco e conteste a compra.',
  },
  {
    id: 'm2_comprovante_bonito',
    tipo: 'achar',
    titulo: 'O comprovante bonito',
    enunciado:
      'O cliente simpático mostrou este comprovante de Pix na tela do celular dele. Toque em tudo o que mostra que o dinheiro não chegou na conta da loja.',
    visual: 'comprovante',
    trechos: [
      { texto: 'Comprovante de Pix' },
      {
        texto: 'Situação: AGENDADO',
        suspeito: true,
        porque:
          'Pix agendado não é Pix pago. O agendamento pode ser cancelado a qualquer momento antes da data, e até lá nenhum centavo sai da conta de quem "pagou".',
      },
      {
        texto: 'Data do pagamento: 17/12',
        suspeito: true,
        porque: 'A data é do mês que vem. Um pagamento de hoje tem data e hora de hoje, e cai em segundos.',
      },
      {
        texto: 'Valor: R$ 300,00',
        suspeito: true,
        porque:
          'Pagar "a mais por engano" e pedir o troco em dinheiro é um sinal forte. Se o Pix não existe, você perde a mercadoria e ainda entrega dinheiro vivo.',
      },
      { texto: 'Pagador: R. ALMEIDA' },
      {
        texto: 'Recebedor: MARCOS V. P. SOUZA',
        suspeito: true,
        porque: 'O recebedor não é a loja. Mesmo que fosse pago, esse dinheiro iria para outra pessoa.',
      },
      { texto: 'ID da transação: E0921...7Q2' },
    ],
    minimo: 3,
    explicacao:
      'Comprovante na tela do cliente não prova nada: imagem se edita, agendamento se cancela e o recebedor pode ser outra pessoa. O que vale é o dinheiro aparecer no extrato da conta da loja, com valor e pagador. Só entregue a mercadoria depois de conferir no seu próprio aplicativo do banco.',
  },
  {
    id: 'm3_qrcode_defesa',
    tipo: 'quiz',
    titulo: 'Contra o QR code por cima',
    enunciado:
      'Alguém colou um QR code falso por cima do QR code impresso do balcão. Qual medida protege melhor as próximas vendas?',
    opcoes: [
      'Plastificar o QR code impresso e colar com fita dupla face',
      'Gerar um QR code na hora para cada venda, pela maquininha ou pelo app do banco, e o cliente conferir o nome do recebedor antes de confirmar',
      'Trocar o QR code impresso por um maior e mais colorido',
      'Pedir para os clientes tirarem foto do QR code antes de pagar',
    ],
    certa: 1,
    explicacao:
      'QR code impresso é um alvo parado: qualquer adesivo cobre. O QR code dinâmico, gerado na hora para aquela venda e com o valor certo, aparece numa tela que fica com você. E, em qualquer Pix, o cliente deve conferir o nome de quem vai receber antes de confirmar. Depois, confira se o dinheiro caiu no seu extrato.',
  },
  {
    id: 'm4_email_atualizacao',
    tipo: 'achar',
    titulo: 'Atualização obrigatória',
    enunciado:
      'Chegou este e-mail na caixa de entrada da loja, num dia de chuva e movimento zero. Toque em tudo o que mostra que não é da empresa da maquininha.',
    visual: 'email',
    trechos: [
      {
        texto: 'De: Suporte Técnico <atendimento@suporte-maquininhas-br.online>',
        suspeito: true,
        porque:
          'O endereço não é do domínio da empresa da maquininha. Nome bonito antes do endereço qualquer um escreve; o que importa é o que vem depois do arroba.',
      },
      {
        texto: 'Assunto: URGENTE: SUA MAQUININHA SERÁ BLOQUEADA EM 24H',
        suspeito: true,
        porque: 'Ameaça com prazo curto é para você agir sem pensar e sem ligar para ninguém.',
      },
      { texto: 'Prezado cliente,' },
      { texto: 'Identificamos que o sistema do seu terminal está desatualizado.' },
      {
        texto: 'Para continuar recebendo, instale o aplicativo de suporte pelo link abaixo.',
        suspeito: true,
        porque:
          'Empresa séria não pede para instalar aplicativo por link de e-mail. Aplicativo de suporte que dá acesso ao seu celular entrega o controle do aparelho para quem está do outro lado.',
      },
      {
        texto: 'Um técnico vai ligar para confirmar o código que chegar por SMS.',
        suspeito: true,
        porque:
          'Código de SMS é seu e não se passa para ninguém, nem para quem diz ser da empresa. Quem pede o código está tentando entrar na sua conta.',
      },
      { texto: 'Atenciosamente, Equipe de Atendimento' },
    ],
    minimo: 3,
    explicacao:
      'O e-mail de "atualização obrigatória" prepara a ligação do falso técnico. Desconfie de remetente fora do domínio da empresa, de ameaça de bloqueio com prazo, de link para instalar aplicativo e de qualquer pedido de código. Não clique: procure o telefone oficial no site, no contrato ou na etiqueta da própria maquininha e pergunte lá.',
  },
];

export const notas: Nota[] = [
  {
    id: 'm1_visor_e_cartao',
    titulo: 'Maquininha de visor danificado e troca de cartão',
    texto:
      'Um entregador cobra uma "taxa" pequena numa maquininha com o visor rachado ou coberto. A vítima digita a senha sem ver o valor real e, no "não passou, tenta de novo", o cartão sai da mão dela e volta outro.',
    exemplo: '"Entrega de flores, só tem uma taxa de R$ 5,99. Ih, não passou, me dá o cartão que eu tento de novo."',
    defesa:
      'Confira o valor no visor antes de digitar a senha. Não pague em maquininha com visor danificado ou escondido. Não deixe o cartão sair da sua mão e confira, antes de guardar, se o cartão devolvido é o seu. Desconfie de entrega surpresa que cobra taxa na porta.',
  },
  {
    id: 'm1_bloquear_contestar',
    titulo: 'Bloquear o cartão e contestar a compra',
    texto:
      'Depois de um golpe com cartão, o tempo conta. Com o cartão ativo, o golpista pode tentar outras compras. E quanto antes o banco souber, melhor para a análise.',
    exemplo: 'A Dona Fátima bloqueou o cartão pelo cadeadinho do aplicativo e, na mesma noite, contestou a compra de R$ 5.990,00 com a central do banco.',
    defesa:
      'Bloqueie o cartão na hora pelo aplicativo do banco ou pelo telefone oficial. Atenção: se houve troca de cartão, o telefone atrás do cartão que ficou com você é de outro banco. Use o aplicativo, a fatura ou o site oficial. Depois conteste a compra com o emissor do cartão e anote o número de protocolo.',
  },
  {
    id: 'm1_bo_registro',
    titulo: 'Boletim de ocorrência e registro de tudo',
    texto:
      'O boletim de ocorrência registra o que aconteceu, quando e como. Ele ajuda na análise do banco e mostra para a polícia o padrão quando há várias vítimas na mesma região.',
    exemplo: 'Print da mensagem do banco, foto do cartão trocado, horário, descrição do entregador e da moto, número de protocolo da contestação.',
    defesa:
      'Faça o boletim de ocorrência, pela delegacia online do seu estado ou presencialmente. Guarde prints, comprovantes, protocolos e qualquer objeto deixado pelo golpista. Desconfie de "central de cancelamento" achada em anúncio de busca: banco nunca pede senha.',
  },
  {
    id: 'm2_comprovante_agendado',
    titulo: 'Comprovante falso e Pix agendado',
    texto:
      'O cliente mostra na tela um comprovante bonito de Pix. Às vezes é imagem editada, às vezes é um Pix agendado para outra data, às vezes o recebedor nem é a loja. Às vezes ainda vem o pedido de troco porque "pagou a mais".',
    exemplo: '"Pronto, Pix feito! Ih, mandei trezentos em vez de cento e sessenta e oito, me volta a diferença em dinheiro?"',
    defesa:
      'Pix agendado não é Pix pago. Comprovante na tela do cliente não prova nada. Só entregue a mercadoria, e só devolva troco, depois que o valor aparecer no extrato da sua conta.',
  },
  {
    id: 'm2_extrato_vale',
    titulo: 'O que vale é o seu extrato',
    texto:
      'Pix de verdade cai em segundos e aparece no extrato de quem recebe, com valor e nome do pagador. Se não caiu, não foi pago, não importa o que diz a tela do outro.',
    exemplo: 'Celular da loja num suporte em cima do balcão, aberto no extrato, apitando a cada Pix que entra.',
    defesa:
      'Confira cada venda no aplicativo do banco da loja antes de entregar. Deixe a regra escrita no balcão, para não depender da pressa nem do humor de ninguém. E combine com a equipe que qualquer um pode dizer "espera, não caiu".',
  },
  {
    id: 'm3_qrcode_trocado',
    titulo: 'QR code colado por cima',
    texto:
      'Um adesivo com outro QR code é colado por cima do QR code impresso da loja. O cliente aponta o celular, paga, e o dinheiro vai para outra pessoa. Pode acontecer na rua inteira ao mesmo tempo.',
    exemplo: 'Trinta e quatro Pix na manhã de segunda, todos para "R. F. COSTA". Nenhum no extrato da loja.',
    defesa:
      'Passe a unha nos QR codes impressos da loja todo dia. Achou adesivo, guarde, fotografe, anote a hora, avise o banco e faça boletim. Peça aos clientes que confiram o nome do recebedor na tela antes de confirmar. Avise os vizinhos de comércio.',
  },
  {
    id: 'm3_med_devolucao',
    titulo: 'Devolução de Pix em caso de golpe (MED)',
    texto:
      'O Mecanismo Especial de Devolução, o MED, é o caminho para pedir a devolução de um Pix feito por causa de golpe. Quem pede é quem fez o Pix, pelo próprio banco. A devolução depende de ainda haver dinheiro na conta de destino, por isso a pressa.',
    exemplo: 'A enfermeira que pagou pelo QR code falso liga para o banco dela, diz que foi golpe e pede a devolução pelo MED, levando o horário, o valor e o nome do recebedor.',
    defesa:
      'Avise o banco o quanto antes, pelo aplicativo ou pelo telefone oficial, diga que foi golpe e peça a devolução pelo MED. Anote o protocolo. Faça boletim de ocorrência. Se o golpe foi no seu balcão, ajude o cliente com as informações em vez de cobrar duas vezes.',
  },
  {
    id: 'm3_qrcode_dinamico',
    titulo: 'QR code dinâmico',
    texto:
      'O QR code dinâmico é gerado na hora, para uma venda, com o valor dela, na tela da maquininha ou do aplicativo. Ele não fica parado no balcão esperando alguém colar outro por cima.',
    exemplo: 'Pastel de carne, oito reais: o QR aparece na maquininha, o cliente aponta, a tela dele mostra o nome da loja e o valor, ele confirma.',
    defesa:
      'Prefira QR code gerado na hora a QR code impresso. Em qualquer caso, o cliente confere o nome do recebedor antes de confirmar, e a loja confere no extrato antes de entregar.',
  },
  {
    id: 'm4_email_falso',
    titulo: 'E-mail de "atualização obrigatória"',
    texto:
      'Um e-mail com cara de empresa avisa que a sua maquininha ou conta será bloqueada se você não instalar alguma coisa ou clicar num link. Muitas vezes prepara uma ligação logo depois.',
    exemplo: '"URGENTE: sua maquininha será bloqueada em 24h. Instale o aplicativo de suporte. Um técnico vai ligar para confirmar o código."',
    defesa:
      'Olhe o endereço do remetente depois do arroba. Desconfie de prazo curto e ameaça. Não instale aplicativo por link de e-mail. Na dúvida, não clique: procure o contato oficial por conta própria.',
  },
  {
    id: 'm4_falso_tecnico',
    titulo: 'Falso técnico e acesso remoto',
    texto:
      'Alguém liga, educado, dizendo ser do suporte da empresa da maquininha ou do banco. Sabe o nome da loja e o endereço, que são públicos. Pede para instalar um aplicativo de suporte e passar um código que chega por SMS.',
    exemplo: '"É rapidinho, senhora. Instala o aplicativo para eu acessar daqui e me lê o código de seis números que vai chegar."',
    defesa:
      'Empresa séria não liga pedindo para instalar aplicativo de acesso remoto nem pedindo código de SMS. Desligue. Se já instalou, desligue o celular da internet, avise o banco pelo telefone oficial de outro aparelho, remova o aplicativo, troque as senhas e faça boletim.',
  },
  {
    id: 'm4_canal_oficial',
    titulo: 'Ligue você para o número oficial',
    texto:
      'Nome, matrícula e protocolo se inventam em um segundo. A única confirmação que vale é a ligação que você faz para um número que você mesma encontrou.',
    exemplo: 'O telefone da central na etiqueta da maquininha, no contrato, no site oficial ou no verso do seu próprio cartão.',
    defesa:
      'Desligue e ligue você para o número oficial. Não use o número que a pessoa passou, nem o que veio no e-mail, nem o primeiro anúncio da busca.',
  },
];
