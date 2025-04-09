import SidebarMenuItem from "@/components/containers/sidebar/SidebarMenuItem";
import { DrawerHeader } from "@/layouts/Base";
import { useLayoutStore } from "@/store/layout";
import { Drafts, MoveToInbox, Send } from "@mui/icons-material";
import { List } from "@mui/material";
import { SidebarDrawer } from "./style";

const menuItems = [
  {
    icon: Send,
    primaryText: "SOOP",
    subItems: [
      { primaryText: "엑셀 랭킹", href: "/" },
      { primaryText: "스타 랭킹", href: "/star-tier" },
    ],
  },

  {
    icon: Drafts,
    primaryText: "커뮤니티",
    subItems: [{ primaryText: "게시판", href: "/boards" }],
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
  const { sidebarState } = useLayoutStore();
  const isOpen = sidebarState !== "CLOSED"; // OPEN 또는 ICON_ONLY일 때 아이템을 표시

  return (
    <SidebarDrawer variant="permanent" sidebarState={sidebarState}>
      <DrawerHeader />
      <List>
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={index}
            item={item}
            openSidebar={sidebarState === "OPEN"}
          />
        ))}
      </List>
    </SidebarDrawer>
  );
}

export default Sidebar;
