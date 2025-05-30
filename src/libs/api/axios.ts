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
  config.withCredentials = true;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    "request path:::",
    `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "error request path:::",
      `${error.request.method} ${error.config.baseURL}${error.request.path}`
    );
    return Promise.reject(error.response?.data.errorCode);
  }
);

export { api };
