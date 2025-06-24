import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";

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

export async function login(username: string, password: string) {
  const data = await apiRequest(API_ROUTES.auth.login, {
    body: { name: username, password },
  });

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
  try {
    const result = await apiRequest(API_ROUTES.auth.logout);
    return result;
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
    // 서버 요청이 실패해도 클라이언트에서는 성공으로 처리
    // (이미 토큰이 만료되었거나 네트워크 문제일 수 있음)
    return { success: true };
  }
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
