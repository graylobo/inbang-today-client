// src/utils/errorHandler.ts

import { ERROR_MESSAGES } from "@/common/constants/error-messages.enum";

export const getErrorMessage = (error: any): string => {
  if (!error) return ERROR_MESSAGES.DEFAULT;

  let errorMessage = error.message || error.error;

  if (errorMessage && ERROR_MESSAGES[errorMessage]) {
    return ERROR_MESSAGES[errorMessage];
  }

  return ERROR_MESSAGES.DEFAULT;
};
