import React, { useCallback, useState } from 'react';
import './App.css';
import { Button, Card, Container, IconButton, Stack, TextField, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CardContent, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
function App() {
  const [players, setPlayers] = useLocalState("players", [])
  const [scores, setScores] = useLocalState("scores", [])
  const onSubmit = (e) => {
    const input = document.getElementById("NeuerSpieler");
    const v = input.value
    if (v) setPlayers([...players, v])
    input.value = ""
    e.preventDefault?.()
  }

  return (
    <Container>
      <Stack component="form" direction="row" alignItems={"center"} onSubmit={onSubmit} sx={{ m: 3 }}>
        <TextField label="Neuer Spieler" id="NeuerSpieler"></TextField>
        <IconButton onClick={onSubmit}><AddIcon /></IconButton>
      </Stack>
      <Card >
        <CardContent sx={{
          p: 3, gap: 2,
          display: "grid",
          gridTemplateColumns: `repeat(${players.length + 1}, 1fr)`
        }}>
          {players.map(p => <Box key={p}>{p} ({scores.reduce((acc, score) => acc + (score[p] ?? 0), 0)})</Box>)}
          <span></span>
          {scores.map((score, index) => {
            return <React.Fragment key={index}>
              {players.map((player) => {
                return <React.Fragment key={player}>
                <Box >
                  <TextField value={score[player] ?? "0"} type="number" variant="filled" sx={{ width: 60 }}
                    onChange={event => {
                      const newValue = parseInt(event.target.valueAsNumber)
                      if (!isNaN(newValue)) {
                        score[player] = newValue
                        setScores([...scores])
                      } else {
                        score[player] = undefined
                        setScores([...scores])
                      }
                    }} />
                </Box>
                </React.Fragment>
              })}
              <Box>
              <DeleteScoreButton onReset={() => {
                setScores(scores.filter((_, index2) => index !== index2))
              }}/>
              </Box>
            </React.Fragment>
          })}
        </CardContent>
        <CardActions>
            <GigaWizardDialog addScore={s =>
              setScores([...scores, s])} players={players} />
          <CompleteResetButton onReset={() => {
            setPlayers([])
            setScores([])
          }} />
          </CardActions>
      </Card>
    </Container>
  );
}

function GigaWizardDialog({ players, addScore }) {
  const [open, setOpen] = React.useState(false);
  const [score, setScore] = useState({})

  const handleOpen = () => {
    setScore({})
    setOpen(true);
  }
  return <>
    <Button onClick={handleOpen}>Nächste Runde</Button>
    {<Dialog open={open}>
      <DialogContent>
        <GigaWizard setScores={setScore} scores={score} players={players} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpen(false); addScore(score) }}>Fertig</Button>
        <Button onClick={() => setOpen(false)}>Abbruch</Button>
      </DialogActions>
    </Dialog>}
  </>
}

function GigaWizard({ players, scores, setScores }) {

  return <Stack>
    <TextField type="number" id="ZauberWert" onFocus={() => {
      document.getElementById("ZauberWert").value = ""
    }} />
    {players.map(player => {
      return <Button onClick={
        () => {
          const value = document.getElementById("ZauberWert").valueAsNumber
          setScores({ ...scores, [player]: value || 0 })
        }
      }>{player} {player in scores ? `(${scores[player]})` : ""}</Button>
    })}
  </Stack>
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
    <IconButton onClick={handleClickOpen}><DeleteIcon /></IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ganz sicher?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Runde löschen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nein</Button>
          <Button onClick={() => {
            onReset()
            handleClose()
          }} autoFocus>
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function CompleteResetButton({ onReset }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        Reset
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ganz sicher?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hierdurch werden alle Spieler und Werte gelöscht.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nein</Button>
          <Button onClick={() => {
            onReset()
            handleClose()
          }} autoFocus>
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    const saves = localStorage.getItem(key)
    if (saves) return JSON.parse(saves)
    return initial
  })
  const setActualState = useCallback((value) => {
    localStorage.setItem(key, JSON.stringify(value))
    setState(value)
  })

  return [state, setActualState]
}
export default App;
