// src/utils/errorHandler.ts

import { ERROR_MESSAGES } from "@/common/constants/error-messages.enum";

export const getErrorMessage = (error: any): string => {

  if (error && ERROR_MESSAGES[error]) {
    return ERROR_MESSAGES[error];
  }

  return ERROR_MESSAGES.DEFAULT;
};
