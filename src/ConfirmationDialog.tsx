import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { PropsWithChildren, useCallback, useState } from "react";

export function ConfirmationDialogProvider(props: PropsWithChildren) {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const open = Boolean(confirmation);

  const confirm = useCallback((confirmation: Confirmation) => {
    setConfirmation(confirmation);
  }, []);

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>{confirmation?.title}</DialogTitle>
        <DialogContent>{confirmation?.text}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              confirmation?.onConfirm();
              setConfirmation(null);
            }}
            variant="contained"
          >
            Ok
          </Button>
          <Button onClick={() => setConfirmation(null)} variant="outlined">
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
      <Context.Provider value={{ confirm }}>{props.children}</Context.Provider>
    </>
  );
}

export function useConfirmation() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("Confirmation Context missing");
  }

  return context;
}

const Context = React.createContext<ConfirmationContext | null>(null);

interface ConfirmationContext {
  confirm: (confirmation: Confirmation) => void;
}

export interface Confirmation {
  onConfirm: () => void;
  title: string;
  text: string;
}
