import { CommonResponse } from "./identity.exception";

export function successResponse<T>(message: string, data?: T, statusCode = 200): CommonResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
}

export function errorResponse(message: string, errorCode: number): CommonResponse<null> {
  return {
    success: false,
    message,
    errorCode,
  };
}
