"use client";

import { ExpandLess, ExpandMore, Description } from "@mui/icons-material";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

type MenuItemType = {
  icon?: React.ElementType;
  primaryText: string;
  subItems?: MenuItemType[];
  href?: string;
};

type SidebarMenuItemProps = {
  item: MenuItemType;
  level?: number;
  openSidebar: boolean;
};

function SidebarMenuItem({
  item,
  openSidebar,
  level = 0,
}: SidebarMenuItemProps) {
  const [menuOpen, setMenuOpen] = React.useState(true);
  const router = useRouter();

  const handleMenuItemClick = () => {
    if (item.href) {
      router.push(item.href);
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleMenuItemClick}
        sx={{
          ml: openSidebar ? 2 * level : 0,
          "&:hover": {
            backgroundColor: "var(--drawer-hover-bg)",
          },
          "& .MuiListItemIcon-root": {
            color: "var(--drawer-icon)",
          },
          "& .MuiListItemText-primary": {
            color: "var(--drawer-text)",
          },
          "& .MuiSvgIcon-root": {
            color: "var(--drawer-icon)",
          },
        }}
      >
        {item.icon ? (
          <ListItemIcon>
            <item.icon />
          </ListItemIcon>
        ) : (
          <ListItemIcon>
            <Description />
          </ListItemIcon>
        )}

        <ListItemText primary={openSidebar ? item.primaryText : ""} />
        {openSidebar &&
          item.subItems &&
          (menuOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {item.subItems && (
        <Collapse in={menuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subItems.map((subItem, index) => (
              <SidebarMenuItem
                key={index}
                item={subItem}
                level={level + 1}
                openSidebar={openSidebar}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default SidebarMenuItem;
