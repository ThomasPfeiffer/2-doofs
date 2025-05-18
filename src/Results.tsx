import { Box, Button, Chip, List, ListItem, Rating } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { ContinueButton } from "./ContinueButton";
import { PageLayout } from "./PageLayout";
import { Game, useGame } from "./useGame";
import { Player, usePlayers } from "./usePlayers";

export function Results() {
  const { players } = usePlayers();
  const { game } = useGame();

  const playerStats: PlayerStats[] = useMemo(() => {
    const playerPoints = players.map((player) => {
      let points = 0;
      for (const round of game.rounds) {
        const score = round.scores.find((score) =>
          score.playerIds.includes(player.id)
        );
        points += score ? score.playerIds.length : 0;
      }
      return { player, points: points };
    });
    const max = playerPoints.reduce((max, playerPoint) => {
      return Math.max(max, playerPoint.points);
    }, 0);
    const playerStats = playerPoints.map((playerPoint) => {
      const stars = (playerPoint.points / max) * 4 + 1;
      return {
        ...playerPoint,
        stars: stars,
      };
    });
    return playerStats;
  }, [players, game.rounds]);
  const viewMode = useViewMode();

  return (
    <PageLayout>
      <ViewModeSelect viewMode={viewMode} />
      {viewMode.viewMode === "stars" && (
        <PlayerStars playerStats={playerStats} />
      )}
      {viewMode.viewMode === "rounds" && (
        <Rounds game={game} players={players} />
      )}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
        <ContinueButton game={game} />
        <Button component={Link} to="/" variant="contained">
          Hauptmenü
        </Button>
      </Box>
    </PageLayout>
  );
}

interface PlayerStats {
  player: Player;
  points: number;
  stars: number;
}

function useViewMode() {
  const [viewMode, setViewMode] = useState<"stars" | "rounds">("stars");
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "stars" ? "rounds" : "stars"));
  };
  return { viewMode, toggleViewMode, setViewMode };
}

type UseViewModeReturn = ReturnType<typeof useViewMode>;

function ViewModeSelect(props: { viewMode: UseViewModeReturn }) {
  const { viewMode, setViewMode } = props.viewMode;
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Chip
        onClick={() => setViewMode("stars")}
        label="Platzierung"
        color="primary"
        variant={viewMode == "stars" ? "filled" : "outlined"}
      ></Chip>
      <Chip
        onClick={() => setViewMode("rounds")}
        label="Runden"
        color="primary"
        variant={viewMode == "rounds" ? "filled" : "outlined"}
      ></Chip>
    </Box>
  );
}

function PlayerStars(props: { playerStats: PlayerStats[] }) {
  return (
    <List sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      {props.playerStats.map(({ player, stars }) => {
        return (
          <ListItem
            key={player.id}
            sx={{ display: "flex", gap: 2, flexDirection: "column" }}
          >
            <Box>{player.name}</Box>
            <Box>
              <Rating name="read-only" value={stars} precision={0.5} readOnly />
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}

function Rounds(props: { game: Game; players: Player[] }) {
  const { game, players } = props;
  return (
    <List sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      {game.rounds.map((round) => {
        return (
          <ListItem
            key={round.number}
            sx={{ display: "flex", gap: 2, flexDirection: "column" }}
          >
            <Box>Runde {round.number}</Box>
            <Box>
              {round.scores.map((score) => {
                const player = players.find((p) =>
                  score.playerIds.includes(p.id)
                );
                return (
                  <Box key={score.id}>
                    {player?.name}: {score.playerIds.length} Punkte
                  </Box>
                );
              })}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}
