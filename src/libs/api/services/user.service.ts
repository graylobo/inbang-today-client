"use server";

import { api } from "@/libs/api/axios";
import { API_ROUTES } from "@/libs/api/route";

export async function getUserProfile() {
  console.log("getUserProfile start:::");
  const { data } = await api.get(API_ROUTES.user.profile.get.url);
  console.log("getUserProfile end:::", data);
  return data;
}
