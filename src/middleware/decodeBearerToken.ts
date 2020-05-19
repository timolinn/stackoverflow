import { Response, NextFunction, Request } from "express";
import { StatusCodes } from "../handlers/http";
import { ErrorNames, AppError } from "../handlers/error";
import passport from "../config/passport";
import { logger } from "../util/logger";
import jwt from "jsonwebtoken";
import Container from "typedi";
import UserService from "../components/user/UserService";
import { UserInterface } from "../components/user/userModel";
import config from "../config";
import { extractTokenFromHeader, signJWT, signRefreshJWT, DecodedUser } from "../helpers";
import uuid from "uuid";

/**
 * Parses auth token from the request header
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export default function(req: Request, res: Response, next: NextFunction) {
  // This code is not clean
  // Suggestions for future refactor:
  // Find cleaner way to create error object (perhaps factory pattern)
  // Remove unneccessary error object calls
  return passport.authenticate(
    "jwt",
    { session: false },
    function(err, decodedJWT, info) {
      if (err) {
        return next(
          new AppError(
            err.name || ErrorNames.JsonWebTokenError,
            err.code || StatusCodes.UNAUTHORISED,
            {
              description: err.message || "user not authenticated",
              isOperational: true,
            },
          ),
        );
      }

      if (!decodedJWT) {
        const jwtPayload: any = jwt.decode(extractTokenFromHeader(req));
        if (info.name === ErrorNames.TokenExpiredError) {
          // Generate a new access token if the refreshtoken
          // Is still valid
          const userService = Container.get<UserService<UserInterface>>(
            "user.service",
          );
          return userService
            .findUserById(jwtPayload.sub, ["+password"])
            .then((user) => {
              if (!user) {
                return next(
                  new AppError(
                    ErrorNames.ResourceNotFound,
                    StatusCodes.NOT_FOUND,
                    {
                      description: "user does not exist",
                      isOperational: true,
                    },
                  ),
                );
              }
              return jwt.verify(
                user.refreshToken!,
                config.jwt.refreshTokenSecret,
                async (verifyError) => {
                  if (verifyError) {
                    return next(
                      new AppError(
                        verifyError.name || ErrorNames.UnauthorizedError,
                        StatusCodes.UNAUTHORISED,
                        {
                          description: verifyError.message ||
                            "user not authenticated",
                          isOperational: true,
                        },
                      ),
                    );
                  }
                  const jti = uuid.v4();
                  const newToken = signJWT(
                    user,
                    { expiresIn: config.jwt.expiresIn, jwtid: jti },
                  );
                  user.refreshToken = signRefreshJWT(
                    user,
                    { expiresIn: config.jwt.refreshTokenExpiresIn, jwtid: jti },
                  );
                  await user.save().catch((e) =>
                    logger.debug("Error saving refresh token " + e)
                  );
                  logger.info(`new token generated for ${user.id}`);
                  res.setHeader("X-JWT", newToken);
                  req.user = jwt.decode(newToken) || {};
                  return next();
                },
              );
            })
            .catch((e) =>
              next(
                new AppError(
                  e.name || ErrorNames.InternalServerError,
                  e.code || StatusCodes.INTERNAL_SERVER_ERROR,
                  {
                    description: "unable to authenticate user",
                    isOperational: true,
                  },
                ),
              )
            );
        }
        return next(
          new AppError(
            info.name || ErrorNames.UnauthorizedError,
            StatusCodes.UNAUTHORISED,
            {
              description: info.message || "user not authenticated",
              isOperational: true,
            },
          ),
        );
      }

      req.user = <DecodedUser> decodedJWT;
      next();
    },
  )(req, res, next);
}
