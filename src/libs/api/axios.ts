import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  config.withCredentials = true;

  // 서버 사이드에서만 쿠키를 직접 읽어서 Authorization 헤더 설정
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("서버사이드 쿠키 읽기 실패:", error);
    }
  }
  // 클라이언트 사이드에서는 withCredentials: true로 HTTP-only 쿠키가 자동 포함됨

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
