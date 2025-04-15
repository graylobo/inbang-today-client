import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";

export interface UserProfile {
  data: User;
}

export interface UpdateProfileImageResponse {
  success: boolean;
  data: {
    profileImage: string;
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  return await apiRequest(API_ROUTES.user.profile.get);
}

export async function getUsers(): Promise<User[]> {
  return await apiRequest(API_ROUTES.user.list.get);
}

export async function updateProfileImage(
  formData: FormData
): Promise<UpdateProfileImageResponse> {
  return await apiRequest(API_ROUTES.user.profile.updateImage, {
    body: formData,
  });
}
