import { ErrorCode } from "@/common/enums/error-codes.enum";

export const ERROR_MESSAGES: Record<string, string> = {
  [ErrorCode.DUPLICATE_NAME]: "이미 존재하는 스트리머 이름입니다.",
  [ErrorCode.RESOURCE_NOT_FOUND]: "요청한 리소스를 찾을 수 없습니다.",
  [ErrorCode.INVALID_USERNAME_OR_PASSWORD]:
    "아이디 또는 비밀번호가 올바르지 않습니다.",
  [ErrorCode.NOT_FOUND_USER]: "존재하지 않는 유저입니다.",
  [ErrorCode.DUPLICATE_BROADCAST_DATE]: "이미 존재하는 방송 날짜입니다.",
  [ErrorCode.UNAUTHORIZED]: "로그인이 필요합니다.",
  [ErrorCode.AUTHENTICATION_REQUIRED]: "로그인이 필요합니다.",
  [ErrorCode.ONLY_ADMIN_CAN_ACCESS]: "관리자만 접근할 수 있습니다.",
  [ErrorCode.ONLY_VIEW_OWN_PERMISSIONS]:
    "권한이 있는 유저만 접근할 수 있습니다.",
  DEFAULT: "오류가 발생했습니다. 다시 시도해 주세요.",
};
