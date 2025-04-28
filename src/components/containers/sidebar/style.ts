import { DRAWER_WIDTH } from "@/layouts/Base";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import { SidebarState } from "@/store/layout";

const ICON_ONLY_WIDTH = 64;
const LARGE_DESKTOP_BREAKPOINT = 1200;

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

// CLOSED: largeDesktop 이상이면 64px, 미만이면 0
const closedMixin = (theme: Theme, isLargeDesktop: boolean): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: isLargeDesktop ? `${ICON_ONLY_WIDTH}px` : 0,
  backgroundColor: "var(--drawer-bg)",
  borderRight: isLargeDesktop ? "1px solid var(--drawer-border)" : "none",
  "& .MuiListItemIcon-root": {
    color: "var(--drawer-icon)",
  },
  [theme.breakpoints.up("lg")]: {
    width: isLargeDesktop ? `${ICON_ONLY_WIDTH}px` : 0,
  },
});

const hiddenMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  backgroundColor: "var(--drawer-bg)",
  borderRight: "none",
  [theme.breakpoints.up("sm")]: {
    width: 0,
  },
});

type SidebarDrawerProps = {
  sidebarState: SidebarState;
  isLargeDesktop: boolean;
};

export const SidebarDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) =>
    prop !== "sidebarState" && prop !== "isLargeDesktop",
})<SidebarDrawerProps>(({ theme, sidebarState, isLargeDesktop }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "fixed",
  top: 64,
  zIndex: sidebarState === SidebarState.OPEN ? 1400 : 1200,
  "& .MuiDrawer-paper": {
    position: "fixed",
    top: 64,
    zIndex: sidebarState === SidebarState.OPEN ? 1400 : 1200,
  },
  ...(sidebarState === SidebarState.OPEN && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      position: "fixed",
      top: 64,
      zIndex: 1400,
    },
  }),
  ...(sidebarState === SidebarState.CLOSED && {
    ...closedMixin(theme, isLargeDesktop),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme, isLargeDesktop),
      position: "fixed",
      top: 64,
    },
  }),
  ...(sidebarState === SidebarState.HIDDEN && {
    ...hiddenMixin(theme),
    "& .MuiDrawer-paper": {
      ...hiddenMixin(theme),
      position: "fixed",
      top: 64,
    },
  }),
}));

export const SidebarOverlay = styled("div", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "showOverlay",
})<{ open: boolean; showOverlay: boolean }>(({ open, showOverlay }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: showOverlay ? "rgba(0, 0, 0, 0.5)" : "transparent",
  zIndex: 1200,
  visibility: open ? "visible" : "hidden",
  opacity: open ? 1 : 0,
  transition:
    "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1), visibility 225ms cubic-bezier(0.4, 0, 0.2, 1)",
  backdropFilter: showOverlay ? "grayscale(100%)" : "none",
}));
