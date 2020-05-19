import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";
import { AnswerService, AnswerInterface } from ".";
import { Request, Response, NextFunction } from "express";
import { success } from "../../middleware/response";
import { StatusCodes } from "../../handlers/http";
import { MailerInterface } from "../../services/Mailer";
import { DecodedUser } from "../../helpers";

@Service("Answer.controller")
export class AnswerController {
  constructor(
    @Inject("answer.service") private answerService: AnswerService<
    AnswerInterface
    >,
    @Inject("logger") private logger: LoggerInterface,
    @Inject("mailer") private mailer: MailerInterface,
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const user = <DecodedUser> req.user;
    const answer = await this.answerService.createAnswer(
      { ...data, user: user.userId },
    );
    return res.status(StatusCodes.OK).json(
      success("new answer created", { kind: "Answer", items: [answer] }),
    );
  };
}
