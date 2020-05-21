import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserInterface } from "./components/user/userModel";
import config from "./config";
import { error } from "./middleware/response";
import { StatusCodes } from "./handlers/http";
import sendgrid from "./services/sendgrid";
import { ErrorNames, AppError } from "./handlers/error";
import { logger } from "./util/logger";
import Container from "typedi";
import UserService from "./components/user/UserService";
import { QuestionService, QuestionInterface } from "./components/question";
import { AnswerService, AnswerInterface } from "./components/answer";

export interface DecodedUser {
  userId: string;
  sub: string;
  jti: string;
  role: string;
}

/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/
export const catchError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) =>
  function(req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };

export const renderEmail = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const html = sendgrid.templetify(req.params.template, { name: "Tim" });
  if (!html || html === "") {
    return res.json(
      error(
        "template not found",
        StatusCodes.NOT_FOUND,
        [{
          message: "template not found",
          reason: ErrorNames.ResourceNotFound,
        }],
      ),
    );
  }
  return res.send(html);
};

export const signJWT = (user: UserInterface, options: jwt.SignOptions) =>
  jwt.sign(
    {
      userId: user.id,
      sub: user.id,
      role: user.role,
    },
    config.jwt.secret,
    options,
  );

export const signRefreshJWT = (user: UserInterface, options: jwt.SignOptions) =>
  jwt.sign(
    {
      userId: user.id,
      sub: user.id,
      role: user.role,
    },
    config.jwt.refreshTokenSecret,
    options,
  );

export const extractTokenFromHeader = (req: Request) => {
  let { token } = req.query;
  if (
    !token &&
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  return token;
};

export async function seeder(req: Request, res: Response, next: NextFunction) {
  const user = await Container.get<UserService<UserInterface>>("user.service")
    .createUser(
      <UserInterface> {
        firstName: "Eden",
        lastName: "Hazard",
        password: "hazard10",
        email: "hazard@example.com",
      },
    );

  const question = await Container.get<QuestionService<QuestionInterface>>(
    "question.service",
  ).createQuestion(
    <QuestionInterface> {
      title: "Who is a Gopher?",
      body: "Who the heck are these gophers and occasional rustaceans!?!",
      tags: ["go", "rust"],
      user: user.id,
    },
  );
  const answer = await Container.get<AnswerService<AnswerInterface>>("answer.service")
    .createAnswer(
      <AnswerInterface> {
        text: "The gopher is the Go-to (pun intended)",
        question: question.id,
      },
    );
  res.json({ message: "data seeded successfully", data: { user, question, answer } });
}
