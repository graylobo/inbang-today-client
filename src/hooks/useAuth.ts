import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRequireAuth() {
  const { user, token, isAuthenticated, authInitialized } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized) return;

    if (!isAuthenticated) {
      router.push("/login");
    }
    setIsLoading(false);
  }, [router, isAuthenticated, authInitialized]);

  return { user, token, isLoading };
}

export function useRequireAdmin() {
  const { user, token, isAdmin, authInitialized } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized) return;

    if (!isAdmin) {
      router.push("/");
    }
    setIsLoading(false);
  }, [router, isAdmin, authInitialized]);

  return { user, token, isAdmin, isLoading };
}
