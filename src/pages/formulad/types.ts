import { Dispatch, SetStateAction } from "react";

export interface PlayerPD {
  tires: number;
  brakes: number;
  gearbox: number;
  body: number;
  engine: number;
  suspension: number;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  gear: number;
  pd: number | PlayerPD;
  position: number;
  startingResult: { dice: number; description: string } | null;
  eliminated: boolean;
  lapsCompleted?: number;
  canIncreaseGear?: boolean;
  finished?: boolean;
  isAI?: boolean;
}

export interface GameState {
  mode: "basic" | "advanced";
  players: Player[];
  currentPlayerIndex: number;
  selectedGear: number | null;
  diceValue: number | null;
  brakeAmount: number;
  gamePhase: "setup" | "starting" | "racing" | "finished";
  startingOrder: Player[];
  currentStarterIndex: number;
  raceLog: Array<{ message: string; timestamp: string }>;
  lap: number;
  totalLaps?: number;
  track?: string;
  brakePD?: number;
  brakePDComponents?: Partial<PlayerPD>;
  pendingPrevGear?: number | null;
}

export interface GameCtx {
  gameState: GameState;
  setGameState?: Dispatch<SetStateAction<GameState>>;
  selectGear?: (gear: number) => void;
  rollDice?: () => void;
  calculateBrakeCost?: () => string;
  markLap?: (index: number) => void;
  finishTurn?: () => void;
  GAME_DATA?: {
    diceRanges: Record<string, number[]>;
    brakingPenalty: Record<string, { brakes: number; tires: number }>;
    gearReductionPenalty: Record<string, Record<string, number>>;
    initialPD:
      | number
      | {
          basic?: number;
          advanced?: Record<string, number>;
        };
    carColors: { name: string; value: string; label: string }[];
    tracks: { id: string; label: string }[];
  };
}
