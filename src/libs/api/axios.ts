"use server";
import axios from "axios";
import { cookies } from "next/headers";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 에러 처리는 클라이언트 사이드에서 처리
      return Promise.reject(new Error("UNAUTHORIZED"));
    }
    return Promise.reject(error);
  }
);

export { api };
