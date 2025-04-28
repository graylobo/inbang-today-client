import { create } from "zustand";

export enum SidebarState {
  OPEN = "OPEN", // 완전히 열린 상태
  CLOSED = "CLOSED", // 완전히 닫힌 상태
  HIDDEN = "HIDDEN", // 완전히 숨겨진 상태
}

interface LayoutState {
  sidebarState: SidebarState;
  showOverlay: boolean;
  isSidebarManuallyOpened: boolean;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
  toggleOverlay: () => void;
  setSidebarManuallyOpened: (opened: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarState: SidebarState.CLOSED, // 초기 상태를 CLOSED로 설정
  showOverlay: false,
  isSidebarManuallyOpened: false,
  toggleSidebar: () =>
    set((state) => {
      const nextState =
        state.sidebarState === SidebarState.OPEN
          ? SidebarState.CLOSED
          : SidebarState.OPEN;
      return {
        sidebarState: nextState,
        isSidebarManuallyOpened: nextState === SidebarState.OPEN,
      };
    }),
  setSidebarState: (state) => set({ sidebarState: state }),
  toggleOverlay: () => set((state) => ({ showOverlay: !state.showOverlay })),
  setSidebarManuallyOpened: (opened) =>
    set({ isSidebarManuallyOpened: opened }),
}));
