# Contos de Ciber

Histórias interativas de cibersegurança com humor e realidade brasileira. Você lê, escolhe e cada escolha muda a história e o final. Roupa, escolha especial e capítulo: tudo de graça. Aqui não tem paywall, só firewall.

Jogue em: https://marianabsctba.github.io/Contos_de_Ciber/

## Histórias

- **Sinal Fraco**: uma menina de Pedra Lisa do Norte, cidade onde o sinal só pega em cima da caixa d'água, decide trabalhar com segurança da informação. Da lan house fiado aos freelas de clientes duvidosos, da escolha entre ficar no interior ou ir para a capital às seleções que pedem cinco anos de experiência para júnior. Onze finais.
- **Grupo da Família**: sexta, 18h47, a Tia Neide mandou R$ 4.800 para o "Juninho de número novo". Com o relógio correndo e boa parte da história dentro do celular, no grupo da família, você enfrenta oito golpes em um fim de semana até o almoço de 80 anos da Vó Dita. Oito finais.
- **A DPO Apavorada**: a recepcionista da clínica mandou a planilha de pacientes no grupo do pilates. Você é a encarregada de dados há três dias, com prazo de três dias úteis para comunicar a ANPD e os titulares. Oito finais.
- **Maquininha**: o motoboy das flores com "taxa de R$ 5,99" e visor rachado é só o começo. Um mês de golpes no balcão de uma pastelaria: comprovante falso, QR code colado por cima, falso técnico, boleto adulterado, compra por telefone e conta do delivery invadida. Oito finais.

## Como funciona

- Cenários, personagens e música são gerados no navegador (SVG e Web Audio), sem arquivos de terceiros.
- O progresso fica salvo no navegador a cada fala. Dá para levar para outro aparelho pelo código nas configurações.
- Cada conceito aprendido vira uma página do caderno de ciber, com exemplo real e como se proteger.
- A técnica da história é de defesa: reconhecer golpe, proteger, recusar e reportar do jeito certo.

## Desenvolvimento

```bash
npm install
npm run dev
npm test
```

As histórias ficam em `src/historias/<id>/`, com o roteiro em arquivos de texto. O formato está em [ROTEIRO.md](ROTEIRO.md). O teste lê o roteiro inteiro, confere todas as referências e joga milhares de partidas aleatórias para garantir que toda cena e todo final podem ser alcançados.

A cada push na `main`, o GitHub Actions roda os testes e publica no Pages.

## Licença

MIT. Histórias de ficção: nomes, cidades e empresas são inventados.
