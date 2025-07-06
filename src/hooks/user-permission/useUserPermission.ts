import { apiRequest } from "@/libs/api/api-request";
import { api } from "@/libs/api/axios";
import { API_ROUTES, createUrl } from "@/libs/api/route";
import {
  assignCrewPermission,
  getUserPermissions,
  removeCrewPermission,
} from "@/libs/api/services/user-permission.service";
import { getUsers } from "@/libs/api/services/user.service";
import { getErrorMessage } from "@/libs/utils/error-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 모든 사용자 목록을 가져오는 훅
export function useGetAllUsers() {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: false, // 에러 시 재시도 안함
  });

  // useMutation의 onError처럼 에러 처리
  useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      alert(getErrorMessage(error?.response?.data?.errorCode || error));
      router.push("/");
    }
  }, [query.error, router]);

  return query;
}

// 특정 사용자의 권한 정보를 가져오는 훅
export function useGetUserPermissions(userId: number) {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: () => getUserPermissions(userId),
    enabled: !!userId && userId > 0,
    retry: false, // 에러 시 재시도 안함
  });

  // useMutation의 onError처럼 에러 처리
  useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      alert(getErrorMessage(error?.response?.data?.errorCode || error));
      router.push("/");
    }
  }, [query.error, router]);

  return query;
}

// 사용자에게 특정 크루 권한을 부여하는 훅
export function useAssignCrewPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      crewId,
    }: {
      userId: number;
      crewId: number;
    }) => assignCrewPermission(userId, crewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userPermissions", variables.userId],
      });
    },
    onError: (error) => {
      console.error("Failed to assign permission:", error);
    },
  });
}

// 사용자의 특정 크루 권한을 제거하는 훅
export function useRemoveCrewPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      crewId,
    }: {
      userId: number;
      crewId: number;
    }) => removeCrewPermission(userId, crewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userPermissions", variables.userId],
      });
    },
    onError: (error) => {
      console.error("Failed to remove permission:", error);
    },
  });
}

// 사용자의 관리자 권한을 토글하는 훅
export function useToggleAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isAdmin,
    }: {
      userId: number;
      isAdmin: boolean;
    }) => {
      const response = await apiRequest(API_ROUTES.user.admin.update, {
        params: { userId },
        body: { isAdmin: !isAdmin },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to toggle admin status:", error);
    },
  });
}

// 사용자의 슈퍼 관리자 권한을 토글하는 훅
export function useToggleSuperAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isSuperAdmin,
    }: {
      userId: number;
      isSuperAdmin: boolean;
    }) => {
      const response = await apiRequest(API_ROUTES.user.superAdmin.update, {
        params: { userId },
        body: { isSuperAdmin: !isSuperAdmin },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to toggle super admin status:", error);
    },
  });
}
