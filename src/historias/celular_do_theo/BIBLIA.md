# O Primeiro Celular do Theo: bíblia da história

Tom: comédia de família com ternura, contada por dois lados. A mãe que pesquisa tudo e entra em pânico, o filho de 11 anos que sabe mais de jogo do que ela e menos de perigo do que acha. Segurança digital infantil tratada com respeito e sem terror: o objetivo é o Theo contar para a mãe quando algo der errado. A técnica é sempre de defesa e de educação: configuração, conversa, regras combinadas, reconhecer golpe e saber pedir ajuda.

## Premissa

{nome}, 38 anos, mãe solo, enfermeira em plantão de 12 por 36, resolveu dar o primeiro celular ao filho, o Theo, de 11 anos, que vai começar o sexto ano numa escola nova e vai de ônibus sozinho. É um celular simples, usado, herdado da prima. Em um bimestre: configuração, o grupo da sala, o jogo das moedas, a conta do cartão da mãe, a foto com o uniforme, o grupo que vira lugar de zoação, o desafio viral perigoso, um desconhecido no jogo que quer conversar em outro aplicativo, e a reunião de pais no fim do bimestre.

## Mecânicas próprias

- **Dois pontos de vista**: o comando `@pov theo` faz a protagonista virar o Theo: o `EU:` passa a ser o Theo (nome e aparência dele), e o `{nome}` continua sendo o nome da mãe. `@pov fim` volta para a mãe. Use em cenas inteiras ou capítulos inteiros do lado dele. Escolhas da mãe mudam o que o Theo vive, e o que o Theo escolhe muda o que a mãe descobre (marcas).
- **Confiança** no topo: atributo `confianca` (0 a 10), mostrado como 🤝. Começa em 5. Sobe quando a mãe escuta, explica e combina; desce quando proíbe tudo sem conversar, espiona escondido, humilha ou grita. Quando o Theo está com problema, ele só conta se `confianca` estiver alta o bastante (`@se confianca>=6`). É a mecânica central.
- **Modo conversa**: grupo "6º B 🔥🔥🔥" (do lado do Theo), grupo "Mães e Pais 6º B 📚" (do lado da mãe), chat do jogo, conversa da mãe com a ex-sogra, conversa do Theo com o melhor amigo.
- Outros atributos: `tecnica`, `etica`, `paciencia` (0 a 10, começa 5), `rel_<id>`.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Michele), a mãe | enfermeira, cansada, atenta, faz pesquisa em fórum de mãe à meia-noite |
| theo | Theo | 11 anos, inteligente, ansioso com a escola nova, joga um jogo de construir mundos (fictício: "BlocoVerso"), quer ser youtuber |
| vo_cida | Vó Cida | avó paterna, cuida do Theo nos plantões, acha que "no meu tempo era só desligar a tomada" |
| gui | Gui | melhor amigo do Theo, 11 anos, o que conhece todos os atalhos |
| prof_renata | Professora Renata | professora de tecnologia da escola nova, aliada da mãe, sem moralismo |
| mae_grupo | Mãe do grupo | a mãe que manda corrente e alerta falso no grupo de pais |
| desconhecido | "Kaio_Pro_2009" | jogador desconhecido que se aproxima do Theo no jogo; nunca é mostrado de forma explícita |

## Capítulos

1. **Caixa de presente** (mãe): o celular usado da prima, configurar juntos: conta de criança, senha de bloqueio, controle dos pais conversado (não escondido), regras combinadas por escrito na geladeira. `@roupa` no começo. Desafio formulário ou quiz sobre a configuração.
2. **Grupo da sala** (Theo, `@pov theo`): o grupo "6º B 🔥🔥🔥", figurinhas, áudios, a primeira zoação com alguém, o print que vaza; o Theo decide o que fazer. Modo conversa forte. Ele posta uma foto com o uniforme da escola nova e a localização ligada.
3. **Moedas do BlocoVerso** (mãe): chega a fatura do cartão com compras de moedas do jogo; o Theo usou o cartão salvo na conta da mãe; e também caiu num site de "moedas grátis" que pediu a senha da conta do jogo. Compras no aplicativo com aprovação, cartão salvo, golpe de moeda grátis. Desafio achar com visual `navegador` ou `mensagem`.
4. **A foto do uniforme** (mãe e Theo): a foto com uniforme e localização apareceu num perfil de fofoca da escola; a mãe e o Theo conversam sobre o que se posta, privacidade, localização, quem pode ver. Desafio mapa? use `achar` com visual `mensagem` (a postagem com os detalhes que expõem).
5. **Zoação** (Theo): o grupo da sala passa a zoar um colega (o Davi Lucas) com montagem; o Theo é chamado a participar; e depois vira alvo também. Cyberbullying, não compartilhar, guardar prova, contar para um adulto, a escola. Escolhas do Theo com consequência real.
6. **O desafio** (mãe e Theo): um "desafio" viral perigoso circula no grupo; o Theo está curioso; a mãe descobre pelo grupo de pais, onde também circula alerta falso. Checar sem pânico, conversar sem proibir no grito. Nada de descrever o desafio em detalhe: diga só que é perigoso para a saúde.
7. **Kaio_Pro_2009** (Theo e depois mãe): um jogador desconhecido elogia as construções do Theo, oferece moedas, pede para conversar num outro aplicativo e para manter segredo. Sinais de alerta de aproximação de adulto desconhecido (presentes, segredo, mudar de plataforma, pedir foto ou informação pessoal); o Theo conta para a mãe se a confiança estiver alta; bloquear, denunciar na plataforma, guardar prova, procurar a delegacia ou o canal de denúncia oficial. NUNCA mostrar nada explícito: o golpista só aparece como mensagens de texto ambíguas e manipuladoras, e a história corta antes de qualquer conteúdo impróprio.
8. **Reunião de pais** (mãe): reunião de fim de bimestre com a Professora Renata; a mãe e o Theo apresentam (ou não) as regras da família; o grupo de pais; o que mudou.

## Finais (ids)

Bons: `theo_contou_tudo` (o Theo contou do Kaio na hora, a conta foi bloqueada e denunciada, e ele diz "eu sabia que você ia me ouvir"), `regras_na_geladeira` (as regras combinadas viraram modelo para a sala inteira), `theo_youtuber_responsavel` (o Theo faz o primeiro vídeo do canal ensinando os colegas a se proteger, sem mostrar rosto nem uniforme).
Agridoces: `celular_na_gaveta` (a mãe confiscou o celular até o ano que vem; o Theo está seguro, mas parou de contar as coisas), `mae_espia` (a mãe instalou um aplicativo escondido para vigiar, descobriu tudo, mas o Theo descobriu também, e a confiança vai demorar).
Ruins: `segredo_com_estranho` (a confiança estava baixa e o Theo guardou segredo do Kaio por semanas; deu tempo de proteger, mas foi por pouco), `fatura_do_blocoverso` (as compras e o golpe das moedas viraram uma fatura enorme e uma conta de jogo roubada), `theo_foi_o_zoador` (o Theo participou da zoação, o colega mudou de escola, e a família precisou reaprender tudo).

## Técnica (caderno)

Configuração inicial (senha de bloqueio, conta infantil, controle dos pais combinado), regras de uso combinadas, compras no aplicativo com aprovação e cartão salvo, golpe de moedas e itens grátis, senha da conta do jogo, foto com uniforme e localização, configurações de privacidade, cyberbullying (não compartilhar, guardar prova, contar para adulto, escola), desafios virais e alertas falsos, sinais de aliciamento por adulto desconhecido (presentes, segredo, mudança de plataforma, pedido de foto ou de dados), bloquear, denunciar na plataforma e procurar ajuda (delegacia, canal oficial de denúncia), espiar escondido versus combinar às claras, confiança como a melhor ferramenta de segurança.
