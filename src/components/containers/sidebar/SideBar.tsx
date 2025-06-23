import SidebarMenuItem from "@/components/containers/sidebar/SidebarMenuItem";
import { SidebarState, useLayoutStore } from "@/store/layout";
import { List } from "@mui/material";
import { SidebarDrawer, SidebarOverlay } from "./style";
import styles from "./SideBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/client/use-media-query";

const menuItems = [
  {
    icon: "/common/soop-logo.png",
    primaryText: "SOOP",
    subItems: [
      { primaryText: "엑셀 랭킹", href: "/", icon: "/common/excel-logo.png" },
      {
        primaryText: "스타 랭킹",
        href: "/star-tier",
        icon: "/common/starcraft-logo.png",
      },
    ],
  },

  {
    icon: "/common/community.jpg",
    primaryText: "커뮤니티",
    subItems: [
      { primaryText: "익명 게시판", href: "/boards/anonymous" },
      { primaryText: "자유 게시판", href: "/boards/free" },
    ],
  },
  {
    icon: "/common/starcraft-logo.png",
    primaryText: "스타크래프트",
    subItems: [
      { primaryText: "왼손생산", href: "/starcraft/left-control" },
      // { primaryText: "빌드알리미", href: "/starcraft/build-alert" },
    ],
  },
  // {
  //   icon: MoveToInbox,
  //   primaryText: "Inbox",
  //   subItems: [
  //     { primaryText: "Starred", href: "/inbox" },
  //     { primaryText: "All mail", href: "/inbox" },
  //   ],
  // },
];

function Sidebar() {
  const {
    sidebarState,
    setSidebarState,
    showOverlay,
    isSidebarManuallyOpened,
    setSidebarManuallyOpened,
  } = useLayoutStore();
  const setShowOverlay = useLayoutStore((s) => s.toggleOverlay);
  const largeDesktop = useMediaQuery("largeDesktop");
  const isOpen = sidebarState === SidebarState.OPEN;

  useEffect(() => {
    if (largeDesktop) {
      // largeDesktop 이상: 오버레이 비활성
      if (showOverlay) setShowOverlay();
    } else {
      // largeDesktop 미만: 오버레이 활성
      if (!showOverlay) setShowOverlay();
    }
  }, [largeDesktop, showOverlay, setShowOverlay]);

  const handleOverlayClick = (): void => {
    if (largeDesktop) return; // largeDesktop에서는 무시
    setSidebarState(SidebarState.CLOSED);
    setSidebarManuallyOpened(false);
  };

  // 마우스 오버/리브 핸들러 (아이콘 모드에서만, 수동 오픈이 아닐 때만 동작)
  const handleMouseEnter = () => {
    if (
      largeDesktop &&
      sidebarState === SidebarState.CLOSED &&
      !isSidebarManuallyOpened
    ) {
      setSidebarState(SidebarState.OPEN);
    }
  };
  const handleMouseLeave = () => {
    if (
      largeDesktop &&
      sidebarState === SidebarState.OPEN &&
      !isSidebarManuallyOpened
    ) {
      setSidebarState(SidebarState.CLOSED);
    }
  };

  return (
    <>
      {!largeDesktop && (
        <SidebarOverlay
          open={sidebarState === SidebarState.OPEN}
          showOverlay={showOverlay}
          onClick={handleOverlayClick}
        />
      )}
      <SidebarDrawer
        variant="permanent"
        sidebarState={sidebarState}
        isLargeDesktop={largeDesktop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <List>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index} item={item} openSidebar={isOpen} />
          ))}
        </List>
      </SidebarDrawer>
    </>
  );
}

export default Sidebar;
