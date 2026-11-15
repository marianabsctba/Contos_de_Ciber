# Formato do roteiro

Cada história fica em `src/historias/<id>/` com:

- `historia.ts`: metadados, personagens, desafios e notas do caderno
- `roteiro/*.txt`: as cenas, no formato abaixo (todos os arquivos da pasta são lidos em ordem alfabética)

## Cenas

```
=== id_da_cena
```

Toda cena termina com `@vai`, um bloco de escolhas, `@desafio` ou `@final`. Cena que acaba sem isso é erro no teste.

## Linhas

| Linha | O que faz |
|---|---|
| `> texto` | narração |
| `(texto)` | pensamento da protagonista |
| `EU: texto` | fala da protagonista |
| `EU [feliz]: texto` | fala com expressão |
| `MAE: texto` | fala de personagem (id em maiúsculas) |
| `# texto` | comentário, ignorado |

`{nome}` vira o nome escolhido pela jogadora.

## Comandos

| Comando | O que faz |
|---|---|
| `@cap 3 "Título"` | começa o capítulo 3 (cartão de capítulo e ponto de salvamento) |
| `@fundo id` | troca o cenário |
| `@musica id` | troca a música (`@musica nenhuma` para silêncio) |
| `@som id` | efeito sonoro curto |
| `@entra id [expr] [esquerda\|centro\|direita]` | personagem entra em cena |
| `@sai id` | personagem sai (`@sai todos` limpa a cena) |
| `@expr id expr` | troca a expressão (`EU` vale para a protagonista) |
| `@idade crianca\|adolescente\|adulta` | idade da protagonista |
| `@muda tecnica+1 grana-2 rel_mae+1` | mexe em atributos |
| `@marca flag` / `@desmarca flag` | liga e desliga marcas |
| `@se cond -> cena` | pula se a condição for verdadeira |
| `@vai cena` | pula sempre |
| `@roupa "Título"` | abre o guarda-roupa (tudo de graça) |
| `@desafio id -> cena_acerto \| cena_erro` | minijogo técnico |
| `@anota id` | libera página do caderno |
| `@final id` | fim da história |
| `@zap "Nome do grupo"` | abre o celular com a conversa; falas e narração viram mensagens até `@zap fim` |

## Escolhas

```
? Pergunta opcional que aparece acima das opções
* Texto da opção -> destino {etica+1 marca:recusou_ex}
* Opção condicionada -> destino [se tecnica>=3]
** Opção especial (grátis, com brilho) -> destino {tecnica+2}
```

## Condições

`tecnica>=3`, `grana<0`, `etica=2`, `marca:flag`, `!marca:flag`, juntas com ` e `.

## Atributos

`tecnica`, `etica`, `grana`, `reputacao`, `saude` e relações `rel_<personagem>`. Todos começam em 0, exceto `saude` em 5.

## Expressões

`neutra`, `feliz`, `triste`, `brava`, `surpresa`, `pensativa`, `envergonhada`, `assustada`.

## Modo conversa

Com o celular aberto (`@zap "Família Reunida 🙏🌹"`), `EU:` aparece à direita e os outros à esquerda com o nome colorido. Narração vira aviso do sistema. Pensamentos continuam no balão normal. Prefixos especiais na fala:

- `[audio 3:12] transcrição` mensagem de áudio
- `[foto] legenda` foto
- `[figurinha] texto` figurinha de bom dia

Atributos próprios da história e o relógio no topo são definidos em `historia.ts` (`varsIniciais`, `atributos`, `hud`).
