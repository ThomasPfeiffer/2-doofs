import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router";
import { PageLayout } from "../PageLayout";
import { Game, Player, Round, Score, useGame } from "../useGame";
import { Header } from "./Header";

export function GamePage() {
  const { game, createScore, addToScore, getRound, removeFromScore } =
    useGame();
  const { roundNumber: roundNumberParam } = useParams();
  const roundNumber = roundNumberParam ? parseInt(roundNumberParam, 10) : NaN;
  const [draggingPlayer, setDraggingPlayer] = useState<Player | null>(null);

  if (isNaN(roundNumber)) {
    return <Navigate to="/" />;
  }
  const round = getRound(roundNumber);

  return (
    <DndContext
      onDragStart={(d) => {
        if (d.active.data.current && "player" in d.active.data.current) {
          setDraggingPlayer(d.active.data.current.player);
        }
      }}
      onDragEnd={(event) => {
        const dropTarget = event.over?.data.current;
        if (
          dropTarget &&
          "player" in dropTarget &&
          dropTarget.player.id !== draggingPlayer?.id
        ) {
          createScore(roundNumber, [dropTarget.player, draggingPlayer]);
        }
        if (dropTarget && "scoreId" in dropTarget) {
          addToScore(roundNumber, dropTarget.scoreId, draggingPlayer!);
        }
        if (event.over?.id === "background") {
          removeFromScore(roundNumber, draggingPlayer!);
        }
        setDraggingPlayer(null);
      }}
    >
      <PageLayout>
        <Header roundNumber={roundNumber} />
        <RoundDisplay round={round} game={game} />
        <DragOverlay>
          {draggingPlayer && <PlayerDisplay player={draggingPlayer} />}
        </DragOverlay>
      </PageLayout>
    </DndContext>
  );
}

function RoundDisplay(props: { round: Round; game: Game }) {
  const { round, game } = props;
  const players = game.players;
  const playersWithoutScores = players.filter((player) => {
    return !round.scores.some((score) => score.playerIds.includes(player.id));
  });

  const { setNodeRef, isOver, active } = useDroppable({
    id: "background",
  });

  return (
    <Stack gap={1}>
      <Box
        ref={setNodeRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: -1,
        }}
      />
      {round.scores.map((score) => {
        const displayPlayers: Player[] = score.playerIds.map((playerId) => {
          return (
            players.find((player) => player.id === playerId) ?? {
              id: playerId,
              name: "???",
            }
          );
        });
        return (
          <DroppableScoreDisplay
            players={displayPlayers}
            score={score}
            key={score.id}
          />
        );
      })}

      {playersWithoutScores.map((player) => (
        <DroppablePlayerDisplay player={player} key={player.id} />
      ))}
      {isOver &&
        active?.data.current &&
        "player" in active.data.current &&
        !playersWithoutScores.some(
          (p) => p.id == active.data.current!.player.id
        ) && <PlayerDisplay player={active?.data.current.player} dropPreview />}
    </Stack>
  );
}

function DroppablePlayerDisplay(props: { player: Player }) {
  const { player } = props;
  const { isOver, setNodeRef, active } = useDroppable({
    id: player.id,
    data: { player },
  });
  const draggingPlayer = active?.data?.current?.player as Player | undefined;
  const showDropPreview =
    isOver && draggingPlayer && draggingPlayer?.id !== player.id;

  return (
    <Box ref={setNodeRef}>
      {showDropPreview ? (
        <ScoreDisplay
          players={[props.player]}
          previewPlayer={draggingPlayer!}
        />
      ) : (
        <DraggablePlayerDisplay player={props.player} />
      )}
    </Box>
  );
}

function DraggablePlayerDisplay(props: { player: Player }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.player.id,
    data: { player: props.player },
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ cursor: "grab" }}
    >
      <PlayerDisplay player={props.player} />
    </Box>
  );
}

function PlayerDisplay(props: {
  player: Player | null;
  dropPreview?: boolean;
}) {
  return (
    <Card
      sx={{
        p: 1,
        opacity: props.dropPreview ? 0.6 : 1,
      }}
      elevation={0}
      variant="outlined"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DragIndicatorIcon sx={{ color: "grey" }} />
        <Typography sx={{ textAlign: "center" }}>
          {props.player?.name ?? "???"}
        </Typography>
      </Box>
    </Card>
  );
}

function DroppableScoreDisplay(props: { players: Player[]; score: Score }) {
  const { players, score } = props;
  const { isOver, setNodeRef, active } = useDroppable({
    id: score.id,
    data: { scoreId: score.id },
  });
  const overPlayer =
    active?.data.current && "player" in active.data.current
      ? (active?.data.current.player as Player)
      : null;
  const previewPlayer =
    isOver && overPlayer && !score.playerIds.includes(overPlayer.id)
      ? overPlayer
      : null;

  return (
    <Box ref={setNodeRef}>
      <ScoreDisplay players={players} previewPlayer={previewPlayer} />
    </Box>
  );
}
function ScoreDisplay(props: {
  players: Player[];
  previewPlayer?: Player | null;
}) {
  const { players, previewPlayer } = props;

  return (
    <Card sx={{ backgroundColor: (t) => alpha(t.palette.primary.light, 0.2) }}>
      <CardContent>
        <Stack gap={1}>
          {players.map((player) => (
            <DraggablePlayerDisplay player={player} key={player.id} />
          ))}
          {previewPlayer && (
            <PlayerDisplay player={previewPlayer} dropPreview />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
