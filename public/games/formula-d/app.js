// Game data from provided JSON
const GAME_DATA = {
    diceRanges: {
        "1": [1, 2],
        "2": [2, 3, 4], 
        "3": [4, 5, 6, 7, 8],
        "4": [7, 8, 9, 10, 11, 12],
        "5": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        "6": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    },
    brakingPenalty: {
        "1": {"brakes": 1, "tires": 0},
        "2": {"brakes": 2, "tires": 0}, 
        "3": {"brakes": 3, "tires": 0},
        "4": {"brakes": 3, "tires": 1},
        "5": {"brakes": 3, "tires": 2},
        "6": {"brakes": 3, "tires": 3}
    },
    gearReductionPenalty: {
        "2": {"gearbox": 1, "brakes": 0, "engine": 0},
        "3": {"gearbox": 1, "brakes": 1, "engine": 0}, 
        "4": {"gearbox": 1, "brakes": 1, "engine": 1}
    },
    initialPD: {
        basic: 18,
        advanced: {
            tires: 6,
            brakes: 3, 
            gearbox: 3,
            body: 3,
            engine: 3,
            suspension: 2
        }
    },
    carColors: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan", "brown", "gray"]
};

// Game state
let gameState = {
    mode: 'basic',
    players: [],
    currentPlayerIndex: 0,
    currentGear: 1,
    selectedGear: null,
    diceValue: null,
    brakeAmount: 0,
    gamePhase: 'setup',
    startingOrder: [],
    currentStarterIndex: 0,
    raceLog: [],
    lap: 1
};

// Screen management
function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showStart() {
    showScreen('start-screen');
    gameState.gamePhase = 'setup';
}

function showSetup() {
    console.log('Navigating to setup screen');
    showScreen('setup-screen');
    // Add small delay to ensure screen is shown before updating inputs
    setTimeout(() => {
        updatePlayerInputs();
    }, 100);
}

function showStarting() {
    showScreen('starting-screen');
    gameState.gamePhase = 'starting';
    setupStartingPhase();
}

function showRace() {
    showScreen('race-screen');
    gameState.gamePhase = 'racing';
    updateRaceDisplay();
}

function showVictory(winnerId) {
    showScreen('victory-screen');
    gameState.gamePhase = 'finished';
    displayVictory(winnerId);
}

// Setup functions
function updatePlayerInputs() {
    console.log('Updating player inputs');
    const countSelect = document.getElementById('player-count');
    if (!countSelect) {
        console.error('Player count select not found');
        return;
    }
    
    const count = parseInt(countSelect.value) || 2;
    console.log('Player count:', count);
    
    const container = document.getElementById('players-config');
    if (!container) {
        console.error('Players config container not found');
        return;
    }
    
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        
        const colorOptions = GAME_DATA.carColors.map((color, index) => 
            `<div class="color-option color-${color} ${index === i ? 'selected' : ''}" 
                  data-color="${color}" data-player="${i}"></div>`
        ).join('');
        
        playerDiv.innerHTML = `
            <span class="player-number">P${i + 1}</span>
            <input type="text" class="form-control player-name-input" 
                   placeholder="Nome do piloto" value="Piloto ${i + 1}" data-player="${i}">
            <div class="color-selector" data-player="${i}">
                ${colorOptions}
            </div>
        `;
        container.appendChild(playerDiv);
    }
    
    // Add event listeners for color selection
    container.addEventListener('click', handleColorSelection);
}

function handleColorSelection(event) {
    if (event.target.classList.contains('color-option')) {
        const playerIndex = parseInt(event.target.dataset.player);
        const color = event.target.dataset.color;
        selectColor(playerIndex, color);
    }
}

function selectColor(playerIndex, color) {
    console.log(`Selecting color ${color} for player ${playerIndex}`);
    
    // Remove selection from all players for this color
    document.querySelectorAll(`[data-color="${color}"]`).forEach(el => {
        if (el.classList.contains('color-option')) {
            el.classList.remove('selected');
        }
    });
    
    // Remove current selection for this player
    document.querySelectorAll(`[data-player="${playerIndex}"].color-option`).forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked color
    const targetElement = document.querySelector(`[data-player="${playerIndex}"][data-color="${color}"]`);
    if (targetElement) {
        targetElement.classList.add('selected');
    }
}

function startGame() {
    console.log('Starting game');
    
    const modeSelect = document.getElementById('game-mode');
    const countSelect = document.getElementById('player-count');
    
    if (!modeSelect || !countSelect) {
        console.error('Required form elements not found');
        alert('Erro: elementos do formulário não encontrados');
        return;
    }
    
    const mode = modeSelect.value;
    const count = parseInt(countSelect.value);
    
    console.log('Game mode:', mode, 'Player count:', count);
    
    gameState.mode = mode;
    gameState.players = [];
    
    // Validate and create players
    let usedColors = new Set();
    let valid = true;
    
    for (let i = 0; i < count; i++) {
        const nameInput = document.querySelector(`input[data-player="${i}"]`);
        const selectedColorEl = document.querySelector(`[data-player="${i}"].color-option.selected`);
        
        if (!nameInput) {
            console.error(`Name input for player ${i} not found`);
            alert(`Campo de nome do Piloto ${i + 1} não encontrado`);
            valid = false;
            break;
        }
        
        const name = nameInput.value.trim();
        if (!name) {
            alert(`Nome do Piloto ${i + 1} é obrigatório`);
            valid = false;
            break;
        }
        
        if (!selectedColorEl) {
            alert(`Cor do Piloto ${i + 1} deve ser selecionada`);
            valid = false;
            break;
        }
        
        const color = selectedColorEl.dataset.color;
        if (usedColors.has(color)) {
            alert(`Cor ${color} já foi selecionada por outro piloto`);
            valid = false;
            break;
        }
        
        usedColors.add(color);
        gameState.players.push({
            id: i,
            name,
            color,
            gear: 1,
            pd: mode === 'basic' ? GAME_DATA.initialPD.basic : {...GAME_DATA.initialPD.advanced},
            position: 0,
            startingResult: null,
            eliminated: false
        });
    }
    
    console.log('Players created:', gameState.players);
    
    if (valid) {
        showStarting();
    }
}

// Starting phase functions
function setupStartingPhase() {
    console.log('Setting up starting phase');
    gameState.currentStarterIndex = 0;
    gameState.startingOrder = [];
    updateCurrentStarter();
    updateStartingResults();
}

function updateCurrentStarter() {
    if (gameState.currentStarterIndex >= gameState.players.length) {
        console.log('All players have rolled starting dice');
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentStarterIndex];
    const nameEl = document.getElementById('current-starter-name');
    const colorEl = document.getElementById('current-starter-color');
    const rollBtn = document.getElementById('roll-starting-btn');
    const resultDiv = document.getElementById('starting-result');
    
    if (nameEl) nameEl.textContent = currentPlayer.name;
    if (colorEl) colorEl.className = `starter-car color-${currentPlayer.color}`;
    if (resultDiv) resultDiv.style.display = 'none';
    if (rollBtn) {
        rollBtn.style.display = 'block';
        rollBtn.disabled = false;
    }
}

function rollStartingDice() {
    console.log('Rolling starting dice');
    
    const diceValue = Math.floor(Math.random() * 20) + 1;
    const currentPlayer = gameState.players[gameState.currentStarterIndex];
    
    let description = '';
    if (diceValue === 1) {
        description = 'Péssima largada - motor morre';
    } else if (diceValue >= 2 && diceValue <= 16) {
        description = 'Largada normal';
    } else {
        description = 'Ótima largada - 4 casas grátis';
    }
    
    currentPlayer.startingResult = { dice: diceValue, description };
    gameState.startingOrder.push(currentPlayer);
    
    // Display result
    const diceValueEl = document.getElementById('starting-dice-value');
    const descriptionEl = document.getElementById('starting-description');
    const resultDiv = document.getElementById('starting-result');
    const rollBtn = document.getElementById('roll-starting-btn');
    
    if (diceValueEl) diceValueEl.textContent = diceValue;
    if (descriptionEl) descriptionEl.textContent = description;
    if (resultDiv) resultDiv.style.display = 'block';
    if (rollBtn) rollBtn.style.display = 'none';
    
    // Log event
    addToLog(`${currentPlayer.name} rolou ${diceValue} na largada: ${description}`);
    
    // Move to next player
    setTimeout(() => {
        gameState.currentStarterIndex++;
        if (gameState.currentStarterIndex < gameState.players.length) {
            updateCurrentStarter();
        } else {
            finishStartingPhase();
        }
        updateStartingResults();
    }, 2000);
}

function updateStartingResults() {
    const container = document.getElementById('starting-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Sort by dice result (higher is better)
    const sortedResults = [...gameState.startingOrder].sort((a, b) => b.startingResult.dice - a.startingResult.dice);
    
    sortedResults.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'starting-item';
        item.innerHTML = `
            <div class="starting-item-info">
                <span class="starting-position">${index + 1}º</span>
                <div class="starter-car color-${player.color}"></div>
                <span>${player.name}</span>
            </div>
            <span class="starting-dice">${player.startingResult.dice}</span>
        `;
        container.appendChild(item);
    });
}

function finishStartingPhase() {
    console.log('Finishing starting phase');
    // Sort players by starting position
    gameState.players.sort((a, b) => b.startingResult.dice - a.startingResult.dice);
    gameState.currentPlayerIndex = 0;
    
    const startRaceBtn = document.getElementById('start-race-btn');
    if (startRaceBtn) {
        startRaceBtn.style.display = 'block';
    }
}

function startRace() {
    console.log('Starting race');
    // Apply starting bonuses
    gameState.players.forEach(player => {
        if (player.startingResult.dice >= 17) {
            player.position += 4;
            addToLog(`${player.name} recebe 4 casas grátis pela ótima largada!`);
        }
    });
    
    showRace();
}

// Race functions
function updateRaceDisplay() {
    if (gameState.currentPlayerIndex >= gameState.players.length) {
        gameState.currentPlayerIndex = 0;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Update current player info
    const nameEl = document.getElementById('current-player-name');
    const colorEl = document.getElementById('current-player-color');
    const gearEl = document.getElementById('current-gear-display');
    
    if (nameEl) nameEl.textContent = currentPlayer.name;
    if (colorEl) colorEl.className = `player-car color-${currentPlayer.color}`;
    if (gearEl) gearEl.textContent = `${currentPlayer.gear}ª`;
    
    // Update gear selector
    updateGearSelector();
    
    // Update PD display
    updatePDDisplay();
    
    // Update lap info
    const lapEl = document.getElementById('current-lap');
    if (lapEl) lapEl.textContent = gameState.lap;
    
    // Reset turn state
    gameState.selectedGear = null;
    gameState.diceValue = null;
    gameState.brakeAmount = 0;
    
    const diceResultContainer = document.getElementById('dice-result-container');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const finishTurnBtn = document.getElementById('finish-turn-btn');
    
    if (diceResultContainer) diceResultContainer.style.display = 'none';
    if (rollDiceBtn) rollDiceBtn.disabled = true;
    if (finishTurnBtn) finishTurnBtn.disabled = true;
}

function updateGearSelector() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentGear = currentPlayer.gear;
    
    document.querySelectorAll('.gear-btn').forEach(btn => {
        const gear = parseInt(btn.dataset.gear);
        btn.classList.remove('selected');
        
        // Check if gear change is valid
        const gearDiff = gear - currentGear;
        
        if (gearDiff > 1) {
            // Can't go up more than 1 gear
            btn.disabled = true;
            btn.title = 'Não pode subir mais de 1 marcha por turno';
        } else if (gearDiff < -4) {
            // Can't go down more than 4 gears
            btn.disabled = true;
            btn.title = 'Não pode reduzir mais de 4 marchas por turno';
        } else {
            btn.disabled = false;
            btn.title = '';
        }
    });
    
    const gearInfoEl = document.getElementById('gear-range-info');
    if (gearInfoEl) gearInfoEl.textContent = 'Selecione uma marcha';
}

function selectGear(gear) {
    console.log('Selecting gear:', gear);
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const gearDiff = gear - currentPlayer.gear;
    
    // Apply gear reduction penalty if needed
    if (gearDiff <= -2) {
        const reductionAmount = Math.abs(gearDiff);
        if (GAME_DATA.gearReductionPenalty[reductionAmount]) {
            const penalty = GAME_DATA.gearReductionPenalty[reductionAmount];
            applyPenalty(penalty, `redução de ${reductionAmount} marchas`);
        }
    }
    
    gameState.selectedGear = gear;
    
    // Update UI
    document.querySelectorAll('.gear-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    const selectedBtn = document.querySelector(`[data-gear="${gear}"]`);
    if (selectedBtn) selectedBtn.classList.add('selected');
    
    const range = GAME_DATA.diceRanges[gear.toString()];
    const gearInfoEl = document.getElementById('gear-range-info');
    if (gearInfoEl) {
        gearInfoEl.textContent = `${gear}ª marcha: ${range[0]}-${range[range.length - 1]} casas`;
    }
    
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    if (rollDiceBtn) rollDiceBtn.disabled = false;
}

function rollDice() {
    if (!gameState.selectedGear) return;
    
    console.log('Rolling dice for gear:', gameState.selectedGear);
    
    const range = GAME_DATA.diceRanges[gameState.selectedGear.toString()];
    const diceValue = range[Math.floor(Math.random() * range.length)];
    
    gameState.diceValue = diceValue;
    
    // Update player's gear
    gameState.players[gameState.currentPlayerIndex].gear = gameState.selectedGear;
    
    // Display result
    const diceValueEl = document.getElementById('dice-value');
    const diceResultContainer = document.getElementById('dice-result-container');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    
    if (diceValueEl) diceValueEl.textContent = diceValue;
    if (diceResultContainer) diceResultContainer.style.display = 'block';
    if (rollDiceBtn) rollDiceBtn.disabled = true;
    
    // Setup brake option
    const brakeInput = document.getElementById('brake-input');
    if (brakeInput) {
        brakeInput.max = diceValue;
        brakeInput.value = 0;
        brakeInput.addEventListener('input', updateBrakeCost);
    }
    updateBrakeCost();
    
    const finishTurnBtn = document.getElementById('finish-turn-btn');
    if (finishTurnBtn) finishTurnBtn.disabled = false;
    
    // Log the roll
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    addToLog(`${currentPlayer.name} rolou ${diceValue} na ${gameState.selectedGear}ª marcha`);
}

function updateBrakeCost() {
    const brakeInput = document.getElementById('brake-input');
    const brakeCostEl = document.getElementById('brake-cost');
    
    if (!brakeInput || !brakeCostEl) return;
    
    const brakeAmount = parseInt(brakeInput.value) || 0;
    const gear = gameState.selectedGear;
    
    if (brakeAmount > 0 && GAME_DATA.brakingPenalty[gear]) {
        const penalty = GAME_DATA.brakingPenalty[gear];
        let costText = 'Custo: ';
        
        if (gameState.mode === 'basic') {
            const totalCost = (penalty.brakes + penalty.tires) * brakeAmount;
            costText += `${totalCost} PD`;
        } else {
            const costs = [];
            if (penalty.brakes > 0) costs.push(`${penalty.brakes * brakeAmount} Freios`);
            if (penalty.tires > 0) costs.push(`${penalty.tires * brakeAmount} Pneus`);
            costText += costs.join(', ') || '0 PD';
        }
        
        brakeCostEl.textContent = costText;
    } else {
        brakeCostEl.textContent = 'Custo: 0 PD';
    }
    
    gameState.brakeAmount = brakeAmount;
}

function finishTurn() {
    console.log('Finishing turn');
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const finalMovement = gameState.diceValue - gameState.brakeAmount;
    
    // Apply braking penalty
    if (gameState.brakeAmount > 0) {
        const gear = gameState.selectedGear;
        const penalty = GAME_DATA.brakingPenalty[gear];
        const adjustedPenalty = {
            brakes: penalty.brakes * gameState.brakeAmount,
            tires: penalty.tires * gameState.brakeAmount
        };
        applyPenalty(adjustedPenalty, 'freada');
        addToLog(`${currentPlayer.name} freou ${gameState.brakeAmount} casas`);
    }
    
    // Move player
    currentPlayer.position += finalMovement;
    addToLog(`${currentPlayer.name} avançou ${finalMovement} casas (posição: ${currentPlayer.position})`);
    
    // Check for victory (assuming finish line at position 100)
    if (currentPlayer.position >= 100) {
        showVictory(currentPlayer.id);
        return;
    }
    
    // Move to next player
    nextPlayer();
}

function nextPlayer() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateRaceDisplay();
}

function applyPenalty(penalty, reason) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (gameState.mode === 'basic') {
        const totalPenalty = Object.values(penalty).reduce((sum, val) => sum + val, 0);
        currentPlayer.pd = Math.max(0, currentPlayer.pd - totalPenalty);
        
        if (currentPlayer.pd === 0) {
            currentPlayer.eliminated = true;
            addToLog(`${currentPlayer.name} foi eliminado por perda total de PD!`);
        } else {
            addToLog(`${currentPlayer.name} perdeu ${totalPenalty} PD por ${reason}`);
        }
    } else {
        let eliminated = false;
        Object.keys(penalty).forEach(component => {
            if (penalty[component] > 0 && currentPlayer.pd[component] !== undefined) {
                currentPlayer.pd[component] = Math.max(0, currentPlayer.pd[component] - penalty[component]);
                
                if (currentPlayer.pd[component] === 0 && ['engine', 'gearbox'].includes(component)) {
                    eliminated = true;
                }
            }
        });
        
        if (eliminated) {
            currentPlayer.eliminated = true;
            addToLog(`${currentPlayer.name} foi eliminado por falha crítica!`);
        } else {
            const penaltyText = Object.entries(penalty)
                .filter(([_, value]) => value > 0)
                .map(([component, value]) => `${value} ${component}`)
                .join(', ');
            addToLog(`${currentPlayer.name} perdeu ${penaltyText} por ${reason}`);
        }
    }
    
    updatePDDisplay();
}

function updatePDDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const container = document.getElementById('pd-display');
    
    if (!container) return;
    
    if (gameState.mode === 'basic') {
        container.innerHTML = `
            <div class="pd-basic">
                <span class="pd-label">Pontos de Desgaste</span>
                <span class="pd-value ${currentPlayer.pd <= 5 ? 'critical' : ''}">${currentPlayer.pd}</span>
            </div>
        `;
    } else {
        const components = ['tires', 'brakes', 'gearbox', 'body', 'engine', 'suspension'];
        const componentNames = {
            tires: 'Pneus',
            brakes: 'Freios', 
            gearbox: 'Câmbio',
            body: 'Carroceria',
            engine: 'Motor',
            suspension: 'Suspensão'
        };
        
        container.innerHTML = `
            <div class="pd-advanced">
                ${components.map(comp => `
                    <div class="pd-component">
                        <div class="component-name">${componentNames[comp]}</div>
                        <div class="component-value ${currentPlayer.pd[comp] === 0 ? 'status-critical' : 
                            currentPlayer.pd[comp] === 1 ? 'status-warning' : 'status-good'}">${currentPlayer.pd[comp]}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function undoAction() {
    alert('Funcionalidade de desfazer em desenvolvimento');
}

function showEventsModal() {
    const modal = document.getElementById('events-modal');
    if (modal) modal.classList.remove('hidden');
}

function hideEventsModal() {
    const modal = document.getElementById('events-modal');
    if (modal) modal.classList.add('hidden');
}

function applyEvent(eventType) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    switch (eventType) {
        case 'overheat':
            applyPenalty({engine: 1}, 'superaquecimento');
            break;
        case 'tire-wear':
            applyPenalty({tires: 2}, 'desgaste de pneus');
            break;
        case 'engine-problem':
            applyPenalty({engine: 2}, 'problema no motor');
            break;
        case 'collision':
            applyPenalty({body: 1, suspension: 1}, 'colisão');
            break;
        case 'weather-change':
            addToLog('Tempo mudou - cuidado nas próximas curvas!');
            break;
    }
    
    hideEventsModal();
}

function addToLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    gameState.raceLog.push({message, timestamp});
    
    const container = document.getElementById('event-log-container');
    if (!container) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <div>${message}</div>
        <div class="log-timestamp">${timestamp}</div>
    `;
    
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
    
    // Keep only last 50 entries
    if (gameState.raceLog.length > 50) {
        gameState.raceLog = gameState.raceLog.slice(-50);
        const entries = container.querySelectorAll('.log-entry');
        if (entries.length > 50) {
            entries[0].remove();
        }
    }
}

function displayVictory(winnerId) {
    const winner = gameState.players.find(p => p.id === winnerId);
    if (!winner) return;
    
    const winnerNameEl = document.getElementById('winner-name');
    const winnerColorEl = document.getElementById('winner-color');
    
    if (winnerNameEl) winnerNameEl.textContent = winner.name;
    if (winnerColorEl) winnerColorEl.className = `winner-car color-${winner.color}`;
    
    // Show final standings
    const standings = [...gameState.players].sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        return b.position - a.position;
    });
    
    const container = document.getElementById('final-standings-list');
    if (container) {
        container.innerHTML = '';
        
        standings.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'standing-item';
            item.innerHTML = `
                <div class="standing-info">
                    <span class="standing-position">${index + 1}º</span>
                    <div class="starter-car color-${player.color}"></div>
                    <span>${player.name}</span>
                </div>
                <span class="standing-distance">${player.eliminated ? 'ELIMINADO' : `${player.position} casas`}</span>
            `;
            container.appendChild(item);
        });
    }
    
    addToLog(`🏆 ${winner.name} venceu a corrida!`);
}

function newRace() {
    // Reset game state
    gameState = {
        mode: 'basic',
        players: [],
        currentPlayerIndex: 0,
        currentGear: 1,
        selectedGear: null,
        diceValue: null,
        brakeAmount: 0,
        gamePhase: 'setup',
        startingOrder: [],
        currentStarterIndex: 0,
        raceLog: [],
        lap: 1
    };
    
    showStart();
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Formula D app');
    
    // Add event listeners
    const playerCountSelect = document.getElementById('player-count');
    if (playerCountSelect) {
        playerCountSelect.addEventListener('change', updatePlayerInputs);
    }
    
    // Initialize with default setup
    setTimeout(() => {
        updatePlayerInputs();
    }, 100);
    
    // Initialize log
    addToLog('🏎️ Formula D - Sistema iniciado');
    
    console.log('Formula D App inicializado!');
});