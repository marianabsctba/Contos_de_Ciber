import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'p3_anuncio_aluguel',
    tipo: 'achar',
    titulo: 'O quarto dos sonhos',
    enunciado: 'Anúncio e conversa com o "corretor". Marque os trechos que indicam golpe.',
    trechos: [
      { texto: 'QUARTO MOBILIADO na capital, 5 min do metrô, Wi-Fi e contas inclusas: R$ 350 por mês!', suspeito: true, porque: 'Preço muito abaixo do mercado para a região é a isca clássica. Golpe começa pelo que é bom demais.' },
      { texto: 'Fotos: quarto claro, cama de casal, janela com vista. ' },
      { texto: 'Sou o Wellington, corretor parceiro do proprietário. ' },
      { texto: 'Não dá pra visitar agora porque o inquilino ainda tá lá, mas pode confiar. ', suspeito: true, porque: 'Quem não deixa visitar nem faz chamada de vídeo mostrando o imóvel geralmente não tem imóvel nenhum.' },
      { texto: 'Tem mais 3 interessados, então só seguro a vaga até hoje às 18h. ', suspeito: true, porque: 'Pressa fabricada serve para você não pensar, não pesquisar e não pedir ajuda.' },
      { texto: 'Pra reservar é só fazer um Pix de R$ 400 de caução. ', suspeito: true, porque: 'Pagar antes de visitar e antes de qualquer contrato é exatamente o que o golpista precisa. Pix cai na hora e é difícil de reaver.' },
      { texto: 'A chave Pix tá no nome da minha cunhada, Valéria, que cuida da parte financeira. ', suspeito: true, porque: 'O dinheiro deveria ir para o proprietário ou para a imobiliária. Conta de terceiro é sinal de conta "laranja".' },
      { texto: 'O endereço completo eu mando depois do pagamento. ' },
      { texto: 'Qualquer dúvida me chama aqui no zap, abraço!' },
    ],
    minimo: 4,
    explicacao:
      'Golpe do falso aluguel junta preço irreal, fotos roubadas de anúncio verdadeiro, recusa de visita, pressa e pagamento antecipado por Pix para conta de terceiro. Antes de pagar qualquer coisa: visite (ou faça chamada de vídeo ao vivo no imóvel), faça busca reversa das fotos, confirme quem é o dono e, se houver corretor, consulte o registro dele no CRECI. Pagamento só com contrato e para o titular certo.',
  },
  {
    id: 'p3_troca_titular',
    tipo: 'quiz',
    titulo: 'O marido apressado',
    enunciado:
      'Um homem liga dizendo que a esposa, titular da conta, está internada. Ele sabe o CPF e o nome da mãe dela, chora, grita, ameaça processar e exige trocar agora o celular e o e-mail cadastrados para o número dele. O que você faz?',
    opcoes: [
      'Troca, porque ele acertou o CPF e o nome da mãe, então a identidade está confirmada.',
      'Troca só o e-mail, que é menos importante, para acalmar o cliente.',
      'Não altera nada sem a titular. Explica o procedimento, oferece contato pelo canal já cadastrado e registra a tentativa no sistema.',
      'Passa a senha provisória da conta para ele mesmo resolver pelo aplicativo.',
    ],
    certa: 2,
    explicacao:
      'CPF e nome da mãe vazaram aos milhões e não provam identidade. Trocar celular ou e-mail é o passo que permite ao golpista receber códigos e tomar a conta inteira, por isso é o pedido favorito da engenharia social. Urgência, choro e ameaça são pressão, não prova. O certo é seguir o procedimento, contatar a titular pelo canal que já existe e registrar a tentativa para a equipe de fraude.',
  },
  {
    id: 'p3_hash_cripto',
    tipo: 'quiz',
    titulo: 'Pergunta de entrevista',
    enunciado: 'O entrevistador pergunta: "Qual é a forma correta de um sistema guardar as senhas dos usuários?"',
    opcoes: [
      'Criptografar com AES e guardar a chave no mesmo servidor, para poder mostrar a senha ao usuário quando ele esquecer.',
      'Guardar em Base64, que deixa a senha ilegível.',
      'Guardar só o hash da senha, com sal único por usuário e um algoritmo lento feito para isso, como Argon2 ou bcrypt.',
      'Guardar em texto puro numa tabela que só o administrador acessa.',
    ],
    certa: 2,
    explicacao:
      'Senha não precisa ser recuperada, só conferida. Por isso se guarda o hash: uma função de mão única. O sal (um valor aleatório por usuário) impede que senhas iguais tenham hash igual e inutiliza tabelas prontas, e o algoritmo lento (Argon2, bcrypt, scrypt) torna cara a tentativa em massa se o banco vazar. Criptografia é reversível com a chave, e Base64 nem é proteção: qualquer um decodifica.',
  },
  {
    id: 'p3_vaga_falsa',
    tipo: 'achar',
    titulo: 'A vaga perfeita',
    enunciado: 'Mensagem de uma "recrutadora" no WhatsApp. Marque os sinais de golpe.',
    trechos: [
      { texto: 'Olá, querida! Aqui é a Kelly, do RH. Vi seu currículo e você foi APROVADA para Analista de Segurança Júnior! ', suspeito: true, porque: 'Aprovação sem entrevista, sem teste e sem conversa nenhuma não existe em seleção séria.' },
      { texto: 'Home office, salário de R$ 4.500, sem experiência. ' , suspeito: true, porque: 'Salário acima do mercado para quem não tem experiência, em home office, é a isca perfeita para quem está desesperada.' },
      { texto: 'Para o cadastro, envie foto do RG frente e verso, uma selfie segurando o documento e seus dados bancários. ', suspeito: true, porque: 'Selfie com documento e dados bancários antes de qualquer contrato servem para abrir conta, pedir empréstimo ou passar golpe no seu nome.' },
      { texto: 'O notebook corporativo é enviado após a taxa de material de R$ 89,90, que é reembolsada no primeiro salário. ', suspeito: true, porque: 'Empresa séria não cobra nada para contratar. Taxa de material, curso, exame ou crachá é o golpe.' },
      { texto: 'O pagamento é pelo Pix da nossa parceira de logística. ', suspeito: true, porque: 'Pix para pessoa física ou "parceira" em vez da própria empresa é sinal de conta laranja.' },
      { texto: 'Nossa empresa valoriza pessoas proativas e resilientes. ' },
      { texto: 'As vagas fecham hoje, então responda o quanto antes!', suspeito: true, porque: 'Pressa de novo: a urgência existe para você não confirmar a vaga no site oficial.' },
    ],
    minimo: 4,
    explicacao:
      'Golpe de vaga falsa usa o nome de empresas e recrutadores reais, aprova sem processo, oferece salário irreal e cobra uma "taxa" ou pede documentos e selfie. Confirme a vaga no site oficial ou no perfil verificado da empresa, fale com o recrutador por um canal que você encontrou sozinha e nunca pague para ser contratada. Documentos de admissão só depois da proposta formal, pelo canal da empresa.',
  },
  {
    id: 'p3_ctf_base64',
    tipo: 'quiz',
    titulo: 'Primeira flag',
    enunciado:
      'No desafio mais fácil do CTF aparece só isto: RkxBR3tjb2RpZmljYXJfbmFvX2VfY2lmcmFyfQ== . O que é mais provável?',
    opcoes: [
      'Um hash de senha, impossível de reverter.',
      'Um texto em Base64: só letras, números e o "==" de preenchimento no fim. Basta decodificar.',
      'Uma chave de criptografia militar que exige supercomputador.',
      'Um vírus, e é melhor fechar o notebook.',
    ],
    certa: 1,
    explicacao:
      'Base64 é codificação, não criptografia: transforma dados em texto usando A a Z, a a z, 0 a 9, "+" e "/", com "=" de preenchimento no fim. Qualquer um decodifica, sem chave. Decodificado, vira FLAG{codificar_nao_e_cifrar}. Na vida real, ver senha "escondida" em Base64 num arquivo de configuração é achado de segurança, porque isso não protege nada.',
  },
  {
    id: 'p3_ctf_metodo',
    tipo: 'ordenar',
    titulo: 'O método da Iracema',
    enunciado: 'Coloque em ordem o jeito certo de atacar um desafio de CTF (e quase qualquer problema).',
    passos: [
      'Ler o enunciado inteiro, duas vezes, e anotar cada pista.',
      'Olhar o que foi entregue (arquivo, página, texto) sem mudar nada.',
      'Levantar hipóteses: o que isto parece ser?',
      'Testar uma hipótese por vez e anotar o resultado, inclusive o que deu errado.',
      'Enviar a flag só quando tiver certeza do formato.',
      'Depois do evento, escrever o writeup e ler o dos outros times.',
    ],
    explicacao:
      'CTF premia método, não chute. Ler com calma, observar sem alterar, testar uma hipótese por vez e anotar tudo é o mesmo raciocínio de uma investigação de incidente. O writeup (o relato de como resolveu) é onde a maior parte do aprendizado acontece, e ler o dos outros mostra caminhos que você nem imaginava.',
  },
];

export const notas: Nota[] = [
  {
    id: 'p3_golpe_aluguel',
    titulo: 'Golpe do falso aluguel',
    texto:
      'O golpista copia fotos de um anúncio verdadeiro, põe preço abaixo do mercado e pede caução ou "sinal" por Pix antes da visita. Ele sempre tem pressa e sempre tem um motivo para você não ver o imóvel.',
    exemplo:
      'Estudante do interior paga R$ 400 para "reservar" um quarto perto do metrô, chega com a mala na porta e descobre que outras três pessoas pagaram pelo mesmo quarto, que nunca esteve para alugar.',
    defesa:
      'Visite antes ou peça chamada de vídeo ao vivo no imóvel, faça busca reversa das fotos, confirme o dono e o registro do corretor no CRECI, e só pague com contrato, para o titular certo.',
  },
  {
    id: 'p3_med_pix',
    titulo: 'Caí no golpe do Pix: e agora?',
    texto:
      'O Pix não tem "cancelar", mas existe o MED, o Mecanismo Especial de Devolução do Banco Central. Avisado do golpe, o seu banco aciona o banco de quem recebeu, que pode bloquear o dinheiro se ainda houver saldo na conta.',
    exemplo:
      'Quem avisa o banco no mesmo dia tem muito mais chance: golpista costuma espalhar o dinheiro por outras contas em minutos.',
    defesa:
      'Contate o banco pelo app ou pelos canais oficiais o quanto antes (o prazo para pedir é de até 80 dias), registre boletim de ocorrência (muitos estados têm delegacia online) e guarde prints e comprovantes.',
  },
  {
    id: 'p3_engenharia_social',
    titulo: 'Engenharia social',
    texto:
      'É atacar a pessoa em vez do sistema: convencer alguém a abrir uma exceção, passar um dado ou fazer uma troca. Os gatilhos de sempre são urgência, autoridade, emoção e intimidade falsa.',
    exemplo:
      'Golpista liga para a central da operadora fingindo ser o cliente, chora, diz que é emergência e pede para trocar o chip ou o e-mail. Com isso recebe os códigos de verificação e toma o WhatsApp e o banco da vítima.',
    defesa:
      'Para quem atende: procedimento não tem exceção por pressão, confirme pelo canal já cadastrado e registre a tentativa. Para quem é cliente: cadastre senha ou PIN na operadora e prefira verificação em duas etapas por aplicativo.',
  },
  {
    id: 'p3_verificacao_identidade',
    titulo: 'Pergunta de segurança não é segurança',
    texto:
      'Nome da mãe, CPF, data de nascimento e endereço já vazaram tantas vezes que qualquer golpista tem. Confirmar identidade só com esses dados é como trancar a porta e deixar a chave pendurada na maçaneta.',
    exemplo:
      'Num call center, o golpista acerta todas as "perguntas de segurança" lendo de uma planilha vazada, enquanto o cliente de verdade erra o próprio CEP antigo.',
    defesa:
      'Sistemas sérios confirmam por algo que só o titular tem: código no aparelho já cadastrado, token no app, biometria, retorno no contato que já existia. Desconfie de empresa que pede só dados pessoais.',
  },
  {
    id: 'p3_pendrive_desconhecido',
    titulo: 'Pendrive que caiu do céu',
    texto:
      'Pendrive de origem desconhecida pode vir com programa malicioso, e alguns aparelhos que parecem pendrive se apresentam ao computador como teclado e digitam comandos sozinhos. Conectar é confiar cegamente em quem fez.',
    exemplo:
      'O "kit hacker" vendido em rede social chega com um pendrive "mágico". O único sistema que ele invade é o seu.',
    defesa:
      'Não conecte dispositivo que você não sabe de onde veio, nem os achados no estacionamento. No trabalho, entregue para a equipe de segurança.',
  },
  {
    id: 'p3_hash_vs_cripto',
    titulo: 'Hash, criptografia e codificação',
    texto:
      'Hash é mão única: gera um resumo de tamanho fixo que não se desfaz, ótimo para conferir senha e integridade de arquivo. Criptografia é reversível para quem tem a chave. Codificação (como Base64) só muda o formato, e qualquer um desfaz.',
    exemplo:
      'Uma loja virtual que "criptografa" senhas e consegue te mostrar a sua quando você esquece está guardando a senha de um jeito reversível. Se vazar a chave, vaza tudo.',
    defesa:
      'Senhas: hash com sal e algoritmo lento (Argon2, bcrypt). Dados que precisam voltar: criptografia com chave bem guardada. Base64 nunca é proteção.',
  },
  {
    id: 'p3_discriminacao_entrevista',
    titulo: '"Você pretende ter filhos?"',
    texto:
      'A Lei 9.029/1995 proíbe práticas discriminatórias para acesso ao emprego por motivo de sexo, estado civil, situação familiar, raça, cor, idade, deficiência, entre outros, e proíbe exigir teste ou atestado de gravidez. Usar filhos ou planos de gravidez como critério de seleção é discriminação.',
    exemplo:
      'Candidata é a única a ouvir a pergunta sobre filhos; os candidatos homens da mesma vaga, não. Dias depois, recebe "sem fit cultural".',
    defesa:
      'Você pode responder que isso não é relevante para a vaga. Anote data, nome de quem perguntou e guarde e-mails. Dá para denunciar ao Ministério Público do Trabalho pelo site do MPT.',
  },
  {
    id: 'p3_teste_tecnico',
    titulo: 'Teste técnico ou trabalho de graça?',
    texto:
      'Teste técnico honesto tem escopo claro, tempo curto (poucas horas) e avalia raciocínio. Quando pedem um projeto de dezenas de horas resolvendo um problema real do produto da empresa, é trabalho sem pagamento com outro nome.',
    exemplo:
      '"Um desafiozinho": política de segurança completa, análise do sistema deles e apresentação em 48 horas. Depois, silêncio.',
    defesa:
      'Pergunte quanto tempo esperam, se o teste é remunerado e o que será feito com a entrega. Fazer uma parte bem feita e explicar o seu limite também é resposta.',
  },
  {
    id: 'p3_golpe_vaga_falsa',
    titulo: 'Golpe da vaga falsa',
    texto:
      'Usa nome e foto de empresas e recrutadores reais, aprova sem entrevista, oferece salário irreal e pede uma "taxa" (material, curso, exame, crachá) ou documentos e selfie. Empresa séria não cobra para contratar.',
    exemplo:
      'Perfil clonado de uma recrutadora do LinkedIn manda no WhatsApp: "Aprovada! Só falta o Pix de R$ 89,90 do kit". Dezenas de pessoas pagam no mesmo dia.',
    defesa:
      'Confirme a vaga no site oficial ou no perfil verificado da empresa, fale com o recrutador por um canal que você mesma encontrou, nunca pague e nunca mande selfie com documento antes de uma proposta formal.',
  },
  {
    id: 'p3_documentos_com_golpista',
    titulo: 'Mandei documento para golpista',
    texto:
      'Com RG, selfie e dados bancários, o golpista pode tentar abrir conta, pedir crédito ou aplicar golpes no seu nome. Agir rápido reduz muito o estrago.',
    exemplo:
      'Semanas depois de uma vaga falsa, a vítima descobre uma conta digital aberta no nome dela e usada para receber Pix de outros golpes.',
    defesa:
      'Faça boletim de ocorrência, avise seu banco, consulte no Registrato do Banco Central se abriram contas ou empréstimos no seu CPF, acompanhe seu CPF nos birôs de crédito e avise a empresa que teve o nome usado.',
  },
  {
    id: 'p3_denunciar_golpe',
    titulo: 'Percebi o golpe: e agora?',
    texto:
      'Não responder já é ótimo; denunciar é melhor. Cada perfil e número derrubado é um golpe a menos na tia do grupo da família.',
    exemplo:
      'Uma candidata desconfia da vaga, procura a recrutadora verdadeira e descobre que o perfil foi clonado. O aviso dela no LinkedIn salva várias pessoas.',
    defesa:
      'Denuncie o número no WhatsApp e o perfil na plataforma, avise a empresa e a pessoa que tiveram o nome usado e alerte seus grupos. Não fique "zoando" o golpista: ele tem seu número.',
  },
  {
    id: 'p3_ctf',
    titulo: 'O que é CTF',
    texto:
      'Capture the Flag é uma gincana de segurança. Cada desafio esconde uma "flag", um texto no formato FLAG{...}; achou, enviou, pontuou. As categorias costumam ser web, criptografia, forense, engenharia reversa e OSINT, tudo em ambiente montado e autorizado para isso.',
    exemplo:
      'No formato jeopardy, há um quadro de desafios com pontos crescentes; no ataque e defesa, cada time protege o próprio servidor enquanto testa os dos outros, dentro das regras do evento.',
    defesa:
      'Para começar: plataformas gratuitas de treino, um time, um caderno e writeups. Treinar só onde há autorização; fora do CTF, testar sistema alheio sem permissão é crime.',
  },
  {
    id: 'p3_base64',
    titulo: 'Base64 não esconde nada',
    texto:
      'Base64 transforma bytes em texto usando letras, números, "+" e "/", muitas vezes com "=" no fim. Serve para transportar dados, não para protegê-los: decodificar não precisa de chave.',
    exemplo:
      'Arquivo de configuração com a senha do banco de dados "protegida" em Base64. Qualquer estagiário curioso lê em dez segundos.',
    defesa:
      'Segredo de verdade vai para um cofre de segredos ou é criptografado com chave bem guardada. Se achar senha em Base64 no trabalho, reporte.',
  },
];
