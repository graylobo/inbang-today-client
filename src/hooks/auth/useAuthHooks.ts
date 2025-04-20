"use client";

import {
  verifyNickname as verifyNicknameApi,
  updateNickname as updateNicknameApi,
  completeSocialSignup as completeSocialSignupApi,
  getTempUserInfo,
} from "@/libs/api/services/auth.service";
import { User } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";

interface VerifyNicknameResponse {
  isAvailable: boolean;
}

export function useVerifyNickname(nickname: string, enabled: boolean = true) {
  return useQuery<VerifyNicknameResponse>({
    queryKey: ["verifyNickname", nickname],
    queryFn: async () => {
      if (!nickname.trim()) {
        return { isAvailable: false };
      }
      try {
        const result = await verifyNicknameApi(nickname);
        console.log("닉네임 확인 결과:", result);
        return result;
      } catch (error) {
        console.error("닉네임 확인 에러:", error);
        throw error;
      }
    },
    enabled: enabled && !!nickname.trim(),
    staleTime: 0, // Always refetch to ensure we have the latest data
  });
}

export function useUpdateNickname() {
  return useMutation<User, Error, string>({
    mutationFn: async (nickname: string) => {
      try {
        const result = await updateNicknameApi(nickname);
        console.log("닉네임 업데이트 결과:", result);
        return result;
      } catch (error) {
        console.error("닉네임 업데이트 에러:", error);
        throw error;
      }
    },
  });
}

export function useCompleteSocialSignup() {
  return useMutation<any, Error, { nickname: string; tempUserInfo: any }>({
    mutationFn: async ({ nickname, tempUserInfo }) => {
      try {
        console.log("소셜 회원가입 완료 요청 시작:", {
          nickname,
          tempUserInfo,
        });
        const result = await completeSocialSignupApi(nickname, tempUserInfo);
        console.log("소셜 회원가입 완료 결과:", result);
        return result;
      } catch (error) {
        console.error("소셜 회원가입 완료 에러:", error);
        throw error;
      }
    },
  });
}

export function useTempUserInfo() {
  return useQuery({
    queryKey: ["tempUserInfo"],
    queryFn: async () => {
      try {
        const result = await getTempUserInfo();
        console.log("임시 사용자 정보 조회 결과:", result);
        return result;
      } catch (error) {
        console.error("임시 사용자 정보 조회 에러:", error);
        return null;
      }
    },
  });
}
