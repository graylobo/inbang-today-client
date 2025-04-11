"use client";

import { AppBar } from "@/components/containers/navbar/style";
import { useAuthStore } from "@/store/authStore";
import { SidebarState, useLayoutStore } from "@/store/layout";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Toolbar } from "@mui/material";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

function NavBar() {
  const { user, logout } = useAuthStore();
  const { sidebarState, toggleSidebar } = useLayoutStore();

  // Lower z-index when sidebar is open
  const zIndex = sidebarState === SidebarState.OPEN ? 1000 : 1300;

  return (
    <AppBar
      position="fixed"
      sidebarState={sidebarState}
      className="bg-white dark:bg-dark-bg"
      elevation={0}
      sx={{
        zIndex,
      }}
    >
      <Toolbar className="flex justify-between items-center">
        <div className="flex items-center">
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleSidebar}
            edge="start"
            className="mr-5 text-gray-900 dark:text-gray-100"
          >
            <MenuIcon />
          </IconButton>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300 text-nowrap">
                {user.name}님 환영합니다
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-sm"
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
