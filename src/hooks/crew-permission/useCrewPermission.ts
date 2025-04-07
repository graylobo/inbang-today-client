import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Crew, CrewPermission } from "./useCrewPermission.type";
import {
  assignCrewPermission,
  checkCrewPermission,
  getPermittedCrews,
  getUserPermissions,
  removeCrewPermission,
} from "@/libs/api/services/user-permission.service";

export function useCheckCrewPermission(crewId?: number) {
  const { user, isAdmin, authInitialized } = useAuthStore();

  return useQuery<boolean>({
    queryKey: ["crewPermission", crewId, user?.id],
    queryFn: () => {
      if (!crewId) return Promise.resolve(false);
      return checkCrewPermission(crewId);
    },
    enabled: !!crewId && !!user && authInitialized,
  });
}

export function useGetPermittedCrews() {
  const { user } = useAuthStore();

  return useQuery<Crew[]>({
    queryKey: ["permittedCrews", user?.id],
    queryFn: () => getPermittedCrews(),
    enabled: !!user,
  });
}

export function useGetUserPermissions(userId: number) {
  return useQuery<CrewPermission[]>({
    queryKey: ["userPermissions", userId],
    queryFn: () => getUserPermissions(userId),
    enabled: !!userId,
  });
}

export function useAssignCrewPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, crewId }: { userId: number; crewId: number }) =>
      assignCrewPermission(userId, crewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permittedCrews"] });
      queryClient.invalidateQueries({ queryKey: ["userPermissions"] });
    },
  });
}

export function useRemoveCrewPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, crewId }: { userId: number; crewId: number }) =>
      removeCrewPermission(userId, crewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permittedCrews"] });
      queryClient.invalidateQueries({ queryKey: ["userPermissions"] });
    },
  });
}

// 기존 훅의 기능을 유지하는 컴포지션 훅
export function useCrewPermission(crewId?: number) {
  const { user, isAdmin, authInitialized } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  const {
    data,
    isLoading: isQueryLoading,
    isError,
  } = useCheckCrewPermission(crewId);

  useEffect(() => {
    if (!authInitialized) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (isAdmin) {
      setHasPermission(true);
      setIsLoading(false);
      return;
    }

    if (data !== undefined) {
      setHasPermission(data);
      setIsLoading(false);
    } else if (isError) {
      setHasPermission(false);
      setIsLoading(false);
    }
  }, [data, isError, user, isAdmin, authInitialized, router, crewId]);

  return { hasPermission, isLoading };
}

export function useRequireCrewPermission(crewId?: number) {
  const { hasPermission, isLoading } = useCrewPermission(crewId);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!hasPermission && crewId) {
      router.push("/");
    }
  }, [hasPermission, isLoading, router, crewId]);

  return { hasPermission, isLoading };
}

export function useCrewPermissionsList() {
  const { isAdmin } = useAuthStore();
  const { data: crews, isLoading, isError } = useGetPermittedCrews();

  return {
    crews: crews || [],
    isLoading,
    isError,
    isAdmin,
  };
}
