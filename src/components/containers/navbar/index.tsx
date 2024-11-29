import { AppBar } from "@/components/containers/navbar/style";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

type NavBarProps = {
  openSidebar: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
};

function NavBar({
  openSidebar,
  handleDrawerOpen,
  handleDrawerClose,
}: NavBarProps) {
  const handleDrawerToggle = () => {
    if (openSidebar) {
      handleDrawerClose();
    } else {
      handleDrawerOpen();
    }
  };
  return (
    <AppBar
      position="fixed"
      open={openSidebar}
      sx={{
        width: "100%",
        zIndex: (theme: any) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            marginRight: 5,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Link href={"/"}>
          <Typography variant="h6" noWrap component="div">
            INBANG TODAY
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
