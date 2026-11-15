# A Casa Inteligente da Vó: bíblia da história

Tom: comédia de família com tecnologia doméstica. A vó é moderna, o neto é empolgado, a casa conversa com todo mundo e ninguém leu o manual. A técnica é de defesa e de configuração: senha de fábrica, atualização, rede separada, privacidade de quem mora e de quem visita, e saber quando um aparelho "inteligente" não precisa existir. Nunca há passo a passo de como invadir aparelho ou câmera.

## Premissa

Vó Zilá, 76 anos, viúva, independente, mora sozinha numa casa de vila. O neto Caíque, 22 anos, ganhou dinheiro com uns bicos e resolveu "modernizar a vó": câmera na sala, campainha com vídeo, lâmpadas que mudam de cor, tomada inteligente na cafeteira, assistente de voz, fechadura com senha, babá eletrônica para "ouvir se ela cair" e uma balança que manda o peso para o celular. Tudo instalado em uma tarde, tudo com a senha que veio na caixa. {nome}, a outra neta, que trabalha com redes, descobre num domingo que a câmera da sala da vó aparece num site que lista câmeras abertas na internet. Daí em diante: assistente de voz que compra sozinho, campainha que mostra a rua para estranhos, fechadura, a vizinha fofoqueira, golpe de falso suporte técnico, a vó que gostou da tecnologia e não quer abrir mão, e no fim o aniversário de 77 anos na casa nova (ou velha).

## Mecânicas próprias

- **Mapa da casa**: o desafio `achar` com `visual: 'casa'`. Cada trecho é um aparelho ou detalhe da casa, escrito com um emoji no começo e o cômodo, por exemplo `📷 Sala: câmera com senha admin/admin`, `💡 Quarto: lâmpada colorida`, `🔔 Portão: campainha com vídeo sem atualização desde a instalação`. Os trechos aparecem como uma planta em blocos. Os suspeitos são os riscos reais; os inocentes são aparelhos bem configurados ou sem risco relevante.
- **Segurança da casa** no topo: atributo `seguranca`, de 0 a 10, mostrado como 🏠. Começa em 1 no capítulo 1 (`@muda seguranca=1`). Cada aparelho bem configurado sobe; cada aparelho novo instalado no impulso desce.
- **Modo conversa**: grupo "Netos da Vó Zilá 👵💜", conversa com a vó (que manda áudio e figurinha), conversa com o falso suporte técnico.
- Outros atributos: `tecnica`, `etica`, `paciencia` (0 a 10, começa 5), `autonomia_vo` (o quanto a vó continua dona da própria casa e das próprias decisões, começa 3), `rel_<id>`.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Lívia) | neta, analista de redes, paciente com tudo menos com senha de fábrica |
| vo | Vó Zilá | 76 anos, aposentada dos Correios de uma cidade fictícia (diga só "agência"), adora novela e a assistente de voz, que ela chama de "a moça" |
| caique | Caíque | neto, 22 anos, entusiasta, comprou tudo em promoção, coração enorme |
| dona_jura | Dona Jura | vizinha da vila, fofoqueira profissional, descobre tudo antes de todo mundo |
| tecnico_falso | "Suporte Casa Conectada" | golpista que liga oferecendo "atualização de segurança remota" |
| sargento | Sargento Lopes | policial do bairro, amigo da vó, aparece no capítulo da fechadura |
| tio_mauro | Tio Mauro | filho da vó, pai do Caíque, quer pôr a vó numa casa de repouso "porque ela não dá conta" |

## Capítulos

1. **Admin, admin** (domingo): almoço na vó, o Caíque mostra a casa nova, `@roupa`, a {nome} acha a câmera da sala da vó num site de câmeras abertas. `@muda seguranca=1`. Desafio mapa da casa (primeira varredura).
2. **A moça comprou** (segunda): a assistente de voz fez um pedido de 12 pacotes de fralda geriátrica porque a TV falou uma frase parecida; também gravou conversas da novela. Configurar compras por voz com confirmação, revisar o que fica gravado, privacidade. Desafio quiz ou mapa.
3. **Quem está no portão?** (terça): a campainha com vídeo da vó compartilha imagens com "amigos" que o Caíque adicionou sem querer; a Dona Jura vê todo mundo que entra; um carro estranho passa três vezes. Contas compartilhadas, atualização, quem tem acesso.
4. **A fechadura** (quarta à noite): a fechadura com senha numérica usa 1234; a vó deu a senha para o entregador de gás; a fechadura trava com a bateria fraca e a vó fica do lado de fora. Sargento Lopes. Senha de fechadura, chave física de reserva, bateria, quem tem a senha.
5. **Suporte Casa Conectada** (quinta): golpista liga para a vó dizendo que "detectou invasão" e pede para ela instalar um aplicativo de acesso remoto e ler um código. Desafio achar no visual `mensagem` ou `email`.
6. **A rede da casa** (sábado): a {nome} reorganiza a rede da casa: senha forte do Wi-Fi, rede separada para os aparelhos, atualização, desligar o que não precisa. Desafio formulário ou mapa da casa final.
7. **Casa de repouso?** (domingo seguinte): o Tio Mauro usa a confusão para dizer que a vó "não dá conta" de morar sozinha. A tecnologia pode cuidar sem vigiar? Babá eletrônica ou botão de emergência que ela controla, consentimento da vó, autonomia.
8. **Setenta e sete** (aniversário): festa na casa da vila, a casa reconfigurada (ou não), a decisão sobre a autonomia da vó e o que fica instalado.

## Finais (ids)

Bons: `casa_segura_e_dela` (a casa ficou segura e a vó continua dona dela: escolheu o que manter e sabe desligar tudo), `vo_influencer_tech` (a vó vira a referência da vila em segurança de casa, ensina a Dona Jura e grava vídeo), `menos_e_mais` (metade dos aparelhos foi embora; ficaram só os úteis e bem configurados; a casa ficou mais tranquila).
Agridoces: `vo_desligou_tudo` (a vó se assustou e tirou tudo da tomada; segura, mas sem o botão de emergência que ajudaria), `caique_aprendeu_tarde` (resolveram tudo, mas o Caíque ficou mal com a família por um tempo).
Ruins: `camera_na_internet` (a câmera continuou aberta e a sala da vó virou vídeo num fórum estranho), `golpe_do_suporte` (a vó instalou o aplicativo do falso suporte e perdeu dinheiro da aposentadoria), `vo_no_repouso` (a confusão virou argumento e a vó foi morar numa casa de repouso contra a vontade).

## Técnica (caderno)

Senha padrão de fábrica e por que trocar, sites que listam câmeras abertas (sem nomes reais), atualização de firmware, contas e convites de acesso compartilhado, compras por voz e confirmação, o que o assistente de voz grava e como revisar e apagar, rede separada para aparelhos (rede de convidados ou rede de dispositivos), senha forte do Wi-Fi, fechadura eletrônica com chave física e bateria, falso suporte técnico e acesso remoto, câmera dentro de casa e privacidade de quem mora e de quem visita, consentimento e autonomia da pessoa idosa, desligar o que não precisa.
