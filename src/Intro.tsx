import { Add, PlayArrow, RemoveCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import FlipMove from "react-flip-move";
import { useNavigate } from "react-router";
import { useConfirmation } from "./ConfirmationDialog";
import logo from "./logo.png";
import { PageActions, PageLayout } from "./PageLayout";
import { ResetButton } from "./ResetButton";
import { useGame } from "./useGame";
import { Player, usePlayers } from "./usePlayers";
import { ContinueButton } from "./ContinueButton";

export function Intro() {
  const { players, addPlayer } = usePlayers();
  const { game, resetGame, addRound } = useGame();
  const hasGame = game.rounds.length > 0;
  const { confirm } = useConfirmation();
  const navigate = useNavigate();

  return (
    <PageLayout
      noHeader
      actions={
        <PageActions orientation="vertical">
          {hasGame && <ContinueButton game={game} />}
          <Button
            endIcon={<PlayArrow />}
            disabled={players.some((it) => !it.name) || players.length <= 1}
            onClick={() => {
              if (hasGame) {
                confirm({
                  title: "Sicher?",
                  text: "Du hast noch ein laufendes Spiel, möchtest du wirklich ein neues starten?",
                  onConfirm: () => {
                    resetGame();
                    navigate(`/1`);
                  },
                });
              } else {
                addRound();
                navigate(`/1`);
              }
            }}
            variant="contained"
            fullWidth
          >
            Neues Spiel
          </Button>
        </PageActions>
      }
    >
      <Stack alignItems="center">
        <Box sx={{ position: "absolute", top: 0, right: 0, p: 2 }}>
          <ResetButton />
        </Box>
        <ErrorBoundary fallback={<Typography>Fehler</Typography>}>
          <Fade in={true} timeout={2000}>
            <Box
              component="img"
              sx={{
                width: "50%",
                height: "auto",
                display: "block",
                maxWidth: 800,
                p: 2,
              }}
              src={logo}
              alt="error"
            />
          </Fade>
          <Fade in={true} timeout={4000}>
            <Stack sx={{ width: 1, maxWidth: "90%" }}>
              <FlipMove>
                {players.map((player, index) => {
                  return (
                    <Box sx={{ my: 4 }} key={player.id}>
                      <PlayerInput
                        player={player}
                        showLabel={true}
                        allowDelete={players.length !== 1}
                        index={index}
                      />
                    </Box>
                  );
                })}
                <Button startIcon={<Add />} onClick={addPlayer} variant="text">
                  Spieler hinzufügen
                </Button>
              </FlipMove>
            </Stack>
          </Fade>
        </ErrorBoundary>
      </Stack>
    </PageLayout>
  );
}

function PlayerInput(props: {
  player: Player;
  index: number;
  showLabel: boolean;
  allowDelete: boolean;
}) {
  const { player, allowDelete } = props;
  const { updatePlayer, removePlayer } = usePlayers();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        variant="standard"
        placeholder="Spielernamen eingeben..."
        InputLabelProps={{ shrink: true }}
        value={player.name}
        sx={{
          "label[data-shrink=false] + & ::-webkit-input-placeholder": {
            opacity: "0.5 !important",
          },
        }}
        onChange={(e) => updatePlayer(player.id, e.target.value)}
        fullWidth
      />
      <Box sx={{ alignSelf: "end", width: "24px" }}>
        {allowDelete && (
          <IconButton
            onClick={() => removePlayer(player.id)}
            sx={{ p: 0 }}
            size="large"
          >
            <RemoveCircle sx={{ color: (t) => t.palette.error.light }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
