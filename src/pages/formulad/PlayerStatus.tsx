import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GameCtx } from "./types";

const PlayerStatus: React.FC<{ ctx: GameCtx }> = ({ ctx }) => {
  const { gameState, markLap, GAME_DATA } = ctx;
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
              Marcha: {currentPlayer.gear}ª | Posição: {currentPlayer.position}
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
              {typeof currentPlayer.pd === "number" ? (
                <div className="p-2 bg-muted rounded text-center">
                  <div className="text-xs text-muted-foreground">PD</div>
                  <div
                    className={`font-bold ${
                      currentPlayer.pd === 0
                        ? "text-destructive"
                        : currentPlayer.pd === 1
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {currentPlayer.pd}
                  </div>
                </div>
              ) : (
                // currentPlayer.pd is narrowed at runtime; cast via unknown to satisfy TypeScript safely
                Object.entries(
                  currentPlayer.pd as unknown as Record<string, number>
                ).map(([component, value]) => (
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
                ))
              )}
            </div>
            {/* lap button moved to bottom controls for consistent placement */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerStatus;
