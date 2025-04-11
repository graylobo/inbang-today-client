import { DRAWER_WIDTH } from "@/layouts/Base";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { SidebarState } from "@/store/layout";

type AppBarProps = {
  sidebarState: SidebarState;
} & MuiAppBarProps;

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "sidebarState",
})<AppBarProps>(({ theme, sidebarState }) => ({
  zIndex: sidebarState === SidebarState.OPEN ? 1000 : theme.zIndex.drawer + 1,
  width: "100%",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Remove all margin and width adjustments to keep AppBar fixed in place
  // regardless of sidebar state
}));
