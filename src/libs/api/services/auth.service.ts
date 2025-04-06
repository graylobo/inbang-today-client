"use server";
import { api } from "@/libs/api/axios";
import { User } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", { name: username, password });
  const cookieStore = await cookies();
  cookieStore.set("access_token", data.access_token);
  return data;
}

export async function register(username: string, password: string) {
  const { data } = await api.post("/auth/register", {
    name: username,
    password,
  });
  return data;
}
