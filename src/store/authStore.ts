import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
  clearStorage: () => void; // 추가
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      clearStorage: () => {
        localStorage.removeItem("auth-storage");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
