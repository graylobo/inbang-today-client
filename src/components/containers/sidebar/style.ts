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
});

const iconOnlyMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: "var(--drawer-bg)",
  borderRight: "1px solid var(--drawer-border)",
  "& .MuiListItemIcon-root": {
    color: "var(--drawer-icon)",
  },
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
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
  ...(sidebarState === SidebarState.OPEN && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(sidebarState === SidebarState.ICON_ONLY && {
    ...iconOnlyMixin(theme),
    "& .MuiDrawer-paper": iconOnlyMixin(theme),
  }),
  ...(sidebarState === SidebarState.CLOSED && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
