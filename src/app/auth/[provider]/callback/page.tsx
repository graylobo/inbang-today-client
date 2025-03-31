"use client";

import { getUserProfile } from "@/libs/api/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setTokens } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // URL에서 토큰 파라미터 추출
        const token = searchParams.get("token");

        if (!token) {
          console.error("토큰이 URL에 없습니다.");
          router.push("/register");
          return;
        }

        // 토큰 저장 (localStorage 또는 state)
        localStorage.setItem("access_token", token);
        setTokens(token);

        // 이제 토큰을 사용하여 프로필 정보 요청
        // getUserProfile 함수가 저장된 토큰을 사용하도록 수정해야 할 수 있음
        const { data } = await getUserProfile();

        // refreshToken이 응답에 포함되어 있다면 저장
        if (data.refreshToken) {
          localStorage.setItem("refresh_token", data.refreshToken);
          setTokens(data.refreshToken);
        }

        setUser(data);
        console.log("data:::", data);
        router.push(`/`);
      } catch (error) {
        console.log("가져오기실패:", error);
        router.push("/register");
      }
    };

    console.log("useEffect:::");
    fetchUserProfile();
  }, [router, searchParams, setUser, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400">로그인 처리중...</div>
    </div>
  );
}
