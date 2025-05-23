import { Box, Container } from "@mui/material";
import React, { PropsWithChildren } from "react";
import logo from "./logo.png";
import { Link } from "react-router";

export interface PageLayoutProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  noHeader?: boolean;
}

export function PageLayout(props: PageLayoutProps) {
  return (
    <Container
      sx={{
        height: "100vh",
        maxHeight: "700px",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        "@media (min-height: 800px)": {
          mt: "80px",
        },
      }}
      maxWidth="sm"
    >
      <Box
        component="header"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {!props.noHeader && (
          <Link to="/">
            <Box
              component="img"
              sx={{
                width: "auto",
                height: "60px",
                display: "block",
                py: 1,
              }}
              src={logo}
              alt="error"
            />
          </Link>
        )}
      </Box>
      <Box component="main" sx={{ overflowY: "auto" }}>
        {props.children}
      </Box>
      <Box
        component="footer"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.actions}
      </Box>
    </Container>
  );
}

export function PageActions(
  props: PropsWithChildren<{ orientation?: "horizontal" | "vertical" }>
) {
  return (
    <Box
      sx={
        props.orientation === "vertical"
          ? {
              display: "flex",
              flexDirection: "column",
              gap: 1,
              py: 1,
              width: 1,
            }
          : {
              display: "flex",
              justifyContent: "space-evenly",
              gap: 1,
              py: 2,
              width: 1,
            }
      }
    >
      {props.children}
    </Box>
  );
}
