import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useGame } from "../useGame";

export function Header() {
  const navigate = useNavigate();
  const { roundNumber: roundNumberParam } = useParams();
  const roundNumber = roundNumberParam ? parseInt(roundNumberParam, 10) : NaN;
  const { game } = useGame();

  const hasNext = roundNumber < game.rounds.length;
  const forward = useCallback(() => {
    if (hasNext) {
      navigate(`/${roundNumber + 1}`);
    }
  }, [hasNext, navigate, roundNumber]);

  const previous = useCallback(() => {
    navigate(roundNumber > 1 ? `/${roundNumber - 1}` : "/");
  }, [navigate, roundNumber]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        my: 2,
      }}
    >
      <IconButton onClick={previous}>
        <NavigateBeforeIcon />
      </IconButton>
      <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
        Runde {roundNumber}
      </Typography>
      <IconButton onClick={forward} disabled={!hasNext}>
        <NavigateNextIcon />
      </IconButton>
    </Box>
  );
}
