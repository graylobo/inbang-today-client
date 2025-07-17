import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

export interface PlatformAuthResponse {
  success: boolean;
  message: string;
  userInfo?: {
    username: string;
    profileMessage: string;
  };
}

export async function generatePlatformAuthCode(
  platformName: string,
  username: string
): Promise<string> {
  const data = await apiRequest(API_ROUTES.platformVerification.generateCode, {
    params: { platformName },
    body: { username },
  });
  return data.code;
}

export async function verifyPlatformAuth(
  platformName: string,
  username: string
): Promise<PlatformAuthResponse> {
  const data = await apiRequest(API_ROUTES.platformVerification.verify, {
    params: { platformName },
    body: { username },
  });
  return data;
}
