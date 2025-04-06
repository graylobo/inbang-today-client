import { ErrorCode } from "@/common/enums/error-codes.enum";

export const ERROR_MESSAGES: Record<string, string> = {
  [ErrorCode.DUPLICATE_NAME]: "이미 존재하는 스트리머 이름입니다.",
  [ErrorCode.RESOURCE_NOT_FOUND]: "요청한 리소스를 찾을 수 없습니다.",
  DEFAULT: "오류가 발생했습니다. 다시 시도해 주세요.",
};
