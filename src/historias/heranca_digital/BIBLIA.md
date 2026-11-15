# Herança Digital: bíblia da história

Tom: drama de família com humor carinhoso, o tipo de riso que aparece em velório brasileiro (o primo que só aparece em enterro, a tia que traz bolo, a discussão sobre quem fica com a furadeira). Luto tratado com respeito; o humor nunca é com a morte, é com a vida que continua. A técnica é de defesa e de organização: acesso legítimo, proteção contra golpes que miram famílias enlutadas, privacidade de quem morreu e de quem ficou, e planejamento para que ninguém passe por isso de novo.

## Premissa

Seu Valter, 68 anos, eletricista aposentado, morreu de repente numa terça. Deixou três filhos ({nome}, a do meio; Rodrigo, o mais velho, que mora longe; e Tainá, a caçula, que ainda mora com a mãe), a viúva Dona Lúcia e um celular com tela trincada que era a chave de tudo: banco, aplicativo de conversa, a verificação em duas etapas de todas as contas, 30 anos de fotos e o chip. O celular está com 23% de bateria e o carregador é de um modelo que ninguém mais tem. Ninguém sabe a senha. Durante as duas semanas seguintes: golpes que leem obituário, a conta dele na rede social que continua ativa, o falso advogado do inventário, as contas que cobram assinatura, o banco, o grupo da família e, no fim, a missa de sétimo dia e o que fica.

## Mecânicas próprias

- **Bateria** no topo: atributo `bateria` (0 a 100), mostrado como 🔋 %. Começa em 23 no capítulo 1. Usar o celular gasta bateria; achar um carregador recarrega. Bateria em 0 desliga o celular e atrasa tudo (marca `celular_apagou`).
- **Cofre de contas**: desafio `formulario` com `visual: 'cofre'` (aparência de cofre/lista de contas). Cada campo é uma conta do Seu Valter (banco, rede social, e-mail, nuvem de fotos, aplicativo de transporte, assinatura de streaming, conta de jogo de paciência) e as opções são ações (recuperar pelo caminho oficial, encerrar, transformar em memorial, guardar e não mexer, entrar com a senha adivinhada). A certa é a ação legítima e adequada para cada caso.
- **Modo conversa**: grupo "Família Valter 🕊️" (que antes se chamava "Churrasco do Valter 🔥" e alguém renomeou), conversa com o falso advogado, mensagens que continuam chegando no celular do pai.
- Outros atributos: `tecnica`, `etica`, `paciencia` (0 a 10, começa 5), `uniao` (união dos irmãos, começa 0), `rel_<id>`.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Renata) | filha do meio, trabalha com suporte de TI numa escola, virou "a que resolve" |
| lucia | Dona Lúcia | viúva, forte, quer as fotos e não quer mais nada, chama o celular de "o aparelho do teu pai" |
| rodrigo | Rodrigo | irmão mais velho, mora em outro estado, prático demais, quer "resolver tudo em dois dias" |
| taina | Tainá | caçula, 19 anos, fala com o pai pelo perfil dele, não quer que nada seja apagado |
| tio_nelson | Tio Nelson | irmão do Valter, contador aposentado, sabe de inventário e de churrasco |
| falso_advogado | "Dr. Ricardo Inventários" | golpista que lê obituário e oferece "liberação rápida de herança" mediante taxa |
| atendente_banco | Atendente do banco | atendimento de agência, humana, segue o procedimento |
| padre | Padre Jonas | padre da paróquia, entende mais de celular do que todo mundo pensa |

## Capítulos

1. **23% de bateria** (terça, hospital e depois a casa): a notícia, o celular do pai no saco plástico do hospital, tela trincada, 23%, sem senha. O grupo da família vira mar de mensagens. Primeira decisão: o que fazer com o celular. `@roupa` (roupa que ela estava ao receber a notícia) e `@muda bateria=23`.
2. **O velório e o carregador** (quarta): velório com humor carinhoso, a procura do carregador entre os parentes, a primeira mensagem estranha no celular do pai ("seu cartão foi bloqueado, clique aqui"). Golpes que miram celular de pessoa que morreu. Desafio mensagem.
3. **Doutor Ricardo resolve seu inventário** (quinta): o falso advogado liga para a Dona Lúcia sabendo o nome do Valter (do obituário) e oferece liberação rápida de valores mediante taxa. Como conferir advogado de verdade (inscrição na OAB pelo cadastro oficial), inventário com advogado escolhido pela família. Desafio achar no visual `email` ou `mensagem`.
4. **O perfil continua postando** (sexta): a conta do Valter na rede social posta "bom dia" sozinha (agendado, aplicativo de terceiros ou invasão?). A Tainá não quer que apaguem. Memorial versus encerrar, contato herdeiro, privacidade de quem morreu. Desafio cofre parcial.
5. **O banco** (segunda): ir à agência com certidão de óbito, não usar a senha do pai para movimentar a conta (mesmo sabendo), bloqueio de cartões, débitos automáticos. O Rodrigo quer "só fazer um Pix da conta dele pra pagar o enterro". Por que isso é problema (inventário, partilha, responsabilidade). Sem citar artigo de lei.
6. **As assinaturas** (terça): o cartão do pai continua pagando streaming, aplicativo de transporte, nuvem de fotos, um jogo de paciência premium e uma revista de pesca. Desafio cofre completo com o destino de cada conta.
7. **As fotos** (quarta à noite): 30 anos de fotos na nuvem e no celular. Como recuperar pelo caminho oficial de cada serviço para familiares, cópia de segurança, o que a família vê e o que talvez não devesse ver (privacidade de quem morreu, sem escândalo). Briga e reconciliação dos irmãos.
8. **Sétimo dia** (missa e almoço): a família reunida, o Padre Jonas, o celular do pai finalmente desligado ou guardado, e a decisão de fazer um plano de herança digital para a Dona Lúcia e para todos.

## Finais (ids)

Bons: `album_da_familia` (as fotos recuperadas viram um álbum impresso que circula entre os netos), `plano_para_todos` (a família inteira faz um plano de herança digital: gerenciador de senhas, contatos de confiança, cada um sabe o que fazer), `memorial_do_valter` (o perfil vira memorial, a Tainá continua escrevendo para o pai lá, e ninguém mais invade).
Agridoces: `irmaos_separados` (tudo resolvido, mas os irmãos param de se falar por um tempo), `celular_na_gaveta` (o celular fica guardado numa gaveta, desligado, com a bateria em 1%, e um pouco de tudo continua por resolver).
Ruins: `taxa_do_inventario` (a família paga o falso advogado e perde dinheiro no pior momento), `conta_invadida_do_pai` (alguém tomou a conta do Valter e pediu dinheiro aos amigos dele no nome dele), `pix_da_discordia` (o Pix tirado da conta do pai sem inventário vira briga judicial entre os irmãos).

## Técnica e direitos (caderno)

Herança digital, por que não usar a senha de quem morreu para movimentar contas, golpes que miram famílias enlutadas (obituário, falso advogado, falso cartório, falsa cobrança), conferir inscrição de advogado no cadastro oficial da OAB, banco e certidão de óbito, débitos automáticos e assinaturas, conta memorial e contato herdeiro nas redes sociais, pedidos de acesso de familiares pelo caminho oficial de cada serviço, chip e verificação em duas etapas (o número do falecido pode ser reaproveitado pela operadora com o tempo), privacidade de quem morreu e de quem conversou com ele, backup das fotos, plano de herança digital (gerenciador de senhas com acesso de emergência, lista de contas, contato de confiança, testamento com orientação de advogado).
