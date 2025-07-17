import {
  generateSoopAuthCode,
  verifySoopAuth,
  SoopAuthResponse,
} from "@/libs/api/services/soop-auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGenerateSoopAuthCode() {
  return useMutation({
    mutationFn: generateSoopAuthCode,
    onError: (error: any) => {
      console.error("숲 인증 코드 생성 에러:", error);
      toast.error(error.message || "인증 코드 생성에 실패했습니다.");
    },
  });
}

export function useVerifySoopAuth() {
  const queryClient = useQueryClient();

  return useMutation<SoopAuthResponse, Error, string>({
    mutationFn: verifySoopAuth,
    onSuccess: (response) => {
      if (response.success) {
        // 인증 성공 시 관련 쿼리 무효화하여 서버에서 최신 데이터를 가져오도록 함
        queryClient.invalidateQueries({ queryKey: ["soopAuthStatus"] });
      }
    },
    onError: (error: any) => {
      console.error("숲 인증 확인 에러:", error);
      toast.error(error.message || "인증 확인에 실패했습니다.");
    },
  });
}
