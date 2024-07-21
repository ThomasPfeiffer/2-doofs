import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { useGame } from "../GameContext";

export function ResetScoresButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { resetGame } = useGame();

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
        <DialogTitle id="alert-dialog-title">Neues Spiel?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hierdurch werden alle Ergebnisse gelöscht.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={handleClose}>
            Nein
          </Button>
          <Button
            color="primary"
            onClick={() => {
              resetGame();
              handleClose();
            }}
          >
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
