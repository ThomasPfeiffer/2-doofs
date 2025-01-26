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
import FlipMove from "react-flip-move";
import { useNavigate } from "react-router";
import { useConfirmation } from "./ConfirmationDialog";
import logo from "./logo.png";
import { PageLayout } from "./PageLayout";
import { useGame } from "./useGame";
import { Player, usePlayers } from "./usePlayers";

export function Intro() {
  const { players, addPlayer } = usePlayers();
  const { game, resetGame, addRound } = useGame();
  const hasGame = game.rounds.length > 0;
  const { confirm } = useConfirmation();
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Stack alignItems="center">
        <Fade in={true} timeout={2000}>
          <Box
            component="img"
            sx={{
              width: "80vw",
              height: "auto",
              display: "block",
              maxWidth: 800,
            }}
            src={logo}
            alt="error"
          />
        </Fade>
        <Fade in={true} timeout={4000}>
          <Stack sx={{ width: 1 }}>
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
              <Stack gap={2}>
                <Button
                  startIcon={<Add />}
                  onClick={addPlayer}
                  variant="outlined"
                  fullWidth
                >
                  Spieler hinzufügen
                </Button>
                {hasGame && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      navigate(`/${game.rounds.length}`);
                    }}
                    endIcon={<PlayArrow />}
                  >
                    Fortsetzen
                  </Button>
                )}
                <Button
                  endIcon={<PlayArrow />}
                  disabled={
                    players.some((it) => !it.name) || players.length <= 1
                  }
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
              </Stack>
            </FlipMove>
          </Stack>
        </Fade>
      </Stack>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(game, undefined, 2)}
      </Typography>
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
        rowGap: 1,
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
