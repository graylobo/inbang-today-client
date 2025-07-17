import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

export interface SoopAuthResponse {
  success: boolean;
  message: string;
  userInfo?: {
    username: string;
    profileMessage: string;
  };
}

export async function generateSoopAuthCode(username: string): Promise<string> {
  const data = await apiRequest(API_ROUTES.soopAuth.generateCode, {
    body: { username },
  });
  return data.code;
}

export async function verifySoopAuth(
  username: string
): Promise<SoopAuthResponse> {
  const data = await apiRequest(API_ROUTES.soopAuth.verify, {
    body: { username },
  });
  return data;
}
