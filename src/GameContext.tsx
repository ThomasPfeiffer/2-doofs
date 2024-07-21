import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { Player } from "./Player";
import { useLocalState } from "./useLocalState";
import { noop } from "./noop";

const Context = createContext<Game>({
  hasGame: false,
  rounds: [],
  addRound: noop,
  removeRound: noop,
  setRounds: noop,
});

export function GameContextProvider(props: PropsWithChildren) {
  const [rounds, setRounds] = useLocalState<Array<Round>>("scores", []);
  const addRound = useCallback(
    (round: Round) => {
      setRounds([...rounds, round]);
    },
    [rounds]
  );
  const removeRound = useCallback(
    (index: number) => {
      setRounds(rounds.filter((_, i) => i !== index));
    },
    [rounds]
  );

  return (
    <Context.Provider
      value={{
        rounds,
        setRounds,
        addRound,
        removeRound,
        hasGame: rounds.length > 0,
      }}
    ></Context.Provider>
  );
}

export type Game = {
  rounds: Array<Round>;
  setRounds: (rounds: Array<Round>) => void;
  addRound: (round: Round) => void;
  removeRound: (index: number) => void;
  hasGame: boolean;
};

export interface Round {
  scores: Score;
}

export type Score = Record<Player, number>;

export function useGame() {
  return useContext(Context);
}
