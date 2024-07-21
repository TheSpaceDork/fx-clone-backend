/* 

Response: {
  message: string;
  data: unknown;
  error: string | undefined
}
*/

export enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400,
  TokenExpired = 403,
  Unauthorized = 401,
}

export const formatResponse = (
  statusCode: number,
  message: string,
  data: unknown
) => {
  if (data) {
    return {
      statusCode,
      message,
      data,
    };
  } else {
    return {
      statusCode,
      message,
    };
  }
};

export const SuccessResponse = (data: any) => {
  return formatResponse(200, "success", data);
};

export const ErrorResponse = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    return formatResponse(404, message ?? error.message, error.cause);
  }

  return formatResponse(404, message ?? `${error}`, error);
};
