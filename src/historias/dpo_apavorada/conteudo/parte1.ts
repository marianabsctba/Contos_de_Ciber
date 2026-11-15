import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'd1_apagar_resolve',
    tipo: 'quiz',
    titulo: 'Apagou para todos. Resolveu?',
    enunciado:
      'A Rosângela apagou para todos a mensagem com a planilha. Antes disso, várias pessoas visualizaram e uma encaminhou para outro grupo. O que dá para dizer sobre o incidente?',
    opcoes: [
      'Resolveu: se a mensagem sumiu do grupo, o incidente deixou de existir.',
      'Ajudou a conter, mas não desfaz as cópias baixadas nem as encaminhadas. O incidente continua e precisa ser avaliado e registrado.',
      'Piorou: apagar a mensagem é sempre destruição de prova, e o certo era deixar no grupo.',
    ],
    certa: 1,
    explicacao:
      'Apagar para todos é uma boa medida de contenção, depois de guardar a evidência (print com data, hora e participantes). Mas quem baixou o arquivo continua com ele, e quem encaminhou levou para outro lugar. Por isso o incidente segue: é preciso pedir que apaguem as cópias, saber para onde foi, avaliar o risco e registrar tudo.',
  },
  {
    id: 'd1_registro_incidente',
    tipo: 'quiz',
    titulo: 'Para que registrar?',
    enunciado: 'O Dr. Romeu pergunta: "Se a gente decidir não comunicar, para que registrar o incidente?"',
    opcoes: [
      'Não precisa: o registro só existe para os incidentes comunicados à ANPD.',
      'Só se a ANPD pedir. Até lá, o melhor é não deixar nada por escrito.',
      'O registro é obrigatório mesmo para incidentes não comunicados, e a clínica deve guardá-lo por no mínimo cinco anos.',
    ],
    certa: 2,
    explicacao:
      'Pelo regulamento de comunicação de incidente da ANPD, o controlador mantém o registro do incidente, inclusive dos que não foram comunicados, por no mínimo cinco anos. O registro mostra o que se sabia, quando, o que foi avaliado e decidido. É a memória da clínica e a melhor prova de que ela agiu com responsabilidade.',
  },
  {
    id: 'd1_avaliacao_risco',
    tipo: 'formulario',
    titulo: 'Avaliação de risco do Incidente 001/2026',
    enunciado: 'Preencha a avaliação de risco do envio da planilha ao grupo "Pilates das Amigas". Uma resposta por campo.',
    campos: [
      {
        rotulo: 'Tipo de dado envolvido',
        opcoes: [
          'Dado pessoal comum: nome e telefone, como numa agenda',
          'Dado pessoal sensível: diagnóstico é dado referente à saúde, junto com CPF e telefone',
          'Dado anonimizado: ninguém consegue saber de quem é',
        ],
        certa: 1,
        porque:
          'Dado referente à saúde é dado pessoal sensível (art. 5º, II da LGPD). E com nome, CPF e telefone ao lado, a pessoa é totalmente identificável. Nada ali é anonimizado.',
      },
      {
        rotulo: 'Titulares afetados',
        opcoes: [
          '63: os participantes do grupo de pilates',
          'Só quem reclamar com a clínica',
          '1.847: os pacientes cujos dados estavam na planilha',
        ],
        certa: 2,
        porque:
          'Titular é a pessoa a quem os dados se referem. Os 63 participantes são os destinatários indevidos, que também devem constar, mas os titulares afetados são os 1.847 pacientes da planilha.',
      },
      {
        rotulo: 'O que foi comprometido',
        opcoes: [
          'A confidencialidade: pessoas sem autorização tiveram acesso aos dados',
          'Nada, porque a mensagem foi apagada',
          'Nada, porque as destinatárias são pessoas conhecidas e de bem',
        ],
        certa: 0,
        porque:
          'Apagar não desfaz o acesso que já aconteceu, nem as cópias baixadas e encaminhadas. E ser "de confiança" não dá autorização a ninguém para ver diagnóstico de paciente.',
      },
      {
        rotulo: 'Possibilidade de dano relevante aos titulares',
        opcoes: [
          'Não há, porque ninguém pediu resgate nem invadiu sistema',
          'Há: exposição do estado de saúde, discriminação, constrangimento e golpes usando CPF, telefone e convênio',
          'Só se a imprensa descobrir',
        ],
        certa: 1,
        porque:
          'Incidente não precisa de hacker. Dado de saúde exposto pode causar discriminação e constrangimento, e CPF com telefone e convênio é matéria-prima para golpe em nome da clínica. O dano é para os titulares, não para a reputação da clínica.',
      },
      {
        rotulo: 'Conclusão',
        opcoes: [
          'Não comunicar: foi erro humano, sem má-fé',
          'Comunicar à ANPD só se ela perguntar',
          'Comunicar à ANPD e aos titulares em até três dias úteis, e registrar a avaliação',
        ],
        certa: 2,
        porque:
          'O art. 48 da LGPD manda comunicar à ANPD e ao titular o incidente que possa acarretar risco ou dano relevante. Erro sem má-fé continua sendo incidente. O regulamento da ANPD dá três dias úteis, contados do conhecimento pelo controlador.',
      },
    ],
    minimo: 4,
    explicacao:
      'Avaliar o risco é olhar para o titular: que dado foi exposto, de quantas pessoas, para quem, e o que pode acontecer com elas. Dado de saúde (sensível) de 1.847 pacientes, identificável e exposto a terceiros, pode acarretar dano relevante. A conclusão é comunicar à ANPD e aos titulares no prazo, e deixar a avaliação no registro do incidente.',
  },
  {
    id: 'd1_comunicacao_anpd',
    tipo: 'formulario',
    titulo: 'Comunicação de incidente à ANPD',
    enunciado: 'Monte o conteúdo da comunicação que vai pelo formulário oficial no site da ANPD. Uma resposta por campo.',
    campos: [
      {
        rotulo: 'Natureza dos dados afetados',
        opcoes: [
          '"Dados cadastrais de pacientes", sem mais detalhes',
          'Nome, CPF, telefone, convênio, número da carteirinha e diagnóstico, incluindo dado pessoal sensível de saúde',
          '"Nenhum dado sensível", para não alarmar',
        ],
        certa: 1,
        porque:
          'A comunicação precisa descrever a natureza dos dados afetados. Esconder que havia diagnóstico é informar errado, e a ANPD vai pedir de novo.',
      },
      {
        rotulo: 'Titulares envolvidos',
        opcoes: [
          '1.847 pacientes, e os 63 participantes do grupo mais o grupo para onde foi encaminhado como destinatários',
          '63 pessoas',
          '"Poucos pacientes"',
        ],
        certa: 0,
        porque:
          'Informações sobre os titulares envolvidos são conteúdo mínimo. São os 1.847 pacientes; os destinatários indevidos também devem ser descritos. Diminuir o número é a pior ideia possível.',
      },
      {
        rotulo: 'Medidas de segurança e medidas adotadas',
        opcoes: [
          '"A clínica segue o padrão de mercado"',
          '"Não se aplica"',
          'O que existia (pasta com senha compartilhada, sem controle de envio) e o que foi feito (mensagem apagada, pedido de exclusão das cópias, acesso restrito, senha trocada, logs preservados)',
        ],
        certa: 2,
        porque:
          'A comunicação indica as medidas técnicas e de segurança utilizadas e as adotadas para reverter ou mitigar os efeitos. Frase genérica não informa nada, e honestidade sobre a falha conta a favor de quem coopera.',
      },
      {
        rotulo: 'Riscos aos titulares',
        opcoes: [
          'Nenhum risco, porque as destinatárias são conhecidas',
          'Exposição do estado de saúde, discriminação, constrangimento e uso dos dados em golpes',
          'Risco à imagem da clínica',
        ],
        certa: 1,
        porque: 'Os riscos que importam são os dos titulares. O risco à imagem da clínica não é o que a autoridade pergunta.',
      },
      {
        rotulo: 'Informações que ainda faltam',
        opcoes: [
          'Esperar ter todas as informações antes de enviar qualquer coisa',
          'Comunicar no prazo o que já se sabe, indicar o que está em apuração e complementar depois',
          'Preencher com uma estimativa qualquer para não deixar campo em branco',
        ],
        certa: 1,
        porque:
          'O regulamento permite comunicar o que se tem no prazo e complementar depois. Esperar o "completinho" perde o prazo, e inventar número é informação falsa.',
      },
      {
        rotulo: 'Se a comunicação não foi imediata',
        opcoes: [
          'Explicar os motivos da demora, com a verdade',
          'Não mencionar, ninguém vai perceber',
          'Dizer que a culpa da demora foi da recepcionista',
        ],
        certa: 0,
        porque:
          'Os motivos da demora fazem parte do que a LGPD pede na comunicação quando ela não é imediata. Culpar uma pessoa não explica nada sobre o processo.',
      },
    ],
    minimo: 5,
    explicacao:
      'A comunicação à ANPD (art. 48 da LGPD e regulamento de comunicação de incidente) descreve a natureza dos dados, os titulares envolvidos, as medidas técnicas e de segurança, os riscos, os motivos da demora se houver, e as medidas adotadas para reverter ou mitigar os efeitos. Vai pelo formulário oficial no site da ANPD, em até três dias úteis. O que faltar, comunica-se depois, em complemento.',
  },
];

export const notas: Nota[] = [
  {
    id: 'd1_preservar_evidencia',
    titulo: 'Primeiro a prova, depois a faxina',
    texto:
      'Num incidente, a vontade é apagar tudo na hora. Antes de apagar, guarde a evidência: print da mensagem mostrando data e hora, lista de participantes, quem visualizou, para onde foi encaminhado. Depois, apague.',
    exemplo: 'A Rosângela tirou print do grupo com o horário 8h12 e da lista dos 63 participantes antes de apagar para todos.',
    defesa:
      'Tenha um passo a passo curto de contenção: preservar, apagar, pedir exclusão das cópias, identificar quem recebeu, avisar a diretoria e abrir o registro. Sem a evidência, ninguém consegue reconstruir o que aconteceu.',
  },
  {
    id: 'd1_incidente',
    titulo: 'Incidente não precisa de hacker',
    texto:
      'Incidente de segurança com dados pessoais é um evento que compromete a segurança desses dados, por exemplo quando pessoas sem autorização passam a ter acesso a eles. Um arquivo enviado ao grupo errado é incidente, mesmo sem invasão, sem vírus e sem má-fé.',
    exemplo: 'Mesmo apagada para todos, a planilha ficou nos celulares de quem baixou e no grupo da Hidroginástica.',
    defesa: 'Trate o "envio errado" com a mesma seriedade de um ataque: contenção, avaliação de risco e registro.',
  },
  {
    id: 'd1_encarregada',
    titulo: 'O que faz a encarregada (DPO)',
    texto:
      'O art. 41 da LGPD diz que o encarregado é o canal de comunicação entre o controlador, os titulares e a ANPD. Ele aceita reclamações dos titulares, recebe comunicações da ANPD e orienta os funcionários sobre as práticas de proteção de dados.',
    exemplo: 'A encarregada avisou a diretoria com fatos, organizou a contenção e vai ser o contato da clínica com a ANPD e com os pacientes.',
    defesa: 'Deixe o contato da encarregada fácil de achar e combine com a equipe: qualquer pergunta de paciente sobre dados vai para ela.',
  },
  {
    id: 'd1_contencao_tecnica',
    titulo: 'Restringir, não destruir',
    texto:
      'Conter um incidente é impedir que ele piore: apagar as cópias indevidas, restringir o acesso, trocar senhas compartilhadas. Destruir a planilha original ou os logs de acesso não é contenção: é apagar o que mostra o que aconteceu.',
    exemplo: 'O Wesley queria "dar um F5 na LGPD" apagando servidor, histórico e logs. O certo era restringir a pasta, trocar a senha e guardar os logs à parte.',
    defesa:
      'A LGPD (art. 46) pede medidas de segurança para proteger os dados de acessos não autorizados. Senha única para a recepção inteira e planilha com tudo numa pasta aberta são exatamente o que precisa mudar.',
  },
  {
    id: 'd1_quem_decide',
    titulo: 'Quem decide e quem orienta',
    texto:
      'O controlador é a clínica: é ela quem toma as decisões sobre o tratamento e responde por elas. A encarregada orienta, registra e é o canal com a ANPD e os titulares. Quando a diretoria discorda, a encarregada registra por escrito a orientação que deu.',
    exemplo: 'O Dr. Romeu queria esconder. A encarregada explicou a obrigação de comunicar e mandou a orientação por e-mail para a diretoria.',
    defesa: 'Orientação importante vai por escrito, com data. Protege a clínica, que decide com informação, e protege a encarregada.',
  },
  {
    id: 'd1_registro',
    titulo: 'O registro do incidente',
    texto:
      'O regulamento de comunicação de incidente da ANPD manda o controlador manter o registro do incidente, inclusive dos que não forem comunicados, por no mínimo cinco anos. O registro conta o que aconteceu, quando a clínica soube, quais dados, quantos titulares, o que foi avaliado, decidido e feito.',
    exemplo: 'O "Registro de Incidente 001/2026" recebeu como anexos os prints, a lista de participantes e a avaliação de risco.',
    defesa: 'Abra o registro no primeiro dia e vá completando. Registro feito na pressa, uma semana depois, esquece metade.',
  },
  {
    id: 'd1_cultura_sem_culpa',
    titulo: 'Errar acontece, esconder é que não pode',
    texto:
      'Quando quem avisa um erro é punido, a equipe aprende a esconder o próximo. A pergunta útil não é "quem errou?", e sim "o que permitiu esse erro?".',
    exemplo: 'A Rosângela errou o grupo, mas a planilha inteira com diagnóstico nem precisava estar circulando por aplicativo para confirmar consulta.',
    defesa: 'No registro, descreva a causa no processo. Agradeça quem avisou rápido. É assim que o próximo incidente chega em minutos, e não pelo jornal.',
  },
  {
    id: 'd1_minimizacao',
    titulo: 'Só o necessário',
    texto:
      'Um dos princípios do art. 6º da LGPD é a necessidade: usar só os dados indispensáveis para a finalidade. Para confirmar consulta, a recepção precisa de nome e horário, não de CPF, convênio e diagnóstico.',
    exemplo: 'Para avaliar o risco, bastou ver os nomes das colunas e a contagem de linhas, sem abrir o diagnóstico de ninguém.',
    defesa: 'Planilha com tudo não circula por aplicativo de conversa. Cada área recebe só as colunas de que precisa.',
  },
  {
    id: 'd1_dado_sensivel',
    titulo: 'Dado de saúde é dado sensível',
    texto:
      'O art. 5º, II da LGPD lista os dados pessoais sensíveis, entre eles o dado referente à saúde. O art. 11 traz as bases legais para tratá-los, como a tutela da saúde por profissionais ou serviços de saúde. Além da LGPD, o sigilo médico e as regras do prontuário continuam valendo.',
    exemplo: 'A clínica pode tratar o diagnóstico do Seu Arlindo para cuidar dele. Essa base não cobre o diagnóstico dele no celular da Zuleica.',
    defesa: 'Saber em que base legal cada dado é tratado ajuda a ver na hora quando ele saiu do lugar.',
  },
  {
    id: 'd1_dano_relevante',
    titulo: 'Risco ou dano relevante',
    texto:
      'O art. 48 da LGPD manda comunicar à ANPD e aos titulares o incidente que possa acarretar risco ou dano relevante. Para avaliar, olhe para o titular: que tipo de dado, de quantas pessoas, para quem foi, e o que pode acontecer com elas.',
    exemplo: 'Diagnóstico com CPF e telefone de 1.847 pacientes, em grupos de conversa: exposição, discriminação, constrangimento e golpe.',
    defesa: 'Tenha um modelo de avaliação pronto, campo por campo, para não decidir no susto. E guarde a avaliação no registro.',
  },
  {
    id: 'd1_finalidade',
    titulo: 'Finalidade: o dado tem endereço',
    texto:
      'O princípio da finalidade (art. 6º da LGPD) diz que o dado é tratado para propósitos legítimos, específicos e informados ao titular. Dado coletado para atendimento não vira campanha de marketing só porque está à mão.',
    exemplo: 'A Bruna quis segmentar a campanha de check-up pelos diagnósticos da planilha que vazou.',
    defesa: 'Antes de reaproveitar uma base, pergunte: para que ela foi coletada, e o paciente sabia disso?',
  },
  {
    id: 'd1_prazo_anpd',
    titulo: 'Três dias úteis',
    texto:
      'Pelo regulamento de comunicação de incidente da ANPD, a comunicação à ANPD é feita em até três dias úteis, contados do conhecimento pelo controlador de que o incidente afetou dados pessoais. A comunicação aos titulares segue o mesmo prazo, em linguagem simples.',
    exemplo: 'A Bem Viver soube na segunda de manhã. Cada "vamos pensar até amanhã" custou um dia útil.',
    defesa: 'Comece a contar no primeiro minuto. Reunião, avaliação e rascunho cabem no prazo se ninguém empurrar para depois.',
  },
  {
    id: 'd1_conteudo_comunicacao',
    titulo: 'O que vai na comunicação',
    texto:
      'A comunicação à ANPD, pelo formulário oficial no site dela, descreve a natureza dos dados, os titulares envolvidos, as medidas técnicas e de segurança, os riscos, os motivos da demora se houver e as medidas para reverter ou mitigar os efeitos. Se faltar informação no prazo, comunica-se o que se tem e complementa-se depois. A ANPD também pode pedir informações complementares.',
    exemplo: 'A encarregada informou 1.847 titulares, disse que ainda apurava o grupo da Hidroginástica e se comprometeu a complementar.',
    defesa: 'Número certo, dado descrito pelo nome e medidas reais. Comunicação vaga volta em forma de pergunta.',
  },
  {
    id: 'd1_sancoes',
    titulo: 'Sanções e boa-fé',
    texto:
      'O art. 52 da LGPD prevê sanções como advertência, multa simples de até 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração, multa diária, publicização da infração, bloqueio e eliminação dos dados. Na hora de aplicar, o § 1º manda considerar critérios como a boa-fé, a cooperação, a adoção de medidas e a pronta adoção de medidas corretivas.',
    exemplo: 'A multa é para o agente de tratamento, a clínica, e não para a senhora do pilates que abriu o arquivo.',
    defesa: 'Agir rápido, registrar, comunicar e cooperar não é só o certo: é o que pesa a favor da clínica se um dia houver processo.',
  },
];
