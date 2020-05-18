import schemas from "../util/dataSchemas";
import { Request, Response, NextFunction } from "express";
import { error } from "./response";
import { StatusCodes } from "../handlers/http";
import { ErrorNames, AppError } from "../handlers/error";
import validator from "validator";

export const validateRequestData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supportedMethods = ["post", "patch", "put"];
  const path = req.originalUrl;
  const method = req.method.toLowerCase();
  const schema = schemas[path];

  // eslint-disable-next-line id-blacklist
  if (supportedMethods.includes(method) && schema !== undefined) {
    const result = schema.validate(req.body);
    if (result.error) {
      const errs = [
        {
          reason: ErrorNames.ValidationError,
          errors: result.error.details,
        },
      ];
      return res.status(StatusCodes.UNPREOCESSABLE_ENTITY).json(
        error("ValidationError", StatusCodes.UNPREOCESSABLE_ENTITY, errs),
      );
    }
  } else {
    return next(
      new AppError(
        ErrorNames.ValidationError,
        StatusCodes.UNPREOCESSABLE_ENTITY,
        {
          description: "Validation schema for " + path + " not found",
          isOperational: true,
        },
      ),
    );
  }
  return next();
};

export const isObjectId = (...params: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    for (const param of params) {
      const value = req.params[param];
      if (!validator.isMongoId(value)) {
        return next(
          new AppError(
            ErrorNames.InvalidArgumentError,
            StatusCodes.BAD_REQUEST,
            {
              isOperational: true,
              description: "invalid url parameter",
            },
          ),
        );
      }
    }
    next();
  };
