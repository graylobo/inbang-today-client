"use client";

import { ExpandLess, ExpandMore, Description } from "@mui/icons-material";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Link,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MenuItemType = {
  icon?: React.ElementType | string;
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

  const handleMenuItemClick = (): void => {
    if (item.href) {
      router.push(item.href);
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  const renderIcon = () => {
    if (!item.icon) {
      return (
        <ListItemIcon>
          <Description />
        </ListItemIcon>
      );
    }

    if (typeof item.icon === "string") {
      return (
        <ListItemIcon>
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src={item.icon}
              alt={item.primaryText}
              width={24}
              height={24}
            />
          </div>
        </ListItemIcon>
      );
    }

    const IconComponent = item.icon as React.ElementType;
    return (
      <ListItemIcon>
        <IconComponent />
      </ListItemIcon>
    );
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
        {renderIcon()}
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
