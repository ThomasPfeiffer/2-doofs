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
} from "@mui/material";
import { useLocalState } from "../useLocalState";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export const Route = createLazyFileRoute("/game")({
  component: Game,
});

function Game() {
  const { players, setPlayers } = usePlayers();
  const { addRound, rounds: scores, setRounds: setScores } = useGame();
  const onSubmit = (e) => {
    const input = document.getElementById("NeuerSpieler") as HTMLInputElement;
    const v = input.value;
    if (v && !players.includes(v)) setPlayers([...players, v]);
    input.value = "";
    e.preventDefault?.();
  };
  const [excite, setExcite] = useLocalState("excite", false);

  return (
    <Container>
      <Stack
        component="form"
        direction="row"
        alignItems={"center"}
        onSubmit={onSubmit}
        sx={{ m: 3 }}
      >
        <TextField label="Neuer Spieler" id="NeuerSpieler"></TextField>
        <IconButton onClick={onSubmit}>
          <AddIcon />
        </IconButton>
      </Stack>
      <Card>
        <CardContent
          sx={{
            p: 3,
            gap: 2,
            display: "grid",
            gridTemplateColumns: `repeat(${players.length + 1}, 1fr)`,
            overflow: "auto",
          }}
        >
          {players.map((p) => (
            <Box key={p}>
              {p}{" "}
              {excite
                ? ""
                : `(${scores.reduce(
                    (acc, score) => acc + (score[p] ?? 0),
                    0
                  )})`}
            </Box>
          ))}
          <span></span>
          {scores.map((score, index) => {
            return (
              <React.Fragment key={index}>
                {players.map((player) => {
                  return (
                    <React.Fragment key={player}>
                      <Box>
                        <TextField
                          value={score[player] ?? "0"}
                          type="number"
                          variant="filled"
                          sx={{ width: 60 }}
                          onChange={(event) => {
                            const newValue = parseInt(event.target.value);
                            if (!isNaN(newValue)) {
                              score[player] = newValue;
                              setScores([...scores]);
                            } else {
                              score[player] = undefined;
                              setScores([...scores]);
                            }
                          }}
                        />
                      </Box>
                    </React.Fragment>
                  );
                })}
                <Box>
                  <DeleteScoreButton
                    onReset={() => {
                      setScores(scores.filter((_, index2) => index !== index2));
                    }}
                  />
                </Box>
              </React.Fragment>
            );
          })}
        </CardContent>
        <CardActions>
          <GigaWizardDialog
            addScore={(s) => setScores([...scores, s])}
            players={players}
          />
          <CompleteResetButton
            onReset={() => {
              setPlayers([]);
              setScores([]);
            }}
            onResetScores={() => {
              setScores([]);
            }}
          />
        </CardActions>
      </Card>
      <FormControlLabel
        control={
          <Switch
            checked={excite}
            onChange={(e) => setExcite(e.target.checked)}
          />
        }
        label="Spannung maximieren"
      />
    </Container>
  );
}

function GigaWizardDialog({ players, addScore }) {
  const [open, setOpen] = React.useState(false);
  const [score, setScore] = useState({});

  const handleOpen = () => {
    setScore({});
    setOpen(true);
  };
  return (
    <>
      <Button onClick={handleOpen}>Nächste Runde</Button>
      {
        <Dialog open={open}>
          <DialogContent>
            <GigaWizard setScores={setScore} scores={score} players={players} />
          </DialogContent>
          <DialogActions>
            <Button color="info" onClick={() => setOpen(false)}>
              Abbruch
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setOpen(false);
                addScore(score);
              }}
            >
              Fertig
            </Button>
          </DialogActions>
        </Dialog>
      }
    </>
  );
}

function GigaWizard({ players, scores, setScores }) {
  return (
    <Stack>
      <TextField
        type="number"
        id="ZauberWert"
        placeholder="score"
        onFocus={() => {
          (document.getElementById("ZauberWert") as HTMLInputElement).value =
            "";
        }}
      />
      {players.map((player) => {
        return (
          <Button
            onClick={() => {
              const value = (
                document.getElementById("ZauberWert") as HTMLInputElement
              ).valueAsNumber;
              setScores({ ...scores, [player]: value || 0 });
            }}
          >
            {player} {player in scores ? `(${scores[player]})` : ""}
          </Button>
        );
      })}
    </Stack>
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

function CompleteResetButton({ onReset, onResetScores }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>Reset</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Ganz sicher?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Was möchtest du zurücksetzen?
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
            Alles
          </Button>
          <Button
            color="primary"
            onClick={() => {
              onResetScores();
              handleClose();
            }}
          >
            Nur Ergebnisse
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
