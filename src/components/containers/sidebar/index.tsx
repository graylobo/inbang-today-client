import SidebarMenuItem from "@/components/containers/sidebar/SidebarMenuItem";
import { DrawerHeader } from "@/layouts/Base";
import { Drafts, MoveToInbox, Send } from "@mui/icons-material";
import { List } from "@mui/material";
import { SidebarDrawer } from "./style";
const menuItems = [
  {
    icon: Send,
    primaryText: "Sent mail",
    subItems: [
      { primaryText: "Sent Item 1", href: "/sent-mail" },
      { primaryText: "Sent Item 2", href: "/sent-mail" },
    ],
  },
  {
    icon: Drafts,
    primaryText: "Drafts",
    subItems: [
      { primaryText: "Draft 1", href: "/drafts" },
      { primaryText: "Draft 2", href: "/drafts" },
    ],
  },
  {
    icon: MoveToInbox,
    primaryText: "Inbox",
    subItems: [
      { primaryText: "Starred", href: "/inbox" },
      { primaryText: "All mail", href: "/inbox" },
    ],
  },
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
