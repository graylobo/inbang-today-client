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
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(sidebarState === SidebarState.OPEN && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(sidebarState === SidebarState.ICON_ONLY && {
    marginLeft: theme.spacing(7),
    width: `calc(100% - ${theme.spacing(7)}px)`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(8),
      width: `calc(100% - ${theme.spacing(8)}px)`,
    },
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
