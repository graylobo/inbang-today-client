import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { useQuery } from "@tanstack/react-query";

export interface SoopAuthStatus {
  isVerified: boolean;
  username?: string;
  verifiedAt?: string;
}

export async function getPlatformAuthStatus(
  platformName: string
): Promise<SoopAuthStatus> {
  const data = await apiRequest(API_ROUTES.platformVerification.status, {
    params: { platformName },
  });
  return data;
}

export function usePlatformAuthStatus(platformName: string) {
  return useQuery({
    queryKey: ["platformAuthStatus", platformName],
    queryFn: () => getPlatformAuthStatus(platformName),
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
}
