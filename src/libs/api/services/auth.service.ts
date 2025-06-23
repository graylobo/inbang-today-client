import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  const data = await apiRequest(API_ROUTES.auth.login, {
    body: { name: username, password },
  });
  const cookieStore = await cookies();
  cookieStore.set("access_token", data.access_token);
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
  // 서버 컴포넌트에서 실행될 때
  try {
    const cookieStore = await cookies();
    const tempUserInfoCookie = cookieStore.get("temp_user_info");

    if (!tempUserInfoCookie) {
      return null;
    }

    return JSON.parse(tempUserInfoCookie.value);
  } catch (error) {
    console.error("임시 사용자 정보 파싱 오류:", error);
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
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
