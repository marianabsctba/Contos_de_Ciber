# Black Friday do Desespero: bíblia da história

Tom: comédia de consumo brasileiro com suspense de contagem regressiva. Todo mundo já quis a TV de 65 polegadas pelo preço de uma air fryer. A técnica é sempre de defesa: conferir o site, desconfiar do preço impossível, pagar do jeito mais seguro, conhecer os direitos de quem compra a distância e agir rápido quando dá errado. Nunca há passo a passo de como montar um golpe.

## Premissa

{nome}, 24 anos, analista de atendimento numa empresa de seguros, juntou R$ 2.400 em dez meses para dar uma TV nova ao pai, Seu Ademar, antes da final do campeonato no domingo. A TV dele é de tubo, com palha de aço na antena, e ele jura que "a imagem é ótima". Sexta, 23h40, um anúncio patrocinado: "TV 65 polegadas por R$ 899, só até meia-noite". Começa o fim de semana mais longo do comércio eletrônico: site clonado, boleto da loja falsa, cupom por SMS, vendedor de marketplace que quer fechar pelo aplicativo de conversa, taxa de reentrega, falso atendimento na rede social e, no fim, a final do campeonato na sala.

## Mecânicas próprias

- **Navegador falso**: o desafio `achar` com `visual: 'navegador'`. O PRIMEIRO trecho é sempre o endereço do site (aparece na barra de endereço), por exemplo `https://www.lojamegastore-oficial.shop/tv-65`. Os outros trechos são o conteúdo da página: preço, selo, contador, rodapé com CNPJ, formas de pagamento, avaliações. Os suspeitos são os detalhes errados. É o coração desta história; use em vários capítulos.
- **Relógio da promoção**: atributo `minutos`, mostrado como ⏳. Começa em 20 no capítulo 1 (`@muda minutos=20`). A pressa é a arma do golpista: o relógio aperta e as escolhas apressadas parecem tentadoras. Conferir com calma custa minutos e quase sempre é o certo. Pode ser reiniciado em outros capítulos para novas "ofertas relâmpago".
- **Economia**: atributo `economia`, em reais, mostrado como 💳 R$. Começa em 2400. Golpes subtraem; recuperar dinheiro soma.
- **Modo conversa** (`@zap`): o grupo "Família Ademar ⚽📺", a conversa com o vendedor do marketplace, o falso atendimento na rede social e o irmão caçador de cupons.
- Outros atributos: `tecnica`, `etica`, `paciencia` (0 a 10, começa 5), `rel_<id>`.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Bianca) | protagonista, trabalha com atendimento e conhece golpe "de ouvir", mas nunca caiu (ainda) |
| pai | Seu Ademar | aposentado, motorista de ônibus por 30 anos, apaixonado por futebol, não quer TV nova "porque a dele é ótima" |
| kevin | Kevin | irmão caçula, 19 anos, "influenciador de cupons" com 800 seguidores, manda 40 links por dia |
| paty | Paty | melhor amiga, trabalha no atendimento de uma loja grande de verdade, conhece o lado de dentro |
| vendedor | "Vendedor Top 5 Estrelas" | golpista do marketplace que quer fechar fora da plataforma |
| sac_falso | "Atendimento Oficial" | golpista que responde reclamações na rede social se passando pela loja |
| entregador | Entregador | golpista da taxa de reentrega por mensagem |
| gerente | Gerente do banco | ajuda de verdade, cansada da Black Friday |
| dona_nice | Dona Nice | vizinha, compra tudo que aparece na TV, sempre com uma opinião |

## Capítulos

1. **Faltam 20 minutos** (sexta 23h40): anúncio patrocinado, site idêntico ao de uma loja grande, preço impossível, contador regressivo, só Pix. Desafio navegador. `@roupa` no começo (pijama ou roupa de chegar do trabalho).
2. **Boleto com desconto** (sábado 8h): o Kevin manda um link de "outra loja" que aceita boleto com 15% de desconto. Beneficiário estranho, boleto que vence em uma hora. Desafio boleto (`visual: 'boleto'`) ou navegador.
3. **Seu cupom expira hoje** (sábado 11h): SMS com cupom de R$ 500 para "clientes selecionados", link encurtado, página pedindo login e dados do cartão. Desafio mensagem.
4. **Vendedor Top 5 Estrelas** (sábado tarde): no marketplace de verdade, um vendedor com preço ótimo pede para fechar pelo aplicativo de conversa "para dar mais desconto". Por que nunca sair da plataforma. Desafio navegador ou mensagem.
5. **Taxa de reentrega** (domingo cedo): mensagem da "transportadora" dizendo que a entrega falhou e cobrando taxa. Ela nem comprou nada ainda (ou comprou). Desafio mensagem.
6. **Falamos com você no privado** (domingo manhã): ela reclama na rede social de uma compra atrasada e um perfil "Atendimento Oficial" responde em segundos pedindo dados para "estorno". Selo falso, nome parecido. Desafio quiz.
7. **A loja de verdade** (domingo meio-dia): a Paty ajuda a comprar no lugar certo: site digitado, CNPJ conferido, cartão virtual, preço que faz sentido, nota fiscal, direito de arrependimento de 7 dias em compra fora da loja. Desafio formulário (o que conferir antes de comprar) ou ordenar.
8. **A final do campeonato** (domingo 16h): a família reunida na sala, a TV (nova, velha ou emprestada da Dona Nice), o jogo, o desfecho do dinheiro e da relação com o pai.

## Finais (ids)

Bons: `tv_nova_e_dinheiro_salvo` (comprou no lugar certo, preço justo, a TV chega antes do jogo, o pai chora no hino), `kevin_virou_caca_golpe` (o Kevin para de espalhar link e vira "influenciador anti golpe" com 12 mil seguidores), `o_presente_era_outro` (ela descobre que o pai queria mesmo era assistir junto; compram depois, com calma, e a TV de tubo ganha aposentadoria digna).
Agridoces: `tv_da_dona_nice` (sem TV nova, assistem na sala da vizinha, com bolo e opinião), `recuperou_metade` (caiu num golpe, agiu rápido, recuperou parte pelo banco, a TV fica para o Natal).
Ruins: `caiu_no_site_clone` (pagou o Pix da TV de R$ 899 e a TV nunca existiu), `limpou_a_economia` (golpe atrás de golpe, a economia de dez meses some em um fim de semana), `cartao_clonado` (os dados do cartão foram parar na página do cupom e as compras começaram a pingar na fatura).

## Técnica e direitos (caderno)

Anúncio patrocinado não é garantia, site clonado e endereço parecido, cadeado não prova que o site é honesto, preço impossível, contador regressivo como pressão, CNPJ e razão social no rodapé, consulta de reputação da loja, pagamento mais seguro (cartão, de preferência virtual) versus Pix para desconhecido, boleto com beneficiário diferente da loja, SMS com link encurtado, nunca sair da plataforma do marketplace, taxa de entrega falsa, perfis falsos de atendimento na rede social, empresa não pede senha nem código, direito de arrependimento de 7 dias em compra fora do estabelecimento (Código de Defesa do Consumidor, art. 49), nota fiscal e garantia, o que fazer quando cai (banco, contestação do cartão, devolução do Pix pelo banco, boletim de ocorrência, denúncia da página).
