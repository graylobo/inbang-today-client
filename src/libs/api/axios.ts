import axios from "axios";

// 쿠키에서 토큰을 가져오는 함수
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  config.withCredentials = true;

  // 쿠키에서 access_token 가져와서 Authorization 헤더에 추가
  const token = getCookie("access_token");
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
