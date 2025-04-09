import { create } from "zustand";

export enum SidebarState {
  OPEN = "OPEN", // 완전히 열린 상태
  ICON_ONLY = "ICON_ONLY", // 아이콘만 보이는 상태
  CLOSED = "CLOSED", // 완전히 닫힌 상태
}

interface LayoutState {
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarState: SidebarState.OPEN,
  setSidebarState: (state) => set({ sidebarState: state }),
  toggleSidebar: () =>
    set((state) => {
      const currentState = state.sidebarState;
      // 상태 순환: OPEN -> ICON_ONLY -> CLOSED -> OPEN
      if (currentState === SidebarState.OPEN) {
        return { sidebarState: SidebarState.ICON_ONLY };
      } else if (currentState === SidebarState.ICON_ONLY) {
        return { sidebarState: SidebarState.CLOSED };
      } else {
        return { sidebarState: SidebarState.OPEN };
      }
    }),
}));
