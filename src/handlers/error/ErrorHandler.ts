import { AppError } from "./AppError";
import { logger } from "../../util/logger";
import { error } from "../../middleware/response";
import { StatusCodes } from "../http";

class ErrorHandler {
  public handleError(err: AppError) {
    let errObj;
    if (this.isTrustedError(err)) {
      errObj = {
        reason: err.name || "unknown",
        message: err.message || "something went wrong",
      };
    } else {
      errObj = {
        reason: err.name || "unknown",
        message: "something went wrong",
      };
    }
    logger.error(
      error(err.message || errObj.message, err.code || StatusCodes.INTERNAL_SERVER_ERROR, [errObj], err.stack)
    );
    return error(errObj.message, err.code || StatusCodes.INTERNAL_SERVER_ERROR, [errObj]);
  };

  public isTrustedError(err: AppError | Error) {
    if (err instanceof AppError) {
      return err.isOperational;
    }
    return false;
  }
}

export const errorHandler = new ErrorHandler();
