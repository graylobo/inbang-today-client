"use server";
import axios from "axios";
import { cookies } from "next/headers";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
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
