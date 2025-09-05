import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import type { GameCtx } from "./types";

const GearSelector: React.FC<{ ctx: GameCtx }> = ({ ctx }) => {
  const { gameState, selectGear, GAME_DATA } = ctx;
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

        {/* Visual hint if a gear reduction penalty was deferred */}
        {gameState.pendingPrevGear != null && (
          <div className="mt-3 text-center text-sm text-yellow-500">
            Redução selecionada: {gameState.pendingPrevGear} →{" "}
            {gameState.selectedGear ?? "?"} (penalidade será aplicada ao
            finalizar turno)
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GearSelector;
