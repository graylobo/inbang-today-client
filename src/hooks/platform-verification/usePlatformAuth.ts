import {
  generatePlatformAuthCode,
  verifyPlatformAuth,
  PlatformAuthResponse,
} from "@/libs/api/services/platform-verification.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGeneratePlatformAuthCode() {
  return useMutation({
    mutationFn: ({
      platformName,
      username,
    }: {
      platformName: string;
      username: string;
    }) => generatePlatformAuthCode(platformName, username),
    onError: (error: any) => {
      console.error("플랫폼 인증 코드 생성 에러:", error);
      toast.error(error.message || "인증 코드 생성에 실패했습니다.");
    },
  });
}

export function useVerifyPlatformAuth() {
  const queryClient = useQueryClient();

  return useMutation<
    PlatformAuthResponse,
    Error,
    { platformName: string; username: string }
  >({
    mutationFn: ({ platformName, username }) =>
      verifyPlatformAuth(platformName, username),
    onSuccess: (response) => {
      if (response.success) {
        // 인증 성공 시 관련 쿼리 무효화하여 서버에서 최신 데이터를 가져오도록 함
        queryClient.invalidateQueries({ queryKey: ["platformAuthStatus"] });
      }
    },
    onError: (error: any) => {
      console.error("플랫폼 인증 확인 에러:", error);
      toast.error(error.message || "인증 확인에 실패했습니다.");
    },
  });
}
