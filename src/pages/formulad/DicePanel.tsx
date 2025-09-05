import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { GameCtx } from "./types";

const DicePanel: React.FC<{ ctx: GameCtx }> = ({ ctx }) => {
  const { gameState, rollDice, calculateBrakeCost, setGameState, GAME_DATA } =
    ctx;
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
              <Label htmlFor="brake-pd-input">Remover PD (freada)</Label>
              <Input
                id="brake-pd-input"
                type="number"
                min={0}
                max={gameState.diceValue || 20}
                value={gameState.brakePD ?? 0}
                onChange={(e) =>
                  setGameState &&
                  setGameState((prev) => ({
                    ...prev,
                    brakePD: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-center"
              />
              <p className="text-sm text-muted-foreground">
                Movimento final:{" "}
                {(gameState.diceValue || 0) -
                  ((gameState.brakePD ?? gameState.brakeAmount) || 0)}{" "}
                casas
              </p>
              {gameState.mode === "advanced" &&
                typeof GAME_DATA?.initialPD !== "number" &&
                GAME_DATA?.initialPD?.advanced && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Remover por componente (avançado)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(
                        GAME_DATA.initialPD.advanced as Record<string, number>
                      ).map((comp: string) => (
                        <Input
                          key={comp}
                          type="number"
                          min="0"
                          max="10"
                          value={
                            (gameState.brakePDComponents?.[
                              comp as keyof typeof gameState.brakePDComponents
                            ] as number) || 0
                          }
                          onChange={(e) =>
                            setGameState &&
                            setGameState((prev) => ({
                              ...prev,
                              brakePDComponents: {
                                ...(prev.brakePDComponents || {}),
                                [comp]: parseInt(e.target.value) || 0,
                              },
                            }))
                          }
                          className="text-center"
                        />
                      ))}
                    </div>
                  </div>
                )}
              <p className="text-sm text-muted-foreground">
                {calculateBrakeCost && calculateBrakeCost()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DicePanel;
