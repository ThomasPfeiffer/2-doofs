import { Box } from "@mui/material";
import React, { PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return <Box sx={{ pt: 2, pb: 4, px: 3 }}>{props.children}</Box>;
}
