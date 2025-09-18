import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Car,
  Clock,
  Crown,
  Dices,
  Flag,
  Home,
  Medal,
  RotateCcw,
  Settings,
  SkipForward,
  Trophy,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";
import GearSelectorComp from "./formulad/GearSelector";
import DicePanelComp from "./formulad/DicePanel";
import PlayerStatusComp from "./formulad/PlayerStatus";
import BottomControlsComp from "./formulad/BottomControls";
import type { GameCtx } from "./formulad/types";

// Game data
const GAME_DATA = {
  diceRanges: {
    "1": [1, 2],
    "2": [2, 3, 4],
    "3": [4, 5, 6, 7, 8],
    "4": [7, 8, 9, 10, 11, 12],
    "5": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    "6": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  },
  brakingPenalty: {
    "1": { brakes: 1, tires: 0 },
    "2": { brakes: 2, tires: 0 },
    "3": { brakes: 3, tires: 0 },
    "4": { brakes: 3, tires: 1 },
    "5": { brakes: 3, tires: 2 },
    "6": { brakes: 3, tires: 3 },
  },
  gearReductionPenalty: {
    "2": { gearbox: 1, brakes: 0, engine: 0 },
    "3": { gearbox: 1, brakes: 1, engine: 0 },
    "4": { gearbox: 1, brakes: 1, engine: 1 },
  },
  initialPD: {
    basic: 18,
    advanced: {
      tires: 6,
      brakes: 3,
      gearbox: 3,
      body: 3,
      engine: 3,
      suspension: 2,
    },
  },
  carColors: [
    { name: "red", value: "#DC2626", label: "Vermelho" },
    { name: "blue", value: "#2563EB", label: "Azul" },
    { name: "green", value: "#16A34A", label: "Verde" },
    { name: "yellow", value: "#CA8A04", label: "Amarelo" },
    { name: "purple", value: "#9333EA", label: "Roxo" },
    { name: "orange", value: "#EA580C", label: "Laranja" },
    { name: "pink", value: "#DB2777", label: "Rosa" },
    { name: "cyan", value: "#0891B2", label: "Ciano" },
    { name: "brown", value: "#A16207", label: "Marrom" },
    { name: "gray", value: "#6B7280", label: "Cinza" },
  ],
  tracks: [
    { id: "interlagos", label: "Interlagos" },
    { id: "silverstone", label: "Silverstone" },
    { id: "monza", label: "Monza" },
    { id: "spa", label: "Spa-Francorchamps" },
    { id: "suzuka", label: "Suzuka" },
    { id: "monterey", label: "WeatherTech Raceway Laguna Seca" },
  ],
};

interface PlayerPD {
  tires: number;
  brakes: number;
  gearbox: number;
  body: number;
  engine: number;
  suspension: number;
}

interface Player {
  id: number;
  name: string;
  color: string;
  gear: number;
  pd: number | PlayerPD;
  position: number;
  startingResult: { dice: number; description: string } | null;
  eliminated: boolean;
  lapsCompleted?: number;
  canIncreaseGear?: boolean; // controls per-turn gear-increase availability
  finished?: boolean;
  isAI?: boolean;
}

interface GameState {
  mode: "basic" | "advanced";
  players: Player[];
  currentPlayerIndex: number;
  selectedGear: number | null;
  diceValue: number | null;
  brakeAmount: number;
  brakePD?: number;
  brakePDComponents?: Partial<PlayerPD>;
  pendingPrevGear?: number | null;
  gamePhase: "setup" | "starting" | "racing" | "finished";
  startingOrder: Player[];
  currentStarterIndex: number;
  raceLog: Array<{ message: string; timestamp: string }>;
  lap: number;
  totalLaps?: number;
  // global turn/round counter and tracker for who played in the current round
  turnNumber?: number;
  roundTracker?: number[]; // array of player IDs who already played this round
  track?: string;
}

const FormulaD = () => {
  // Load game state from localStorage on component mount
  const loadGameState = (): GameState | null => {
    try {
      const saved = localStorage.getItem("formulaD-gameState");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error loading game state:", error);
      return null;
    }
  };

  const loadSetupData = () => {
    try {
      const saved = localStorage.getItem("formulaD-setupData");
      return saved
        ? JSON.parse(saved)
        : {
            mode: "basic" as "basic" | "advanced",
            playerCount: 4,
            players: Array(4)
              .fill(null)
              .map((_, i) => ({
                name: `Piloto ${i + 1}`,
                color: GAME_DATA.carColors[i].name,
              })),
          };
    } catch (error) {
      console.error("Error loading setup data:", error);
      return {
        mode: "basic" as "basic" | "advanced",
        playerCount: 4,
        players: Array(4)
          .fill(null)
          .map((_, i) => ({
            name: `Piloto ${i + 1}`,
            color: GAME_DATA.carColors[i].name,
          })),
      };
    }
  };

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return (
      saved || {
        mode: "basic",
        players: [],
        currentPlayerIndex: 0,
        selectedGear: null,
        diceValue: null,
        brakeAmount: 0,
        turnNumber: 1,
        roundTracker: [],
        gamePhase: "setup",
        startingOrder: [],
        currentStarterIndex: 0,
        raceLog: [],
        lap: 1,
      }
    );
  });

  const [setupData, setSetupData] = useState(() => loadSetupData());
  const [colorScrollIndex, setColorScrollIndex] = useState(0);
  const colorContainerRef = useRef<HTMLDivElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinners, setShowWinners] = useState(false);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formulaD-gameState", JSON.stringify(gameState));
  }, [gameState]);

  // Save setup data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formulaD-setupData", JSON.stringify(setupData));
  }, [setupData]);

  useEffect(() => {
    if (gameState.raceLog.length === 0) {
      addToLog("🏎️ Formula D - Sistema iniciado");
    }
  }, [gameState.raceLog.length]);

  // Skip eliminated players automatically during racing phase
  useEffect(() => {
    if (gameState.gamePhase === "racing") {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer?.eliminated) {
        const nextIndex = getNextPlayerIndex(
          gameState.currentPlayerIndex,
          gameState.players
        );
        setGameState((prev) => ({ ...prev, currentPlayerIndex: nextIndex }));
        addToLog(`${currentPlayer.name} está eliminado - pulando turno`);
      }
    }
  }, [gameState.gamePhase, gameState.currentPlayerIndex, gameState.players]);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setGameState((prev) => ({
      ...prev,
      raceLog: [...prev.raceLog.slice(-49), { message, timestamp }],
    }));
  };

  const getNextPlayerIndex = (
    currentIndex: number,
    players: Player[]
  ): number => {
    let nextIndex = (currentIndex + 1) % players.length;
    let attempts = 0;

    // Skip eliminated players, but prevent infinite loop
    while (players[nextIndex]?.eliminated && attempts < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      attempts++;
    }

    return nextIndex;
  };

  const updateSetupPlayers = (count: number) => {
    const newPlayers = Array(count)
      .fill(null)
      .map((_, i) => ({
        name:
          i < setupData.players.length
            ? setupData.players[i].name
            : `Piloto ${i + 1}`,
        color: GAME_DATA.carColors[i].name,
      }));
    setSetupData((prev) => ({
      ...prev,
      playerCount: count,
      players: newPlayers,
    }));
  };

  const updatePlayerName = (index: number, name: string) => {
    setSetupData((prev) => ({
      ...prev,
      players: prev.players.map((p, i) => (i === index ? { ...p, name } : p)),
    }));
  };

  const updatePlayerColor = (index: number, color: string) => {
    setSetupData((prev) => ({
      ...prev,
      players: prev.players.map((p, i) => (i === index ? { ...p, color } : p)),
    }));
  };

  const startGame = () => {
    const players: Player[] = setupData.players.map((p, i) => ({
      id: i,
      name: p.name,
      color: p.color,
      gear: 1,
      pd:
        setupData.mode === "basic"
          ? GAME_DATA.initialPD.basic
          : { ...GAME_DATA.initialPD.advanced },
      position: 0,
      startingResult: null,
      eliminated: false,
      lapsCompleted: 0,
      canIncreaseGear: true,
      finished: false,
    }));

    // single-player mode: do not add a CPU opponent — play with only the configured human players

    setGameState((prev) => ({
      ...prev,
      mode: setupData.mode,
      players,
      totalLaps: setupData.laps || 3,
      track: setupData.track || GAME_DATA.tracks[0].id,
      gamePhase: "starting",
      currentStarterIndex: 0,
      startingOrder: [],
    }));
  };

  const rollStartingDice = () => {
    const diceValue = Math.floor(Math.random() * 20) + 1;
    const currentPlayer = gameState.players[gameState.currentStarterIndex];

    let description = "";
    if (diceValue === 1) {
      description = "Péssima largada - motor morre";
    } else if (diceValue >= 2 && diceValue <= 16) {
      description = "Largada normal";
    } else {
      description = "Ótima largada - 4 casas grátis";
    }

    const updatedPlayer = {
      ...currentPlayer,
      startingResult: { dice: diceValue, description },
    };

    setGameState((prev) => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentStarterIndex] = updatedPlayer;

      const newStartingOrder = [...prev.startingOrder, updatedPlayer];
      const nextIndex = prev.currentStarterIndex + 1;

      return {
        ...prev,
        players: newPlayers,
        startingOrder: newStartingOrder,
        currentStarterIndex: nextIndex,
      };
    });

    addToLog(
      `${currentPlayer.name} rolou ${diceValue} na largada: ${description}`
    );
  };

  const finishStartingPhase = () => {
    const sortedPlayers = [...gameState.players].sort(
      (a, b) => (b.startingResult?.dice || 0) - (a.startingResult?.dice || 0)
    );

    // Apply starting bonuses
    const playersWithBonuses = sortedPlayers.map((player) => {
      if (player.startingResult && player.startingResult.dice >= 17) {
        addToLog(`${player.name} recebe 4 casas grátis pela ótima largada!`);
        return { ...player, position: player.position + 4 };
      }
      return player;
    });

    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: 0,
      gamePhase: "racing",
      // ensure per-player gear rule resets
      players: playersWithBonuses.map((p) => ({
        ...p,
        canIncreaseGear: true,
      })) as Player[],
    }));
  };

  const resetGame = () => {
    // Clear localStorage
    localStorage.removeItem("formulaD-gameState");
    localStorage.removeItem("formulaD-setupData");

    // Reset to initial state
    const initialSetupData = {
      mode: "basic" as "basic" | "advanced",
      playerCount: 4,
      players: Array(4)
        .fill(null)
        .map((_, i) => ({
          name: `Piloto ${i + 1}`,
          color: GAME_DATA.carColors[i].name,
        })),
    };

    const initialGameState = {
      mode: "basic" as "basic" | "advanced",
      players: [],
      currentPlayerIndex: 0,
      selectedGear: null,
      diceValue: null,
      brakeAmount: 0,
      gamePhase: "setup" as "setup" | "starting" | "racing" | "finished",
      startingOrder: [],
      currentStarterIndex: 0,
      raceLog: [],
      lap: 1,
    };

    setSetupData(initialSetupData);
    setGameState(initialGameState);

    // Add initial log message
    setTimeout(() => {
      addToLog("🏎️ Formula D - Sistema reiniciado");
    }, 100);
  };

  const returnToStart = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "setup",
      players: [],
      currentPlayerIndex: 0,
      selectedGear: null,
      diceValue: null,
      brakeAmount: 0,
      startingOrder: [],
      currentStarterIndex: 0,
      raceLog: [],
      lap: 1,
    }));
    setShowWinners(false);
    setShowConfetti(false);
    addToLog("🏁 Voltando para configuração inicial");
  };

  const finishRace = () => {
    // Sort players primarily by finished status, then lapsCompleted, then position.
    const active = [...gameState.players].filter((p) => !p.eliminated);
    active.sort((a, b) => {
      // finished players first
      if ((a.finished ? 1 : 0) !== (b.finished ? 1 : 0))
        return (b.finished ? 1 : 0) - (a.finished ? 1 : 0);
      const lapsA = a.lapsCompleted || 0;
      const lapsB = b.lapsCompleted || 0;
      if (lapsA !== lapsB) return lapsB - lapsA;
      return b.position - a.position;
    });

    const eliminatedPlayers = [...gameState.players].filter(
      (p) => p.eliminated
    );
    eliminatedPlayers.sort((a, b) => b.position - a.position);

    const finalStandings = [...active, ...eliminatedPlayers];

    // Update game state to finished
    setGameState((prev) => ({
      ...prev,
      gamePhase: "finished",
      players: finalStandings,
    }));

    // Show confetti and winners
    setShowConfetti(true);
    setShowWinners(true);

    // Add final log messages
    addToLog("🏁 CORRIDA FINALIZADA!");
    if (finalStandings.length > 0) {
      addToLog(`🥇 VENCEDOR: ${finalStandings[0].name}!`);
      if (finalStandings.length > 1)
        addToLog(`🥈 2º lugar: ${finalStandings[1].name}`);
      if (finalStandings.length > 2)
        addToLog(`🥉 3º lugar: ${finalStandings[2].name}`);
    }

    // Stop confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const getNextPlayerBasedOnPosition = (players?: Player[]): number => {
    const playersToCheck = players || gameState.players;

    // Get all non-eliminated players with their current positions and gears
    const activePlayers = playersToCheck
      .map((player, index) => ({ ...player, originalIndex: index }))
      .filter((player) => !player.eliminated);

    if (activePlayers.length === 0) return 0;

    // Sort by position (furthest back goes first), then by gear (lower gear goes first)
    activePlayers.sort((a, b) => {
      if (a.position !== b.position) {
        return a.position - b.position; // Lower position (further back) goes first
      }
      return a.gear - b.gear; // Lower gear goes first for ties
    });

    // If there are still ties, maintain current order or use manual selection
    const nextPlayer = activePlayers[0];
    return nextPlayer.originalIndex;
  };

  const selectGear = (gear: number) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const gearDiff = gear - currentPlayer.gear;

    // Prevent increasing gear if player is not allowed yet
    if (gear > currentPlayer.gear && !currentPlayer.canIncreaseGear) {
      addToLog(
        `${currentPlayer.name} não pode aumentar marcha até o próximo turno.`
      );
      return;
    }

    // If reducing gear by 2+ steps, defer the penalty until finishTurn
    if (gearDiff <= -2) {
      // store the previous gear so we can compute and apply penalty at the end of the turn
      setGameState((prev) => ({
        ...prev,
        selectedGear: gear,
        pendingPrevGear: currentPlayer.gear,
      }));
      addToLog(
        `${currentPlayer.name} selecionou redução de ${currentPlayer.gear} -> ${gear} (penalidade será aplicada ao finalizar turno)`
      );
      return;
    }

    setGameState((prev) => ({ ...prev, selectedGear: gear }));
  };

  const rollDice = () => {
    if (!gameState.selectedGear) return;

    const range =
      GAME_DATA.diceRanges[
        gameState.selectedGear.toString() as keyof typeof GAME_DATA.diceRanges
      ];
    const diceValue = range[Math.floor(Math.random() * range.length)];

    setGameState((prev) => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex] = {
        ...newPlayers[prev.currentPlayerIndex],
        gear: prev.selectedGear!,
      };

      return {
        ...prev,
        diceValue,
        players: newPlayers,
        // reset manual brake inputs for the new roll
        brakeAmount: 0,
        brakePD: 0,
        brakePDComponents: {},
      };
    });

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    addToLog(
      `${currentPlayer.name} rolou ${diceValue} na ${gameState.selectedGear}ª marcha`
    );

    // Check for engine limit
    if (
      (gameState.selectedGear === 5 && diceValue === 20) ||
      (gameState.selectedGear === 6 && diceValue === 30)
    ) {
      addToLog(
        `⚠️ Motor no limite! ${currentPlayer.name} deve fazer teste de resistência.`
      );
      // In a full implementation, this would trigger a special event
    }
  };

  interface PenaltyData {
    [key: string]: number;
  }

  const applyPenalty = (penalty: PenaltyData, reason: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    setGameState((prev) => {
      const newPlayers = [...prev.players];
      const player = { ...newPlayers[prev.currentPlayerIndex] };

      if (prev.mode === "basic") {
        const totalPenalty = Object.values(penalty).reduce(
          (sum, val) => sum + (val as number),
          0
        );
        const currentPD = player.pd as number;
        player.pd = Math.max(0, currentPD - totalPenalty);

        if (player.pd === 0) {
          player.eliminated = true;
          addToLog(`${player.name} foi eliminado por perda total de PD!`);
        } else {
          addToLog(`${player.name} perdeu ${totalPenalty} PD por ${reason}`);
        }
      } else {
        let eliminated = false;
        const playerPD = player.pd as PlayerPD;
        Object.keys(penalty).forEach((component) => {
          if (
            penalty[component] > 0 &&
            playerPD[component as keyof PlayerPD] !== undefined
          ) {
            playerPD[component as keyof PlayerPD] = Math.max(
              0,
              playerPD[component as keyof PlayerPD] - penalty[component]
            );

            if (
              playerPD[component as keyof PlayerPD] === 0 &&
              ["engine", "gearbox"].includes(component)
            ) {
              eliminated = true;
            }
          }
        });

        if (eliminated) {
          player.eliminated = true;
          addToLog(`${player.name} foi eliminado por falha crítica!`);
        } else {
          const penaltyText = Object.entries(penalty)
            .filter(([_, value]) => (value as number) > 0)
            .map(([component, value]) => `${value} ${component}`)
            .join(", ");
          addToLog(`${player.name} perdeu ${penaltyText} por ${reason}`);
        }
      }

      newPlayers[prev.currentPlayerIndex] = player;
      return { ...prev, players: newPlayers };
    });
  };

  const finishTurn = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    // Determine final movement using manual PD (brakePD) when available, otherwise fallback to brakeAmount
    const brakeUsed =
      typeof gameState.brakePD === "number"
        ? gameState.brakePD
        : gameState.brakeAmount;
    const finalMovement = Math.max(
      0,
      (gameState.diceValue || 0) - (brakeUsed || 0)
    );

    // Apply manual braking PD
    if (brakeUsed > 0) {
      if (gameState.mode === "basic") {
        // basic: single PD numeric
        applyPenalty({ pd: brakeUsed }, "freada (manual)");
        addToLog(`${currentPlayer.name} gastou ${brakeUsed} PD (freada)`);
      } else if (
        gameState.brakePDComponents &&
        Object.keys(gameState.brakePDComponents).length > 0
      ) {
        // Convert Partial<PlayerPD> to PenaltyData by filtering undefined
        const penaltyFromComponents: { [k: string]: number } = {};
        Object.entries(gameState.brakePDComponents).forEach(([k, v]) => {
          if (v && v > 0) penaltyFromComponents[k] = v;
        });
        if (Object.keys(penaltyFromComponents).length > 0) {
          applyPenalty(penaltyFromComponents, "freada (manual)");
          const compText = Object.entries(penaltyFromComponents)
            .map(([k, v]) => `${v} ${k}`)
            .join(", ");
          addToLog(
            `${currentPlayer.name} gastou PD por componente: ${compText}`
          );
        }
      } else if (typeof gameState.brakePD === "number") {
        // advanced mode but player used the numeric input - treat as generic PD reduction
        applyPenalty({ pd: gameState.brakePD }, "freada (manual)");
        addToLog(
          `${currentPlayer.name} gastou ${gameState.brakePD} PD (freada)`
        );
      }
    }

    // Apply deferred gear reduction penalty if present
    if (gameState.pendingPrevGear != null && gameState.selectedGear != null) {
      const prevGear = gameState.pendingPrevGear;
      const newGear = gameState.selectedGear;
      const reductionAmount = prevGear - newGear;
      if (reductionAmount >= 2) {
        const key =
          reductionAmount.toString() as keyof typeof GAME_DATA.gearReductionPenalty;
        const penalty = GAME_DATA.gearReductionPenalty[key];
        if (penalty) {
          applyPenalty(penalty, `redução de ${reductionAmount} marchas`);
          addToLog(
            `${currentPlayer.name} sofreu penalidade por redução de ${reductionAmount} marchas`
          );
        }
      }
    }

    // Move player
    setGameState((prev) => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex] = {
        ...newPlayers[prev.currentPlayerIndex],
        position: newPlayers[prev.currentPlayerIndex].position + finalMovement,
      };

      // Victory by position removed: race end is controlled by laps (see markLap/finishRace)

      const nextIndex = getNextPlayerBasedOnPosition(newPlayers);

      // after a player's turn ends, they cannot increase gear until their next turn
      newPlayers[prev.currentPlayerIndex].canIncreaseGear = false;
      // allow the player who will play next to increase gear when their turn starts
      if (newPlayers[nextIndex]) newPlayers[nextIndex].canIncreaseGear = true;

      // Update round tracker and turn counter safely (avoid undefined variables)
      const prevTracker = prev.roundTracker || [];
      const playerId = newPlayers[prev.currentPlayerIndex].id;
      const updatedTracker = [...prevTracker, playerId];
      const uniqueTracker = Array.from(new Set(updatedTracker));

      const activePlayersCount = newPlayers.filter((p) => !p.eliminated).length;

      let clearedRoundTracker: number[] = uniqueTracker;
      let newTurnNumber = prev.turnNumber || 1;

      // If all active players have played this round, clear tracker and increment turn counter
      if (uniqueTracker.length >= Math.max(1, activePlayersCount)) {
        clearedRoundTracker = [];
        newTurnNumber = (prev.turnNumber || 1) + 1;
      }

      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextIndex,
        selectedGear: null,
        diceValue: null,
        brakeAmount: 0,
        // clear manual brake inputs and pending gear after finishing
        brakePD: 0,
        brakePDComponents: {},
        pendingPrevGear: null,
        roundTracker: clearedRoundTracker,
        turnNumber: newTurnNumber,
      };
    });
    addToLog(
      `${currentPlayer.name} avançou ${finalMovement} casas (posição: ${
        currentPlayer.position + finalMovement
      })`
    );
  };

  const calculateBrakeCost = () => {
    // Show cost based on manual PD input; if none provided, cost is 0
    const brakeUsed =
      typeof gameState.brakePD === "number"
        ? gameState.brakePD
        : gameState.brakeAmount;
    if (!gameState.selectedGear || !brakeUsed) return "Custo: 0 PD";

    if (gameState.mode === "basic") {
      return `Custo: ${brakeUsed} PD`;
    } else {
      if (
        gameState.brakePDComponents &&
        Object.keys(gameState.brakePDComponents).length > 0
      ) {
        const costs = Object.entries(gameState.brakePDComponents)
          .map(([k, v]) => `${v} ${k}`)
          .join(", ");
        return `Custo: ${costs}`;
      }
      return `Custo: ${brakeUsed} PD`;
    }
  };

  const applyEvent = (eventType: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    switch (eventType) {
      case "overheat":
        applyPenalty({ engine: 1 }, "superaquecimento");
        break;
      case "tire-wear":
        applyPenalty({ tires: 2 }, "desgaste de pneus");
        break;
      case "engine-problem":
        applyPenalty({ engine: 2 }, "problema no motor");
        break;
      case "collision":
        applyPenalty({ body: 1, suspension: 1 }, "colisão");
        break;
      case "weather-change":
        addToLog("Tempo mudou - cuidado nas próximas curvas!");
        break;
    }
  };

  const undoAction = () => {
    setGameState((prev) => {
      const newPlayers = [...prev.players];
      const currentPlayer = { ...newPlayers[prev.currentPlayerIndex] };
      const brakeUsed =
        typeof prev.brakePD === "number" ? prev.brakePD : prev.brakeAmount;
      const movement = (prev.diceValue || 0) - (brakeUsed || 0);
      const finalMovement = Math.max(0, movement);

      currentPlayer.position += finalMovement;

      // after a player's turn ends, they cannot increase gear until their next turn
      currentPlayer.canIncreaseGear = false;

      newPlayers[prev.currentPlayerIndex] = currentPlayer;

      const nextIndex = getNextPlayerBasedOnPosition(newPlayers);

      // when we set the next player, if it's a different player we should allow that player to increase gear
      if (newPlayers[nextIndex]) {
        newPlayers[nextIndex].canIncreaseGear = true;
      }

      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextIndex,
        selectedGear: null,
        diceValue: null,
        brakeAmount: 0,
      };
    });
  };

  const markLap = (playerIndex: number) => {
    setGameState((prev) => {
      const newPlayers = [...prev.players];
      const player = { ...newPlayers[playerIndex] } as Player;
      player.lapsCompleted = (player.lapsCompleted || 0) + 1;
      // mark finished when reaches totalLaps
      if ((prev.totalLaps || 3) <= (player.lapsCompleted || 0)) {
        player.finished = true;
        addToLog(`${player.name} completou a corrida!`);
      } else {
        addToLog(`${player.name} completou volta ${player.lapsCompleted}`);
      }

      newPlayers[playerIndex] = player;

      // if all players finished, finalize
      const allFinished = newPlayers.every((p) => p.finished || p.eliminated);
      if (allFinished) {
        setTimeout(() => finishRace(), 200);
      }

      return { ...prev, players: newPlayers };
    });
  };

  const GearSelector = () => {
    if (gameState.gamePhase !== "racing") return null;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentGear = currentPlayer.gear;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Seletor de Marcha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((gear) => {
              const gearDiff = gear - currentGear;
              const isDisabled = gearDiff > 1 || gearDiff < -4;
              const isSelected = gameState.selectedGear === gear;

              return (
                <Button
                  key={gear}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isDisabled}
                  onClick={() => selectGear(gear)}
                  className="h-12 font-bold"
                >
                  {gear}ª
                </Button>
              );
            })}
          </div>
          {gameState.selectedGear && (
            <div className="text-center text-sm text-muted-foreground">
              {gameState.selectedGear}ª marcha:{" "}
              {
                GAME_DATA.diceRanges[
                  gameState.selectedGear.toString() as keyof typeof GAME_DATA.diceRanges
                ][0]
              }
              -
              {
                GAME_DATA.diceRanges[
                  gameState.selectedGear.toString() as keyof typeof GAME_DATA.diceRanges
                ].slice(-1)[0]
              }{" "}
              casas
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const DicePanel = () => {
    if (gameState.gamePhase !== "racing") return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dices className="w-5 h-5" />
            Rolagem de Dado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            size="lg"
            disabled={!gameState.selectedGear || gameState.diceValue !== null}
            onClick={rollDice}
            className="mb-4"
          >
            <Dices className="w-4 h-4 mr-2" />
            Rolar Dado
          </Button>

          {gameState.diceValue && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-2xl font-bold">
                  {gameState.diceValue}
                </div>
                <span className="text-lg">casas</span>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <Label htmlFor="brake-input">Reduzir movimento (freada)</Label>
                <Input
                  id="brake-input"
                  type="number"
                  min="0"
                  max={gameState.diceValue}
                  value={gameState.brakeAmount}
                  onChange={(e) =>
                    setGameState((prev) => ({
                      ...prev,
                      brakeAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="text-center"
                />
                <p className="text-sm text-muted-foreground">
                  Movimento final:{" "}
                  {(gameState.diceValue || 0) - gameState.brakeAmount} casas
                </p>
                <p className="text-sm text-muted-foreground">
                  {calculateBrakeCost()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const PlayerStatus = () => {
    if (gameState.gamePhase !== "racing") return null;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const colorObj = GAME_DATA.carColors.find(
      (c) => c.name === currentPlayer.color
    );

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Status do Carro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-8 h-8 rounded-full border-2 border-foreground"
              style={{ backgroundColor: colorObj?.value }}
            />
            <div>
              <h3 className="font-semibold">{currentPlayer.name}</h3>
              <p className="text-sm text-muted-foreground">
                Marcha: {currentPlayer.gear}ª | Posição:{" "}
                {currentPlayer.position}
                {currentPlayer.eliminated && (
                  <span className="text-red-500 ml-2">ELIMINADO</span>
                )}
              </p>
            </div>
          </div>

          {gameState.mode === "basic" ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Pontos de Desgaste</span>
              <Badge
                variant={
                  (currentPlayer.pd as number) <= 5 ? "destructive" : "default"
                }
              >
                {currentPlayer.pd as number}
              </Badge>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentPlayer.pd as PlayerPD).map(
                  ([component, value]) => (
                    <div
                      key={component}
                      className="p-2 bg-muted rounded text-center"
                    >
                      <div className="text-xs text-muted-foreground capitalize">
                        {component}
                      </div>
                      <div
                        className={`font-bold ${
                          value === 0
                            ? "text-destructive"
                            : value === 1
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {value}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="mt-2 text-center">
                <Button
                  size="sm"
                  onClick={() => markLap(gameState.currentPlayerIndex)}
                >
                  Dar uma volta
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  // Bottom controls bar (fixed)
  const BottomControls = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    return (
      <div className="fixed bottom-4 left-0 right-0 flex items-center justify-center pointer-events-auto z-50">
        <div className="bg-background/90 backdrop-blur-md border rounded-full px-4 py-2 flex items-center gap-4 shadow-lg">
          <div className="text-sm text-muted-foreground">{`Turno ${
            gameState.lap
          } • ${currentPlayer?.name || ""}`}</div>
          <Button
            size="lg"
            onClick={rollDice}
            disabled={!gameState.selectedGear || gameState.diceValue !== null}
            className="mx-2"
          >
            <Dices className="w-4 h-4 mr-2" />
            Rolar
          </Button>
          <Button
            size="lg"
            onClick={finishTurn}
            disabled={gameState.diceValue === null}
            className="mx-2"
          >
            <Flag className="w-4 h-4 mr-2" />
            Finalizar Turno
          </Button>
          <div className="ml-2 text-sm text-center">
            <div className="font-semibold">
              {currentPlayer?.position ?? 0} casas
            </div>
            <div className="text-xs text-muted-foreground">
              {currentPlayer ? `${currentPlayer.gear}ª marcha` : ""}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Confetti component
  const ConfettiAnimation = () => {
    if (!showConfetti) return null;
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: [
                "#ff0000",
                "#00ff00",
                "#0000ff",
                "#ffff00",
                "#ff00ff",
                "#00ffff",
              ][Math.floor(Math.random() * 6)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    );
  };

  // Podium component (separate)
  const PodiumDisplay = () => {
    if (!showWinners) return null;
    const winners = gameState.players
      .filter((player) => !player.eliminated)
      .sort((a, b) => {
        if ((a.finished ? 1 : 0) !== (b.finished ? 1 : 0))
          return (b.finished ? 1 : 0) - (a.finished ? 1 : 0);
        const lapsA = a.lapsCompleted || 0;
        const lapsB = b.lapsCompleted || 0;
        if (lapsA !== lapsB) return lapsB - lapsA;
        return b.position - a.position;
      })
      .slice(0, 3);

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Crown className="w-8 h-8 text-yellow-500" />
              🏁 PÓDIUM FINAL 🏁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end gap-4 mb-6">
              {/* 2nd place */}
              {winners[1] && (
                <div className="text-center">
                  <div className="bg-gray-400 text-white p-4 rounded-lg mb-2 h-24 flex items-center justify-center">
                    <div>
                      <Medal className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-bold">2º</div>
                    </div>
                  </div>
                  <div
                    className="w-16 h-16 rounded-full border-4 border-white mx-auto mb-2"
                    style={{
                      backgroundColor: GAME_DATA.carColors.find(
                        (c) => c.name === winners[1].color
                      )?.value,
                    }}
                  />
                  <p className="font-bold text-sm">{winners[1].name}</p>
                  <p className="text-xs text-muted-foreground">
                    Pos: {winners[1].position}
                  </p>
                </div>
              )}

              {/* 1st place */}
              {winners[0] && (
                <div className="text-center">
                  <div className="bg-yellow-500 text-white p-4 rounded-lg mb-2 h-32 flex items-center justify-center">
                    <div>
                      <Crown className="w-8 h-8 mx-auto mb-1" />
                      <div className="text-lg font-bold">1º</div>
                    </div>
                  </div>
                  <div
                    className="w-20 h-20 rounded-full border-4 border-yellow-500 mx-auto mb-2"
                    style={{
                      backgroundColor: GAME_DATA.carColors.find(
                        (c) => c.name === winners[0].color
                      )?.value,
                    }}
                  />
                  <p className="font-bold text-lg">{winners[0].name}</p>
                  <p className="text-sm text-muted-foreground">
                    Pos: {winners[0].position}
                  </p>
                  <Badge className="mt-1 bg-yellow-500">🏆 CAMPEÃO</Badge>
                </div>
              )}

              {/* 3rd place */}
              {winners[2] && (
                <div className="text-center">
                  <div className="bg-amber-600 text-white p-4 rounded-lg mb-2 h-20 flex items-center justify-center">
                    <div>
                      <Medal className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-bold">3º</div>
                    </div>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full border-4 border-white mx-auto mb-2"
                    style={{
                      backgroundColor: GAME_DATA.carColors.find(
                        (c) => c.name === winners[2].color
                      )?.value,
                    }}
                  />
                  <p className="font-bold text-sm">{winners[2].name}</p>
                  <p className="text-xs text-muted-foreground">
                    Pos: {winners[2].position}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">
                🎉 Parabéns a todos os pilotos! 🎉
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setShowWinners(false)} variant="outline">
                  Fechar
                </Button>
                <Button
                  onClick={returnToStart}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Nova Corrida
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Minimal AI: choose a valid gear randomly, roll, then finish turn
  // const runAiTurn = () => {
  //   const current = gameState.players[gameState.currentPlayerIndex];
  //   if (!current || !current.isAI) return;

  //   // pick a random selectable gear (1-6 that obeys increase/decrease rules)
  //   const currentGear = current.gear;
  //   const selectable = [1, 2, 3, 4, 5, 6].filter(
  //     (g) =>
  //       !(g > currentGear && !current.canIncreaseGear) &&
  //       !(g - currentGear > 1) &&
  //       !(g - currentGear < -4)
  //   );
  //   const choice = selectable[Math.floor(Math.random() * selectable.length)];
  //   setGameState((prev) => ({ ...prev, selectedGear: choice }));

  //   // small delay to emulate thinking
  //   setTimeout(() => {
  //     rollDice();
  //     // after roll, finish turn automatically
  //     setTimeout(() => finishTurn(), 300);
  //   }, 300);
  // };

  if (gameState.gamePhase === "setup") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-[min(1400px,92vw)]">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div></div> {/* Spacer */}
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Car className="w-8 h-8" />
                Formula D
              </h1>
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
            <p className="text-muted-foreground">Controle Digital de Corrida</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Configurar Nova Corrida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Modo de Jogo</Label>
                <Select
                  value={setupData.mode}
                  onValueChange={(value: "basic" | "advanced") =>
                    setSetupData((prev) => ({ ...prev, mode: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico (PD único)</SelectItem>
                    <SelectItem value="advanced">
                      Avançado (Componentes)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Número de Jogadores</Label>
                <Select
                  value={setupData.playerCount.toString()}
                  onValueChange={(value) => updateSetupPlayers(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Jogadores
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Seleção de Pista</Label>
                <Select
                  value={setupData.track || GAME_DATA.tracks[0].id}
                  onValueChange={(value) =>
                    setSetupData((prev) => ({ ...prev, track: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_DATA.tracks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantidade de Voltas</Label>
                <Select
                  value={(setupData.laps || 3).toString()}
                  onValueChange={(value) =>
                    setSetupData((prev) => ({
                      ...prev,
                      laps: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} voltas
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Configuração dos Pilotos</Label>
                {setupData.players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <span className="font-medium min-w-[30px]">
                      P{index + 1}
                    </span>
                    <Input
                      value={player.name}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      placeholder="Nome do piloto"
                      className="flex-1"
                    />
                    <div className="flex flex-col items-start gap-2 w-48">
                      <div className="text-xs text-muted-foreground">Cor</div>
                      <div className="relative w-full">
                        {/* arrows only visible on small screens */}
                        <button
                          className="sm:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/60 p-1 rounded"
                          onClick={() => {
                            const el = document.querySelector(
                              "#color-container-" + index
                            ) as HTMLElement | null;
                            if (el)
                              el.scrollBy({ left: -120, behavior: "smooth" });
                          }}
                          aria-hidden={false}
                        >
                          ◀
                        </button>

                        <div
                          id={`color-container-${index}`}
                          className="flex gap-2 overflow-x-auto scrollbar-none px-6 sm:px-0"
                          style={{ scrollSnapType: "x mandatory" }}
                        >
                          {GAME_DATA.carColors.map((color, ci) => (
                            <div
                              key={color.name}
                              className="flex flex-col items-center flex-shrink-0 w-12"
                            >
                              <div className="text-[11px] mb-1 text-center">
                                {color.label}
                              </div>
                              <button
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                                  player.color === color.name
                                    ? "border-foreground scale-110"
                                    : "border-muted-foreground/30"
                                }`}
                                style={{ backgroundColor: color.value }}
                                onClick={() =>
                                  updatePlayerColor(index, color.name)
                                }
                                title={color.label}
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/60 p-1 rounded"
                          onClick={() => {
                            const el = document.querySelector(
                              "#color-container-" + index
                            ) as HTMLElement | null;
                            if (el)
                              el.scrollBy({ left: 120, behavior: "smooth" });
                          }}
                          aria-hidden={false}
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => {}} className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={startGame} className="flex-1">
                  <Flag className="w-4 h-4 mr-2" />
                  Iniciar Largada
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (gameState.gamePhase === "starting") {
    const currentPlayer = gameState.players[gameState.currentStarterIndex];
    const isComplete =
      gameState.startingOrder.length >= gameState.players.length;
    const sortedResults = [...gameState.startingOrder].sort(
      (a, b) => (b.startingResult?.dice || 0) - (a.startingResult?.dice || 0)
    );

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-[min(1400px,92vw)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Flag className="w-6 h-6" />
              Largada
            </h1>
            <p className="text-muted-foreground">
              Cada piloto rola o dado preto (1-20) para determinar a posição de
              largada
            </p>
          </div>

          {!isComplete && currentPlayer && (
            <Card className="max-w-md mx-auto mb-8">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-foreground"
                    style={{
                      backgroundColor: GAME_DATA.carColors.find(
                        (c) => c.name === currentPlayer.color
                      )?.value,
                    }}
                  />
                  <span className="text-xl font-semibold">
                    {currentPlayer.name}
                  </span>
                </div>
                <Button size="lg" onClick={rollStartingDice}>
                  <Dices className="w-4 h-4 mr-2" />
                  Rolar Dado Preto
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState.startingOrder.length > 0 && (
            <Card className="max-w-2xl mx-auto mb-8">
              <CardHeader>
                <CardTitle>Resultados da Largada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sortedResults.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}º</Badge>
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: GAME_DATA.carColors.find(
                              (c) => c.name === player.color
                            )?.value,
                          }}
                        />
                        <span>{player.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {player.startingResult?.dice}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {player.startingResult?.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                setGameState((prev) => ({ ...prev, gamePhase: "setup" }))
              }
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            {isComplete && (
              <Button size="lg" onClick={finishStartingPhase}>
                <Zap className="w-4 h-4 mr-2" />
                Começar Corrida
              </Button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (gameState.gamePhase === "racing") {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-[min(1400px,92vw)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Car className="w-6 h-6" />
              Corrida Formula D
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>Round: {gameState.turnNumber || 1}</span>
              <span>Volta: {gameState.lap}</span>
              <span>☀️ Tempo seco</span>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Vez do Piloto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-full border-2 border-foreground"
                  style={{
                    backgroundColor: GAME_DATA.carColors.find(
                      (c) => c.name === currentPlayer.color
                    )?.value,
                  }}
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold">
                    {currentPlayer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Marcha atual: {currentPlayer.gear}ª
                  </p>
                  {currentPlayer.eliminated && (
                    <Badge variant="destructive" className="mt-1">
                      ELIMINADO
                    </Badge>
                  )}
                </div>
              </div>

              {currentPlayer.eliminated && (
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Este jogador está eliminado.
                  </p>
                  <Button
                    onClick={() => {
                      const nextIndex = getNextPlayerIndex(
                        gameState.currentPlayerIndex,
                        gameState.players
                      );
                      setGameState((prev) => ({
                        ...prev,
                        currentPlayerIndex: nextIndex,
                      }));
                      addToLog(
                        `${currentPlayer.name} está eliminado - pulando turno`
                      );
                    }}
                  >
                    Pular Turno
                  </Button>
                </div>
              )}

              {/* Manual turn control */}
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap justify-center">
                  <Button
                    onClick={() => {
                      const nextIndex = getNextPlayerBasedOnPosition();
                      setGameState((prev) => ({
                        ...prev,
                        currentPlayerIndex: nextIndex,
                      }));
                      addToLog("Próximo jogador (por posição)");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Próximo (Auto)
                  </Button>
                  {gameState.players.map(
                    (player, index) =>
                      !player.eliminated &&
                      index !== gameState.currentPlayerIndex && (
                        <Button
                          key={player.id}
                          onClick={() => {
                            setGameState((prev) => ({
                              ...prev,
                              currentPlayerIndex: index,
                            }));
                            addToLog(`Turno manual para ${player.name}`);
                          }}
                          variant="outline"
                          size="sm"
                          style={{
                            backgroundColor: GAME_DATA.carColors.find(
                              (c) => c.name === player.color
                            )?.value,
                            color: ["yellow", "white"].includes(player.color)
                              ? "#000"
                              : "#fff",
                          }}
                        >
                          {player.name}
                        </Button>
                      )
                  )}
                </div>
              </div>

              {/* Current standings */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">
                  Classificação Atual:
                </h4>
                <div className="space-y-1">
                  {[...gameState.players]
                    .sort((a, b) => b.position - a.position)
                    .map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{index + 1}º</span>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: GAME_DATA.carColors.find(
                                (c) => c.name === player.color
                              )?.value,
                            }}
                          />
                          <span
                            className={
                              player.id === currentPlayer.id ? "font-bold" : ""
                            }
                          >
                            {player.name}
                          </span>
                          {player.eliminated && (
                            <Badge variant="destructive" className="text-xs">
                              ELIM
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground">
                          {player.position} casas
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {!currentPlayer.eliminated && (
            <GearSelectorComp ctx={{ gameState, selectGear, GAME_DATA }} />
          )}
          {!currentPlayer.eliminated && (
            <DicePanelComp
              ctx={{ gameState, rollDice, calculateBrakeCost, setGameState }}
            />
          )}
          <PlayerStatusComp ctx={{ gameState, markLap, GAME_DATA }} />

          <div className="flex gap-4 mb-6">
            <Button variant="outline" className="flex-1" onClick={undoAction}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Desfazer
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Eventos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Eventos Especiais</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    onClick={() => applyEvent("overheat")}
                  >
                    Superaquecimento
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyEvent("tire-wear")}
                  >
                    Desgaste de Pneus
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyEvent("engine-problem")}
                  >
                    Problema no Motor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyEvent("collision")}
                  >
                    Colisão
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyEvent("weather-change")}
                  >
                    Mudança de Tempo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              className="flex-1"
              disabled={gameState.diceValue === null}
              onClick={finishTurn}
            >
              <Flag className="w-4 h-4 mr-2" />
              Finalizar Turno
            </Button>
          </div>

          {/* Game control buttons */}
          <div className="flex gap-2 mb-4 justify-center">
            <Button
              onClick={returnToStart}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Button>
            <Button
              onClick={finishRace}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Terminar Corrida
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Log da Corrida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {gameState.raceLog
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="text-sm p-2 border-b border-border/50"
                    >
                      <div>{entry.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.timestamp}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
        <BottomControlsComp
          ctx={{ gameState, rollDice, finishTurn, markLap, selectGear }}
        />
      </div>
    );
  }

  if (gameState.gamePhase === "finished") {
    // Order players by: not eliminated, finished status, lapsCompleted desc, position desc
    const standings = [...gameState.players].sort((a, b) => {
      if (a.eliminated && !b.eliminated) return 1;
      if (!a.eliminated && b.eliminated) return -1;
      if ((a.finished ? 1 : 0) !== (b.finished ? 1 : 0))
        return (b.finished ? 1 : 0) - (a.finished ? 1 : 0);
      const lapsA = a.lapsCompleted || 0;
      const lapsB = b.lapsCompleted || 0;
      if (lapsA !== lapsB) return lapsB - lapsA;
      return b.position - a.position;
    });
    const winner = standings.find((p) => !p.eliminated) || standings[0] || null;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-[min(1400px,92vw)]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8" />
              Corrida Finalizada!
            </h1>
          </div>

          {winner && (
            <Card className="max-w-md mx-auto mb-8">
              <CardContent className="pt-6 text-center">
                <div
                  className="w-20 h-20 rounded-full border-4 border-foreground mx-auto mb-4"
                  style={{
                    backgroundColor: GAME_DATA.carColors.find(
                      (c) => c.name === winner.color
                    )?.value,
                  }}
                />
                <h2 className="text-2xl font-bold mb-2">{winner.name}</h2>
                <p className="text-muted-foreground">Parabéns pela vitória!</p>
              </CardContent>
            </Card>
          )}

          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Classificação Final</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {standings.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "outline"}>
                        {index + 1}º
                      </Badge>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: GAME_DATA.carColors.find(
                            (c) => c.name === player.color
                          )?.value,
                        }}
                      />
                      <span>{player.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {player.eliminated
                        ? "ELIMINADO"
                        : `${player.position} casas`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={returnToStart}>
              <Home className="w-4 h-4 mr-2" />
              Nova Corrida
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <ConfettiAnimation />
      <PodiumDisplay />
    </>
  );
};

export default FormulaD;
