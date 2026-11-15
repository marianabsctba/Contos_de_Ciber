# Sinal Fraco: bíblia da história

Tom: novela brasileira com humor, realidade dura contada com carinho, técnica de ciber de verdade explicada sem aula chata. A técnica é sempre de defesa e de conceito: ela entende, protege, recusa, denuncia. Nunca há passo a passo de ataque.

## Lugar e tempo

- **Pedra Lisa do Norte** (fictícia), interior, 11 mil habitantes, uma barra de sinal na praça e duas na caixa d'água.
- **Capital**: cidade grande genérica, sem nome real ("a capital").
- Começa por volta de 2010, quando ela tem 9 anos, e termina perto dos 30.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Jéssica) | protagonista |
| mae | Dona Rosilene | diarista, cansada, ama a filha do jeito dela, acha que computador "dá vírus na vista" |
| vo | Vó Nita | benzedeira, a maior apoiadora, chama o PC de "a televisão de escrever" |
| tio | Tio Juca | dono de oficina, dá o PC velho, gambiarrista |
| bia | Bia | melhor amiga da infância, quer ser influencer, depois vira cabeleireira |
| leni | Professora Leni | professora do laboratório com cadeado, primeira a acreditar nela |
| cida | Dona Cida | dona da lan house "Cida Net", fala alto, deixa ela usar fiado |
| valdir | Seu Valdir | padeiro, primeiro cliente honesto (site da padaria) |
| cleiton | Cleiton | ex obcecado que quer "recuperar" a conta da ex |
| marlene | Marlene | desconfia do marido e quer ler as conversas dele |
| robson | Robson | dono de loja que quer prejudicar o concorrente |
| doutor | "Doutor" Anselmo | golpista de terno que oferece muito dinheiro por um "serviço" |
| thais | Thaís | colega de república na capital, enfermeira, prática |
| kelly | Kelly | recrutadora de RH com frases de LinkedIn |
| fabio | Fábio | supervisor do call center, metas e planilha |
| iracema | Iracema | mentora, analista sênior negra de 50 anos, sarcástica e generosa |
| davi | Davi | colega de CTF, interesse romântico opcional |
| rafa | Rafa | colega de trabalho que vira rival ou amigo |
| prefeito | Prefeito Zé Bento | prefeito de Pedra Lisa, populista, senha é o nome do cachorro |
| delegado | Delegada Márcia | delegada de crimes cibernéticos |

## Atributos

- `tecnica`: o quanto ela sabe
- `etica`: integridade (positivo quando recusa coisa errada, negativo quando aceita)
- `grana`: dinheiro guardado
- `reputacao`: nome no mercado e na cidade
- `saude`: saúde mental de 0 a 10 (começa 5)
- `rel_<id>`: relação com cada personagem

## Estrutura (capítulos)

**Parte 1, infância (crianca)**
1. A televisão de escrever: primeiro contato no laboratório trancado da escola.
2. Cida Net: lan house, dinheiro de latinha, primeiro e-mail, primeira senha ruim.
3. O PC do Tio Juca: monta o PC velho, aprende hardware, quase queima a casa.
4. Vírus na vista: o PC lotado de pragas e barras de ferramentas; aprende a limpar e o que é golpe.

**Parte 2, adolescência (adolescente)**
5. Aprendendo sozinha: fóruns, vídeos, PDF da biblioteca, inglês com dicionário.
6. A menina do computador: conserta PC de vizinho, primeiro dinheiro.
7. O site da padaria: primeiro freela honesto, Seu Valdir paga em pão e dinheiro; aprende sobre senha de painel e backup.
8. Freelas estranhos: Cleiton e Marlene pedem acesso a contas de outras pessoas. Escolha ética, nota sobre LGPD e crime de invasão (Lei 12.737). Consequências marcadas.
9. O concorrente: Robson quer prejudicar a loja rival. Calote de um cliente. Golpe do falso cliente que pede dados.
10. O Doutor: proposta de muito dinheiro por algo claramente criminoso. Quem aceita ganha grana e marca `pacto_doutor`; quem recusa pode avisar a polícia.
11. Formatura e a encruzilhada: ENEM, falta de dinheiro, briga com a mãe. **Escolha grande: ficar em Pedra Lisa ou ir para a capital.**

**Parte 3A, capital (adulta)**
12. Rodoviária: chegada, república, golpe do aluguel.
13. Call center: emprego de sobrevivência, metas, aprende engenharia social pelo lado de quem atende.
14. Vaga júnior com 5 anos de experiência: seleções frustradas (teste de 40 horas sem pagamento, ghosting, "sem fit cultural", pergunta machista).
15. A vaga falsa: golpe de recrutamento que pede dados e Pix de "taxa"; ela identifica (ou cai).
16. CTF: primeiro evento, conhece Iracema e Davi, perde feio e aprende.
17. Certificação cara: estudar de madrugada, burnout ameaça.
18. Primeiro emprego na área: SOC noturno, primeiro alerta real, síndrome da impostora.
19. O incidente: ransomware num hospital cliente; decisões em resposta a incidente.
20. Caminhos: proposta de promoção, convite para palestra, convite de bug bounty, ou o passado com o Doutor bate à porta.

**Parte 3B, interior (adulta)**
12i. Ficar: a assistência técnica "{nome} Conserta", celular de vó, golpe do falso parente na cidade inteira.
13i. Faculdade a distância e trabalho remoto que paga em dólar e some (golpe ou real).
14i. A prefeitura: senha do prefeito, Wi-Fi da prefeitura aberto, ela tenta orientar e ninguém escuta.
15i. Ransomware na cooperativa: a cidade para, ela ajuda a recuperar com backup e plano.
16i. Reconhecimento ou desgaste: proposta de ir embora, de abrir empresa, de dar aula.

## Finais (ids)

Bons: `ciso` (chefe de segurança de uma grande empresa), `pesquisadora` (palestrante e pesquisadora reconhecida), `bug_bounty` (caçadora de falhas com reconhecimento internacional), `empresa_interior` (empresa própria de segurança em Pedra Lisa que atende a região), `professora` (forma outras meninas do interior).
Agridoces: `burnout` (sai da área para cuidar de si, e tudo bem), `outra_carreira` (descobre que ama outra coisa), `volta_pra_casa` (volta para Pedra Lisa sem ter conseguido, mas inteira).
Ruins: `presa` (o pacto com o Doutor vem à tona), `foragida` (rica, sozinha, olhando por cima do ombro), `golpeada` (cai em tantos golpes que perde tudo e desiste).

## Técnica que aparece (caderno)

Hardware básico, senha forte e gerenciador, verificação em duas etapas, phishing, golpe do falso parente, golpe do Pix agendado e comprovante falso, malware e barra de ferramentas, backup 3-2-1, atualização, LGPD, Lei 12.737 (invasão de dispositivo), engenharia social, golpe de vaga falsa, HTTPS, SQL injection conceitual (o que é e como se previne), CTF, triagem de alerta, ransomware, resposta a incidente, divulgação responsável e bug bounty, princípio do menor privilégio.
