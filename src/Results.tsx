import { Button, List, ListItem } from "@mui/material";
import React from "react";
import { Link } from "react-router";
import { PageLayout } from "./PageLayout";
import { useGame } from "./useGame";
import { usePlayers } from "./usePlayers";

export function Results() {
  const { players } = usePlayers();
  const { game } = useGame();

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

  return (
    <PageLayout>
      <List>
        {playerPoints.map((playerPoint) => {
          return (
            <ListItem key={playerPoint.player.id}>
              {playerPoint.player.name}: {playerPoint.points}
            </ListItem>
          );
        })}
      </List>
      <Button component={Link} to="/" variant="contained">
        Start
      </Button>
    </PageLayout>
  );
}
