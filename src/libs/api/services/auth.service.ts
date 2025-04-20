"use server";
import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  const data = await apiRequest(API_ROUTES.auth.login, {
    body: { name: username, password },
  });
  const cookieStore = await cookies();
  cookieStore.set("access_token", data.access_token);
  return data;
}

export async function register(username: string, password: string) {
  const data = await apiRequest(API_ROUTES.auth.register, {
    body: { name: username, password },
  });
  return data;
}

export async function verifyNickname(nickname: string) {
  const data = await apiRequest(API_ROUTES.auth.verifyNickname, {
    query: { nickname },
  });
  return data;
}

export async function updateNickname(nickname: string) {
  const data = await apiRequest(API_ROUTES.auth.updateNickname, {
    body: { name: nickname },
  });
  return data.user;
}
