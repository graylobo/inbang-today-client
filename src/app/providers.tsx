"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { getProfile } from "@/libs/api/services/auth.service";
import { usePathname } from "next/navigation";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 1, // 1분 동안 캐시 유지
      gcTime: 1000 * 60 * 10, // 10분 동안 메모리에 보관
    },
  },
});

// 인증 상태를 확인하는 함수
async function verifyAuthStatus(
  setUser: (user: any) => void,
  setIsLoading: (loading: boolean) => void
) {
  setIsLoading(true);
  try {
    // 서버 컴포넌트에서 HTTP-only 쿠키를 읽어 사용자 정보 조회
    const userData = await getProfile();
    if (userData && userData.data) {
      setUser(userData.data);
    } else {
      setUser(null);
    }
  } catch (error) {
    console.error("인증 확인 중 오류:", error);
    setUser(null);
  } finally {
    setIsLoading(false);
  }
}

// 인증 상태가 로드되었음을 확인하는 컴포넌트
function AuthInitializer() {
  const { authInitialized, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // 초기 로드 시 및 라우트 변경 시 인증 상태 확인
  useEffect(() => {
    // 초기 로딩 시 또는 라우트 변경 시 인증 상태 확인
    verifyAuthStatus(setUser, setIsLoading);
  }, [pathname, setUser]);

  if (isLoading) {
    // 인증 확인 중에는 로딩 상태 표시 (선택 사항)
    return null;
  }

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
