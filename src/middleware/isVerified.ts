import { Request, Response, NextFunction } from "express";
import { error } from "./response";
import { StatusCodes } from "../handlers/http";
import { ErrorNames } from "../handlers/error";

export async function isEmailVerified(req: Request, res: Response, next: NextFunction) {
  const user: any = req.user;
  if (!user) {
    return res.json(error("failed to check email verification status", StatusCodes.NOT_FOUND,
      [{
        message: "user not logged in",
        reason: ErrorNames.AuthenticationError,
      }]));
  }

  if (user.isVerified) {
    return next();
  }

  return res.json(error("email not verified", StatusCodes.FORBIDDEN,
    [{
      message: "email not verified: please verify your email to proceed",
      reason: ErrorNames.UnauthorizedError,
    }]));
}
