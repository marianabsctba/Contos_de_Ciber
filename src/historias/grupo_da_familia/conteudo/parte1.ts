import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'g1_sinais_falso_filho',
    tipo: 'achar',
    titulo: 'O Juninho de número novo',
    enunciado: 'Estes são os prints da conversa da Tia Neide com o "Juninho Novo". Toque em tudo o que é sinal de golpe.',
    trechos: [
      {
        texto: 'Oi mãe tudo bem? Esse é meu número novo, salva aí e apaga o outro',
        suspeito: true,
        porque: 'Número novo que chega do nada pedindo para apagar o antigo é a abertura clássica do golpe do falso parente. Apagar o antigo tira de você o jeito de conferir.',
      },
      { texto: 'Juninho? Que número é esse filho?' },
      { texto: 'Meu celular caiu na privada lá no hospital kkk' },
      {
        texto: 'Mãe preciso de um favor urgente, meu banco travou pra Pix e o aluguel vence hoje',
        suspeito: true,
        porque: 'Urgência com dinheiro é a alavanca do golpe: quem está com pressa não para para pensar nem para conferir.',
      },
      {
        texto: 'Faz um Pix pra essa chave, é do meu colega Wanderson',
        suspeito: true,
        porque: 'Dinheiro para conta de outra pessoa é sinal forte. Golpista usa conta de terceiro, a chamada conta laranja, para receber.',
      },
      {
        texto: 'Não liga não que eu to em reunião do plantão, não posso atender',
        suspeito: true,
        porque: 'Quem impede a ligação está impedindo a confirmação. Por voz, o golpe cai na hora.',
      },
      {
        texto: 'E não comenta com o pai, ele vai falar que eu sou irresponsável',
        suspeito: true,
        porque: 'Pedir segredo isola a vítima de quem poderia alertar. Família que conversa cai menos.',
      },
      { texto: 'Obrigado mãe 🙏🙏 tu é a melhor' },
      {
        texto: 'Mãe consegue mandar mais 2 mil? Deu um problema no contrato',
        suspeito: true,
        porque: 'Quando o primeiro Pix dá certo, o golpista sempre pede mais. Novo pedido logo depois é quase uma assinatura do golpe.',
      },
    ],
    minimo: 4,
    explicacao:
      'O golpe do falso parente segue um roteiro: número novo, desculpa para não atender ligação, urgência com dinheiro, conta de outra pessoa, pedido de segredo e, se der certo, um novo pedido. A defesa é simples: antes de qualquer Pix, ligue para o número antigo ou faça uma pergunta que só a pessoa de verdade saberia responder.',
  },
  {
    id: 'g1_ordem_primeiros_passos',
    tipo: 'ordenar',
    titulo: 'O que fazer primeiro',
    enunciado: 'A Tia Neide fez um Pix para um golpista há menos de uma hora. Coloque as ações na ordem que dá mais chance de o dinheiro voltar.',
    passos: [
      'Falar com o banco pelo aplicativo oficial ou pelo número atrás do cartão e dizer que foi golpe',
      'Pedir a devolução pelo MED do Pix e anotar o número de protocolo',
      'Registrar o boletim de ocorrência online, com os prints e o comprovante',
      'Avisar a família e os contatos que o "número novo" é golpe',
      'Bloquear e denunciar o número do golpista no aplicativo de conversa',
    ],
    explicacao:
      'O banco vem primeiro porque só ele consegue pedir o bloqueio do dinheiro enquanto ainda está na conta de destino, e isso é questão de minutos. O protocolo prova que você avisou. O boletim de ocorrência pode ser feito logo depois, online, e reforça a contestação. Avisar os contatos impede novas vítimas. Bloquear e denunciar por último, depois de guardar os prints, para não perder a conversa que serve de prova.',
  },
  {
    id: 'g1_central_quiz',
    tipo: 'quiz',
    titulo: 'A Central de Segurança',
    enunciado:
      'A "central" sabe o nome completo da Tia Neide, o final do cartão e o valor do Pix de ontem. Diz que vai estornar se ela fizer uma transferência de teste e pede para ela não desligar. Qual é a coisa certa a dizer agora?',
    opcoes: [
      'Pedir o número do protocolo e anotar tudo antes de decidir',
      'Mandar a tia desligar e ligar ela mesma no número que está atrás do cartão',
      'Fazer só metade da transferência de teste, para garantir',
      'Pedir para ele confirmar o CPF completo da tia, para provar que é do banco',
    ],
    certa: 1,
    explicacao:
      'Banco nunca pede transferência de teste, senha ou código para estornar nada. Saber dados da vítima não prova que é o banco: golpista compra dados vazados e lê o que se conta em grupo. Protocolo e CPF qualquer um inventa ou descobre. O único teste que funciona é desligar e ligar você mesma para o número oficial, que está no cartão ou no aplicativo.',
  },
  {
    id: 'g1_recuperacao',
    tipo: 'achar',
    titulo: 'O Dr. Fausto',
    enunciado: 'Esta é a conversa do "Dr. Fausto Recupera" com a Tia Neide. Toque em tudo o que é sinal do golpe da recuperação.',
    trechos: [
      { texto: 'Bom dia, Dona Neide! Recebi seu contato pela nossa página 🙏' },
      {
        texto: 'Recuperação garantida em 24h, 98% de sucesso',
        suspeito: true,
        porque: 'Ninguém pode garantir que um dinheiro de golpe volta. Advogado de verdade é proibido pelas regras da profissão de prometer resultado.',
      },
      {
        texto: 'Já localizei a conta do golpista no sistema do Banco Central',
        suspeito: true,
        porque: 'Advogado particular não tem acesso a "sistema do Banco Central" para ver conta de ninguém. É só um jeito de parecer poderoso.',
      },
      {
        texto: 'A senhora paga uma taxa de liberação de R$ 680, por Pix, para a minha assistente',
        suspeito: true,
        porque: 'Taxa antecipada para "liberar" dinheiro, paga para conta de terceiro, é o próprio golpe. Pedir devolução pelo MED no banco é de graça.',
      },
      {
        texto: 'Precisa ser hoje até as 10h, senão o processo prescreve',
        suspeito: true,
        porque: 'Prazo inventado e curtíssimo serve para não dar tempo de pesquisar ou de perguntar para alguém.',
      },
      {
        texto: 'Vou precisar de uma foto do seu documento e do código que vai chegar por SMS',
        suspeito: true,
        porque: 'Código de SMS nunca se passa para ninguém: ele abre contas em seu nome. Foto de documento serve para novos golpes.',
      },
      { texto: 'Fique tranquila, a senhora está em boas mãos ⚖️' },
    ],
    minimo: 4,
    explicacao:
      'O golpe da recuperação procura quem já caiu num golpe e promete trazer o dinheiro de volta mediante taxa. Os sinais: garantia de resultado, acesso a sistemas que ninguém de fora tem, taxa antecipada, prazo apertado e pedido de documento ou código. Quem pede a devolução de Pix é o seu banco, pelo MED, sem custo. Advogado de verdade tem inscrição que você confere na consulta pública da OAB.',
  },
];

export const notas: Nota[] = [
  {
    id: 'g1_falso_parente',
    titulo: 'Golpe do falso parente',
    texto:
      'Alguém manda mensagem de um número desconhecido dizendo ser filho, neto ou sobrinho que "trocou de número". Usa a foto da pessoa, pega dados de rede social e, depois de uns minutos de conversa, pede dinheiro com urgência.',
    exemplo:
      '"Oi mãe, esse é meu número novo. Meu banco travou, faz um Pix pra conta do meu colega? Não posso atender agora e não conta pro pai."',
    defesa:
      'Antes de qualquer Pix, ligue para o número antigo ou para outra pessoa que esteja com ele. Desconfie de pressa, de conta de terceiro e de pedido de segredo. Combine em família uma pergunta ou palavra que só vocês sabem.',
  },
  {
    id: 'g1_confirmar_outro_canal',
    titulo: 'Confirmar por outro caminho',
    texto:
      'Golpista controla a conversa em que ele está. Por isso a confirmação tem que vir de fora dela: uma ligação para o número antigo, um áudio, uma pergunta pessoal ou outra pessoa da família.',
    exemplo:
      'A Tia Neide perguntou o nome do cachorro de infância. O falso Juninho disse que estava sem tempo e mandou pagar logo.',
    defesa:
      'Nunca confirme uma pessoa usando o mesmo número que está pedindo o dinheiro. Ligue você, por um número que você já tinha antes, ou fale com alguém próximo dela.',
  },
  {
    id: 'g1_sem_humilhar',
    titulo: 'Como conversar com quem caiu',
    texto:
      'Quem caiu num golpe sente vergonha, e vergonha faz a pessoa esconder, negar e demorar a agir. Golpista é profissional: tem roteiro, horário e treino. Cair não é falta de inteligência.',
    exemplo:
      'Expor a tia no grupo fez ela defender o golpista por orgulho. Contar que você também já caiu fez ela ligar para o banco.',
    defesa:
      'Fale no privado, sem plateia. Comece pelo que fazer agora, não pelo erro. Elogie o que a pessoa fez certo. Deixe ela contar para os outros do jeito dela.',
  },
  {
    id: 'g1_med_pix',
    titulo: 'MED: o Mecanismo Especial de Devolução do Pix',
    texto:
      'O Pix não tem botão de cancelar, mas tem o MED. Avisado do golpe, o seu banco aciona o banco de quem recebeu, que pode bloquear o valor se ele ainda estiver na conta. Os bancos analisam e, se ficar confirmado o golpe, o dinheiro volta.',
    exemplo:
      'Golpista costuma espalhar o dinheiro por outras contas em minutos. Quem avisa o banco na primeira hora tem muito mais chance.',
    defesa:
      'Peça a contestação pelo app ou pelo número oficial do banco o quanto antes (o prazo máximo é de 80 dias, mas cada minuto conta). Anote o protocolo e guarde o comprovante e os prints.',
  },
  {
    id: 'g1_canal_oficial',
    titulo: 'O número certo do banco',
    texto:
      'O telefone do banco está impresso atrás do cartão e dentro do aplicativo oficial. Resultado de busca, anúncio patrocinado e número que alguém mandou por mensagem podem ser de golpista.',
    exemplo:
      'O Tio Edson achou um "0800 Central Recupera Pix 24h" num anúncio. A "central" pediu senha e código de SMS na primeira frase.',
    defesa:
      'Use só o app oficial ou o número do cartão. Banco nunca pede senha, código recebido por SMS nem transferência para "testar" nada.',
  },
  {
    id: 'g1_bo_online',
    titulo: 'Boletim de ocorrência online',
    texto:
      'Na maioria dos estados dá para registrar boletim de ocorrência de golpe pela delegacia virtual, no site oficial da polícia civil ou do governo do estado. Leva uns vinte minutos.',
    exemplo:
      'Data, hora, valor, chave Pix, nome que apareceu no comprovante, número do golpista e os prints da conversa.',
    defesa:
      'Faça logo depois de falar com o banco. O banco pode pedir o BO, e cada registro ajuda a ligar a mesma conta laranja a outras vítimas.',
  },
  {
    id: 'g1_falsa_central',
    titulo: 'Falsa central de segurança',
    texto:
      'Alguém liga dizendo ser do banco, cita dados verdadeiros da vítima e oferece resolver um problema: estornar um golpe, cancelar uma compra, proteger a conta. Para isso, pede transferência de teste, senha, código ou instalação de aplicativo.',
    exemplo:
      '"Para liberar seu estorno, faça uma transferência de teste para a conta de validação. Não desligue, senão o protocolo cai. E não comente com familiares."',
    defesa:
      'Desligue e ligue você mesma no número do cartão. Saber seu nome, CPF ou final do cartão não prova nada: esses dados vazam. Banco não pede transferência de teste. Nunca.',
  },
  {
    id: 'g1_grupo_exposto',
    titulo: 'O que se conta no grupo, o golpista lê',
    texto:
      'Grupo grande de família tem gente que ninguém lembra quem adicionou. Valor de Pix, horário, banco, viagem e endereço contados ali podem chegar a quem não devia e virar roteiro para o próximo golpe.',
    exemplo:
      'A falsa central sabia o valor e a hora do Pix porque a Tia Neide contou tudo no grupo de 43 pessoas.',
    defesa:
      'Assunto de dinheiro e de golpe, trate no privado. De tempos em tempos, confira quem está no grupo e deixe só administradores de confiança adicionando gente.',
  },
  {
    id: 'g1_golpe_recuperacao',
    titulo: 'Golpe da recuperação',
    texto:
      'Depois de um golpe, aparece quem promete recuperar o dinheiro: "advogado", "hacker do bem", "perito", "órgão do governo". Cobram uma taxa para começar e, depois, mais uma, e mais uma.',
    exemplo:
      '"Recuperação garantida em 24h. Taxa de liberação de R$ 680 até as 10h. Agora, mais R$ 1.500 de custas."',
    defesa:
      'Ninguém recupera Pix mediante taxa. Quem pede a devolução é o seu banco, pelo MED, de graça. Desconfie de quem procura você depois do golpe e de quem promete resultado.',
  },
  {
    id: 'g1_checar_advogado',
    titulo: 'Como conferir um advogado',
    texto:
      'Todo advogado tem inscrição na OAB, e qualquer pessoa pode conferir no cadastro nacional de advogados, uma consulta pública e gratuita no site da OAB. As regras da profissão proíbem prometer resultado e cobrar "taxa de liberação".',
    exemplo:
      'O perfil do Dr. Fausto tinha foto de terno, 2.300 seguidores, seis semanas de vida, comentários fechados e um número de inscrição que não existia.',
    defesa:
      'Confira nome e inscrição na consulta oficial da OAB. Procure o advogado por indicação ou pela própria OAB, não por anúncio que chegou até você.',
  },
];
