import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authInitialized: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  setUser: (user: User | null) => void;
  setTokens: (refreshToken: string) => void;
  logout: () => void;
  clearStorage: () => void; // 추가
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
      authInitialized: false,
      setAuth: (user, token) => set({ user, token, authInitialized: true }),
      setUser: (user: User | null) => {
        if (!user) {
          return set({
            user: null,
            isAuthenticated: false,
            authInitialized: true,
          });
        }

        return set({
          user: {
            ...user,
            id: user?.id || 0,
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            name: user?.name || "",
            createdAt: user?.createdAt || "",
          },
          isAdmin: user?.isAdmin || false,
          isAuthenticated: !!user,
          authInitialized: true,
        });
      },
      logout: () => set({ user: null, token: null, authInitialized: true }),
      setTokens: (refreshToken) =>
        set({
          refreshToken,
        }),
      clearStorage: () => {
        localStorage.removeItem("auth-storage");
        set({ user: null, token: null, authInitialized: true });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
