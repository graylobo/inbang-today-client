"use client";
import NavBar from "@/components/containers/navbar";
import Sidebar from "@/components/containers/sidebar/SideBar";
import * as React from "react";
import styles from "./Base.module.scss";

export const DRAWER_WIDTH = 240;

export default function BaseLayout({ children }: any) {
  return (
    <div className={styles.base}>
      <NavBar />
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.drawerHeader} />
        {children}
      </main>
    </div>
  );
}
