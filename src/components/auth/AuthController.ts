import { NextFunction, Request, Response } from "express";
import { Service, Inject } from "typedi";
import UserService from "../user/UserService";
import { UserInterface } from "../user/UserModel";
import { LoggerInterface } from "../../util/logger";
import { success, error } from "../../middleware/response";
import passport from "passport";
import { StatusCodes } from "../../handlers/http";
import { ErrorNames, AppError } from "../../handlers/error";
import { MailerData, MailerInterface } from "../../services/Mailer";
import jwt from "jsonwebtoken";
import redis from "../../lib/redisClient";
import { extractTokenFromHeader } from "../../helpers";

@Service("auth.controller")
export default class AuthController {

  constructor(
    @Inject("user.service") private userService: UserService<UserInterface>,
    @Inject("logger") private logger: LoggerInterface,
    @Inject("mailer") private mailer: MailerInterface
  ) {

  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false, failureMessage: "invalid email or password" }, (err, user) => {
      if (!err) {
        if (!user) {
          return next(err);
        }
        return this.login(req, res, user);
      }

      return next(err);
    })(req, res);
  };

  private login = async (req: Request, res: Response, user: UserInterface) => {
    req.logIn(user, async (err) => {
      if (!err) {
        const serializedUser: any = user.serializeAuthenticatedUser();
        user.refreshToken = serializedUser.refreshToken;
        await user.save();
        return res.json(success<UserInterface>("user now logged in", { kind: "User", items: [serializedUser] }));
      }
      return res.status(StatusCodes.BAD_REQUEST)
        .json(error(err.name || "invalid email or password", StatusCodes.BAD_REQUEST,
          [{
            message: err.message || "invalid email or password",
            reason: err.name || "AuthenticationError",
          }]));
    });
  };


  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(error("user not found", StatusCodes.NOT_FOUND, [
        {
          message: "user with that email does not exist",
          reason: ErrorNames.ResourceNotFound,
        },
      ]));
    }

    const token = user.serializeAuthenticatedUser().accessToken;
    const mailData: MailerData = {
      to: email,
      subject: "Reset Password",
      templateName: "recoverPassword",
      mailInfo: {
        name: user.fullName(),
        link: `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword?token=${token}`,
      },
    };

    this.mailer.setData(mailData);
    this.mailer.send();
    return res.status(StatusCodes.OK).json(success<unknown>("reset password link sent to " + email, {
      kind: "User",
      items: [{ name: mailData.mailInfo?.name, link: mailData.mailInfo?.link }],
    }));
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    let user: any = req.user;
    user = await this.userService.findUserById(user.userId);
    this.logger.debug(`reset password requested by ${user}`);
    if (!user) {
      return next(new AppError(ErrorNames.ResourceNotFound, StatusCodes.NOT_FOUND, {
        description: "user was found in our database",
        isOperational: true,
      }));
    }
    user.password = password;
    await user.save();

    // Don't send passowrd to client
    user.password = null;
    return res.status(StatusCodes.OK).json(success<UserInterface>("password changed", {
      kind: "User",
      items: [user],
    }));
  };

  public blacklistJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req);
    if (!token) return res.status(StatusCodes.BAD_REQUEST).json(error("no auth token", StatusCodes.BAD_REQUEST));

    const decoded: any = jwt.decode(token);
    if (!decoded) return res.status(StatusCodes.BAD_REQUEST).json(error("invalid auth token", StatusCodes.BAD_REQUEST));

    // Set token in redis
    // TODO: Blacklist refresh token
    await redis().then(client => client.set(decoded.jti, token, "EX", decoded.exp - decoded.iat, (err, reply) => {
      if (err) {
        this.logger.debug("Error blacklisting token " + err);
        return next(new AppError(ErrorNames.InternalServerError, StatusCodes.INTERNAL_SERVER_ERROR, {
          description: "failed to blacklist token",
          isOperational: true,
        }));
      }
      return res.status(StatusCodes.OK)
        .json(success<never>("token blacklisted successfully", { kind: "User", items: [] }));
    })).catch(err => {
      this.logger.error(`unable to connect to redis: ${err}`);
      return res.status(StatusCodes.OK).json(error("failed to logout, please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      ));
    });
  };

  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromHeader(req);
    if (!token) return res.status(StatusCodes.BAD_REQUEST).json(error("no auth token", StatusCodes.BAD_REQUEST));

    const decoded: any = jwt.decode(token);
    // TODO: investigate how redis handles negative expiry timestamp
    // TODO: Blacklist refresh token
    await redis().then(client => client.set(decoded.jti, token, "EX", decoded.exp - decoded.iat, (err, reply) => {
      if (err) {
        return next(new AppError(ErrorNames.InternalServerError, StatusCodes.INTERNAL_SERVER_ERROR, {
          description: "failed to logout, please try again",
          isOperational: true,
        }));
      }
    })).catch(err => {
      this.logger.error(`unable to connect to redis: ${err}`);
      return res.status(StatusCodes.OK).json(error("failed to logout, please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      ));
    });
    res.status(StatusCodes.OK).json(success<never>("logout successful", { kind: "User", items: [] }));
  };
}
