import React, { useCallback, useReducer, useState } from "react";
import "./App.css";
import {
  Button,
  Card,
  Container,
  FormControlLabel,
  Switch,
  IconButton,
  Stack,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardContent,
  CardActions,
  Fade,
  Slide,
  Grow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import logo from "./logo.png";
import {
  Add,
  Delete,
  RemoveCircle,
  StackedLineChart,
  Stop,
} from "@mui/icons-material";
import FlipMove from "react-flip-move";

type Player = string;

export function App() {
  const [players, setPlayers] = useLocalState<Player[]>("players", []);
  const hasGame = players.length > 0;

  return hasGame ? (
    <Game players={players} setPlayers={setPlayers} />
  ) : (
    <Intro setPlayers={setPlayers} />
  );
}

function Intro(props: { setPlayers: (players: Player[]) => void }) {
  const timeout = 2000;
  let counter = 1;
  const getTimeout = () => timeout * counter++;
  const [newPlayers, setNewPlayers] = useState<Player[]>([""]);

  const deletePlayer = (index: number) =>
    setNewPlayers(newPlayers.filter((_, i) => i !== index));
  const updatePlayer = (updatedPlayer: Player, indexToUpdate: number) =>
    setNewPlayers(
      newPlayers.map((player, index) =>
        index === indexToUpdate ? updatedPlayer : player
      )
    );

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
              {newPlayers.map((player, index) => {
                return (
                  <Box sx={{ my: 2 }}>
                    <PlayerInput
                      player={player}
                      showLabel
                      allowDelete={newPlayers.length !== 1}
                      deletePlayer={deletePlayer}
                      updatePlayer={updatePlayer}
                      index={index}
                    />
                  </Box>
                );
              })}
              <Button
                startIcon={<Add />}
                onClick={() => setNewPlayers([...newPlayers, ""])}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Spieler hinzufügen
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
        label={showLabel ? `Name` : " "}
        value={player}
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

function Game(props: {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}) {
  const { players, setPlayers } = props;
  const [scores, setScores] = useLocalState("scores", []);
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

function useLocalState<T>(key: string, initial: T): [T, (t: T) => void] {
  const [state, setState] = useState(() => {
    const saves = localStorage.getItem(key);
    if (saves) return JSON.parse(saves);
    return initial;
  });
  const setActualState = useCallback((value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
    setState(value);
  }, []);

  return [state, setActualState];
}
