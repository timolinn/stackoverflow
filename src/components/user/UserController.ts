import { NextFunction, Request, Response } from "express";
import { Service, Inject } from "typedi";
import UserService from "../user/UserService";
import { UserInterface } from "./userModel";
import { LoggerInterface } from "../../util/logger";
import { success, error } from "../../middleware/response";
import { AppError, ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";
import { MailerInterface } from "../../services/Mailer";

@Service()
export default class UserController {
  constructor(
    @Inject("user.service") private userService: UserService<UserInterface>,
    @Inject("logger") private logger: LoggerInterface,
    @Inject("mailer") private mailer: MailerInterface
  ) {

  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    // Does email exist already
    let user = await this.userService.findUserByEmail(data.email);
    if (user) {
      this.logger.info(`${data.email} email is already taken`);
      return next(new AppError(ErrorNames.ValidationError, StatusCodes.UNPREOCESSABLE_ENTITY,
        {
          description: "email already taken",
          isOperational: true,
        }));
    }
    // TODO: Send welcome email
    // TODO: Send email verification link
    user = await this.userService.createUser(data);
    return res.json(success<UserInterface>("new user created", { kind: "User", items: [user]}));
  };
}
