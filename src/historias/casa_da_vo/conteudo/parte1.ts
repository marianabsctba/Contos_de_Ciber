import type { Desafio, Nota } from '../../../motor/tipos';

export const desafios: Desafio[] = [
  {
    id: 'v1_planta_domingo',
    tipo: 'achar',
    titulo: 'A primeira varredura',
    enunciado:
      'A planta da casa da Vó Zilá, desenhada num papel de pão, com cada aparelho que o Caíque instalou. Toque em tudo que deixa a casa em risco.',
    visual: 'casa',
    trechos: [
      {
        texto: '📷 Sala: câmera nova, usuário admin e senha admin',
        suspeito: true,
        porque:
          'Senha de fábrica é a primeira que qualquer programa testa. Existem sites que listam câmeras abertas na internet justamente porque muita gente nunca troca. Troque no primeiro uso por uma senha forte e única.',
      },
      {
        texto: '🔔 Portão: campainha com vídeo, atualização pendente desde a instalação',
        suspeito: true,
        porque:
          'Atualização corrige falhas que o fabricante já descobriu. Aparelho que nunca é atualizado continua com todas elas. Atualize o aparelho e o aplicativo.',
      },
      { texto: '💡 Varanda: lâmpada colorida, conta da vó com senha própria, atualizada' },
      {
        texto: '🔒 Porta: fechadura com senha 1234',
        suspeito: true,
        porque: '1234 é a primeira tentativa de qualquer pessoa. Senha de fechadura não pode ser sequência, aniversário nem número da casa.',
      },
      {
        texto: '🗣️ Cozinha: assistente de voz com compra por voz ligada, cartão salvo e sem confirmação',
        suspeito: true,
        porque:
          'Sem confirmação, qualquer voz parecida com um pedido vira compra, até a da televisão. Ligue a confirmação por código ou desligue as compras por voz.',
      },
      { texto: '☕ Cozinha: tomada da cafeteira, só liga às 6h e desliga às 8h' },
      { texto: '⚖️ Banheiro: balança que manda o peso só para o celular da vó' },
      { texto: '📻 Quarto: rádio de pilha de 1978, sem Wi-Fi nenhum' },
    ],
    minimo: 3,
    explicacao:
      'Nem todo aparelho moderno é perigoso. O risco está na senha que veio na caixa, na atualização que nunca foi feita e nas funções que ninguém configurou, como a compra por voz sem confirmação. Para cada aparelho: senha forte e única no primeiro uso, atualização em dia e só as funções que a dona da casa quer usar.',
  },
  {
    id: 'v2_config_moca',
    tipo: 'formulario',
    titulo: 'As configurações da moça',
    enunciado:
      'A tela de configurações da assistente de voz, com tudo no padrão de fábrica. Escolha, junto com a vó, como cada coisa deve ficar.',
    visual: 'documento',
    campos: [
      {
        rotulo: 'Compras por voz',
        opcoes: [
          'Ligadas, sem confirmação, para ser mais prático',
          'Ligadas só para compras de valor baixo',
          'Ligadas com um código de confirmação que só a vó sabe, ou desligadas se ela preferir',
        ],
        certa: 2,
        porque:
          'Limite de valor não impede doze pedidos pequenos. Quem confirma a compra tem que ser uma pessoa, com um código que a televisão não sabe falar.',
      },
      {
        rotulo: 'Gravações guardadas',
        opcoes: [
          'Guardar tudo para sempre, vai que precisa',
          'Revisar de vez em quando, apagar o que não quer e ligar a exclusão automática depois de um período',
          'Mandar uma cópia de cada gravação para o Caíque',
        ],
        certa: 1,
        porque:
          'A assistente guarda trechos de áudio na conta, inclusive de visitas. Nas configurações dá para ouvir, apagar e programar para apagar sozinho.',
      },
      {
        rotulo: 'Microfone',
        opcoes: [
          'Sempre ligado, inclusive com visita em casa',
          'Desligado pelo botão do próprio aparelho quando quiser privacidade, com a luz mostrando que está desligado',
          'Coberto com fita adesiva',
        ],
        certa: 1,
        porque:
          'Fita adesiva não impede o microfone de ouvir. O botão do aparelho desliga o microfone de verdade, e a luz mostra para todo mundo na sala que ele está desligado.',
      },
      {
        rotulo: 'Aviso de pedidos',
        opcoes: [
          'Nenhum aviso, para não incomodar',
          'Aviso de cada pedido no celular da vó',
          'Aviso só no e-mail do Caíque',
        ],
        certa: 1,
        porque: 'Quem precisa saber de cada pedido é a dona da conta. Assim ela percebe na hora qualquer compra que não fez.',
      },
    ],
    minimo: 3,
    explicacao:
      'Assistente de voz fica esperando a palavra de ativação e, quando acha que ouviu, grava um trecho e manda para interpretar. Por isso ela erra com a televisão e grava visitas. Configure compras por voz com confirmação por código, ou desligue; revise e apague as gravações nas configurações e ligue a exclusão automática; use o botão de microfone desligado quando quiser privacidade; e mantenha os avisos de pedido no celular de quem é dona da conta.',
  },
  {
    id: 'v3_quem_ve_o_portao',
    tipo: 'achar',
    titulo: 'Quem vê o quê',
    enunciado:
      'A planta da casa de novo, agora com quem tem acesso a cada aparelho, tirada da tela "Membros e acessos". Toque em tudo que precisa ser revisto.',
    visual: 'casa',
    trechos: [
      { texto: '👵 Portão: Vó Zilá, dona da conta, com senha própria' },
      {
        texto: '👥 Portão: "Bigode Futsal", convite aceito, vê ao vivo',
        suspeito: true,
        porque: 'Um amigo do Caíque que a vó nem conhece vê quem entra e sai da casa dela. Acesso só para quem a dona da casa quer.',
      },
      {
        texto: '💔 Portão: "Tati ❤️", convite aceito, último acesso às 3h da manhã',
        suspeito: true,
        porque: 'Ex-namorada continua com acesso porque ninguém revisou a lista. Acesso que não faz mais sentido tem que ser removido.',
      },
      {
        texto: '👀 Portão: "Jura Vila 7", vê gravações e recebe aviso de cada visita, sem a vó saber',
        suspeito: true,
        porque:
          'Pode até ser vizinha de confiança, mas a vó não sabia. Quem decide quem vê e o quanto vê é a dona da casa, e dá para dar só o aviso, sem as gravações.',
      },
      {
        texto: '🔔 Portão: campainha pedindo atualização há 17 dias',
        suspeito: true,
        porque: 'A atualização traz correções de segurança. Instale assim que aparecer, no aparelho e no aplicativo.',
      },
      { texto: '📷 Sala: câmera com acesso da vó e do Caíque, cada um com a própria conta' },
      { texto: '💡 Varanda: lâmpada colorida, sem ninguém convidado' },
      { texto: '☕ Cozinha: tomada da cafeteira, só a conta da vó' },
    ],
    minimo: 3,
    explicacao:
      'Aplicativo de campainha e de câmera facilita convidar gente, e quase ninguém revisa depois. Abra a lista de membros e acessos, remova quem não precisa mais, dê a cada pessoa a própria conta em vez de dividir senha, limite o que cada uma vê quando o aplicativo permitir e atualize o aparelho. Quem decide é quem mora na casa.',
  },
  {
    id: 'v4_fechadura_config',
    tipo: 'formulario',
    titulo: 'A fechadura da vó',
    enunciado: 'Onze da noite, café na mesa e o Sargento Lopes de testemunha. Escolha como fica cada coisa da fechadura.',
    visual: 'documento',
    campos: [
      {
        rotulo: 'Senha da porta',
        opcoes: [
          '1234, porque é fácil de lembrar',
          'A data de aniversário da vó',
          'Uma sequência longa que só a vó sabe, sem datas, telefone nem número da casa',
        ],
        certa: 2,
        porque: 'Sequência e aniversário são as primeiras tentativas de qualquer um. Senha de porta tem que ser fácil para a dona lembrar e difícil para os outros adivinharem.',
      },
      {
        rotulo: 'Quando o entregador de gás vier',
        opcoes: [
          'Passar a senha principal por telefone',
          'Criar uma senha temporária só para aquele horário, se a fechadura permitir, ou combinar a entrega com alguém em casa',
          'Deixar a porta destrancada',
        ],
        certa: 1,
        porque: 'Senha principal compartilhada continua valendo para sempre, para quem recebeu e para quem ouviu. Senha temporária expira sozinha.',
      },
      {
        rotulo: 'Chave física de reserva',
        opcoes: [
          'Na gaveta da cozinha, dentro de casa',
          'Debaixo do vaso da varanda',
          'Com alguém de confiança fora de casa, ou na bolsa, longe do documento com endereço',
        ],
        certa: 2,
        porque: 'Chave reserva serve quando a fechadura falha. Dentro de casa ela não ajuda, e debaixo do vaso qualquer um acha.',
      },
      {
        rotulo: 'Quando a fechadura apitar',
        opcoes: [
          'Ignorar, deve ser a assistente de voz',
          'Trocar as pilhas logo, ter pilhas reserva e ligar o aviso de bateria fraca no celular',
          'Tirar as pilhas para o apito parar',
        ],
        certa: 1,
        porque: 'O apito é o aviso de bateria fraca. Ignorar é esperar a noite em que ela acaba de vez com você do lado de fora.',
      },
      {
        rotulo: 'Na hora de digitar a senha',
        opcoes: ['Em voz alta, para não errar', 'Cobrindo o teclado com a mão, sem ninguém olhando'],
        certa: 1,
        porque: 'Senha falada na rua é senha compartilhada com a vila inteira.',
      },
    ],
    minimo: 4,
    explicacao:
      'Fechadura eletrônica é boa quando a senha não é óbvia, quando não é passada para prestadores (use senha temporária se o aparelho permitir), quando existe uma chave física de reserva em lugar útil e quando a bateria é trocada no primeiro aviso. Muitas fechaduras têm um jeito de emergência para bateria esgotada, descrito no manual do fabricante: vale ler antes de precisar.',
  },
];

export const notas: Nota[] = [
  {
    id: 'v1_senha_de_fabrica',
    titulo: 'Senha de fábrica',
    texto:
      'Muitos aparelhos saem da caixa com usuário e senha iguais para todos os compradores, como "admin" e "admin". Essas senhas são públicas: estão nos manuais e em listas que programas automáticos testam, sem parar, em tudo que está ligado na internet.',
    exemplo: 'A câmera da sala da Vó Zilá, instalada numa tarde, com usuário admin e senha admin, apertando "avançar" até acabar.',
    defesa:
      'Troque a senha de fábrica no primeiro uso, por uma senha forte e única para cada aparelho. Atualize o aparelho e o aplicativo. Desligue o acesso pela internet que você não usa.',
  },
  {
    id: 'v1_camera_aberta',
    titulo: 'Câmera aberta na internet',
    texto:
      'Existem sites que listam câmeras abertas na internet: aparelhos com senha padrão, ou sem senha, que qualquer pessoa consegue assistir. Ninguém escolhe a sua casa; a câmera aparece porque está aberta.',
    exemplo: 'Uma reportagem com miniaturas borradas de salas de estar. Num canto, um sofá com manta de crochê roxa e um santo na estante.',
    defesa:
      'Olhe a configuração da câmera da sua família: senha, atualização e acesso remoto. Se estiver aberta, troque a senha, atualize e revise quem tem acesso. Nunca procure nem abra a câmera de outra pessoa.',
  },
  {
    id: 'v1_camera_em_casa',
    titulo: 'Câmera dentro de casa',
    texto:
      'Câmera dentro de casa filma quem mora e quem visita. Quem vê as imagens, onde ficam guardadas e para onde a lente aponta são decisões de quem mora, com consentimento.',
    exemplo: '"Fica a câmera, mas virada para a porta, não para o meu sofá. E quem vê sou eu e os meus netos."',
    defesa:
      'Pergunte a quem mora se quer a câmera e onde. Câmera não precisa ficar no quarto nem no banheiro. Cada pessoa com acesso tem a própria conta, e a lista de quem vê é curta e revisada.',
  },
  {
    id: 'v2_compra_por_voz',
    titulo: 'Compra por voz',
    texto:
      'Com a compra por voz ligada e um cartão salvo, a assistente pode concluir um pedido ao ouvir uma frase parecida com um pedido, inclusive da televisão, do rádio ou de uma criança.',
    exemplo: 'A personagem da novela grita "Ô moça, compra logo doze pacotes de fralda!". A assistente responde: "Pedido confirmado."',
    defesa:
      'Ligue a confirmação por código para compras por voz, ou desligue a função. Ative o aviso de cada pedido no celular de quem é dona da conta. Se acontecer, cancele no aplicativo da loja o quanto antes.',
  },
  {
    id: 'v2_gravacoes',
    titulo: 'O que a assistente grava',
    texto:
      'A assistente fica esperando a palavra de ativação. Quando acha que ouviu, grava um trecho e manda para interpretar. Esses trechos ficam guardados na conta, às vezes com conversas que nada têm a ver com pedido.',
    exemplo: 'Na lista de gravações: a vó cantando na pia, o terço inteiro e a Dona Jura contando quem deve o condomínio.',
    defesa:
      'Nas configurações da assistente, revise as gravações, apague o que não quer e ligue a exclusão automática. Quem decide o que fica é a dona da conta.',
  },
  {
    id: 'v2_microfone_visitas',
    titulo: 'Microfone e visitas',
    texto:
      'Quem visita não sabe que tem uma assistente ouvindo. A privacidade de quem entra na casa também conta.',
    exemplo: 'A Dona Jura, na cozinha da vizinha, falando "umas coisas que não são para ficar escritas".',
    defesa:
      'Use o botão de microfone desligado do próprio aparelho quando quiser privacidade, por exemplo com visita. A luz mostra que ele está desligado. Fita adesiva não impede o microfone de ouvir.',
  },
  {
    id: 'v3_convites_acesso',
    titulo: 'Convites e acessos compartilhados',
    texto:
      'Campainha e câmera conectadas deixam convidar outras pessoas para ver as imagens. É fácil convidar e quase ninguém revisa depois: amigos, ex-namoradas e vizinhos continuam com acesso.',
    exemplo: 'Na lista "Membros e acessos": Bigode Futsal, Tati com coração e Jura Vila 7, que via cada visita sem a vó saber.',
    defesa:
      'Abra a lista de acessos e remova quem não precisa. Cada pessoa com a própria conta, nada de dividir senha. Limite o que cada um vê, quando o aplicativo permitir. Quem decide é quem mora.',
  },
  {
    id: 'v3_atualizacao',
    titulo: 'Atualização e fim do suporte',
    texto:
      'O fabricante corrige falhas por atualizações. Aparelho que nunca é atualizado fica com todas as falhas conhecidas. Aparelho que o fabricante parou de atualizar não recebe mais correção nenhuma.',
    exemplo: 'A campainha pedindo atualização há dezessete dias, e uma babá eletrônica no armário sem atualização desde 2019.',
    defesa:
      'Atualize aparelho e aplicativo assim que aparecer a atualização, ou ligue a atualização automática. Aparelho sem atualização e sem suporte do fabricante é candidato a sair da tomada.',
  },
  {
    id: 'v3_vizinho_suspeito',
    titulo: 'Carro estranho na rua',
    texto:
      'Quando alguma coisa parece suspeita, a vontade é ir lá perguntar ou postar a placa no grupo do bairro. As duas coisas podem colocar você em risco ou expor alguém inocente.',
    exemplo: 'O carro prata que passou cinco vezes na vila era da autoescola, com uma aluna de dezoito anos treinando baliza.',
    defesa:
      'Não confronte, não exponha placa nem foto em grupo. Anote o que viu e avise a polícia. Em emergência, ligue 190.',
  },
  {
    id: 'v4_senha_fechadura',
    titulo: 'Senha de fechadura eletrônica',
    texto:
      'Fechadura com senha numérica é tão boa quanto a senha. Sequência, aniversário e número da casa são as primeiras tentativas de qualquer pessoa. E senha falada em voz alta deixa de ser segredo.',
    exemplo: '"Um. Dois. Três. Quatro." Às onze da noite, na rua, com uma janela se fechando do outro lado.',
    defesa:
      'Use uma sequência longa que só você sabe, sem datas, telefone ou endereço. Digite cobrindo o teclado. Troque a senha se desconfiar que alguém soube.',
  },
  {
    id: 'v4_bateria_e_chave',
    titulo: 'Bateria e chave física',
    texto:
      'Fechadura eletrônica funciona com pilha. Quando a pilha está acabando, ela apita. Quando acaba, o teclado apaga. Muitos modelos têm chave física e um jeito de emergência, descritos no manual.',
    exemplo: 'A vó no banquinho do portão, às dez da noite, com a chave de reserva na gaveta da cozinha, do lado de dentro.',
    defesa:
      'Troque as pilhas no primeiro aviso e tenha pilhas reserva. Ligue o aviso de bateria no celular. Leia no manual oficial o que fazer com a bateria esgotada. Deixe uma chave física com alguém de confiança ou na bolsa, longe do documento com endereço.',
  },
  {
    id: 'v4_prestadores',
    titulo: 'Senha para prestador de serviço',
    texto:
      'Dar a senha principal para o entregador, o técnico ou a faxineira é dar uma senha que vale para sempre, para quem recebeu e para quem ele contar.',
    exemplo: 'A vó, na missa das seis, passando a senha da porta por telefone para o moço do gás deixar o botijão.',
    defesa:
      'Se a fechadura permitir, crie uma senha temporária, que vale só naquele dia e horário. Se não permitir, combine a entrega com alguém em casa. Se já passou a senha principal, troque.',
  },
];
