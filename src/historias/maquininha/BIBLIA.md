# Maquininha: bíblia da história

Tom: comédia de pequeno comércio brasileiro, com o suor e o orgulho de quem vive de vender pastel. Golpes reais do dia a dia do comerciante e do consumidor, explicados para qualquer pessoa entender. A técnica é sempre de defesa: conferir, desconfiar com método, bloquear, contestar, registrar e avisar. Nunca há passo a passo de como aplicar um golpe.

## Premissa

{nome}, 29 anos, é dona do **Pastel da {nome}**, que começou como barraca na feira de domingo e virou uma lanchonete com balcão, duas mesas na calçada e um chapeiro chamado Jefferson. Tudo vai bem até a sexta em que a mãe dela, Dona Fátima, recebe um buquê com "taxa de entrega de R$ 5,99" de um motoboy com a maquininha de visor rachado. Daí em diante, um mês de golpes de todos os lados: em casa, no balcão, no e-mail, no telefone e no aplicativo de delivery. No fim, a Feira da Cidade e a associação de comerciantes da rua.

## Mecânicas próprias

- **Caixa** no topo: atributo `caixa`, em reais, mostrado como 💰 R$. Começa em 3200 no capítulo 1 (`@muda caixa=3200`). Vendas somam, golpes subtraem. Se ficar abaixo de 0 a pastelaria entra no vermelho (pode levar a finais ruins).
- **Desafio de inspeção**: o desafio `achar` agora tem um campo `visual` que muda a moldura: `maquininha` (tela de terminal de pagamento com o valor no visor), `comprovante` (comprovante de Pix em papel térmico), `boleto` (boleto com linha digitável e beneficiário), `email` (e-mail com remetente e assunto), `mensagem` (padrão, balão de conversa). Os trechos são o conteúdo do que aparece; os suspeitos são os detalhes errados. Use bastante: é o coração desta história.
- **Modo conversa** (`@zap`): grupo "Comerciantes da Rua 7 🍢🛒" com o pessoal das lojas vizinhas, a conversa com a mãe e o chat do aplicativo de delivery.
- Outros atributos: `tecnica`, `etica`, `paciencia` (0 a 10, começa 5), `reputacao` (da pastelaria na rua), `rel_<id>`.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Joyce) | dona da pastelaria, rápida no troco e na resposta |
| mae | Dona Fátima | mãe, aposentada, adora surpresa, caiu no golpe do motoboy |
| jefferson | Jefferson | chapeiro, 20 anos, filósofo do óleo quente, mais esperto do que parece |
| tati | Tati | amiga e vendedora de açaí da barraca ao lado, braço direito |
| osvaldo | Seu Osvaldo | fornecedor de queijo há 15 anos, analógico, "manda boleto por e-mail porque minha neta falou" |
| motoboy | Motoboy das flores | golpista, sempre com pressa |
| tecnico | "Técnico da Maquininha" | golpista educado ao telefone |
| cliente_pix | Cliente do comprovante | golpista simpático que paga com comprovante falso |
| gerente | Gerente do banco | competente, cansada, ajuda de verdade |
| delegado | Delegado Paulo | delegado da cidade, come pastel de carne sempre |
| zeca | Seu Zeca | presidente da associação de comerciantes, dono do bar, contra "essas modernidades" |

## Capítulos

1. **Taxa de R$ 5,99** (sexta 20h): a mãe recebe flores sem remetente, o motoboy cobra taxa na maquininha de visor rachado, digita outro valor e troca o cartão. A mãe liga chorando. Bloquear cartão pelo app ou pelo telefone do verso, contestar a compra, boletim de ocorrência. Desafio de inspeção da maquininha (visual `maquininha`).
2. **Comprovante bonito** (sábado): no balcão, um cliente simpático paga 12 pastéis e um caldo com "Pix feito" mostrando um comprovante na tela. Conferir no extrato do app do banco antes de entregar, Pix agendado não é Pix pago. Desafio `comprovante`.
3. **QR code por cima** (segunda): alguém colou um QR code por cima do dela no balcão. Os Pix da manhã foram para outra pessoa. Conferir o nome do recebedor na tela antes de pagar, QR code dinâmico gerado na hora, aviso para clientes. Grupo dos comerciantes descobre que aconteceu na rua inteira.
4. **O técnico que ligou** (quarta): "técnico da empresa da maquininha" liga para "atualizar o sistema" e pede para instalar um aplicativo e informar um código. Por que empresa séria não faz isso, como confirmar pelo canal oficial. Desafio `email` com o e-mail de "atualização obrigatória".
5. **Boleto do queijo** (sexta seguinte): o boleto do Seu Osvaldo chega por e-mail com o beneficiário trocado. Conferir beneficiário, CNPJ e valor antes de pagar, confirmar por telefone conhecido. Desafio `boleto`.
6. **Encomenda grande pelo telefone** (sábado): pedido de 200 pastéis para uma "festa de empresa" pago com cartão digitado por telefone; semanas depois vem a contestação, o cartão era de outra pessoa. Venda não presencial, riscos, quando pedir pagamento antecipado por Pix conferido. Desafio quiz.
7. **A conta do delivery** (domingo): a conta da lanchonete no aplicativo de delivery é invadida, os pagamentos são desviados e o cardápio vira "PASTEL GRÁTIS" ou some. Senha forte, verificação em duas etapas, não reutilizar senha, quem tem acesso à conta (o Jefferson usava a mesma senha do e-mail). Desafio senha.
8. **Feira da Cidade** (um mês depois): concurso do melhor pastel, reunião da associação de comerciantes, o delegado, a mãe recuperando (ou não) o dinheiro, e a decisão de ensinar a rua inteira ou fechar a porta.

## Finais (ids)

Bons: `pastelaria_blindada` (a pastelaria vira exemplo, sem perder um real desde então), `rua_protegida` (ela organiza a associação, cartilha na parede de cada loja, o Seu Zeca dá o braço a torcer), `mae_ganhou_a_contestacao` (o banco devolve o dinheiro da Dona Fátima e ela vira palestrante do grupo da igreja).
Agridoces: `virou_influencer` (os vídeos dela sobre golpe viralizam, mas a pastelaria fica sem dona no balcão), `voltou_pra_feira` (ela fecha a loja e volta para a barraca de domingo, menor, simples e segura).
Ruins: `fechou_as_portas` (caixa no vermelho, a loja fecha), `caiu_em_tudo` (golpe atrás de golpe, sem aprender), `culpou_o_jefferson` (ela culpou o chapeiro pela conta invadida, ele foi embora e levou a receita do molho).

## Técnica (caderno)

Golpe da maquininha com visor quebrado e troca de cartão, conferir valor no visor antes de digitar a senha, bloquear cartão e contestar compra, comprovante falso e Pix agendado, conferir no extrato, QR code adulterado e nome do recebedor, QR code dinâmico, falso técnico e acesso remoto, canal oficial, boleto adulterado (beneficiário, CNPJ e valor), venda não presencial com cartão e contestação (chargeback), senha forte e verificação em duas etapas em aplicativo de delivery, não compartilhar senha e dar acesso individual, boletim de ocorrência, avisar a vizinhança comercial.
