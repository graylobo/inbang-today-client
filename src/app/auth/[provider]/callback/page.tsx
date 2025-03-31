"use client";

import { getUserProfile } from "@/libs/api/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
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
        console.error("가져오기실패:", error);
        router.push("/register");
      }
    };

    console.log("useEffect:::");
    fetchUserProfile();
  }, [router, setUser, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400">로그인 처리중...</div>
    </div>
  );
}
