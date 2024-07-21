import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Player } from "./Player";
import { useLocalState } from "./useLocalState";
import { noop } from "./noop";
import { createId } from "./createId";

const Context = createContext<GameContext>({
  game: { rounds: [] },
  addRound: noop,
  removeRound: noop,
  resetGame: noop,
  setGame: noop,
});

export function GameContextProvider(props: PropsWithChildren) {
  const [maybeOldGame, setGame] = useLocalState<OldGame | Game>("scores", {
    rounds: [],
  });
  const { game } = useOldGameMigration(maybeOldGame, setGame);

  const addRound = useCallback(
    (round: Round) => {
      setGame({ rounds: [...game.rounds, round] });
    },
    [game.rounds]
  );
  const removeRound = useCallback(
    (index: number) => {
      setGame({ rounds: game.rounds.filter((_, i) => i !== index) });
    },
    [game.rounds]
  );
  const resetGame = useCallback(() => {
    setGame({ rounds: [] });
  }, []);

  return (
    <Context.Provider
      value={{
        game,
        addRound,
        removeRound,
        resetGame,
        setGame,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export type GameContext = {
  game: Game;
  addRound: (round: Round) => void;
  removeRound: (index: number) => void;
  resetGame: () => void;
  setGame: (game: Game) => void;
};

type Game = {
  rounds: Array<Round>;
};

export interface Round {
  scores: Array<Score>;
}
export type Score = { playerId: string; value: number };

export function useGame() {
  return useContext(Context);
}

function useOldGameMigration(
  game: OldGame | Game,
  updateGame: (game: Game) => void
): { game: Game } {
  const migratedGame = useMemo(() => {
    if (isOldGame(game)) {
      const playerMap = new Map<string, string>();
      const idFor = (name: string) => {
        if (!playerMap.has(name)) {
          playerMap.set(name, createId());
        }
        return playerMap.get(name);
      };
      const migratedGame: Game = {
        rounds: game.map((oldRound) => {
          return {
            scores: Object.entries(oldRound).map(([playerName, value]) => ({
              playerId: idFor(playerName),
              value: value,
            })),
          };
        }),
      };
      return migratedGame;
    }
    return game;
  }, [game]);
  useEffect(() => {
    if (isOldGame(game)) {
      updateGame(migratedGame);
    }
  }, []);

  return { game: migratedGame };
}

type OldGame = Array<OldScore>;
type OldPlayer = string;
type OldScore = Record<OldPlayer, number>;

function isOldGame(game: OldGame | Game): game is OldGame {
  return Array.isArray(game);
}
