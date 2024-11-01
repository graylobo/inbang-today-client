import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, router]);

  return { user, token };
}
