import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

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
  // 서버 API를 통해 임시 사용자 정보 가져오기
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const response = await apiRequest(API_ROUTES.auth.me);

    // 임시 사용자인 경우에만 tempUserInfo 반환
    if (response.isTempUser && response.tempUserInfo) {
      return response.tempUserInfo;
    }

    return null;
  } catch (error) {
    console.error("임시 사용자 정보 조회 오류:", error);
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
