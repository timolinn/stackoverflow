import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";
import { AnswerService, AnswerInterface } from ".";
import { Request, Response, NextFunction } from "express";
import { success } from "../../middleware/response";
import { StatusCodes } from "../../handlers/http";
import { MailerInterface } from "../../services/Mailer";
import { DecodedUser } from "../../helpers";
import { QuestionService, QuestionInterface } from "../question";
import { AppError, ErrorNames } from "../../handlers/error";

@Service("Answer.controller")
export class AnswerController {
  constructor(
    @Inject("answer.service") private answerService: AnswerService<
    AnswerInterface
    >,
    @Inject("question.service") private questionService: QuestionService<
    QuestionInterface
    >,
    @Inject("logger") private logger: LoggerInterface,
    @Inject("mailer") private mailer: MailerInterface,
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const question = await this.questionService.findQuestionById(data.question);
    if (!question) {
      return next(new AppError(ErrorNames.ResourceNotFound, StatusCodes.NOT_FOUND, {
        description: "Sorry! we could not find that question",
        isOperational: true,
      }));
    }
    const user = <DecodedUser> req.user;
    const answer = await this.answerService.createAnswer(
      { ...data, user: user.userId },
    );
    return res.status(StatusCodes.OK).json(
      success("new answer created", { kind: "Answer", items: [answer] }),
    );
  };
}
