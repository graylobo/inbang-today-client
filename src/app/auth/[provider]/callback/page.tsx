"use client";

import { getUserProfile } from "@/libs/api/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data);
        router.push("/");
      } catch (error) {
        console.error("프로필 가져오기 실패:", error);
        router.push("/login");
      }
    };

    fetchUserProfile();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400">로그인 처리중...</div>
    </div>
  );
}
