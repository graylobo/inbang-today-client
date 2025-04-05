"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 인증 상태가 로드되었음을 확인하는 컴포넌트
function AuthInitializer() {
  const { authInitialized, setUser } = useAuthStore();

  useEffect(() => {
    // 인증 상태가 아직 초기화되지 않았다면 명시적으로 초기화
    if (!authInitialized) {
      // 이미 로그인된 사용자가 있는지 확인 (Zustand의 persist에 의해 저장된 상태)
      const userJson = localStorage.getItem("auth-storage");
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          if (userData?.state?.user) {
            // 저장된 사용자 정보가 있으면 사용
            setUser(userData.state.user);
          } else {
            // 사용자 정보가 없으면 미인증 상태로 초기화
            setUser(null);
          }
        } catch (e) {
          // 파싱 에러가 발생하면 미인증 상태로 초기화
          setUser(null);
        }
      } else {
        // 저장된 상태가 없으면 미인증 상태로 초기화
        setUser(null);
      }
    }
  }, [authInitialized, setUser]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
