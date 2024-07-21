import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React from "react";
import { useGame } from "../GameContext";
import { usePlayers } from "../PlayerContext";
import { useNavigate } from "@tanstack/react-router";

export function CompleteResetButton() {
  const [open, setOpen] = React.useState(false);
  const { resetGame } = useGame();
  const { resetPlayers } = usePlayers();
  const navigate = useNavigate();
  const onReset = () => {
    resetGame();
    resetPlayers();
    navigate({ to: "/" });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} variant="outlined">
        Reset
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alles zurücksetzen?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Alle Spieler und Ergebnisse werden gelöscht.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={handleClose}>
            Abbruch
          </Button>
          <Button
            onClick={() => {
              onReset();
              handleClose();
            }}
            color="error"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
