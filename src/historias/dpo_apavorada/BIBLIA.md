# A DPO Apavorada: bíblia da história

Tom: comédia de escritório com suspense de prazo legal. Privacidade e proteção de dados de verdade, LGPD correta e atual (Brasil, 2026), contada de um jeito leve. Ninguém é vilão de desenho: o dono tem medo de quebrar, a recepcionista tem vergonha, o TI quer resolver rápido. A técnica é sempre de defesa e de governança.

## Premissa

{nome}, 31 anos, advogada, é a encarregada pelo tratamento de dados pessoais (DPO) da **Clínica Bem Viver** há três dias. Segunda, 8h12, a recepcionista Rosângela mandou a planilha "PACIENTES_2026_FINAL_v3.xlsx" (nome, CPF, telefone, convênio e diagnóstico de 1.847 pacientes) no grupo errado: em vez de "Recepção Bem Viver", foi para o "Pilates das Amigas 🧘‍♀️", com 63 participantes. A partir daí, contenção, avaliação de risco, comunicação à ANPD e aos titulares, pressão interna, golpistas usando os dados e o desfecho.

## Mecânicas próprias

- **Prazo**: atributo `prazo` em dias úteis, mostrado no topo como 📅. Começa em 3 no capítulo 1 (prazo da comunicação de incidente). Escolhas que enrolam fazem a história avançar no tempo (`prazo-1`). Se chegar a 0 sem comunicar, marca `perdeu_prazo`.
- **Risco**: atributo `risco` (0 a 10, começa 6), mostrado como ⚠️. Contenção bem feita baixa o risco; esconder, apagar evidência ou demorar sobe.
- **Formulário**: desafio novo, tipo `formulario` (ver tipos.ts), para montar a comunicação de incidente, o aviso aos titulares e o registro do incidente campo a campo.
- Outros atributos: `tecnica` (técnica e jurídica), `etica`, `paciencia` (0 a 10, começa 5), `credibilidade` (o quanto a diretoria escuta a DPO, começa 0), `rel_<id>`.

## Elenco

| id | Nome | Quem é |
|---|---|---|
| eu | {nome} (padrão Camila) | encarregada, advogada, café na veia |
| romeu | Dr. Romeu Tavares | médico, dono da clínica, 64 anos, "isso não vazou, foi compartilhado" |
| rosangela | Rosângela | recepcionista há 19 anos, coração enorme, morre de vergonha |
| wesley | Wesley | TI terceirizado, "é só apagar a mensagem", faz tudo por áudio |
| bruna | Bruna | marketing, quer "aproveitar a base" para campanha de check-up |
| cleide | Dona Cleide | paciente furiosa que descobriu o diagnóstico vazado pela vizinha do pilates |
| jorge | Jorge | advogado de pacientes, educado e implacável |
| nayara | Nayara | jornalista do portal local "Fala Cidade" |
| socia | Dra. Helena | sócia minoritária, aliada racional |
| golpista | "Central Bem Viver" | golpista que liga para pacientes usando os dados vazados |

## Capítulos

1. **Terceiro dia** (segunda 8h12): descoberta, caos no grupo de pilates (use o modo conversa), primeiras ações de contenção: pedir para apagar, identificar quem recebeu, preservar evidências (print com data e hora antes de apagar), avisar a diretoria.
2. **Gabinete de crise**: reunião com Romeu, Wesley e Helena. Wesley quer apagar tudo e "fingir que nada aconteceu". Romeu quer esconder. Registro do incidente, quem faz o quê, comunicação interna.
3. **Isso é dado sensível?**: avaliação de risco. Dados de saúde são dados pessoais sensíveis (art. 5º, II e art. 11 da LGPD); diagnóstico mais CPF mais telefone; quantidade de titulares; possibilidade de dano relevante. Desafio formulário de avaliação.
4. **Três dias úteis**: comunicação à ANPD pelo canal oficial. Conteúdo mínimo (natureza e categoria dos dados, titulares envolvidos, medidas técnicas e de segurança, riscos, motivos da demora se houver, medidas para reverter ou mitigar). Romeu tenta diminuir o número. Desafio formulário.
5. **Querido paciente**: comunicação aos titulares em linguagem simples e clara (também no prazo). Bruna quer transformar o aviso em propaganda. Primeiras ligações de pacientes, Dona Cleide no balcão.
6. **Golpe em nome da clínica**: golpistas ligam para pacientes como "Central Bem Viver" pedindo Pix para "liberar resultado de exame". Ação rápida: aviso aos pacientes, boletim de ocorrência, orientação na recepção, mensagem fixa no site. Desafio achar na mensagem do golpista.
7. **Titular tem direitos**: Jorge pede acesso aos dados de três pacientes (art. 18; declaração completa em até 15 dias); Bruna insiste na campanha; Nayara liga para a matéria. Gestão de reputação com verdade.
8. **O ofício**: chega o ofício da ANPD pedindo informações complementares. Reunião final com a diretoria. Desfecho: plano de adequação, treinamento, a Rosângela, o Romeu e você.

## Finais (ids)

Bons: `dpo_respeitada` (a clínica vira referência de privacidade na cidade), `processo_arquivado` (cooperação total, medidas adotadas, a fiscalização se encerra sem sanção), `rosangela_campea` (a Rosângela vira a campeã de privacidade da equipe e dá o treinamento).
Agridoces: `demitida_com_dignidade` (Romeu te demite por "atrapalhar", você sai íntegra e abre consultoria), `burnout_dpo` (o cargo cobra caro; você sai para se cuidar).
Ruins: `clinica_sancionada` (perdeu prazo, comunicação incompleta; processo sancionador e matéria no jornal), `cumplice` (você ajudou a esconder; quando aparece, a responsabilidade cai em todos, inclusive em você), `vazou_de_novo` (nada mudou e três meses depois a Bruna manda a base para uma agência sem contrato).

## Técnica e direito (caderno)

O que é a encarregada (DPO) e o que ela faz (art. 41), dado pessoal sensível de saúde (art. 5º, II e art. 11), incidente de segurança, contenção e preservação de evidência, registro do incidente, avaliação de risco e dano relevante, comunicação à ANPD (art. 48 e regulamento de comunicação de incidente, prazo de 3 dias úteis), comunicação aos titulares em linguagem clara, direitos dos titulares (art. 18) e prazo de resposta, finalidade e por que não usar a base para marketing (art. 6º), sigilo médico e prontuário, golpe usando dados vazados, minimização (não mandar planilha inteira por aplicativo de conversa), controle de acesso e menor privilégio, contrato com operador (art. 39), sanções administrativas (art. 52) e o peso da cooperação e da boa-fé, cultura de privacidade e treinamento.
