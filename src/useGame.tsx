import React, { createContext, useCallback, useEffect, useState } from "react";
import { Player } from "./usePlayers";

export type Round = {
  number: number;
  scores: Score[];
};

export type Score = {
  id: string;
  playerIds: string[];
};

export type Game = {
  id: string;
  rounds: Round[];
};

export type GameContext = {
  game: Game;
  resetGame: () => void;
  addRound: () => void;

  addToScore: (roundNumber: number, scoreId: string, player: Player) => void;
  removeFromScore: (roundNumber: number, player: Player) => void;
  createScore: (roundNumber: number, players: Player[]) => void;
};

const Context = createContext<GameContext | null>(null);

export function GameContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: game, setState: setGame } = useLocalState<Game>(
    "gameV1",
    defaultGame
  );

  const resetGame = useCallback(() => {
    setGame((currentGame: Game) => {
      return { ...currentGame, rounds: [{ number: 1, scores: [] }] };
    });
  }, [setGame]);

  const addRound = useCallback(() => {
    setGame((currentGame: Game) => {
      const roundNumber = game.rounds.length + 1;
      const newRound = { number: roundNumber, scores: [] };
      return { ...currentGame, rounds: [...currentGame.rounds, newRound] };
    });
  }, [game.rounds.length, setGame]);

  const addToScore = useCallback(
    (roundNumber: number, scoreId: string, player: Player) => {
      setGame((currentGame: Game) => {
        const newRounds = currentGame.rounds.map((round) => {
          if (round.number === roundNumber) {
            const newScores = round.scores
              .map((score) => {
                if (score.id === scoreId) {
                  const playerIds = score.playerIds.includes(player.id)
                    ? [...score.playerIds]
                    : [...score.playerIds, player.id];
                  return {
                    ...score,
                    playerIds,
                  };
                }
                return {
                  ...score,
                  playerIds: score.playerIds.filter((id) => id !== player.id),
                };
              })
              .filter((score) => score.playerIds.length > 1);
            return { ...round, scores: newScores };
          }
          return round;
        });
        return { ...currentGame, rounds: newRounds };
      });
    },
    [setGame]
  );

  const createScore = useCallback(
    (roundNumber: number, players: Player[]) => {
      setGame((currentGame: Game) => {
        const newScore: Score = {
          id: crypto.randomUUID(),
          playerIds: players.map((player) => player.id),
        };
        const newRounds = currentGame.rounds.map((round) => {
          if (round.number === roundNumber) {
            const newScores = round.scores.map((score) => {
              return {
                ...score,
                playerIds: score.playerIds.filter(
                  (id) => !players.some((player) => player.id === id)
                ),
              };
            });
            return { ...round, scores: [...newScores, newScore] };
          }
          return round;
        });
        return { ...currentGame, rounds: newRounds };
      });
    },
    [setGame]
  );

  const removeFromScore = useCallback(
    (roundNumber: number, player: Player) => {
      setGame((currentGame: Game) => {
        const newRounds = currentGame.rounds.map((round) => {
          if (round.number === roundNumber) {
            const newScores = round.scores
              .map((score) => {
                return {
                  ...score,
                  playerIds: score.playerIds.filter((id) => id !== player.id),
                };
              })
              .filter((score) => score.playerIds.length > 1);
            return { ...round, scores: newScores };
          }
          return round;
        });
        return { ...currentGame, rounds: newRounds };
      });
    },
    [setGame]
  );

  return (
    <Context.Provider
      value={{
        game,
        resetGame,
        addRound,
        addToScore,
        createScore,
        removeFromScore: removeFromScore,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useGame() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("Game Context missing");
  }

  return context;
}

function useLocalState<T>(key: string, initial: () => T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
    return initial();
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return { state, setState };
}

function defaultGame(): Game {
  return {
    id: crypto.randomUUID(),
    rounds: [],
  };
}
