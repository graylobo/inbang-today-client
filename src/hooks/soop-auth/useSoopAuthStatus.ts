import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { useQuery } from "@tanstack/react-query";

export interface SoopAuthStatus {
  isVerified: boolean;
  username?: string;
  verifiedAt?: string;
}

export async function getSoopAuthStatus(): Promise<SoopAuthStatus> {
  const data = await apiRequest(API_ROUTES.soopAuth.status);
  return data;
}

export function useSoopAuthStatus() {
  return useQuery({
    queryKey: ["soopAuthStatus"],
    queryFn: getSoopAuthStatus,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
}
