import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { usePlayers } from "../PlayerContext";
import { useGame } from "../GameContext";
import {
  Container,
  Stack,
  TextField,
  IconButton,
  Card,
  CardContent,
  Box,
  CardActions,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Typography,
  Divider,
} from "@mui/material";
import { useLocalState } from "../useLocalState";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { createId } from "../createId";
import { Send, SettingsRounded } from "@mui/icons-material";
import { CompleteResetButton } from "../components/CompleteResetButton";
import { ResetScoresButton } from "../components/ResetScoresButton";

export const Route = createLazyFileRoute("/game")({
  component: Game,
});

function Game() {
  const { players, setPlayers, addPlayer } = usePlayers();
  const {
    addRound,
    game: { rounds },
  } = useGame();

  return (
    <Container>
      <Settings />
      <span></span>
    </Container>
  );
}

function Settings() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <SettingsRounded />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ pb: 0 }}>Menü</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <AddPlayer />
          <DialogActions sx={{ mt: 2, gap: 2 }}>
            <CompleteResetButton />
            <ResetScoresButton />
            <Button variant="contained" onClick={() => setOpen(false)}>
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddPlayer() {
  const { addPlayer } = usePlayers();
  const onSubmit = (e) => {
    const input = document.getElementById("NeuerSpieler") as HTMLInputElement;
    const newPlayerName = input.value;
    if (newPlayerName) {
      addPlayer({ id: createId(), name: newPlayerName });
    }
    input.value = "";
    e.preventDefault?.();
  };

  return (
    <Box>
      <Typography fontWeight="bold" paragraph></Typography>
      <Stack
        component="form"
        direction="row"
        alignItems={"center"}
        onSubmit={onSubmit}
      >
        <TextField
          label="Spieler hinzufügen"
          id="NeuerSpieler"
          variant="standard"
        ></TextField>
        <IconButton onClick={onSubmit}>
          <AddIcon color="primary" />
        </IconButton>
      </Stack>
    </Box>
  );
}

function DeleteScoreButton({ onReset }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ganz sicher?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Runde löschen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nein</Button>
          <Button
            onClick={() => {
              onReset();
              handleClose();
            }}
            autoFocus
          >
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
