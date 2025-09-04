# Plano de Desenvolvimento - App Formula D

## 1. Visão Geral do Projeto

### Objetivo

Criar um web app minimalista para auxiliar jogadores de Formula D, mantendo o tabuleiro físico mas digitalizando:

- Controle de estado dos carros (PD, marchas, posição na ordem)
- Sistema de dados virtuais
- Validação de regras
- Controle de turnos
- Cronômetro e estatísticas

### Escopo Inicial - Modo Local

- 2-10 jogadores em um único dispositivo
- Regras Básicas e Avançadas
- Circuito padrão (Mônaco)
- Interface touch-friendly

## 2. Análise das Regras Principais

### 2.1 Estados do Carro

**Regras Básicas:**

- PD global: 0-18 pontos
- Marcha atual: 1ª-6ª
- Posição na ordem de jogo

**Regras Avançadas:**

- PD por componente: Pneus(6), Freios(3), Câmbio(3), Carroceria(3), Motor(3), Suspensão(2)
- Condições especiais: pneus carecas, sem freios, etc.
- Tipo de pneus (Duros/Macios/Chuva)

### 2.2 Sistema de Dados

- Dados por marcha: 1ª(1-2), 2ª(2-4), 3ª(4-8), 4ª(7-12), 5ª(11-20), 6ª(21-30)
- Dado preto: 1-20 para eventos especiais
- Freada: reduzir casas após rolagem

### 2.3 Eventos Especiais

- Largada (dado preto): 1=parado, 2-16=normal, 17-20=ótima
- Motor no limite: 5ª=20 ou 6ª=30
- Colisões, peças na pista, vácuo
- Meteorologia e efeitos

### 2.4 Penalidades Críticas

- Redução múltipla de marchas
- Freada excessiva (tabela específica)
- Curvas sem paradas obrigatórias
- Condições climáticas

## 3. Arquitetura do Sistema

### 3.1 Estrutura de Dados

```javascript
// Estado Global do Jogo
const gameState = {
  mode: "basic" | "advanced",
  phase: "setup" | "qualifying" | "racing" | "finished",
  currentPlayer: 0,
  lap: 1,
  totalLaps: 1,
  weather: "sunny" | "unstable" | "rainy",
  cars: [CarState],
  raceLog: [Event],
  settings: GameSettings,
};

// Estado Individual do Carro
const carState = {
  id: number,
  name: string,
  color: string,
  driver: string,

  // Básico
  totalPD: number, // 0-18

  // Avançado
  components: {
    tires: { current: number, max: number, type: "hard" | "soft" | "rain" },
    brakes: { current: number, max: number },
    gearbox: { current: number, max: number },
    body: { current: number, max: number },
    engine: { current: number, max: number },
    suspension: { current: number, max: number },
  },

  // Estado atual
  gear: number, // 1-6
  position: number, // ordem na corrida
  hasNitro: boolean, // GT only
  conditions: {
    baldTires: boolean,
    noBrakes: boolean,
    faceDown: boolean, // após derrapagem
  },

  // Estatísticas
  rolls: number,
  distanceTraveled: number,
  penalties: number,
};
```

### 3.2 Motor de Regras

```javascript
class RulesEngine {
  // Validações principais
  validateGearChange(from, to) // máximo +1, -4
  calculateDamage(event, conditions) // tabelas específicas
  processCollision(cars) // dado preto para envolvidos
  checkEngineLimit(gear, roll) // 5ª=20, 6ª=30
  applyWeatherEffects(weather, action)

  // Penalidades
  calculateBrakingPenalty(reducedCells)
  calculateGearReductionPenalty(gears)
  calculateCurvePenalty(missedStops)
}
```

## 4. Interface do Usuário

### 4.1 Layout Principal

```
┌─────────────────────────────────────────┐
│ Formula D Assistant                      │
├─────────────────────────────────────────┤
│ [Setup] [Race] [Settings] [Log]         │
├─────────────────────────────────────────┤
│                                         │
│  Current Turn: Player 1 (Red Car)      │
│  Lap: 1/2  Weather: ☀️ Sunny           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ GEAR SELECTOR                       │ │
│ │ [1st] [2nd] [3rd] [4th] [5th] [6th] │ │
│ │      Current: 3rd                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ DICE ROLLER                         │ │
│ │ 3rd Gear (4-8 spaces)              │ │
│ │ [ROLL DICE] Result: 6               │ │
│ │ [BRAKE] Reduce to: [_] spaces       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ CAR STATUS                          │ │
│ │ PD: ████████████████░░ 16/18        │ │
│ │ Position: 3rd                       │ │
│ │ [MORE DETAILS]                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [END TURN] [UNDO] [SPECIAL EVENTS]      │
└─────────────────────────────────────────┘
```

### 4.2 Telas Específicas

**Setup Screen:**

- Escolha de modo (Básico/Avançado)
- Número de jogadores (2-10)
- Nomes e cores dos carros
- Configurações da corrida (voltas, clima)

**Car Details (Avançado):**

- PD por componente com barras visuais
- Alertas visuais (vermelho quando crítico)
- Tipo de pneus atual
- Condições especiais ativas

**Special Events:**

- Motor no limite
- Colisões
- Peças na pista
- Parada nos boxes
- Eventos climáticos

**Race Log:**

- Histórico completo de ações
- Filtros por jogador/evento
- Botão para contestações

## 5. Fluxo de Jogo Detalhado

### 5.1 Fase de Setup

1. Escolher modo de jogo
2. Configurar jogadores
3. Distribuir grid de largada (dado preto)
4. Configurar condições iniciais

### 5.2 Largada

1. Cada jogador rola dado preto
2. Aplicar efeitos: parado(1), normal(2-16), ótima(17-20)
3. Definir ordem inicial

### 5.3 Turno Individual

```
┌─ INÍCIO DO TURNO ─┐
│ 1. Mostrar jogador atual
│ 2. Exibir opções de marcha
│ 3. Validar mudança permitida
└──────────────────┘
         │
┌─ ROLAGEM DE DADO ─┐
│ 4. Rolar dado da marcha
│ 5. Mostrar resultado
│ 6. Oferecer opção de freada
└──────────────────┘
         │
┌─ APLICAR EFEITOS ─┐
│ 7. Redução de PD por freada
│ 8. Penalidades de redução
│ 9. Eventos especiais
└──────────────────┘
         │
┌─ CHECAGENS PÓS-MOVIMENTO ─┐
│ 10. Motor no limite (5ª=20, 6ª=30)
│ 11. Colisões potenciais
│ 12. Peças na pista
│ 13. Vácuo disponível
└──────────────────────────┘
         │
┌─ FINALIZAR TURNO ─┐
│ 14. Atualizar ordem
│ 15. Log do movimento
│ 16. Próximo jogador
└─────────────────┘
```

### 5.4 Eventos Especiais

**Motor no Limite:**

```javascript
function checkEngineLimit(car, roll) {
  if ((car.gear === 5 && roll === 20) || (car.gear === 6 && roll === 30)) {
    // Todos em 5ª/6ª rolam dado preto
    const limit = gameState.weather === "rainy" ? 3 : 4;
    // Aplicar dano se resultado ≤ limit
  }
}
```

**Colisão:**

```javascript
function processCollision(causeCar, affectedCars) {
  // Afetados rolam primeiro
  affectedCars.forEach((car) => rollBlackDie(car));
  // Causador rola uma vez por afetado
  for (let i = 0; i < affectedCars.length; i++) {
    rollBlackDie(causeCar);
  }
  // Aplicar danos 1-4
}
```

## 6. Implementação por Fases

### Fase 1 - MVP (Básico Local)

- [ ] Setup de jogo básico
- [ ] Sistema de turnos
- [ ] Dados virtuais por marcha
- [ ] Controle de PD global
- [ ] Freada simples
- [ ] Log básico

### Fase 2 - Regras Básicas Completas

- [ ] Largada com dado preto
- [ ] Motor no limite
- [ ] Colisões
- [ ] Sistema de ordem automático
- [ ] Condições de eliminação

### Fase 3 - Regras Avançadas

- [ ] PD por componente
- [ ] Redução múltipla de marchas
- [ ] Tabela de freada complexa
- [ ] Peças na pista
- [ ] Vácuo
- [ ] Condições especiais (pneus carecas, etc.)

### Fase 4 - Recursos Avançados

- [ ] Meteorologia
- [ ] Seleção de pneus
- [ ] Parada nos boxes
- [ ] Cronometragem
- [ ] Modo GT (corrida urbana)

### Fase 5 - Experiência Completa

- [ ] Escuderias
- [ ] Volta de classificação
- [ ] Estatísticas detalhadas
- [ ] Exportação de logs
- [ ] Temas visuais

## 7. Tecnologias Sugeridas

### Frontend

- **HTML5/CSS3/JavaScript puro** ou
- **Vue.js/React** (para reatividade)
- **CSS Grid/Flexbox** (layout)
- **LocalStorage** (persistência)

### Estrutura Sugerida

```
formula-d-app/
├── index.html
├── css/
│   ├── main.css
│   ├── components.css
│   └── themes.css
├── js/
│   ├── main.js
│   ├── game-state.js
│   ├── rules-engine.js
│   ├── ui-controller.js
│   └── utils.js
└── assets/
    ├── images/
    └── sounds/ (opcional)
```

## 8. Especificações Técnicas

### 8.1 Dados e Randomização

```javascript
const DICE_RANGES = {
  1: [1, 2],
  2: [2, 3, 4],
  3: [4, 5, 6, 7, 8],
  4: [7, 8, 9, 10, 11, 12],
  5: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  6: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
};

function rollGearDie(gear) {
  const range = DICE_RANGES[gear];
  return range[Math.floor(Math.random() * range.length)];
}

function rollBlackDie() {
  return Math.floor(Math.random() * 20) + 1;
}
```

### 8.2 Tabelas de Penalidades

```javascript
const BRAKING_PENALTY = {
  1: { brakes: 1, tires: 0 },
  2: { brakes: 2, tires: 0 },
  3: { brakes: 3, tires: 0 },
  4: { brakes: 3, tires: 1 },
  5: { brakes: 3, tires: 2 },
  6: { brakes: 3, tires: 3 },
  7: "eliminated",
};

const GEAR_REDUCTION_PENALTY = {
  2: { gearbox: 1, brakes: 0, engine: 0 },
  3: { gearbox: 1, brakes: 1, engine: 0 },
  4: { gearbox: 1, brakes: 1, engine: 1 },
};
```

### 8.3 Validações

```javascript
function canChangeGear(currentGear, targetGear) {
  const diff = targetGear - currentGear;
  return diff >= -4 && diff <= 1; // max +1, -4
}

function isEliminated(car, mode) {
  if (mode === "basic") {
    return car.totalPD <= 0;
  } else {
    return (
      car.components.body.current <= 0 ||
      car.components.engine.current <= 0 ||
      car.components.suspension.current <= 0
    );
  }
}
```

## 9. Interface de Usuário Detalhada

### 9.1 Componentes Visuais

**Barra de PD:**

```html
<div class="pd-bar">
  <div class="pd-fill" style="width: 75%"></div>
  <span class="pd-text">15/20</span>
</div>
```

**Seletor de Marcha:**

```html
<div class="gear-selector">
  <button class="gear-btn" data-gear="1">1st</button>
  <button class="gear-btn active" data-gear="2">2nd</button>
  <button class="gear-btn" data-gear="3">3rd</button>
  <!-- ... -->
</div>
```

**Resultado do Dado:**

```html
<div class="dice-result">
  <div class="die-face">6</div>
  <div class="gear-range">3rd Gear (4-8)</div>
</div>
```

### 9.2 Estados Visuais

- **Jogador ativo:** destaque com borda colorida
- **PD crítico:** barra vermelha piscando
- **Eliminado:** opacidade reduzida + ícone X
- **Condições especiais:** badges coloridos

## 10. Fluxo de Testes

### 10.1 Casos de Teste Principais

1. **Setup básico:** 4 jogadores, 1 volta
2. **Largada:** todos os tipos (1, 2-16, 17-20)
3. **Mudanças de marcha:** válidas e inválidas
4. **Freada:** todas as combinações da tabela
5. **Motor no limite:** 5ª=20, 6ª=30
6. **Colisão:** múltiplos carros
7. **Eliminação:** PD zero, componentes críticos

### 10.2 Cenários Avançados

1. **Redução múltipla:** 6ª→2ª (penalidades)
2. **Pneus carecas:** derrapagem e recuperação
3. **Vácuo:** sequência de movimentos
4. **Meteorologia:** mudanças durante corrida
5. **Boxes:** parada rápida vs lenta

## 11. Próximos Passos

### Desenvolvimento

1. **Protótipo:** HTML/CSS/JS básico
2. **Teste:** regras básicas com 2 jogadores
3. **Iteração:** feedback e refinamento
4. **Expansão:** regras avançadas
5. **Polimento:** UX e performance

### Preparação para Online

- Arquitetura cliente-servidor
- Sincronização de estado
- Reconexão automática
- Salas privadas/públicas

---

_Este plano cobre todos os aspectos essenciais para criar um app auxiliar completo para Formula D, mantendo a experiência física do tabuleiro enquanto digitaliza a complexidade das regras._
