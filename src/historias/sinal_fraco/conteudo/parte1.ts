import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'p1_quiz_partes_pc',
    tipo: 'quiz',
    titulo: 'Cadê o computador?',
    enunciado: 'No laboratório tem monitor, teclado, mouse e uma caixa bege debaixo da mesa. Qual dessas partes é o computador de verdade, onde as coisas são processadas?',
    opcoes: [
      'O monitor, a "televisão de escrever"',
      'O teclado, porque é por ele que a gente escreve',
      'O gabinete, a caixa onde ficam placa-mãe, processador, memória e disco',
      'O mouse, porque é ele que escolhe tudo',
    ],
    certa: 2,
    explicacao:
      'O gabinete é o computador propriamente dito: lá dentro ficam a placa-mãe, o processador (que faz as contas), a memória RAM, o disco e a fonte. Monitor é dispositivo de saída, só mostra o resultado. Teclado e mouse são dispositivos de entrada, só mandam comandos. Saber o que é cada parte é o primeiro passo para entender onde um problema pode estar.',
  },
  {
    id: 'p1_senha_primeiro_email',
    tipo: 'senha',
    titulo: 'A senha do primeiro e-mail',
    enunciado:
      'Crie a senha do seu primeiro e-mail. Nada de aniversário, nome do cachorro ou "123". Dica da Dona Cida: uma frase comprida e meio sem sentido, que só você entende, é fácil de lembrar e difícil de adivinhar.',
    minimoBits: 50,
    explicacao:
      'O que deixa uma senha forte é o tamanho e a imprevisibilidade. Data de aniversário, nome de bicho, time e sequências como "123" são as primeiras coisas que qualquer pessoa, ou qualquer programa de adivinhação, tenta. Uma frase com várias palavras que não combinam entre si é longa e fácil de lembrar. E cada conta precisa da sua própria senha: se uma vazar, as outras continuam protegidas.',
  },
  {
    id: 'p1_ordenar_montagem',
    tipo: 'ordenar',
    titulo: 'Montando o PC do Tio Juca',
    enunciado: 'O Tio Juca saiu correndo para a oficina. Coloque a montagem na ordem certa e segura antes de ligar o computador.',
    passos: [
      'Tirar o gabinete da tomada e apertar o botão de ligar uma vez, para descarregar o que sobrou de energia',
      'Tocar numa parte de metal do gabinete para descarregar a eletricidade estática do corpo',
      'Encaixar a memória no slot até as travinhas fecharem e ligar os cabos de energia e de dados do HD',
      'Conferir se não sobrou parafuso solto lá dentro nem fio encostando na ventoinha',
      'Fechar o gabinete e conectar monitor, teclado e mouse',
      'Conferir se a chave da fonte está na voltagem da tomada (127 V ou 220 V) e só então ligar no filtro de linha',
    ],
    explicacao:
      'Mexer em peça com o computador na tomada pode dar choque e queimar componentes, então primeiro tira da tomada. A eletricidade estática do corpo também queima peça sensível, por isso se toca no metal antes de pegar na memória. Parafuso solto dentro do gabinete pode causar curto. E fontes antigas têm uma chave manual de voltagem: fonte em 110 V ligada numa tomada de 220 V queima na hora. Fontes mais novas costumam ser automáticas, mas sempre vale conferir a etiqueta.',
  },
  {
    id: 'p1_achar_download_falso',
    tipo: 'achar',
    titulo: 'A página do jogo grátis',
    enunciado: 'A Professora Leni mostra uma página de download. Toque em tudo o que for suspeito.',
    trechos: [
      { texto: 'Endereço: superjogos-gratis-download.biz/corrida-completo', suspeito: true, porque: 'Não é o site de quem fez o jogo nem uma loja oficial. Jogo pago "de graça" num site qualquer é isca clássica.' },
      { texto: 'Corrida dos Carrões 2: versão completa' },
      { texto: 'BAIXAR AGORA (botão verde gigante piscando)', suspeito: true, porque: 'É um anúncio fingindo ser o botão de download. Muitas vezes baixa outro programa, não o que você queria.' },
      { texto: 'Requisitos: Windows XP ou superior, 2 GB de espaço' },
      { texto: 'Desative seu antivírus antes de instalar, ele pode bloquear o jogo', suspeito: true, porque: 'Ninguém honesto pede para desligar a proteção. Quem pede isso quer passar sem ser visto.' },
      { texto: 'Arquivo: corrida_completo.mp3.exe', suspeito: true, porque: 'Extensão dupla: parece música ou jogo, mas termina em .exe, um programa que vai ser executado.' },
      { texto: 'Instale também a Barra MegaBusca (recomendado) [x]', suspeito: true, porque: 'Caixinha já marcada para instalar programa extra que você não pediu. Desmarque, ou melhor, não instale nada daí.' },
      { texto: 'Avaliação dos usuários: comentários de quem jogou' },
    ],
    minimo: 4,
    explicacao:
      'Página de download falsa tem sempre os mesmos sinais: endereço que não é do fabricante, vários botões de "download" que na verdade são anúncios, pedido para desativar o antivírus, arquivo com extensão dupla terminando em .exe e caixinhas pré-marcadas instalando coisa extra. A regra é simples: programa e jogo só do site oficial de quem fez ou da loja oficial do sistema.',
  },
];

export const notas: Nota[] = [
  {
    id: 'p1_o_que_e_hacker',
    titulo: 'Hacker não é sinônimo de bandido',
    texto:
      'Na origem, hacker é quem tem curiosidade de entender como as coisas funcionam por dentro e gosta de resolver problemas. Quem entra em conta ou aparelho dos outros sem permissão está cometendo crime, não importa o nome que se dê. E existe uma profissão inteira de gente que usa esse conhecimento para proteger pessoas e empresas: a segurança da informação.',
    exemplo:
      'Quando um banco descobre uma falha no aplicativo antes dos golpistas, quase sempre foi alguém da equipe de segurança, ou um pesquisador de fora que avisou do jeito certo, que encontrou e reportou.',
    defesa:
      'Curiosidade é ótima. Use sempre no que é seu ou em ambientes feitos para treinar, e nunca na conta, no celular ou no sistema de outra pessoa sem autorização.',
  },
  {
    id: 'p1_partes_do_pc',
    titulo: 'Entrada, processamento e saída',
    texto:
      'Todo computador funciona em três etapas: recebe dados (entrada), processa (pensa) e mostra o resultado (saída). Teclado, mouse e microfone são entrada. O gabinete, com processador e memória, processa. Monitor, caixa de som e impressora são saída.',
    exemplo:
      'Quando você digita no teclado da lan house, a letra viaja até o gabinete, é processada e aparece no monitor. Se a tela apaga mas o gabinete continua com a luz acesa, o problema pode estar só no monitor ou no cabo.',
    defesa:
      'Antes de achar que "o computador morreu", veja qual parte parou: entrada, processamento ou saída. Isso economiza tempo e conserto desnecessário.',
  },
  {
    id: 'p1_senha_forte',
    titulo: 'Senha forte é senha comprida',
    texto:
      'Uma senha forte é longa e imprevisível. Frases com várias palavras que não combinam são fáceis de lembrar e muito difíceis de adivinhar. Aniversário, nome de filho, de bicho ou de time, e "123" no final são as primeiras coisas testadas por quem tenta adivinhar.',
    exemplo:
      'Muita conta de rede social no Brasil é invadida porque a senha é algo como "flamengo2010" ou a data de nascimento, informação que está no próprio perfil da pessoa.',
    defesa:
      'Use uma frase-senha diferente para cada conta, guarde num gerenciador de senhas e ative a verificação em duas etapas sempre que o serviço oferecer.',
  },
  {
    id: 'p1_recuperar_conta',
    titulo: 'A porta dos fundos da conta',
    texto:
      'Pergunta de segurança, e-mail e telefone de recuperação são caminhos para entrar na conta quando você esquece a senha. Se a resposta da pergunta é algo que a cidade inteira sabe, qualquer um pode usar essa porta dos fundos.',
    exemplo:
      'Responder "Pipoca" na pergunta "nome do seu primeiro animal" quando o Pipoca aparece em todas as suas fotos é o mesmo que deixar a chave debaixo do tapete.',
    defesa:
      'Mantenha o e-mail e o celular de recuperação atualizados e, se o serviço ainda usar pergunta de segurança, dê uma resposta inventada que só você sabe e guarde junto com suas senhas.',
  },
  {
    id: 'p1_sair_da_conta',
    titulo: 'Computador compartilhado não é seu',
    texto:
      'Fechar a janela do navegador nem sempre encerra a sessão: a conta pode continuar aberta para o próximo que sentar. Em computador de lan house, escola, biblioteca ou de outra pessoa, o certo é clicar em "Sair" e fechar o navegador inteiro.',
    exemplo:
      'Até hoje gente esquece o e-mail ou a rede social aberta no computador do trabalho ou da gráfica, e o próximo usuário manda mensagem em nome dela, de brincadeira ou de má-fé.',
    defesa:
      'Sempre clique em "Sair". Prefira a janela anônima em computador dos outros, não deixe o navegador salvar a senha e, se esquecer a conta aberta, troque a senha e encerre as sessões ativas nas configurações.',
  },
  {
    id: 'p1_hardware_basico',
    titulo: 'O que tem dentro do gabinete',
    texto:
      'A placa-mãe liga todas as peças. O processador faz as contas e precisa de cooler para não esquentar demais. A memória RAM guarda o que está sendo usado agora e esquece tudo quando desliga. O HD ou SSD guarda os arquivos de forma permanente. A fonte transforma a energia da tomada no que as peças aguentam.',
    exemplo:
      'Computador que desliga sozinho depois de um tempo ligado muitas vezes está superaquecendo por poeira no cooler. Computador que perde os arquivos pode estar com o HD morrendo.',
    defesa:
      'Mantenha o gabinete limpo e ventilado, preste atenção em barulho estranho no disco e faça cópia dos arquivos importantes antes que ele dê problema.',
  },
  {
    id: 'p1_eletricidade_segura',
    titulo: 'Mexer em PC sem levar choque',
    texto:
      'Antes de abrir ou mexer em qualquer peça, tire o computador da tomada. A eletricidade estática do corpo pode queimar componentes, então toque numa parte de metal do gabinete antes de pegar nas peças. Fontes antigas têm chave de voltagem manual: ligar uma fonte em 110 V numa tomada de 220 V queima a fonte e pode causar princípio de incêndio.',
    exemplo:
      'Em boa parte do Brasil, a tomada é 127 V; em outras cidades e regiões, é 220 V. Muita fonte queimou em mudança de cidade porque ninguém olhou a chavinha.',
    defesa:
      'Tire da tomada antes de mexer, confira a etiqueta da fonte e a voltagem da tomada antes de ligar e, se sentir cheiro de queimado, desligue no disjuntor e não tente de novo sem descobrir a causa.',
  },
  {
    id: 'p1_benjamim_e_filtro',
    titulo: 'Benjamim não é tomada extra infinita',
    texto:
      'Ligar muitos aparelhos num benjamim ou extensão sobrecarrega a fiação e pode esquentar, derreter e pegar fogo. O filtro de linha de boa qualidade organiza as tomadas e ajuda contra pequenos picos, mas não faz milagre: uma instalação elétrica com aterramento é o que protege de verdade.',
    exemplo:
      'Benjamim com geladeira, micro-ondas e ferro de passar juntos é uma das causas mais comuns de incêndio doméstico no Brasil.',
    defesa:
      'Não ligue aparelho que puxa muita energia junto com o computador no mesmo benjamim, prefira um filtro de linha certificado pelo Inmetro e desligue tudo da tomada em dia de tempestade.',
  },
  {
    id: 'p1_malware',
    titulo: 'Malware: o programa que trabalha contra você',
    texto:
      'Malware é qualquer programa malicioso, que faz no seu computador ou celular coisas que você não autorizou. Tem o que enche de propaganda (adware), o que espiona e rouba senhas (spyware), o que sequestra arquivos e pede resgate (ransomware) e o que finge ser útil para te enganar (cavalo de Troia).',
    exemplo:
      'O "jogo grátis" que nunca abre, mas deixa o computador lento e cheio de janelas, é um cavalo de Troia clássico: a isca era o jogo, o anzol era o programa escondido.',
    defesa:
      'Instale só de fonte oficial, mantenha sistema e programas atualizados, use um antivírus confiável e desconfie de tudo que é pago e aparece de graça.',
  },
  {
    id: 'p1_programas_indesejados',
    titulo: 'Barra de ferramentas e o "Avançar" sem ler',
    texto:
      'Muito instalador traz programa extra de carona, como barra de ferramentas, troca de página inicial e "otimizador". As caixinhas já vêm marcadas, e quem clica em "Avançar" em tudo aceita tudo. Também existe o falso antivírus, que mostra centenas de vírus inventados e cobra para "remover", que é golpe.',
    exemplo:
      'Janela gritando "SEU COMPUTADOR TEM 347 VÍRUS, PAGUE PARA LIMPAR" é golpe até hoje, inclusive no celular, em forma de anúncio que vibra e imita alerta do sistema.',
    defesa:
      'Leia cada tela do instalador e desmarque o que não pediu. Para remover, use o painel de programas do sistema. Nunca pague programa que aparece do nada dizendo que você está infectado.',
  },
  {
    id: 'p1_fonte_oficial',
    titulo: 'Só baixe da fonte oficial',
    texto:
      'O lugar mais seguro para baixar um programa ou aplicativo é o site de quem fez ou a loja oficial do sistema. Sites que oferecem programa pago de graça costumam colocar malware junto. Em página de download, botão grande piscando quase sempre é anúncio.',
    exemplo:
      'Aplicativo de banco falso com o mesmo logotipo do verdadeiro, divulgado por link no WhatsApp, é um golpe comum no Brasil para roubar senha e dados.',
    defesa:
      'Digite você mesmo o endereço do fabricante ou procure na loja oficial, confira o nome do desenvolvedor, desconfie de arquivo com extensão dupla como ".mp3.exe" e nunca desative o antivírus porque uma página pediu.',
  },
  {
    id: 'p1_antivirus_e_atualizacao',
    titulo: 'Antivírus e atualização andam juntos',
    texto:
      'Antivírus ajuda a encontrar e bloquear programas maliciosos, mas só funciona bem se estiver atualizado. As atualizações do sistema e dos programas corrigem falhas que o malware usa para entrar. Formatar resolve infecção, mas apaga tudo o que não tiver cópia em outro lugar.',
    exemplo:
      'Muita gente formata o computador para tirar vírus e só depois lembra que as fotos da família estavam só ali, sem nenhuma cópia.',
    defesa:
      'Deixe as atualizações automáticas ligadas, use um antivírus de fonte oficial e guarde cópia do que importa em pelo menos mais um lugar antes de qualquer limpeza.',
  },
];
