import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'd2_aviso_titulares',
    tipo: 'formulario',
    titulo: 'Querido paciente',
    enunciado: 'Monte, campo a campo, o aviso aos 1.847 pacientes. Linguagem simples, sem esconder nada e sem assustar à toa.',
    campos: [
      {
        rotulo: 'O que aconteceu',
        opcoes: [
          'Na segunda-feira, às 8h12, uma planilha com dados de pacientes foi enviada por engano a um grupo de mensagens com 63 pessoas.',
          'Houve um pequeno compartilhamento interno de informações, sem maiores consequências.',
          'A clínica foi vítima de um ataque hacker sofisticado.',
        ],
        certa: 0,
        porque:
          '"Pequeno compartilhamento" minimiza o que aconteceu e "ataque hacker" é falso. O titular precisa saber o fato como ele foi, com data e de que jeito, para avaliar o próprio risco.',
      },
      {
        rotulo: 'Quais dados',
        opcoes: [
          'Dados diversos, conforme o caso de cada paciente.',
          'Nome, CPF, telefone, convênio e diagnóstico.',
          'Apenas dados cadastrais básicos.',
        ],
        certa: 1,
        porque:
          'Esconder o diagnóstico é esconder justamente o dado sensível, o dado de saúde, que torna o incidente grave. "Dados diversos" não diz nada a ninguém.',
      },
      {
        rotulo: 'Riscos para você',
        opcoes: [
          'Não há nenhum risco.',
          'Risco gravíssimo de roubo de identidade: procure um advogado imediatamente.',
          'Outras pessoas podem ter visto informação sobre a sua saúde, e golpistas podem tentar contato usando seu nome e telefone.',
        ],
        certa: 2,
        porque:
          'O aviso deve dizer os riscos reais, sem negar e sem criar pânico. Dizer que não há risco é falso, e o tom alarmista assusta sem ajudar a pessoa a se proteger.',
      },
      {
        rotulo: 'O que a clínica fez',
        opcoes: [
          'Pedimos a exclusão a quem recebeu, registramos o incidente, comunicamos a ANPD e mudamos quem pode acessar esse tipo de arquivo.',
          'A funcionária responsável foi identificada e será punida.',
          'Estamos estudando o caso com toda a atenção.',
        ],
        certa: 0,
        porque:
          'O titular quer saber das medidas para reverter ou reduzir o dano. Expor uma funcionária não protege ninguém, e "estamos estudando" é uma frase que não informa medida nenhuma.',
      },
      {
        rotulo: 'O que você pode fazer',
        opcoes: [
          'Nada, está tudo resolvido.',
          'Desconfie de qualquer contato pedindo dinheiro ou dados em nome da clínica. A clínica não pede Pix para liberar exame.',
          'Troque o seu CPF o quanto antes.',
        ],
        certa: 1,
        porque:
          'O aviso precisa dar ao titular algo que ele consiga fazer. Não dá para "trocar o CPF" por causa de um incidente, e dizer que não há nada a fazer deixa a pessoa desprotegida contra golpes.',
      },
      {
        rotulo: 'Contato',
        opcoes: [
          'Responda esta mensagem com seu CPF para confirmar que recebeu.',
          'Procure a recepção em horário comercial.',
          'Fale com a encarregada de dados da clínica pelo e-mail e telefone exclusivos deste aviso.',
        ],
        certa: 2,
        porque:
          'O aviso deve trazer o contato da encarregada, que é o canal com os titulares. Pedir CPF por mensagem é exatamente o que um golpista faria, e a recepção não é o canal para isso.',
      },
    ],
    minimo: 5,
    explicacao:
      'Pelo regulamento de comunicação de incidente da ANPD, o aviso aos titulares sai em até 3 dias úteis, em linguagem simples, com o mínimo: o que aconteceu, que dados foram envolvidos, quais os riscos, que medidas foram adotadas, o que o titular pode fazer e o contato da encarregada. Aviso bom cabe numa tela de celular e uma pessoa de 80 anos entende de primeira.',
  },
  {
    id: 'd2_golpe_central',
    tipo: 'achar',
    titulo: 'A "Central Bem Viver"',
    enunciado: 'Esta é a mensagem que a Dona Cleide recebeu. Toque em tudo o que é sinal de golpe.',
    trechos: [
      {
        texto: 'Olá, Sra. Cleide! Aqui é da Central Bem Viver ✅',
        suspeito: true,
        porque: 'A clínica não tem "central", e o selo ✅ escrito no nome qualquer um coloca. Número desconhecido usando o nome da clínica pede confirmação pelo telefone que você já conhece.',
      },
      {
        texto: 'Seu resultado de exame de tireoide (convênio VidaPlena) já está disponível.',
        suspeito: true,
        porque: 'O golpista usa os dados que vazaram, diagnóstico e convênio, para parecer de casa. Saber detalhes sobre você não prova que o contato é legítimo: só prova que os dados circularam.',
      },
      {
        texto: 'Por uma atualização do sistema do convênio, é necessária uma taxa de liberação de R$ 89,90.',
        suspeito: true,
        porque: 'Não existe taxa para liberar resultado de exame. O aviso da clínica disse isso com todas as letras.',
      },
      {
        texto: 'Pagamento via Pix para a chave CPF em nome de Marcos A. S., responsável pelo financeiro.',
        suspeito: true,
        porque: 'Empresa recebe em conta da empresa. Pix para pessoa física é sinal forte de conta usada só para receber o golpe.',
      },
      {
        texto: 'O link de pagamento expira em 2 horas. Após esse prazo o exame será descartado.',
        suspeito: true,
        porque: 'Pressa e ameaça de perder algo importante são a alavanca do golpe: quem está com medo não para para conferir.',
      },
      {
        texto: 'Não é necessário ligar na clínica, a recepção está sobrecarregada.',
        suspeito: true,
        porque: 'Quem tenta impedir você de ligar para o número oficial está impedindo a confirmação. Uma ligação para o fixo derruba o golpe.',
      },
      { texto: 'Qualquer dúvida estamos à disposição 🙏' },
    ],
    minimo: 4,
    explicacao:
      'Dados vazados viram matéria-prima de golpe: com nome, telefone, convênio e diagnóstico, o golpista monta uma mensagem que parece da clínica. Os sinais se repetem: canal desconhecido, cobrança que não existe, conta de pessoa física, pressa e pedido para não confirmar. A defesa é avisar os pacientes antes do golpista, deixar claro o que a clínica nunca pede e orientar a confirmar sempre pelo número oficial.',
  },
  {
    id: 'd2_resposta_titular',
    tipo: 'quiz',
    titulo: 'A declaração completa',
    enunciado: 'O Dr. Jorge pediu, em nome de três pacientes, confirmação e acesso aos dados. Se a clínica não responder na hora em formato simplificado, o que precisa ter a declaração completa?',
    opcoes: [
      'Origem dos dados, inexistência de registro se for o caso, critérios utilizados e finalidade do tratamento, em até 15 dias do requerimento.',
      'Apenas uma cópia do cadastro, em até 30 dias, enviada para o e-mail que constar no pedido.',
      'Uma carta explicando que dado de saúde é protegido por sigilo médico e não pode ser entregue nem ao próprio paciente.',
    ],
    certa: 0,
    explicacao:
      'O art. 19 da LGPD prevê duas formas: em formato simplificado, imediatamente, ou por declaração clara e completa, que indique a origem dos dados, a inexistência de registro, os critérios utilizados e a finalidade do tratamento, em até 15 dias contados do requerimento. O sigilo médico protege o paciente dos outros, não do próprio paciente. E antes de entregar, confira que quem pede é o titular ou alguém com poderes para representá-lo.',
  },
  {
    id: 'd2_plano_adequacao',
    tipo: 'ordenar',
    titulo: 'O plano de adequação',
    enunciado: 'Coloque o plano de adequação da Bem Viver numa ordem que faça sentido para a diretoria aprovar e para a equipe seguir.',
    passos: [
      'Mapear quais dados a clínica tem, onde ficam, quem acessa e para quê, mantendo o registro das operações',
      'Restringir o acesso pelo menor privilégio e acabar com planilha de pacientes em aplicativo de conversa',
      'Formalizar em contrato as instruções e responsabilidades do operador de TI',
      'Treinar a equipe, começando por quem atende e manuseia dados todos os dias',
      'Revisar e testar o plano de tempos em tempos, com registro do que mudou',
    ],
    explicacao:
      'Primeiro se descobre o que existe (o art. 37 pede o registro das operações), porque não dá para proteger o que não se conhece. Depois se fecha a porta com controle de acesso e minimização, que são medidas de segurança do art. 46. Em seguida se amarra quem trata dados em nome da clínica, já que pelo art. 39 o operador segue as instruções do controlador. Com as regras definidas, a equipe é treinada nelas. E governança, como no art. 50, é revisar sempre, não fazer uma vez só.',
  },
];

export const notas: Nota[] = [
  {
    id: 'd2_aviso_titulares',
    titulo: 'Avisar os titulares',
    texto:
      'Quando o incidente pode acarretar risco ou dano relevante, o art. 48 da LGPD manda comunicar a ANPD e também os titulares. Pelo regulamento de comunicação de incidente da ANPD, o aviso aos titulares sai em até 3 dias úteis, em linguagem simples, dizendo o que aconteceu, que dados foram envolvidos, os riscos, as medidas adotadas, o que a pessoa pode fazer e o contato do encarregado.',
    exemplo:
      'Ruim: "Informamos que houve um evento envolvendo ativos de informação." Bom: "Na segunda, uma planilha com seu nome, CPF, telefone, convênio e diagnóstico foi enviada por engano a um grupo de mensagens."',
    defesa:
      'Tenha um modelo de aviso pronto antes do incidente. Envie a cada titular individualmente, sem lista com cópia aberta e sem anexar dado nenhum. Teste o texto com alguém que não é da área.',
  },
  {
    id: 'd2_aviso_nao_e_propaganda',
    titulo: 'Aviso de incidente não é anúncio',
    texto:
      'Transparência, um dos princípios do art. 6º da LGPD, é dar ao titular informação clara e acessível. Um aviso com cupom, "pequeno imprevisto" e foto sorridente informa menos e parece que a clínica está escondendo o tamanho do problema atrás do marketing.',
    exemplo: '"Querido paciente 💚 Aproveite e agende seu check-up com 20% OFF" num aviso sobre diagnóstico vazado.',
    defesa:
      'O aviso tem um objetivo só: o titular entender o que aconteceu e se proteger. Marketing fica fora. Comunicação pode ajudar a deixar o texto claro, não bonito.',
  },
  {
    id: 'd2_golpe_dados_vazados',
    titulo: 'Golpe com dado vazado',
    texto:
      'Depois de um vazamento, o risco mais comum é o dado virar roteiro de golpe. Com nome, telefone e informação de saúde, o golpista se passa pela clínica, cita o exame e o convênio e cobra uma "taxa". Esse é um dos danos que a avaliação de risco precisa considerar.',
    exemplo: '"Central Bem Viver ✅: seu exame de tireoide está disponível, pague R$ 89,90 por Pix para liberar."',
    defesa:
      'Avise os pacientes antes do golpista: diga o que a clínica nunca pede. Fixe o alerta no site, oriente a recepção, registre os relatos no registro do incidente e leve o fato novo como informação complementar à ANPD.',
  },
  {
    id: 'd2_boletim_ocorrencia',
    titulo: 'Boletim de ocorrência',
    texto:
      'Quando o nome da clínica é usado num golpe, o boletim de ocorrência registra o crime e ajuda a polícia a ligar casos parecidos. A vítima que pagou também deve registrar o seu e procurar o banco o quanto antes.',
    exemplo: 'A clínica leva os prints, os números usados, a chave Pix e o horário dos contatos, sem levar a planilha inteira.',
    defesa:
      'Minimização vale até para provar o crime: leve só o necessário. Guarde o número do boletim no registro do incidente e oriente as vítimas com um passo a passo simples.',
  },
  {
    id: 'd2_roteiro_recepcao',
    titulo: 'Roteiro para a recepção',
    texto:
      'A recepção é a primeira a ouvir o paciente assustado. Sem orientação, cada atendente responde de um jeito, e algumas respostas ajudam o golpe a continuar. O art. 41 coloca entre as atividades do encarregado orientar os funcionários sobre as práticas de proteção de dados.',
    exemplo: '"A clínica não cobra por Pix e não pede senha nem código. Anote nome, horário e número de quem ligou e passe para a encarregada."',
    defesa: 'Roteiro curto, impresso no balcão, com o contato da encarregada. E nunca dizer ao paciente que "está tudo bem" quando não está.',
  },
  {
    id: 'd2_direitos_titular',
    titulo: 'Direitos do titular e prazo de resposta',
    texto:
      'O art. 18 da LGPD garante ao titular, entre outros, a confirmação de que seus dados são tratados e o acesso a eles. Pelo art. 19, a confirmação e o acesso são dados em formato simplificado, imediatamente, ou por declaração clara e completa, com origem, critérios e finalidade, em até 15 dias do requerimento. O pedido pode vir de representante legalmente constituído.',
    exemplo: 'O Dr. Jorge pede, com procuração, acesso aos dados de três pacientes. O relógio começa no dia em que o pedido chega.',
    defesa:
      'Registre a data do pedido, confira quem pede e com que poderes, entregue por canal seguro e responda no prazo. Entregar prontuário para a pessoa errada é um segundo incidente.',
  },
  {
    id: 'd2_campanha_base',
    titulo: 'Finalidade: a base não é do marketing',
    texto:
      'Pelo princípio da finalidade (art. 6º), o dado é tratado para propósitos legítimos, específicos e informados ao titular, sem uso posterior incompatível. Dado de saúde é sensível (art. 5º, II) e tem as bases do art. 11. A base que permite à clínica tratar dados para cuidar da saúde do paciente não serve para vender check-up.',
    exemplo: '"Manda a campanha de check-up para os 1.847 da base, eles estão engajados." Uma semana depois do vazamento.',
    defesa:
      'Para marketing, use canal aberto ao público e cadastro de quem quer receber, sabendo para quê. Se o uso envolver dado sensível, o art. 11 exige consentimento específico e destacado, para finalidade específica.',
  },
  {
    id: 'd2_imprensa_verdade',
    titulo: 'Imprensa e reputação com verdade',
    texto:
      'Negar um incidente que já está em print não protege a reputação: transforma um erro em mentira. A nota para a imprensa segue a mesma lógica do aviso aos titulares, só que mais curta.',
    exemplo: '"Não houve vazamento nenhum", dito para uma jornalista que tem o print da planilha com o nome do arquivo.',
    defesa:
      'Nota curta e verdadeira: o que houve, o que foi feito, como a pessoa se protege. Não exponha funcionário. Use a matéria para alertar sobre golpes que usam o nome da empresa.',
  },
  {
    id: 'd2_sancoes',
    titulo: 'Sanções e o peso da cooperação',
    texto:
      'O art. 52 da LGPD prevê, entre outras sanções, advertência, multa simples de até 2% do faturamento no Brasil limitada a R$ 50 milhões por infração, multa diária, publicização da infração, bloqueio e eliminação dos dados. O § 1º lista critérios para aplicar as sanções, entre eles a boa-fé, a cooperação, a adoção de medidas e a pronta adoção de medidas corretivas.',
    exemplo: '"Responde o mínimo" ao pedido de informações complementares da ANPD é o contrário de cooperação.',
    defesa:
      'Responda completo e no prazo, com o registro do incidente organizado. Mostrar o que foi feito, e quando, é o melhor argumento que uma clínica pode ter.',
  },
  {
    id: 'd2_plano_adequacao',
    titulo: 'Plano de adequação',
    texto:
      'Depois do incidente, o que impede o próximo é o plano: saber que dados existem e quem acessa (registro das operações, art. 37), aplicar medidas de segurança como controle de acesso e minimização (art. 46) e manter boas práticas e governança (art. 50).',
    exemplo: 'A planilha de 1.847 pacientes com diagnóstico estava no celular da recepção, que só precisava da agenda do dia.',
    defesa:
      'Menor privilégio: cada pessoa acessa só o que precisa para trabalhar. Nada de planilha de pacientes em aplicativo de conversa. Revisão periódica, com registro do que mudou.',
  },
  {
    id: 'd2_contrato_operador',
    titulo: 'Contrato com o operador',
    texto:
      'Operador é quem trata dados em nome do controlador, como o TI terceirizado. Pelo art. 39, o operador realiza o tratamento segundo as instruções do controlador. Instrução que só existe em áudio de dois minutos não protege ninguém.',
    exemplo: 'O Wesley exporta o histórico do sistema e manda para o primeiro "Jorge" que encontrou.',
    defesa:
      'Contrato escrito com instruções de tratamento, medidas de segurança, sigilo, aviso imediato de incidente e o que fazer com os dados no fim do serviço. E a mesma regra para agência de marketing, laboratório e qualquer um que receba dado.',
  },
];
