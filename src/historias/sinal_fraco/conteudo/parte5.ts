import type { Desafio, Nota } from '../../../motor/tipos';

/** Parte 5, capital: capítulos 17 a 20 e finais do ramo da capital */
export const desafios: Desafio[] = [
  {
    id: 'p5_curso_upsell',
    tipo: 'achar',
    titulo: 'O Grupo VIP',
    enunciado: 'Primeira mensagem do mentor no Grupo VIP do curso de R$ 997. Marque os trechos que denunciam a furada.',
    trechos: [
      { texto: 'Parabéns, guerreiro(a)! Você deu o primeiro passo rumo à liberdade hacker.' },
      {
        texto: 'Aprovação GARANTIDA na certificação ou seu dinheiro de volta (consulte condições).',
        suspeito: true,
        porque: 'Ninguém pode garantir aprovação numa prova aplicada por outra instituição. E o "consulte condições" é onde a garantia morre.',
      },
      {
        texto: 'Só HOJE: a Mentoria Black de R$ 4.997 sai por R$ 1.997. Amanhã volta ao preço normal.',
        suspeito: true,
        porque: 'Urgência artificial é o truque mais antigo de pressão. Se a oferta some amanhã, é pra você não pensar hoje.',
      },
      {
        texto: 'Pagamento só por Pix para a chave do meu CPF, que a plataforma demora pra liberar.',
        suspeito: true,
        porque: 'Fugir da plataforma de pagamento tira de você o estorno, a nota e qualquer proteção. Pix para pessoa física é difícil de contestar.',
      },
      {
        texto: 'Indique 3 amigos e ganhe a sua mentoria de graça. Eles indicam mais 3 e você ganha comissão.',
        suspeito: true,
        porque: 'Quando o lucro vem de recrutar gente e não do produto, é estrutura de pirâmide.',
      },
      { texto: 'O material do módulo 1 já está na área de membros.' },
      {
        texto: 'Não precisa saber nada de computador. Em 7 dias você vai estar ganhando em dólar.',
        suspeito: true,
        porque: 'Promessa de resultado rápido, sem esforço e com dinheiro fácil é a assinatura do curso milagroso.',
      },
    ],
    minimo: 4,
    explicacao:
      'Curso milagroso tem padrão: garantia impossível, urgência falsa, pagamento fora da plataforma, recrutamento de amigos e promessa de dinheiro fácil. Quem compra pela internet tem 7 dias para desistir e pedir o dinheiro de volta (artigo 49 do Código de Defesa do Consumidor). Guarde prints, peça por escrito e, se negarem, reclame no Procon.',
  },
  {
    id: 'p5_menor_privilegio',
    tipo: 'quiz',
    titulo: 'Quem pode o quê',
    enunciado:
      'Uma clínica contrata uma estagiária para cadastrar pacientes. O técnico sugere dar a ela conta de administrador no servidor "pra não ficar pedindo senha toda hora". Qual é a decisão certa?',
    opcoes: [
      'Dar administrador, porque é mais prático e ela é de confiança.',
      'Dar acesso só ao sistema de cadastro, com as permissões que a função exige, e revisar quando ela mudar de função ou sair.',
      'Usar uma conta única "recepcao" com a senha colada no monitor, que todo mundo compartilha.',
      'Dar administrador só durante o estágio e tirar no fim.',
    ],
    certa: 1,
    explicacao:
      'Princípio do menor privilégio: cada pessoa e cada sistema recebe só o acesso necessário para a sua tarefa, pelo tempo necessário. Se a conta da estagiária for roubada por phishing, o estrago fica limitado ao cadastro, e não ao servidor inteiro. Conta compartilhada também é ruim: ninguém sabe quem fez o quê.',
  },
  {
    id: 'p5_triagem',
    tipo: 'ordenar',
    titulo: 'Triagem de alerta',
    enunciado: 'Chegou um alerta de "login suspeito". Coloque os passos da triagem na ordem certa.',
    passos: [
      'Ler o alerta e entender qual regra disparou e por quê',
      'Levantar o contexto: quem é o usuário, que máquina, que horário, o que é normal para ele',
      'Correlacionar com outros registros: outros logins, acessos depois do evento, alertas parecidos',
      'Decidir: falso positivo, atividade legítima ou incidente real',
      'Documentar o que foi visto e escalar com as evidências quando for real ou houver dúvida',
    ],
    explicacao:
      'Triagem é como pronto-socorro: primeiro entender o sintoma, depois o histórico, depois os exames, e só então o diagnóstico. Pular para a decisão sem contexto gera falso negativo (ignorar ataque) ou falso positivo (acordar todo mundo por nada). E o que não está documentado, para o próximo turno, não aconteceu.',
  },
  {
    id: 'p5_alerta_mfa',
    tipo: 'quiz',
    titulo: 'Vinte e sete notificações',
    enunciado:
      'Às 3h12, a conta de um diretor recebeu 27 pedidos de aprovação de login no celular, todos recusados, e depois um aprovado. O acesso veio de um país onde a empresa não opera. O que isso indica?',
    opcoes: [
      'Nada demais: ele está viajando e errou o dedo algumas vezes.',
      'Provável fadiga de MFA: alguém tem a senha dele e insistiu até ele aprovar para a notificação parar.',
      'O aplicativo de autenticação está com defeito e deve ser reinstalado.',
      'Ataque de negação de serviço contra o celular do diretor.',
    ],
    certa: 1,
    explicacao:
      'A senha já estava com o atacante (a verificação em duas etapas só pediu a aprovação porque a senha estava certa). Ele dispara pedidos em sequência, de madrugada, até a vítima cansar e aprovar. Resposta: encerrar as sessões, bloquear e trocar a senha, verificar o que foi acessado e falar com o usuário por outro canal.',
  },
  {
    id: 'p5_resposta_incidente',
    tipo: 'ordenar',
    titulo: 'Código azul',
    enunciado: 'Ransomware no hospital. Coloque as etapas da resposta a incidente na ordem certa.',
    passos: [
      'Conter: isolar da rede as máquinas afetadas, sem desligar, para a criptografia não se espalhar',
      'Preservar evidência: copiar registros, memória e amostras antes de mexer, com data, hora e responsável',
      'Erradicar: achar por onde o atacante entrou, fechar a porta e remover contas e programas dele',
      'Recuperar: restaurar a partir de backup limpo e testado, numa rede limpa, e monitorar de perto',
      'Lições aprendidas: reunião sem caça às bruxas, relatório e mudanças para não acontecer de novo',
    ],
    explicacao:
      'Conter primeiro evita que o estrago cresça. Preservar evidência permite descobrir a porta de entrada e apoia a investigação policial. Sem erradicar, o atacante volta pela mesma porta logo depois da restauração. Recuperar de backup testado traz o serviço de volta com segurança. E lições aprendidas transformam o incidente em melhoria, em vez de repetição.',
  },
  {
    id: 'p5_divulgacao',
    tipo: 'quiz',
    titulo: 'A falha no banco',
    enunciado:
      'Dentro do escopo de um programa de bug bounty, você encontra uma falha que deixa ver o extrato de outros clientes. O que fazer?',
    opcoes: [
      'Postar um vídeo mostrando a falha, para pressionar o banco a corrigir rápido.',
      'Baixar extratos de vários clientes para provar que é grave.',
      'Reportar pelo canal do programa, com o impacto e como reproduzir usando só a sua conta de teste, e não divulgar até a correção e a autorização.',
      'Mandar mensagem ao banco oferecendo os detalhes em troca de um valor que você define.',
    ],
    certa: 2,
    explicacao:
      'Divulgação responsável: avisar pelo canal oficial, sem acessar nem guardar dados de terceiros, dar tempo para a correção e só falar em público depois, se as regras permitirem. Expor antes coloca clientes em risco. Baixar dados de outras pessoas viola a LGPD e o próprio escopo. Exigir dinheiro fora do programa é extorsão.',
  },
];

export const notas: Nota[] = [
  {
    id: 'p5_curso_milagroso',
    titulo: 'Curso milagroso',
    texto:
      'Golpe de curso promete aprovação garantida, emprego certo ou dinheiro rápido, cria urgência e empurra pagamento fora da plataforma. O produto real é a sua esperança. Muitas vezes o lucro vem de recrutar novos alunos, como pirâmide.',
    exemplo:
      'Anúncio com carro de luxo alugado: "Vire hacker em 7 dias, de R$ 4.997 por R$ 997". O material é um PDF copiado e o Grupo VIP só vende a próxima mentoria.',
    defesa:
      'Desconfie de garantia e de prazo curto. Procure o nome do curso com "reclamação". Pague só pela plataforma. Compra on-line tem 7 dias de arrependimento (CDC, art. 49): peça o estorno por escrito e guarde prints. Existe muito conteúdo bom e gratuito de comunidades sérias.',
  },
  {
    id: 'p5_menor_privilegio',
    titulo: 'Menor privilégio',
    texto:
      'Cada pessoa, sistema ou fornecedor deve ter só o acesso necessário para a sua função, pelo tempo necessário. Conta de administrador é para tarefa de administrador, e não para ler e-mail. Assim, se uma conta for roubada, o estrago fica pequeno.',
    exemplo:
      'O fornecedor de manutenção de um hospital tinha acesso remoto de administrador a todos os servidores, sem verificação em duas etapas. Bastou roubar essa senha para chegar ao prontuário.',
    defesa:
      'Revise acessos a cada mudança de função e quando alguém sai. Separe a conta do dia a dia da conta administrativa. Dê acesso temporário para tarefas pontuais. Exija verificação em duas etapas em todo acesso remoto.',
  },
  {
    id: 'p5_triagem_alerta',
    titulo: 'Triagem de alerta',
    texto:
      'Um SOC recebe centenas de alertas por noite, e a maioria é ruído. Triagem é decidir, com método, quais são reais: entender o alerta, ver o contexto, cruzar com outros registros, decidir e documentar. Na dúvida, escalar com evidências.',
    exemplo:
      '"Login de local incomum" às 2h: era o funcionário do financeiro em férias em Caldas Novas, com histórico normal. Falso positivo, documentado e fechado em cinco minutos.',
    defesa:
      'Siga o playbook. Anote tudo o que viu, não só a conclusão. Ajuste regras que só geram ruído. Nunca feche alerta crítico por suposição: escalar com evidência nunca é erro.',
  },
  {
    id: 'p5_fadiga_mfa',
    titulo: 'Fadiga de MFA',
    texto:
      'Quando o golpista já tem a senha, a verificação em duas etapas por notificação ainda segura. Então ele manda dezenas de pedidos seguidos, de madrugada, até a pessoa aprovar só para o celular parar de vibrar.',
    exemplo:
      'Um diretor recebe 27 notificações às 3h, recusa todas e aprova a vigésima oitava meio dormindo. Minutos depois, alguém tenta trocar a conta bancária de pagamento de fornecedores.',
    defesa:
      'Nunca aprove login que você não iniciou: recuse e avise a segurança. Prefira métodos com número de confirmação ou chave de segurança física. Empresas devem alertar e bloquear quando há muitos pedidos recusados seguidos.',
  },
  {
    id: 'p5_impostora',
    titulo: 'Síndrome da impostora',
    texto:
      'É a sensação de que você não merece estar onde está e de que vão descobrir que é uma fraude, mesmo com resultados. Pega muito quem é a primeira da família, mulher em área masculina, gente negra e gente do interior. Não é falta de competência: é falta de referência.',
    exemplo:
      'A analista resolve o alerta certo, escala do jeito certo e ainda assim chora no banheiro achando que foi sorte.',
    defesa:
      'Anote toda semana o que você resolveu e releia quando a dúvida bater. Procure mentoria e comunidade. Pergunte sem medo: todo mundo fingiu entender uma sigla um dia. Se o sofrimento for grande, procure ajuda psicológica, inclusive pelo SUS.',
  },
  {
    id: 'p5_resposta_incidente',
    titulo: 'Resposta a incidente',
    texto:
      'Responder a incidente tem ordem: conter, preservar evidência, erradicar, recuperar e aprender. No ransomware, conter é isolar da rede sem desligar, para não perder o que está na memória. Pagar resgate não garante a chave nem que os dados sejam apagados.',
    exemplo:
      'Um hospital tem arquivos criptografados num domingo de madrugada. A equipe isola as máquinas, copia os registros, descobre que a entrada foi um acesso remoto de fornecedor, fecha essa porta e só então restaura do backup.',
    defesa:
      'Tenha um plano escrito antes do incidente, com contatos, papéis e decisões já combinadas. Ensaie a cada seis meses. Registre boletim de ocorrência. Não negocie com criminoso sem apoio jurídico e da diretoria.',
  },
  {
    id: 'p5_backup_offline',
    titulo: 'Backup fora do alcance',
    texto:
      'Ransomware procura e criptografa backups que estão na mesma rede e usam a mesma senha. Backup bom tem ao menos uma cópia desconectada ou imutável, que o atacante não consegue alterar. E backup só vale se a restauração for testada.',
    exemplo:
      'O backup na rede do hospital foi criptografado junto. O que salvou foi o disco que o técnico Seu Jair copiava toda sexta e guardava desligado numa gaveta com chave.',
    defesa:
      'Siga a regra 3-2-1 com uma cópia offline ou imutável. Use credenciais separadas para o sistema de backup. Teste a restauração periodicamente, num ambiente isolado. Saiba quanto tempo leva para voltar e quantos dias de dados você aceita perder.',
  },
  {
    id: 'p5_comunicacao_incidente',
    titulo: 'Comunicar o incidente',
    texto:
      'Incidente com dados pessoais que possa causar risco ou dano relevante deve ser comunicado à ANPD e às pessoas afetadas (LGPD, art. 48). A regra da ANPD dá prazo de três dias úteis a partir do conhecimento. Esconder costuma sair mais caro: o dado aparece, e a confiança vai junto.',
    exemplo:
      'Um hospital diz que foi "instabilidade em manutenção programada". Dez dias depois, os exames aparecem num fórum, e a imprensa descobre que a direção sabia.',
    defesa:
      'Comunique em linguagem simples: o que aconteceu, que dados foram afetados, o que a instituição está fazendo e o que a pessoa deve fazer. Avise que ninguém vai ligar pedindo senha, código ou Pix, porque golpistas aproveitam vazamentos para enganar as vítimas.',
  },
  {
    id: 'p5_rastro_digital',
    titulo: 'Logs não esquecem',
    texto:
      'Quase tudo o que fazemos na internet deixa registro: no provedor de conexão, no aplicativo, no aparelho da outra pessoa. Pelo Marco Civil da Internet, provedores guardam registros de conexão por um ano e de acesso a aplicações por seis meses, e a Justiça pode pedir mais. Apagar do seu lado não apaga do outro.',
    exemplo:
      'Anos depois de entrar na conta de outra pessoa a pedido de um "cliente", a autora é localizada pela perícia, que cruza registros de acesso da conta com mensagens guardadas no celular de quem encomendou.',
    defesa:
      'A melhor defesa é não fazer. Se fez, procure advogada e colabore: destruir provas e mentir para a polícia agrava a situação. Invasão de dispositivo é crime (Lei 12.737/2012, com penas aumentadas pela Lei 14.155/2021).',
  },
  {
    id: 'p5_emprestimo_taxa',
    titulo: 'Empréstimo com taxa antecipada',
    texto:
      'Golpe que oferece empréstimo fácil, sem consulta, e pede uma "taxa de liberação", "seguro" ou "imposto" antes de soltar o dinheiro. O dinheiro nunca vem. Mira justamente quem está endividado e desesperado.',
    exemplo:
      'Mensagem com logo de banco: "Empréstimo pré-aprovado de R$ 15 mil, sem SPC. Pague R$ 490 no Pix para liberar." O Pix vai para uma pessoa física e o número some.',
    defesa:
      'Instituição séria não cobra valor antecipado para liberar crédito: taxas vêm descontadas no contrato. Confira se a empresa é autorizada no site do Banco Central. Para dívidas, procure o seu banco pelos canais oficiais ou mutirões de renegociação. Caiu? Registre boletim de ocorrência e avise o banco na hora.',
  },
  {
    id: 'p5_divulgacao_responsavel',
    titulo: 'Divulgação responsável e bug bounty',
    texto:
      'Quem encontra uma falha deve avisar o responsável por um canal oficial, sem explorar, sem acessar dados de terceiros e dando prazo para correção. Programas de bug bounty definem escopo, regras e recompensa: testar fora do escopo ou sem autorização continua sendo crime.',
    exemplo:
      'Uma pesquisadora acha, dentro do escopo, uma falha que mostra extratos de outros clientes. Reporta pela plataforma usando só a conta de teste. O banco corrige em nove dias e paga a recompensa.',
    defesa:
      'Leia o escopo antes de começar. Sem programa, procure o contato de segurança da empresa (muitos sites publicam um arquivo security.txt) ou peça ajuda ao CERT.br para intermediar. Nunca troque informação de falha por dinheiro fora de um programa: isso é extorsão.',
  },
];
