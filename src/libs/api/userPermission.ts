import { api } from "@/libs/api/axios";

export interface CrewPermission {
  id: number;
  crew: {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
  };
}

// Get crews the current user has permission to edit
export const getMyPermittedCrews = async () => {
  const response = await api.get("/user-permissions/me/crews");
  return response.data;
};

// Check if the current user has permission to edit a specific crew
export const checkCrewPermission = async (crewId: number) => {
  const response = await api.get(`/user-permissions/check/${crewId}`);
  return response.data.hasPermission;
};

// Admin only: Assign crew edit permission to a user
export const assignCrewPermission = async (userId: number, crewId: number) => {
  const response = await api.post("/user-permissions", { userId, crewId });
  return response.data;
};

// Admin only: Remove crew edit permission from a user
export const removeCrewPermission = async (userId: number, crewId: number) => {
  const response = await api.delete(
    `/user-permissions/${userId}/crew/${crewId}`
  );
  return response.data;
};

// Get permissions for a specific user (admin or self only)
export const getUserPermissions = async (userId: number) => {
  const response = await api.get(`/user-permissions/user/${userId}`);
  return response.data;
};
