import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export function useRequireAuth() {
  const { user, token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.push("/login");
      }
      setIsLoading(false);
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router, isAuthenticated]);

  return { user, token, isLoading };
}

export function useRequireAdmin() {
  const { user, token, isAdmin } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
    setIsLoading(false);
  }, [router, isAdmin]);

  return { user, token, isAdmin, isLoading };
}
