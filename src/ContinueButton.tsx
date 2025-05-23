import { PlayArrow } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { Game } from "./useGame";

export function ContinueButton(props: { game: Game }): React.ReactNode {
  const navigate = useNavigate();
  const { game } = props;

  return (
    <Button
      variant="outlined"
      onClick={() => {
        navigate(`/${game.rounds.length}`);
      }}
      endIcon={<PlayArrow />}
    >
      Fortsetzen
    </Button>
  );
}
