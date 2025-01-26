import { Container } from "@mui/material";
import React, { PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return (
    <Container sx={{ pt: { xs: 2, md: 10 }, pb: 4, px: 3 }} maxWidth="sm">
      {props.children}
    </Container>
  );
}
