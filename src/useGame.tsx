import React, { createContext, useCallback, useEffect, useState } from "react";

export type Player = {
  id: string;
  name: string;
};

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
  players: Player[];
  rounds: Round[];
};

export type GameContext = {
  game: Game;

  addPlayer: () => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, name: string) => void;

  getRound: (roundNumber: number) => Round;

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

  const addPlayer = useCallback(() => {
    setGame((currentGame: Game) => {
      const newPlayers = [
        ...currentGame.players,
        { id: crypto.randomUUID(), name: "" },
      ];
      const newGame: Game = { ...currentGame, players: newPlayers };
      return newGame;
    });
  }, [setGame]);

  const removePlayer = useCallback(
    (id: string) => {
      setGame((currentGame: Game) => {
        const newPlayers = currentGame.players.filter(
          (player) => player.id !== id
        );
        const newGame: Game = { ...currentGame, players: newPlayers };
        return newGame;
      });
    },
    [setGame]
  );

  const updatePlayer = useCallback(
    (id: string, name: string) => {
      setGame((currentGame: Game) => {
        const newPlayers = currentGame.players.map((player) => {
          if (player.id === id) {
            return { ...player, name };
          }
          return player;
        });
        const newGame: Game = { ...currentGame, players: newPlayers };
        return newGame;
      });
    },
    [setGame]
  );

  const getRound = useCallback(
    (roundNumber: number) => {
      const round = game.rounds[roundNumber];
      if (!round) {
        const newRound = { number: roundNumber, scores: [] };
        setGame((currentGame: Game) => {
          return { ...currentGame, rounds: [...currentGame.rounds, newRound] };
        });
        return newRound;
      }
      return round;
    },
    [game.rounds]
  );

  const addToScore = useCallback(
    (roundNumber: number, scoreId: string, player: Player) => {
      setGame((currentGame: Game) => {
        const newRounds = currentGame.rounds.map((round) => {
          if (round.number === roundNumber) {
            const newScores = round.scores.map((score) => {
              const hasPlayer = score.playerIds.includes(player.id);
              if (score.id === scoreId) {
                if (!hasPlayer)
                  return {
                    ...score,
                    playerIds: [...score.playerIds, player.id],
                  };
              } else {
                if (hasPlayer)
                  return {
                    ...score,
                    playerIds: score.playerIds.filter((id) => id !== player.id),
                  };
              }

              return score;
            });
            return { ...round, scores: newScores };
          }
          return round;
        });
        return { ...currentGame, rounds: newRounds };
      });
    },
    []
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
            return { ...round, scores: [...round.scores, newScore] };
          }
          return round;
        });
        return { ...currentGame, rounds: newRounds };
      });
    },
    [setGame]
  );

  const removeFromScore = useCallback((roundNumber: number, player: Player) => {
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
  }, []);

  return (
    <Context.Provider
      value={{
        game,
        addPlayer,
        removePlayer,
        updatePlayer,
        getRound,
        addToScore,
        createScore,
        removeFromScore,
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
    players: [],
    rounds: [],
  };
}
