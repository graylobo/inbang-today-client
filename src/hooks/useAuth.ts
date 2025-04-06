import { login, register } from "@/libs/api/services/auth.service";
import { getErrorMessage } from "@/libs/utils/error-handler";
import { useAuthStore, User } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export function useLogin(username: string, password: string) {
  return useQuery<User[]>({
    queryKey: ["user", "login"],
    queryFn: () => login(username, password),
  });
}

export function useRegister(username: string, password: string) {
  const router = useRouter();
  return useMutation<User[]>({
    mutationFn: () => register(username, password),
    onSuccess: () => {
      router.push("/login?registered=true");
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
}
