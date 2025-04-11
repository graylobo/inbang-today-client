import { DRAWER_WIDTH } from "@/layouts/Base";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import { SidebarState } from "@/store/layout";

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "var(--drawer-bg)",
  borderRight: "1px solid var(--drawer-border)",
  "& .MuiListItemIcon-root": {
    color: "var(--drawer-icon)",
  },
  "& .MuiListItemText-primary": {
    color: "var(--drawer-text)",
  },
  "& .MuiListItemButton-root:hover": {
    backgroundColor: "var(--drawer-hover-bg)",
  },
  zIndex: 1400,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  backgroundColor: "var(--drawer-bg)",
  borderRight: "none",
  "& .MuiListItemIcon-root": {
    color: "var(--drawer-icon)",
  },
  [theme.breakpoints.up("sm")]: {
    width: 0,
  },
});

type SidebarDrawerProps = {
  sidebarState: SidebarState;
};

export const SidebarDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "sidebarState",
})<SidebarDrawerProps>(({ theme, sidebarState }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "fixed",
  zIndex: sidebarState === SidebarState.OPEN ? 1400 : 1200,
  "& .MuiDrawer-paper": {
    position: "fixed",
    zIndex: sidebarState === SidebarState.OPEN ? 1400 : 1200,
  },
  ...(sidebarState === SidebarState.OPEN && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      position: "fixed",
      zIndex: 1400,
    },
  }),
  ...(sidebarState === SidebarState.CLOSED && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      position: "fixed",
    },
  }),
}));

export const SidebarOverlay = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1200,
  visibility: open ? "visible" : "hidden",
  opacity: open ? 1 : 0,
  transition:
    "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1), visibility 225ms cubic-bezier(0.4, 0, 0.2, 1)",
  backdropFilter: "grayscale(100%)",
}));
