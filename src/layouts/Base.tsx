"use client";
import NavBar from "@/components/containers/navbar";
import Sidebar from "@/components/containers/sidebar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useLayoutStore } from "@/store/layout";

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
  const { openSidebar, setOpenSidebar } = useLayoutStore();

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  return (
    <Box sx={{ display: "flex", padding: 0 }}>
      <CssBaseline />
      <NavBar
        openSidebar={openSidebar}
        handleDrawerOpen={handleSidebarOpen}
        handleDrawerClose={handleSidebarClose}
      />
      <Sidebar openSidebar={openSidebar} />

      <Box component="main" sx={{ flexGrow: 1, px: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
