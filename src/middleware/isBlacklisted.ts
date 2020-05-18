import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader } from "../helpers";
import redis from "../lib/redisClient";
import { logger } from "../util/logger";
import { AppError } from "../handlers/error";
import { ErrorNames } from "../handlers/error";
import { StatusCodes } from "../handlers/http";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  const JWTToken = extractTokenFromHeader(req);
  if (!JWTToken) {
    return next();
  }

  const jwtPayload: any = jwt.decode(JWTToken);
  return redis().then((client) =>
    client.get(jwtPayload.jti, (decodeerr, result) => {
      if (decodeerr) {
        logger.debug(decodeerr);
        decodeerr.message = "an unexpected error occurred";
        throw decodeerr;
      }

      if (!result) {
        // Token not blacklisted
        // Move the user on to the next middleware
        logger.debug("token not blacklisted");
        return next();
      }

      // Token was blacklisted
      // The user must reauthenticate
      return next(
        new AppError(ErrorNames.AuthenticationError, StatusCodes.FORBIDDEN, {
          description: "user not authenticated, please login and try again",
          isOperational: true,
        }),
      );
    })
  ).catch((e) => {
    logger.error(`unable to connect to redis: ${e}`);
    return next(
      new AppError(
        ErrorNames.InternalServerError,
        StatusCodes.INTERNAL_SERVER_ERROR,
        {
          description: "an error occured, please try again",
          isOperational: true,
        },
      ),
    );
  });
};
