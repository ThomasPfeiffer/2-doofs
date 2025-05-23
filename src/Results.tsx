import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { Fragment, useMemo, useState } from "react";
import { Link } from "react-router";
import { ContinueButton } from "./ContinueButton";
import { PageActions, PageLayout } from "./PageLayout";
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
    playerStats.sort((a, b) => b.stars - a.stars);
    return playerStats;
  }, [players, game.rounds]);
  const viewMode = useViewMode();

  return (
    <PageLayout
      actions={
        <PageActions>
          <ContinueButton game={game} />
          <Button component={Link} to="/" variant="contained">
            Hauptmenü
          </Button>
        </PageActions>
      }
    >
      <ViewModeSelect viewMode={viewMode} />
      {viewMode.viewMode === "stars" && (
        <PlayerStars playerStats={playerStats} />
      )}
      {viewMode.viewMode === "rounds" && (
        <Rounds game={game} players={players} />
      )}
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
    <Box sx={{ display: "flex", gap: 2, my: 1 }}>
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
    <Box
      sx={{
        width: 1,
        maxWidth: "100vw",
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        rowGap: 2,
        columnGap: 1,
        my: 2,
      }}
    >
      <Typography fontWeight="bold">Spieler</Typography>
      <Typography fontWeight="bold">Sterne</Typography>
      <Typography fontWeight="bold">Punkte</Typography>
      {props.playerStats.map(({ player, stars, points }) => (
        <Fragment key={player.id}>
          <Box
            sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}
          >
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {player.name}
            </Typography>
          </Box>
          <Box>
            <Rating
              name="read-only"
              value={stars}
              precision={0.5}
              size="small"
              readOnly
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {points}
          </Box>
          <Divider sx={{ gridColumn: "1 / -1" }} />
        </Fragment>
      ))}
    </Box>
  );
}

function Rounds(props: { game: Game; players: Player[] }) {
  const { game, players } = props;
  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Runde</TableCell>
              {players.map((player) => (
                <TableCell
                  key={player.id}
                  align="center"
                  sx={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {player.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {game.rounds.map((round) => (
              <TableRow
                key={round.number}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {round.number}
                </TableCell>
                {players.map((player) => (
                  <TableCell key={player.id} align="center">
                    {round.scores.find((score) =>
                      score.playerIds.includes(player.id)
                    )?.playerIds.length ?? 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
