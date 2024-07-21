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
  updatePlayerName: (id: string, newName: string) => void;
  resetPlayers: () => void;
}

const Context = createContext<PlayerContext>({
  players: [],
  setPlayers: noop,
  addPlayer: noop,
  updatePlayerName: noop,
  resetPlayers: noop,
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
  const updatePlayerName = useCallback((id: string, newName: string) => {
    setPlayers(
      players.map((player) => {
        if (player.id !== id) {
          return player;
        }
        return { id: player.id, name: newName };
      })
    );
  }, []);

  const resetPlayers = useCallback(() => {
    setPlayers([]);
  }, []);

  return (
    <Context.Provider
      value={{
        players,
        setPlayers,
        hasPlayers,
        addPlayer,
        updatePlayerName,
        resetPlayers,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function usePlayers() {
  return useContext(Context);
}
