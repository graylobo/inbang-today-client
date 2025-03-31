"use client";

import { api } from "@/libs/api/axios";
import { API_ROUTES } from "@/libs/api/route";

export const getUserProfile = async () => {
  // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem("access_token");

  return api.get(API_ROUTES.user.profile.get.url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
