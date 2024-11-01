import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRequireAuth() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 렌더링 시에는 잠시 기다림
    const timer = setTimeout(() => {
      if (!user || !token) {
        router.push("/login");
      }
      setIsLoading(false);
    }, 100); // 100ms 딜레이

    return () => clearTimeout(timer);
  }, [user, token, router]);

  return { user, token, isLoading };
}
