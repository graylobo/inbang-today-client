"use client"; // 클라이언트 컴포넌트로 변경

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // 클라이언트 측에서 localStorage에서 토큰 가져오기
  const token = localStorage.getItem("access_token");
  
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