import { AppBar } from "@/components/containers/navbar/style";
import { useAuthStore } from "@/store/authStore";
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
  const { user, logout } = useAuthStore();
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
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {user.username}님 환영합니다
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              로그인
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
