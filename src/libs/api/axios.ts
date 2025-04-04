"use server";
import axios from "axios";
import { cookies } from "next/headers";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  console.log("token:::", token);
  config.withCredentials = true;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data);
  }
);

export { api };
