import { ReplayOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useConfirmation } from "./ConfirmationDialog";

export function ResetButton() {
  const { confirm } = useConfirmation();
  return (
    <IconButton
      onClick={() => {
        confirm({
          text: "Soll alles gelöscht werden?",
          title: "Zurücksetzen",
          onConfirm: () => {
            window.localStorage.clear();
            window.location.reload();
          },
        });
      }}
      size="large"
      sx={{ p: 0 }}
    >
      <ReplayOutlined color="info" />
    </IconButton>
  );
}
