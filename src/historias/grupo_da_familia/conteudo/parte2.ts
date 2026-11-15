import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'g2_dm_parceria',
    tipo: 'achar',
    titulo: 'A "marca" que queria parceria',
    enunciado: 'Esta é a conversa que a Kaká recebeu no direct antes de perder a conta. Toque em tudo o que era sinal de golpe.',
    trechos: [
      { texto: 'Oiii Kaká! Somos a GlowSkin Oficial ✔️ e amamos seu conteúdo!' },
      {
        texto: 'Perfil criado há 2 semanas, com o "✔️" escrito no nome',
        suspeito: true,
        porque: 'Selo de verificação de verdade aparece ao lado do nome, colocado pelo aplicativo. Emoji de selo escrito no nome qualquer um coloca. E marca séria não tem perfil de duas semanas.',
      },
      { texto: 'Queremos te enviar um kit de produtos e fechar uma collab paga.' },
      {
        texto: 'A proposta vale só até hoje às 15h, temos outras influencers na fila',
        suspeito: true,
        porque: 'Pressa artificial. Parceria de verdade tem prazo de semanas, contrato e conversa por e-mail da empresa.',
      },
      {
        texto: 'Vai chegar um código de 6 números no seu celular. Manda aqui pra confirmar seu selo de parceira',
        suspeito: true,
        porque: 'Esse código é o que o aplicativo manda para entrar na conta ou trocar o número. Quem pede o código quer entrar no lugar da dona. Nenhuma empresa precisa dele.',
      },
      {
        texto: 'Não conta pra ninguém ainda, é confidencial até o anúncio',
        suspeito: true,
        porque: 'Pedir segredo isola a vítima e impede que alguém de fora diga "isso é golpe".',
      },
      { texto: 'Pode mandar seu endereço para o envio do kit depois.' },
    ],
    minimo: 3,
    explicacao:
      'O golpe da falsa parceria mira quem cria conteúdo: um perfil que parece de marca, uma proposta boa demais, pressa e, no fim, o pedido do código que chegou por SMS. Com esse código, o golpista troca o e-mail e o telefone da conta e tranca a dona do lado de fora. A regra é uma só: código de verificação não se passa para ninguém, nem para "a equipe", nem para a família.',
  },
  {
    id: 'g2_recuperar_conta',
    tipo: 'ordenar',
    titulo: 'Recuperar a conta da Kaká',
    enunciado: 'A conta foi tomada. Coloque na ordem certa o caminho para recuperar e trancar a porta.',
    passos: [
      'Abrir o aplicativo oficial na tela de login e tocar em "Precisa de ajuda?" ou "Minha conta foi invadida", sem usar link que chegou por mensagem',
      'Provar que é a dona pelo caminho que o próprio aplicativo oferecer: código no e-mail ou telefone antigo, ou selfie em vídeo',
      'Trocar a senha por uma nova, longa, que não é usada em nenhum outro lugar',
      'Remover os aparelhos e sessões desconhecidos e apagar o e-mail e o telefone que o golpista colocou',
      'Ligar a verificação em duas etapas e guardar os códigos de reserva fora do celular',
    ],
    explicacao:
      'Primeiro se entra pelo caminho oficial, porque link de "recuperação" enviado por mensagem costuma ser outro golpe. Depois de provar a identidade, a senha nova fecha a porta, a limpeza de sessões e contatos expulsa quem ainda estava lá dentro, e a verificação em duas etapas impede que um código roubado baste de novo. Enquanto isso, alguém avisa os seguidores por outro canal.',
  },
  {
    id: 'g2_cesta_link',
    tipo: 'achar',
    titulo: 'A cesta básica do Tio Benê',
    enunciado: 'Esta é a mensagem que o Tio Benê encaminhou para 15 grupos. Toque nos sinais de golpe.',
    trechos: [
      { texto: '🇧🇷 CESTA BÁSICA DO GOVERNO 2026 🇧🇷' },
      {
        texto: 'Acesse: cestabrasil-gov.cadastro.site',
        suspeito: true,
        porque: 'Site do governo termina em .gov.br. Aqui o "gov" está no meio do endereço só de enfeite, e o final é ".site".',
      },
      {
        texto: 'Vagas limitadas, só hoje! Encaminhe para 10 grupos para liberar a sua',
        suspeito: true,
        porque: 'Pressa e pedido de encaminhar são o motor da corrente: cada pessoa que repassa leva o golpe a mais gente.',
      },
      {
        texto: 'Envie CPF, foto da identidade frente e verso e uma selfie',
        suspeito: true,
        porque: 'Com documento e selfie, golpista abre conta e pede empréstimo no nome da vítima.',
      },
      {
        texto: 'Pague apenas R$ 19,90 de taxa de entrega com cartão de crédito',
        suspeito: true,
        porque: 'Benefício do governo não cobra taxa. A "taxinha" serve para capturar o número do cartão.',
      },
      { texto: 'Cesta com arroz, feijão, óleo, café e açúcar.' },
    ],
    minimo: 3,
    explicacao:
      'Golpe de benefício falso usa a bandeira, a palavra "governo" e uma taxa pequena para parecer inofensivo. Benefício de verdade aparece no aplicativo oficial (como o gov.br) ou no banco que paga, nunca por link encaminhado. Quem já preencheu deve ligar para o banco pelo número do cartão, bloquear o cartão, contestar a cobrança e acompanhar o CPF no Registrato, do Banco Central.',
  },
  {
    id: 'g2_sinais_piramide',
    tipo: 'achar',
    titulo: 'O "investimento garantido" do Tio Edson',
    enunciado: 'Esta é a mensagem do consultor Wellington Diamante. Toque nos sinais de pirâmide financeira.',
    trechos: [
      { texto: 'Bom dia, Seu Edson! A CryptoGold é o futuro do dinheiro.' },
      {
        texto: 'Rendimento GARANTIDO de 3% ao dia',
        suspeito: true,
        porque: 'Ninguém pode garantir rendimento em investimento de risco. E 3% ao dia transformaria R$ 3.200 em mais de 150 milhões em um ano.',
      },
      {
        texto: 'Indique 3 amigos e suba para o nível DIAMANTE, ganhando 10% de tudo o que eles aplicarem',
        suspeito: true,
        porque: 'Ganhar pelo dinheiro de quem você indica é o coração da pirâmide: os novos pagam os antigos, até pararem de entrar novos.',
      },
      {
        texto: 'O lote fecha hoje às 9h, depois só ano que vem',
        suspeito: true,
        porque: 'Contagem regressiva é para impedir que a pessoa pense, pesquise ou pergunte para alguém.',
      },
      {
        texto: 'Saques acima de R$ 100 têm taxa de liberação de 20%',
        suspeito: true,
        porque: 'Cobrar para devolver o seu próprio dinheiro é sinal de que ele não vai sair. Imposto não é cobrado por site.',
      },
      { texto: 'Temos whitepaper e suporte pelo WhatsApp.' },
    ],
    minimo: 3,
    explicacao:
      'Pirâmide financeira se disfarça de tecnologia, mas tem sempre os mesmos sinais: rendimento alto e garantido, bônus por indicar pessoas, pressa e dificuldade para sacar. Antes de investir, confira no site da CVM se a empresa é autorizada e se há alerta contra ela. Whitepaper é só um documento; qualquer um escreve.',
  },
  {
    id: 'g2_quiz_duas_etapas',
    tipo: 'quiz',
    titulo: 'A prova surpresa da Vó Dita',
    enunciado: 'Com a verificação em duas etapas ligada no aplicativo de conversa, o que acontece se um golpista conseguir o código de 6 números que chega por SMS?',
    opcoes: [
      'Nada muda, ele entra na conta do mesmo jeito',
      'Ele ainda precisa do PIN que só a dona sabe, então não consegue usar a conta',
      'O aplicativo apaga a conta para proteger a dona',
      'O banco é avisado automaticamente',
    ],
    certa: 1,
    explicacao:
      'A verificação em duas etapas acrescenta um PIN que você mesma cria. Mesmo que alguém consiga o código do SMS, sem o PIN não ativa a sua conta em outro aparelho. Por isso o PIN não pode ser data de aniversário nem 123456, e o e-mail de recuperação precisa ser seu. E o código do SMS continua sendo segredo.',
  },
];

export const notas: Nota[] = [
  {
    id: 'g2_codigo_verificacao',
    titulo: 'Código de verificação não se passa',
    texto:
      'O código de 6 números que chega por SMS ou e-mail é a chave que o aplicativo manda para quem está tentando entrar na conta ou trocar o número. Quem pede esse código está tentando entrar no seu lugar, não importa se diz ser marca, banco, suporte ou parente.',
    exemplo: 'A "GlowSkin Oficial" pediu à Kaká o código "para confirmar o selo de parceira". Em dois minutos, a conta tinha outro e-mail e outro dono.',
    defesa: 'Leia a mensagem inteira do SMS, inclusive o "não compartilhe". Não passe o código para ninguém, nunca. Na dúvida, ligue para a pessoa ou empresa por um canal que você mesma procurou.',
  },
  {
    id: 'g2_perfil_pede_pix',
    titulo: 'Conta invadida pedindo Pix',
    texto:
      'Depois de tomar uma conta, o golpista usa a confiança dos seguidores: vende produto barato, pede ajuda urgente, sorteia prêmio com "taxa". Quem recebe acha que está falando com a dona.',
    exemplo: 'O perfil da Kaká começou a vender iPhone pela metade do preço no story. Amigas mandaram "sinal" em minutos.',
    defesa: 'Avise os seguidores e a família por outro canal (outro perfil, WhatsApp, amigas). Quem já pagou deve falar com o próprio banco no mesmo dia, pedir a devolução pelo MED e fazer boletim de ocorrência.',
  },
  {
    id: 'g2_clonagem_recuperar',
    titulo: 'Como recuperar uma conta invadida',
    texto:
      'As redes sociais têm um caminho oficial para conta invadida, na própria tela de login. Elas podem mandar um código para o e-mail ou telefone antigos, pedir uma selfie em vídeo ou mandar um e-mail para desfazer a troca de e-mail.',
    exemplo: 'A Kaká foi pela tela de login, em "minha conta foi invadida", provou que era ela com selfie em vídeo, trocou a senha e removeu o celular desconhecido.',
    defesa: 'Use só o caminho oficial, nunca "recuperadores" que aparecem em comentário ou mensagem. Depois de entrar: senha nova, remover sessões desconhecidas, conferir e-mail e telefone e ligar a verificação em duas etapas. Se não conseguir, denuncie o perfil como falso e faça boletim de ocorrência.',
  },
  {
    id: 'g2_dois_fatores',
    titulo: 'Verificação em duas etapas',
    texto:
      'É uma segunda tranca além da senha ou do código. No aplicativo de conversa, é um PIN de 6 números que você cria. Em redes sociais, pode ser um aplicativo autenticador, que gera um número novo a cada 30 segundos, ou um SMS.',
    exemplo: 'Na festa da Vó Dita, ninguém comeu bolo antes de mostrar a tela da confirmação em duas etapas ligada.',
    defesa: 'Ligue nas configurações de conta de cada aplicativo. Prefira o aplicativo autenticador ao SMS quando houver. Use um PIN que não seja data nem sequência, cadastre um e-mail de recuperação seu e guarde os códigos de reserva fora do celular.',
  },
  {
    id: 'g2_link_beneficio',
    titulo: 'Golpe do link de benefício',
    texto:
      'Mensagens de "cesta básica", "auxílio liberado" ou "valores a receber" levam a sites falsos que pedem CPF, foto de documento, selfie e uma "taxa" pequena no cartão.',
    exemplo: 'O Tio Benê cadastrou ele e a tia Cleide na "cesta básica do governo" e pagou R$ 19,90 de "entrega". No dia seguinte, apareceu uma compra de R$ 640 no cartão.',
    defesa: 'Benefício de verdade aparece no aplicativo oficial do governo ou do banco que paga, e endereço do governo termina em .gov.br. Se já preencheu: bloqueie o cartão pelo número dele, conteste as compras, acompanhe o CPF no Registrato do Banco Central e faça boletim de ocorrência.',
  },
  {
    id: 'g2_fake_news_checar',
    titulo: 'Como checar uma notícia antes de repassar',
    texto:
      'Corrente de medo usa letras maiúsculas, fonte vaga ("a Polícia Federal confirmou", "o cunhado de um amigo"), nenhuma data e pedido de repassar para muitos grupos.',
    exemplo: 'A corrente de que dizer "sim" ao telefone esvazia a conta circula desde 2019 e já foi desmentida várias vezes.',
    defesa: 'Três perguntas: quem disse? Onde mais saiu? Está pedindo pressa ou medo? Copie uma frase e procure em agências de checagem e no site oficial do órgão citado. Na dúvida, não repasse.',
  },
  {
    id: 'g2_voz_palavra_familia',
    titulo: 'Voz imitada e a palavra da família',
    texto:
      'Hoje é possível imitar a voz de alguém a partir de áudios. O golpe não é o "sim" gravado: é alguém ligar ou mandar áudio com uma voz parecida com a de um parente, pedindo dinheiro com urgência.',
    exemplo: 'A família combinou que, se alguém pedir dinheiro por voz ou por número novo, pergunta a palavra secreta. A do Tio Benê é "Jurandir".',
    defesa: 'Combine uma palavra que só a família sabe e nunca escreva no grupo. Se alguém pedir dinheiro, desligue e ligue de volta para o número antigo da pessoa.',
  },
  {
    id: 'g2_conversar_sem_humilhar',
    titulo: 'Corrigir fake news no grupo sem constranger',
    texto:
      'Quem repassa corrente quase sempre quer proteger alguém. Print de "FALSO" em vermelho com bronca na frente de todo mundo faz a pessoa se defender, e não aprender. E da próxima vez ela esconde.',
    exemplo: 'Uma figurinha de pavê dizendo "Talvez" abriu mais conversa com o Tio Benê do que qualquer link de checagem. Depois, foi ele mesmo quem escreveu o desmentido no grupo.',
    defesa: 'Comece pelo privado, reconheça a boa intenção, cheque junto em vez de dar a resposta pronta e deixe a própria pessoa corrigir no grupo. Quem desmente o próprio erro vira exemplo, não piada.',
  },
  {
    id: 'g2_piramide',
    titulo: 'Pirâmide financeira',
    texto:
      'Na pirâmide, o "rendimento" dos primeiros vem do dinheiro dos que entram depois. Funciona enquanto entra gente nova. Quando para, o site sai do ar e quase todo mundo perde. É crime contra a economia popular.',
    exemplo: 'A CryptoGold prometia 3% ao dia, bônus por indicar amigos e um "lote diamante" que fechava às 9h. O Tio Edson já tinha sacado R$ 60 de "lucro", a isca para ele pôr mais.',
    defesa: 'Desconfie de rendimento alto e garantido, de bônus por indicação, de pressa e de taxa para sacar. Teste: tente sacar o que já pôs. Se pedir taxa, não pague.',
  },
  {
    id: 'g2_rendimento_garantido',
    titulo: '"Rendimento garantido" e a consulta na CVM',
    texto:
      'Investimento que rende muito tem risco alto, e ninguém sério garante o resultado. Quem oferece investimento ao público no Brasil precisa de autorização. A CVM mantém o cadastro de quem é autorizado e publica alertas sobre ofertas irregulares.',
    exemplo: 'Na busca da CVM, a CryptoGold não aparecia como autorizada, mas havia um alerta contra uma "Crypto Gold Brasil", com um espaço e uma palavra a mais.',
    defesa: 'Antes de investir, consulte no site da CVM e do Banco Central quem está oferecendo. Faça a conta: 3% ao dia vira milhões em um ano, e isso não existe. Fale com alguém de fora antes de decidir.',
  },
  {
    id: 'g2_denunciar_piramide',
    titulo: 'Caí numa pirâmide: e agora?',
    texto:
      'Quem caiu sente vergonha e tende a esconder, ou a pôr mais dinheiro para "recuperar". Também aparecem "advogados" e "hackers" que prometem devolver tudo mediante taxa, e é o mesmo golpe outra vez.',
    exemplo: 'O Tio Edson perdeu os R$ 500 que já tinha posto, saiu de todos os grupos do "lote diamante" e denunciou o consultor.',
    defesa: 'Não pague taxa de saque nem de recuperação. Guarde comprovantes e prints, faça boletim de ocorrência online e denuncie à CVM. Saia dos grupos e avise quem indicou ou foi indicado.',
  },
  {
    id: 'g2_privacidade_foto_contatos',
    titulo: 'Privacidade de foto, endereço e contatos',
    texto:
      'Story aberto com endereço, fachada, rotina ("venho toda terça") e "ela mora sozinha" é um mapa para golpe e para crime fora da internet. Lista de contatos e grupos abertos ajudam golpistas a descobrir quem é parente de quem.',
    exemplo: 'Na live do aniversário, um perfil sem foto perguntou "que horas a vó fica sozinha?".',
    defesa: 'Poste depois do evento, sem número da casa nem rotina, e use lista de amigos próximos. No aplicativo de conversa, limite quem vê sua foto e quem pode te adicionar a grupos.',
  },
  {
    id: 'g2_grupo_alerta',
    titulo: 'O grupo de alerta da família',
    texto:
      'Um grupo só para avisos de golpe, com poucas regras e moderação, faz a informação chegar rápido sem se perder entre bom dia e corrente. Quem já caiu em golpe costuma ser o melhor vigia.',
    exemplo: 'Regras da Vó Dita: pediu dinheiro, liga para a pessoa; código não se passa; corrente é crime contra a paciência da avó.',
    defesa: 'Crie o grupo com regras na descrição, escolha moderadores que a família respeita e agradeça quem avisa. Errar e contar tem que ser motivo de elogio, nunca de piada.',
  },
];
