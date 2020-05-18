import { NextFunction, Request, Response } from "express";
import { Service, Inject } from "typedi";
import UserService from "../user/UserService";
import { UserInterface } from "../user/UserModel";
import { LoggerInterface } from "../../util/logger";
import { success, error } from "../../middleware/response";
import { AppError, ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";

@Service()
export default class UserController {
  constructor(
    @Inject("user.service") private userService: UserService<UserInterface>,
    @Inject("logger") private logger: LoggerInterface
  ) {

  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    // Does email exist already
    let user = await this.userService.findUserByEmail(data.email);
    if (user) {
      return next(new AppError(ErrorNames.ValidationError, StatusCodes.UNPREOCESSABLE_ENTITY,
        {
          description: "email already taken",
          isOperational: true,
        }));
    }

    user = await this.userService.createUser(data);
    return res.json(success<UserInterface>("new user created", { kind: "User", items: [user]}));
  };
}
