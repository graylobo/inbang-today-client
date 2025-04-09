import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export async function getUserProfile(): Promise<UserProfile> {
  return await apiRequest(API_ROUTES.user.profile.get);
}

export async function getUsers(): Promise<User[]> {
  return await apiRequest(API_ROUTES.user.list.get);
}
