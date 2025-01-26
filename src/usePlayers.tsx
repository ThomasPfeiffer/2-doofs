import React, { createContext, useCallback } from "react";
import { useLocalState } from "./useLocalState";

export type Player = {
  id: string;
  name: string;
};

export type PlayerContext = {
  players: Player[];
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, name: string) => void;
  resetPlayers: () => void;
};

const Context = createContext<PlayerContext | null>(null);

export function PlayerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, setState } = useLocalState<{ players: Player[] }>(
    "playersV1",
    () => ({ players: [createPlayer()] })
  );

  const addPlayer = useCallback(() => {
    setState((currentState) => {
      const newPlayers = [...currentState.players, createPlayer()];
      return { players: newPlayers };
    });
  }, [setState]);

  const removePlayer = useCallback(
    (id: string) => {
      setState((currentState) => {
        const newPlayers = currentState.players.filter(
          (player) => player.id !== id
        );
        return { players: newPlayers };
      });
    },
    [setState]
  );

  const updatePlayer = useCallback(
    (id: string, name: string) => {
      setState((currentState) => {
        const newPlayers = currentState.players.map((player) => {
          if (player.id === id) {
            return { ...player, name };
          }
          return player;
        });
        return { players: newPlayers };
      });
    },
    [setState]
  );

  const resetPlayers = useCallback(() => {
    setState({ players: [] });
  }, [setState]);

  return (
    <Context.Provider
      value={{
        players: state.players,
        addPlayer,
        removePlayer,
        updatePlayer,
        resetPlayers,
      }}
    >
      {children}
    </Context.Provider>
  );
}

function createPlayer() {
  return { id: crypto.randomUUID(), name: "" };
}

export function usePlayers() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("Player Context missing");
  }

  return context;
}
