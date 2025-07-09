// src/utils/errorHandler.ts

import { ERROR_MESSAGES } from "@/common/constants/error-messages.enum";

// 에러 타입 정의
export interface ApiErrorInfo {
  errorCode?: string;
  statusCode?: number;
  originalError?: any;
}

export type ErrorInput = string | ApiErrorInfo | Error;

export const getErrorMessage = (error: ErrorInput): string => {
  // 문자열로 직접 전달된 경우 (이전 방식 호환)
  if (typeof error === "string" && ERROR_MESSAGES[error]) {
    return ERROR_MESSAGES[error];
  }

  // 객체로 전달된 경우
  if (error && typeof error === "object") {
    const apiError = error as ApiErrorInfo;

    // 1순위: errorCode 확인
    if (apiError.errorCode && ERROR_MESSAGES[apiError.errorCode]) {
      return ERROR_MESSAGES[apiError.errorCode];
    }

    // 2순위: statusCode로 처리
    if (apiError.statusCode) {
      return getStatusCodeMessage(apiError.statusCode);
    }
  }

  return ERROR_MESSAGES.DEFAULT;
};

// HTTP 상태 코드별 메시지 처리
const getStatusCodeMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "잘못된 요청입니다.";
    case 401:
      return "로그인이 필요합니다.";
    case 403:
      return "접근 권한이 없습니다.";
    case 404:
      return "요청한 리소스를 찾을 수 없습니다.";
    case 409:
      return "데이터 충돌이 발생했습니다.";
    case 500:
      return "서버 내부 오류가 발생했습니다.";
    default:
      return ERROR_MESSAGES.DEFAULT;
  }
};
