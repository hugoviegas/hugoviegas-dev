import React from "react";
import { Button } from "@/components/ui/button";
import { Dices, ChevronsRight, Flag, Plus, Minus } from "lucide-react";
import type { GameCtx } from "./types";

const BottomControls: React.FC<{ ctx: GameCtx }> = ({ ctx }) => {
  const { gameState, rollDice, finishTurn, markLap, selectGear } = ctx;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentGear = currentPlayer?.gear ?? 1;

  const maxGear = 6;
  const minGear = 1;

  const canIncrease =
    !!currentPlayer && !!currentPlayer.canIncreaseGear && currentGear < maxGear;
  const canDecrease = !!currentPlayer && currentGear > minGear;

  const isGearSelectable = (gear: number) => {
    if (!currentPlayer) return false;
    const gearDiff = gear - currentPlayer.gear;
    // follow same rules as GearSelector: cannot increase more than 1, cannot reduce more than 4
    if (gearDiff > 1 || gearDiff < -4) return false;
    // increasing requires canIncreaseGear
    if (gear > currentPlayer.gear && !currentPlayer.canIncreaseGear)
      return false;
    return gear >= minGear && gear <= maxGear;
  };

  const getSelectableGears = () => {
    const list: number[] = [];
    for (let g = minGear; g <= maxGear; g++) {
      if (isGearSelectable(g)) list.push(g);
    }
    return list;
  };

  // Smarter cycling: start from selectedGear if present, otherwise currentGear.
  const handleIncrease = () => {
    if (!selectGear || !currentPlayer) return;
    const selectable = getSelectableGears();
    if (selectable.length === 0) return;
    const start = gameState.selectedGear ?? currentGear;
    // find index in selectable that's > start (wrap)
    const idx = selectable.findIndex((g) => g > start);
    const next = idx === -1 ? selectable[0] : selectable[idx];
    selectGear(next);
  };

  const handleDecrease = () => {
    if (!selectGear || !currentPlayer) return;
    const selectable = getSelectableGears();
    if (selectable.length === 0) return;
    const start = gameState.selectedGear ?? currentGear;
    // find the last gear < start, otherwise wrap to last
    const prevList = selectable.filter((g) => g < start);
    const prev =
      prevList.length > 0
        ? prevList[prevList.length - 1]
        : selectable[selectable.length - 1];
    selectGear(prev);
  };

  const getPlayerPDTotal = (p: typeof currentPlayer) => {
    if (!p) return 0;
    if (typeof p.pd === "number") return p.pd;
    const pdObj = p.pd as {
      tires?: number;
      brakes?: number;
      gearbox?: number;
      body?: number;
      engine?: number;
      suspension?: number;
    };
    const keys: (keyof typeof pdObj)[] = [
      "tires",
      "brakes",
      "gearbox",
      "body",
      "engine",
      "suspension",
    ];
    return keys.reduce((s, k) => s + (pdObj[k] || 0), 0);
  };

  return (
    <>
      {/* Centered big action buttons above the bottom control */}
      <div className="fixed left-0 right-0 bottom-28 flex justify-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Button
            variant="ghost"
            onClick={rollDice}
            disabled={!gameState.selectedGear || gameState.diceValue !== null}
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg bg-background/90"
            title="Rolar"
          >
            <Dices className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => markLap && markLap(gameState.currentPlayerIndex)}
            disabled={!!currentPlayer?.eliminated}
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg bg-background/90"
            title={
              currentPlayer?.eliminated ? "Jogador eliminado" : "Dar uma volta"
            }
          >
            <Flag className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            onClick={finishTurn}
            disabled={gameState.diceValue === null}
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg bg-background/90"
            title="Finalizar Turno"
          >
            <ChevronsRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 pointer-events-auto z-40">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="bg-background/80 backdrop-blur-md border border-border/40 rounded-full px-3 py-2 flex items-center justify-between shadow-lg flex-wrap md:flex-nowrap">
            {/* Left: player info (compact) */}
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="flex flex-col text-left text-xs">
                <div className="font-semibold">{currentPlayer?.name}</div>
                <div className="text-muted-foreground">
                  Volta: {gameState.lap} • {currentPlayer?.lapsCompleted ?? 0}/
                  {gameState.totalLaps ?? 3}
                </div>
              </div>
              <div className="flex flex-col items-end text-xs">
                <div className="font-semibold">
                  {currentPlayer?.position ?? 0}
                </div>
                <div className="text-muted-foreground">casas</div>
              </div>
              <div className="flex flex-col items-end text-xs ml-2">
                <div className="font-semibold">PD</div>
                <div className="text-muted-foreground">
                  {getPlayerPDTotal(currentPlayer)}
                </div>
              </div>
            </div>

            {/* Center: Gear +/- */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleDecrease}
                disabled={!canDecrease}
                className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
                title="Diminuir marcha"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <div className="text-center">
                <div className="text-sm text-muted-foreground">Marcha</div>
                <div className="text-lg font-bold">{currentGear}ª</div>
              </div>

              <Button
                variant="outline"
                onClick={handleIncrease}
                disabled={!canIncrease || getSelectableGears().length === 0}
                className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
                title={
                  !currentPlayer
                    ? "Sem jogador"
                    : !canIncrease
                    ? "Não pode aumentar marcha agora"
                    : getSelectableGears().length === 0
                    ? "Nenhuma marcha válida disponível"
                    : "Aumentar marcha"
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Right: Rolar, Dar uma volta, Finalizar Turno (ordered) */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground text-right mr-2">
                <div className="font-semibold">{gameState.diceValue ?? 0}</div>
                <div className="text-[10px]">casas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomControls;
