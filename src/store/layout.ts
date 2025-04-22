import { create } from "zustand";

export enum SidebarState {
  OPEN = "OPEN", // 완전히 열린 상태
  CLOSED = "CLOSED", // 완전히 닫힌 상태
}

interface LayoutState {
  sidebarState: SidebarState;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarState: SidebarState.CLOSED, // 초기 상태를 CLOSED로 설정
  toggleSidebar: () =>
    set((state) => ({
      sidebarState:
        state.sidebarState === SidebarState.OPEN
          ? SidebarState.CLOSED
          : SidebarState.OPEN,
    })),
  setSidebarState: (state) => set({ sidebarState: state }),
}));
