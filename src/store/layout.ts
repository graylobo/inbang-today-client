import { create } from "zustand";

interface LayoutState {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  openSidebar: true,
  setOpenSidebar: (open) => set({ openSidebar: open }),
}));
