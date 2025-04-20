import SidebarMenuItem from "@/components/containers/sidebar/SidebarMenuItem";
import { SidebarState, useLayoutStore } from "@/store/layout";
import { List } from "@mui/material";
import { SidebarDrawer, SidebarOverlay } from "./style";
import styles from "./SideBar.module.scss";
import Link from "next/link";
import Image from "next/image";

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
      { primaryText: "빌드알리미", href: "/starcraft/build-alert" },
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
  const { sidebarState, setSidebarState } = useLayoutStore();
  const isOpen = sidebarState === SidebarState.OPEN;

  const handleOverlayClick = (): void => {
    setSidebarState(SidebarState.CLOSED);
  };

  return (
    <>
      <SidebarOverlay
        open={sidebarState === SidebarState.OPEN}
        onClick={handleOverlayClick}
      />
      <SidebarDrawer variant="permanent" sidebarState={sidebarState}>
        <Link href="/" className={styles.homeLogo}>
          <Image
            src="/common/inbang-today.logo.png"
            alt="INBANG TODAY"
            width={120}
            height={40}
            priority
          />
        </Link>

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
