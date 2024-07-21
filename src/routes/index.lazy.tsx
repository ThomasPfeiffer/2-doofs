import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Box,
  Fade,
} from "@mui/material";
import logo from "../logo.png";
import { Add, PlayArrow, RemoveCircle } from "@mui/icons-material";
import FlipMove from "react-flip-move";
import { usePlayers } from "../PlayerContext";
import { Player } from "../Player";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { setPlayers, players } = usePlayers();
  const navigate = useNavigate();

  const deletePlayer = (index: number) =>
    setPlayers(players.filter((_, i) => i !== index));
  const updatePlayer = (updatedPlayer: Player, indexToUpdate: number) =>
    setPlayers(
      players.map((player, index) =>
        index === indexToUpdate ? updatedPlayer : player
      )
    );

  const submit = () => {
    setPlayers(players.filter((it) => it));
    navigate({ to: "/game" });
  };
  return (
    <Container sx={{ px: 3 }}>
      <Stack alignItems="center">
        <Fade in={true} timeout={2000}>
          <Box
            component="img"
            sx={{ width: "80vw", height: "auto", display: "block" }}
            src={logo}
            alt="error"
          />
        </Fade>
        <Fade in={true} timeout={4000}>
          <Stack sx={{ width: 1 }}>
            <FlipMove>
              {players.map((player, index) => {
                return (
                  <Box sx={{ my: 4 }}>
                    <PlayerInput
                      player={player}
                      showLabel={true}
                      allowDelete={players.length !== 1}
                      deletePlayer={deletePlayer}
                      updatePlayer={updatePlayer}
                      index={index}
                    />
                  </Box>
                );
              })}
              <Button
                startIcon={<Add />}
                onClick={() => setPlayers([...players, ""])}
                variant="outlined"
                fullWidth
              >
                Spieler hinzufügen
              </Button>
              <Button
                endIcon={<PlayArrow />}
                disabled={players.filter((it) => it).length <= 1}
                onClick={submit}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Los Gehts!
              </Button>
            </FlipMove>
          </Stack>
        </Fade>
      </Stack>
    </Container>
  );
}

function PlayerInput(props: {
  player: Player;
  index: number;
  updatePlayer: (player: Player, index: number) => void;
  deletePlayer: (index: number) => void;
  showLabel: boolean;
  allowDelete: boolean;
}) {
  const { deletePlayer, player, updatePlayer, showLabel, allowDelete, index } =
    props;

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
        value={player}
        sx={{
          "label[data-shrink=false] + & ::-webkit-input-placeholder": {
            opacity: "0.5 !important",
          },
        }}
        onChange={(e) => updatePlayer(e.target.value, index)}
        fullWidth
      />
      <Box sx={{ alignSelf: "end", width: "24px" }}>
        {allowDelete && (
          <IconButton
            onClick={() => deletePlayer(index)}
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
