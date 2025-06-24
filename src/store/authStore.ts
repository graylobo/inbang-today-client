import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout as logoutApi } from "@/libs/api/services/auth.service";

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  authInitialized: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  setUser: (user: User | null) => void;
  setTokens: (refreshToken: string) => void;
  logout: () => void;
  clearStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      authInitialized: false,
      setAuth: (user, token) => set({ user, token, authInitialized: true }),
      setUser: (user: User | null) => {
        if (!user) {
          return set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isSuperAdmin: false,
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
            isSuperAdmin: user?.isSuperAdmin || false,
            profileImage: user?.profileImage,
          },
          isAdmin: user?.isAdmin || false,
          isSuperAdmin: user?.isSuperAdmin || false,
          isAuthenticated: !!user,
          authInitialized: true,
        });
      },
      logout: async () => {
        try {
          // 서버에서 httpOnly 쿠키 제거
          await logoutApi();

          return set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isSuperAdmin: false,
            authInitialized: true,
          });
        } catch (error) {
          console.error("로그아웃 중 오류 발생:", error);
          // 오류가 발생해도 클라이언트 상태는 초기화
          return set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isSuperAdmin: false,
            authInitialized: true,
          });
        }
      },
      setTokens: (refreshToken) =>
        set({
          refreshToken,
        }),
      clearStorage: () => {
        localStorage.removeItem("auth-storage");
        set({
          user: null,
          token: null,
          isAdmin: false,
          isSuperAdmin: false,
          authInitialized: true,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
