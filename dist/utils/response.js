/*

Response: {
  message: string;
  data: unknown;
  error: string | undefined
}
*/
export var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["NotFound"] = 404] = "NotFound";
    StatusCodes[StatusCodes["Success"] = 200] = "Success";
    StatusCodes[StatusCodes["Accepted"] = 202] = "Accepted";
    StatusCodes[StatusCodes["BadRequest"] = 400] = "BadRequest";
    StatusCodes[StatusCodes["TokenExpired"] = 403] = "TokenExpired";
    StatusCodes[StatusCodes["Unauthorized"] = 401] = "Unauthorized";
})(StatusCodes || (StatusCodes = {}));
export const formatResponse = (statusCode, message, data) => {
    if (data) {
        return {
            statusCode,
            message,
            data,
        };
    }
    else {
        return {
            statusCode,
            message,
        };
    }
};
export const SuccessResponse = (data) => {
    return formatResponse(200, "success", data);
};
export const ErrorResponse = (error, message) => {
    if (error instanceof Error) {
        return formatResponse(404, message ?? error.message, error.cause);
    }
    return formatResponse(404, message ?? `${error}`, error);
};
