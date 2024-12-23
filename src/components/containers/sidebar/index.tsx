import SidebarMenuItem from "@/components/containers/sidebar/SidebarMenuItem";
import { DrawerHeader } from "@/layouts/Base";
import { Drafts, MoveToInbox, Send } from "@mui/icons-material";
import { List } from "@mui/material";
import { SidebarDrawer } from "./style";
const menuItems = [
  {
    icon: Send,
    primaryText: "SOOP",
    subItems: [{ primaryText: "엑셀 랭킹", href: "/" }],
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

type SidebarProps = {
  openSidebar: boolean;
};

function Sidebar({ openSidebar }: SidebarProps) {
  return (
    <SidebarDrawer variant="permanent" open={openSidebar}>
      <DrawerHeader />
      <List>
        {menuItems.map((item, index) => (
          <SidebarMenuItem key={index} item={item} openSidebar={openSidebar} />
        ))}
      </List>
    </SidebarDrawer>
  );
}

export default Sidebar;
