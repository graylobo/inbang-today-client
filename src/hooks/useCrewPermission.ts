import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as userPermissionApi from "@/libs/api/userPermission";

export function useCrewPermission(crewId?: number) {
  const { user, isAdmin, authInitialized } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // Query to check permission for a specific crew
  const permissionQuery = useQuery({
    queryKey: ["crewPermission", crewId, user?.id],
    queryFn: () => userPermissionApi.checkCrewPermission(crewId!),
    enabled: !!crewId && !!user && authInitialized,
  });

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

    if (permissionQuery.isSuccess) {
      setHasPermission(permissionQuery.data);
      setIsLoading(false);
    } else if (permissionQuery.isError) {
      setHasPermission(false);
      setIsLoading(false);
    }
  }, [
    permissionQuery.data,
    permissionQuery.isSuccess,
    permissionQuery.isError,
    user,
    isAdmin,
    authInitialized,
    router,
    crewId,
  ]);

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
  const { user, isAdmin } = useAuthStore();

  // Query to get all crews the user has permission to edit
  const permittedCrewsQuery = useQuery({
    queryKey: ["permittedCrews", user?.id],
    queryFn: userPermissionApi.getMyPermittedCrews,
    enabled: !!user,
  });

  return {
    crews: permittedCrewsQuery.data || [],
    isLoading: permittedCrewsQuery.isLoading,
    isError: permittedCrewsQuery.isError,
    isAdmin,
  };
}

export function useUserPermissionsManagement() {
  const queryClient = useQueryClient();

  // Assign permission mutation
  const assignPermissionMutation = useMutation({
    mutationFn: ({ userId, crewId }: { userId: number; crewId: number }) =>
      userPermissionApi.assignCrewPermission(userId, crewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permittedCrews"] });
    },
  });

  // Remove permission mutation
  const removePermissionMutation = useMutation({
    mutationFn: ({ userId, crewId }: { userId: number; crewId: number }) =>
      userPermissionApi.removeCrewPermission(userId, crewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permittedCrews"] });
    },
  });

  // Get user's permissions
  const getUserPermissions = (userId: number) => {
    return useQuery({
      queryKey: ["userPermissions", userId],
      queryFn: () => userPermissionApi.getUserPermissions(userId),
    });
  };

  return {
    assignPermission: assignPermissionMutation.mutate,
    removePermission: removePermissionMutation.mutate,
    isAssigning: assignPermissionMutation.isPending,
    isRemoving: removePermissionMutation.isPending,
    getUserPermissions,
  };
}
