# TODO - Formula D (tarefas organizadas)

Objetivo: aplicar mudanças solicitadas passo-a-passo para preservar estabilidade e permitir rollback fácil.

## Lista de tarefas (prioridade/ordem sugerida)

1. Refatorar código para otimização e fluidez

   - Objetivo: separar funções grandes em helpers, extrair subcomponentes (GearSelector, DicePanel, PlayerCard, ControlsBar, Podium, Confetti), reduzir re-renderizações.
   - Critério de aceitação: `FormulaD.tsx` reduzido em <50% linhas, app roda sem erros.

2. Trocar mecânica de freada (PD manual)

   - Objetivo: permitir que jogador insira quantos PD remover, para modo basic (valor único) e advanced (cada componente com input).
   - UI: inputs numéricos no painel de rolagem; validação por limite disponível.
   - Critério: ao finalizar turno, os PD escolhidos são aplicados via `applyPenalty` e log gerado.

3. Adiar aplicação de penalidade por redução de marcha para o fim do turno

   - Objetivo: ao selecionar marcha menor, não aplicar penalidade imediatamente; calcular e aplicar somente em `finishTurn`.
   - Critério: selecionar marcha não muda PD até `finishTurn`; `finishTurn` aplica `gearReductionPenalty` conforme diferença.

4. Substituir condição de fim por voltas

   - Adicionar `totalLaps` e `lapsCompleted` por jogador (já há base).
   - Implementar botão "Dar volta"/"Passou pela largada" que incrementa `lapsCompleted` do jogador atual.
   - Critério: quando jogador alcança `totalLaps` marcar `finished`; corrida finaliza quando todos terminarem ou por botão finalizar.

5. Adicionar modo um jogador

   - Jogar o jogo com somente um jogador para testes solo.

6. Contabilizar turnos completos

   - Adicionar `turnNumber` global; após todos jogarem (round completo) incrementar.
   - Mostrar o turno/round atual no topo.

7. Recalcular ordem de jogo após cada turno completo

   - Reordenação: quem terminou em primeiro lugar no último turno começa e os seguintes na mesma ordem de posição; desempate pela marcha (maior marcha começa); se empate, abrir seleção manual.
   - Critério: ao fim de round, `players` reorder refletido na sequência de jogadas e log.

8. Ajustes de cores

   - Substituir Marrom e Cinza por Preto e Branco (manter 10 cores).
   - Atualizar labels e contrastes.

9. Barra de navegação inferior fixa

   - Layout fixo na parte inferior com três ações centrais: Rolar Dado (centro), Finalizar Turno, Visualizador de posição/marcha.
   - Critério: responsivo, acessível e persistente.

10. Reorganização de botões e UI polishing

    - Reposicionar botões principais, melhorar estilo do visualizador de posição/marcha.

- Nota de design: migrar para um estilo minimalista, clean e moderno na barra inferior: botões circulares somente ícone, centralizar ação de rolar dado, botão de "Dar uma volta" e botão "Finalizar turno" à direita; mostrar marcha atual com controles + / - compactos que permitam ciclar entre marchas possíveis; informações do jogador (posição, volta atual, PD) à esquerda de forma compacta.

11. Testes manuais / checklist
    - Testar reload (localStorage), fluxo completo com 2..10 jogadores, empate e desempate manual, voltar ao início, finalizar corrida.

## Notas importantes / informações para futuros prompts

- Para reverter rapidamente, trabalhar branch por feature e commitar incremental.
- Principais arquivos atuais:
  - src/pages/FormulaD.tsx (componente principal)
  - public/games/formula-d (jogo original)
  - components UI (Button, Card, etc) — manter compatibilidade de props
- Variáveis de estado críticas: `gameState.players`, `gameState.currentPlayerIndex`, `gameState.totalLaps`, `gameState.lap`, `gameState.turnNumber`, `raceLog`.
- Persistência: usar `localStorage` com chaves `formulaD-gameState` e `formulaD-setupData`.
- Aceitação futura: cada alteração de regra deve incluir pequeno cenário de teste manual (steps e resultado esperado).
- Para empates na ordem: fornecer UI modal com lista de candidatos e confirmação do usuário.
- Para aplicar PD manual no modo avançado: inputs por componente com soma verificada ≤ PD disponível.

## Plano de execução inicial (curto prazo)

- Criar subcomponentes: GearSelector, DicePanel, PlayerCard, BottomControls.
- Implementar mudança da mecânica de freada (item 2) e adiar penalidade de redução de marcha (item 3).
- Testar localmente e abrir PR/commit.

---

Próxima ação: começar pelo item 1 (refactor) ou item 2 (freada manual + adiar penalidade)? Responda "item 1" ou "item 2" para eu aplicar o patch

## Recomendações rápidas adicionadas

- Mostrar aviso visual no seletor de marcha (`GearSelector`) quando uma redução de marcha foi selecionada e a penalidade foi adiada (usar `pendingPrevGear` no estado). Isso ajuda o jogador a entender que a penalidade será aplicada ao clicar em "Finalizar Turno".
- Considerar clarear a assinatura de `applyPenalty`: separar a aplicação de um PD genérico (número) de penalidades por componente, ou documentar explicitamente que `{ pd: N }` representa PD total no modo básico.
- Adicionar testes unitários mínimos para `finishTurn`: cenários happy-path para modo básico e avançado, incluindo aplicação de `brakePD` (numérico) e `brakePDComponents` (componentes), e aplicação de `gearReductionPenalty` adiada.
- No modo avançado, validar na UI que a soma dos PD por componente não excede o total disponível (opcional: bloquear submissão ou mostrar aviso).
- Continuar usando branches por feature e commits pequenos para facilitar rollback (ex.: `feature/formulad-item-3-defer-gear-penalty`).
- Log claro: quando `pendingPrevGear` for definido, adicionar uma entrada de log explicando a redução selecionada e que a penalidade foi adiada.

Estas recomendações foram adicionadas aqui para referência rápida enquanto trabalhamos item-a-item no TODO.

Prompt inicial para referencia futura:
Vamos fazer algumas alteracoes no jogo pra aprimorar a jogatina:

Refatorar o codigo para otimizacao e fluidez;
Mudar a mecanica de (freada), vamos deixar que o jogador coloque quantos PD sera removido, ou seja o campo atual que faz um calculo vamos deixar que o jogador escreva somente o PD que sera removido, e isso tambem vale para o modo avancado, deixar que o jogador escolha quantos pontos de cada parte do carro sera removido.
tirar o dano de reducao de marcha somente quando finalizar a partida, ou seja, atualmemente se eu estou na marcha 4 e clico na 2 o jogo automaticamente tira 2 PD do jogador, precisamos deixar isso para ser calculado somente apos o fim do turno do jogador (ao clicar em Finalizar truno);
Remover o limite de casas para o final da corrida, vamos usar a mecanica de voltas ao inves disso, ou seja, crie um botao de passar pela largada ou dar uma volta, o jogador que terminar a volta se passar por todas as voltas ele termina o jogo porem os outros podem continuar jogando ate que terminem suas voltas;
adicionar modo um jogador.
identificar em qual turno estamos, quando todos os jogadores jogarem vamos marcar um turno completo. mostrar no topo o numero do turno atual.
melhorar o sistema de quem e o proximo jogador, ou seja, no final de cada turno completo sera colocado a nova ordem de quem joga primeiro, isso sera definido pelo resultado das posicoes do turno anterior, para exemplificar digamos que temos o jogador A, B e C:
Jogador A comeca e anda 3 casas, jogador B em seguida anda 4 casas, jogador C anda 3 casas.
fim do primeiro turno, jogador B deve comecar primeiro, e em seguida vamos decidir o desempate de acordo com a marcha dos jogadores quem tiver a maior comeca, se empatar novamente entao dar a opcao de selecionar manualmente quem sera o proximo jogador a jogar.
Selecao de cores vamos trocar as cores Marrom e Cinza por Preto e Branco.
Reorganizacao de botoes,
Botoes principais na tela fixo, vamos criar uma barra de navegacao na parte inferior fixa na tela, deixa no meio o botao de rolar o dado, botao de Finalizar Turno, e um vizualizador de posicao e marcha atual bem bonito e estilizado.

Essas sao as mudancas que precisamos fazer para executar vamos criar um arquivo TODO, e vamos fazer item por item para nao estragar o codigo.
Deixe anotado algumas informcoes importantes para o futuro prompts
