import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";

// 클라이언트 사이드 쿠키 유틸리티 함수들
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export async function login(username: string, password: string) {
  const data = await apiRequest(API_ROUTES.auth.login, {
    body: { name: username, password },
  });

  // 클라이언트 사이드에서 쿠키 설정
  if (typeof window !== "undefined" && data.access_token) {
    setCookie("access_token", data.access_token);
  }

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

export async function completeSocialSignup(
  nickname: string,
  tempUserInfo: any
) {
  const data = await apiRequest(API_ROUTES.auth.completeSocialSignup, {
    body: { name: nickname, tempUserInfo },
  });
  return data;
}

export async function getTempUserInfo() {
  // 클라이언트 사이드에서 실행
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const tempUserInfoCookie = getCookie("temp_user_info");

    if (!tempUserInfoCookie) {
      return null;
    }

    return JSON.parse(tempUserInfoCookie);
  } catch (error) {
    console.error("임시 사용자 정보 파싱 오류:", error);
    return null;
  }
}

export async function logout() {
  // 클라이언트 사이드에서 쿠키 삭제
  if (typeof window !== "undefined") {
    deleteCookie("access_token");
  }
  return { success: true };
}

export async function getProfile() {
  try {
    const data = await apiRequest(API_ROUTES.user.profile.get);
    return data;
  } catch (error) {
    console.error("사용자 프로필 조회 중 오류:", error);
    return null;
  }
}
