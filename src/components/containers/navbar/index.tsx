"use client";

import { AppBar } from "@/components/containers/navbar/style";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/authStore";
import { SidebarState, useLayoutStore } from "@/store/layout";
import MenuIcon from "@mui/icons-material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, Toolbar } from "@mui/material";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/client/use-media-query";

function NavBar() {
  const { user, logout } = useAuthStore();
  const {
    sidebarState,
    toggleSidebar,
    setSidebarState,
    toggleOverlay,
    setSidebarManuallyOpened,
  } = useLayoutStore();
  const largeDesktop = useMediaQuery("largeDesktop");

  const handleToggleSidebar = () => {
    if (sidebarState === SidebarState.HIDDEN) {
      setSidebarState(SidebarState.OPEN);
      setSidebarManuallyOpened(false);
    } else {
      setSidebarState(SidebarState.HIDDEN);
      setSidebarManuallyOpened(false);
    }
  };

  const handleHamburgerClick = () => {
    if (sidebarState !== SidebarState.OPEN) {
      setSidebarManuallyOpened(true);
    } else {
      setSidebarManuallyOpened(false);
    }
    toggleSidebar();
  };

  return (
    <AppBar
      position="fixed"
      sidebarState={sidebarState}
      className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 "
      elevation={0}
      sx={{
        zIndex: 1500,
      }}
    >
      <Toolbar className="flex justify-between items-center h-[64px]">
        <div className="flex items-center">
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleHamburgerClick}
            edge="start"
            className="mr-5 text-gray-900 dark:text-gray-100"
          >
            <MenuIcon />
          </IconButton>
        </div>

        <div>
          <Link href="/" className="">
            <Image
              src="/common/inbang-today.icon.png"
              alt="INBANG TODAY"
              width={50}
              height={50}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {largeDesktop && (
            <IconButton
              color="inherit"
              aria-label="toggle sidebar visibility"
              onClick={handleToggleSidebar}
              edge="start"
              className="mr-5 text-gray-900 dark:text-gray-100"
            >
              {sidebarState === SidebarState.HIDDEN ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )}
            </IconButton>
          )}
          <ThemeToggle />
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full outline-none ring-offset-2 transition-all hover:ring-2 ring-blue-400">
                  <Avatar>
                    {user.profileImage && (
                      <AvatarImage src={user.profileImage} alt={user.name} />
                    )}
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="flex flex-col space-y-2">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-sm font-medium">{user.email}</p>
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                      사용자
                    </p> */}
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                      포인트: 2,836P
                    </p> */}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                  <div className="space-y-1">
                    <Link
                      href="/user/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <User className="w-4 h-4 mr-2" />내 프로필
                    </Link>
                    {/* <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      설정
                    </Link> */}
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
