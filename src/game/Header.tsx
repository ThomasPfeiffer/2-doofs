import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useGame } from "../useGame";

export function Header(props: { roundNumber: number }) {
  const { game } = useGame();
  const navigate = useNavigate();
  const { roundNumber } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
      }}
    >
      <IconButton onClick={() => navigate(-1)}>
        <NavigateBeforeIcon />
      </IconButton>
      <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
        Runde {roundNumber}
      </Typography>
      <IconButton
        onClick={() => navigate(String(roundNumber + 1))}
        disabled={game.rounds.length <= roundNumber + 1}
      >
        <NavigateNextIcon />
      </IconButton>
    </Box>
  );
}
