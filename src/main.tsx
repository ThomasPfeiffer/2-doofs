import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ConfirmationDialogProvider } from "./ConfirmationDialog";
import { GamePage } from "./game/GamePage";
import "./index.css";
import { Intro } from "./Intro";
import { Results } from "./Results";
import { GameContextProvider } from "./useGame";
import { PlayerContextProvider } from "./usePlayers";

let theme = createTheme();
theme = responsiveFontSizes(theme);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ConfirmationDialogProvider>
          <PlayerContextProvider>
            <GameContextProvider>
              <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/results" element={<Results />} />
                <Route path=":roundNumber" element={<GamePage />} />
              </Routes>
            </GameContextProvider>
          </PlayerContextProvider>
        </ConfirmationDialogProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
