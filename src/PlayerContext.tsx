import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { Player } from "./Player";
import { useLocalState } from "./useLocalState";
import { noop } from "./noop";

export interface PlayerContext {
  players: Array<Player>;
  setPlayers: (players: Array<Player>) => void;
  hasPlayers: boolean;
  addPlayer: (player: Player) => void;
}

const Context = createContext<PlayerContext>({
  players: [],
  setPlayers: noop,
  addPlayer: noop,
  hasPlayers: false,
});

export function PlayerContextProvider(props: PropsWithChildren) {
  const [players, setPlayers] = useLocalState<Player[]>("players", []);
  const addPlayer = useCallback(
    (player: Player) => {
      setPlayers([...players, player]);
    },
    [players]
  );
  const hasPlayers = players.length > 0;

  return (
    <Context.Provider
      value={{
        players,
        setPlayers,
        hasPlayers,
        addPlayer,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function usePlayers() {
  return useContext(Context);
}
