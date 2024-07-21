import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React from "react";
import { PlayerContextProvider } from "../PlayerContext";
import { GameContextProvider } from "../GameContext";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <PlayerContextProvider>
      <GameContextProvider>
        <Outlet />
      </GameContextProvider>
      <TanStackRouterDevtools />
    </PlayerContextProvider>
  );
}
