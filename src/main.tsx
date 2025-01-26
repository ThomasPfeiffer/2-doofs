import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { GamePage } from "./game/GamePage";
import "./index.css";
import { Intro } from "./Intro";
import { GameContextProvider } from "./useGame";

let theme = createTheme();
theme = responsiveFontSizes(theme);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GameContextProvider>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path=":roundNumber" element={<GamePage />} />
          </Routes>
        </GameContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
