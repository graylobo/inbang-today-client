import {
  Crew,
  CrewPermission,
} from "@/hooks/crew-permission/useCrewPermission.type";
import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

export const getPermittedCrews = async (): Promise<Crew[]> =>
  await apiRequest(API_ROUTES.userPermission.me.crews.get);

export const checkCrewPermission = async (crewId: number): Promise<boolean> => {
  const response = await apiRequest(API_ROUTES.userPermission.check.get, {
    params: {
      crewId,
    },
  });
  return response.hasPermission;
};

export const assignCrewPermission = async (
  userId: number,
  crewId: number
): Promise<CrewPermission> =>
  await apiRequest(API_ROUTES.userPermission.create, {
    body: {
      userId,
      crewId,
    },
  });

export const removeCrewPermission = async (
  userId: number,
  crewId: number
): Promise<void> => {
  await apiRequest(API_ROUTES.userPermission.delete, {
    params: {
      userId,
      crewId,
    },
  });
};

export const toggleAdminStatus = async (
  userId: number,
  isAdmin: boolean
): Promise<void> => {
  await apiRequest(API_ROUTES.user.admin.update, {
    params: { userId },
    body: { isAdmin },
  });
};

export const getUserPermissions = async (
  userId: number
): Promise<CrewPermission[]> =>
  await apiRequest(API_ROUTES.userPermission.user.get, {
    params: {
      userId,
    },
  });
