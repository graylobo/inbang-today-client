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

// 관리자 또는 SuperAdmin 확인 (크루 편집 권한이 있는 관리자 페이지 접근에 사용)
export function useRequireAdmin() {
  const { user, token, isAdmin, isSuperAdmin, authInitialized } =
    useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized) return;

    // 관리자 또는 SuperAdmin만 접근 가능
    if (!isAdmin && !isSuperAdmin) {
      router.push("/");
    }
    setIsLoading(false);
  }, [router, isAdmin, isSuperAdmin, authInitialized]);

  return { user, token, isAdmin, isSuperAdmin, isLoading };
}

// SuperAdmin만 확인 (권한 관리 등 SuperAdmin 전용 페이지 접근에 사용)
export function useRequireSuperAdmin() {
  const { user, token, isSuperAdmin, authInitialized } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized) return;

    // SuperAdmin만 접근 가능
    if (!isSuperAdmin) {
      router.push("/");
    }
    setIsLoading(false);
  }, [router, isSuperAdmin, authInitialized]);

  return { user, token, isSuperAdmin, isLoading };
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
