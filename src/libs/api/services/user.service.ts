"use server";

import { api } from "@/libs/api/axios";
import { API_ROUTES } from "@/libs/api/route";

export async function getUserProfile() {
  const { data } = await api.get(API_ROUTES.user.profile.get.url);
  return data;
}
