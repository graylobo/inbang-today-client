"use client";

import {
  verifyNickname as verifyNicknameApi,
  updateNickname as updateNicknameApi,
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
      return await verifyNicknameApi(nickname);
    },
    enabled: enabled && !!nickname.trim(),
    staleTime: 0, // Always refetch to ensure we have the latest data
  });
}

export function useUpdateNickname() {
  return useMutation<User, Error, string>({
    mutationFn: async (nickname: string) => {
      return await updateNicknameApi(nickname);
    },
  });
}
