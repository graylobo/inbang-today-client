"use server";
import { api } from "@/libs/api/axios";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", { username, password });
  cookies().set("accessToken", data.access_token);
  return data;
}

export async function register(username: string, password: string) {
  const { data } = await api.post("/auth/register", { username, password });
  return data;
}
