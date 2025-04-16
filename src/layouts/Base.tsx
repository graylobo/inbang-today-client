"use client";
import NavBar from "@/components/containers/navbar";
import Sidebar from "@/components/containers/sidebar/SideBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import * as React from "react";

export const DRAWER_WIDTH = 240;
export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below nav bar
  ...theme.mixins.toolbar,
}));

export default function BaseLayout({ children }: any) {
  return (
    <Box sx={{ display: "flex", paddingX: 30 }}>
      <CssBaseline />
      <NavBar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          width: "100%", // Take full width available
          zIndex: 1, // Lower z-index than sidebar and overlay
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
