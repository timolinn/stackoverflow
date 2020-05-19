import { Service, Inject } from "typedi";
import { QuestionInterface, QuestionService } from ".";
import { LoggerInterface } from "../../util/logger";
import { Request, Response, NextFunction } from "express";
import { success } from "../../middleware/response";
import { StatusCodes } from "../../handlers/http";
import { MailerInterface } from "../../services/Mailer";
import { DecodedUser } from "../../helpers";
import { AnswerInterface, AnswerService } from "../answer";

@Service("question.controller")
export class QuestionController {
  constructor(
    @Inject("question.service") private questionService: QuestionService<
    QuestionInterface
    >,
    @Inject("answer.service") private answerService: AnswerService<
    AnswerInterface
    >,
    @Inject("logger") private logger: LoggerInterface,
    @Inject("mailer") private mailer: MailerInterface
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const user = <DecodedUser> req.user;
    this.logger.info(user);
    const question = await this.questionService.createQuestion({...data, user: user.userId});
    return res.status(StatusCodes.OK).json(
      success(
        "new question created successfully",
        { kind: "Question", items: [question] },
      ),
    );
  };

  public get = async (req: Request, res: Response, next: NextFunction) => {
    const question = await this.questionService.findQuestionById(req.params.questionId);
    const answers = await this.answerService.findAnswerByQuestionId(req.params.questionId);
    return res.status(StatusCodes.OK).json(
      success(
        "question fetched successfully",
        { kind: "Question", items: [{...question?.toJSON(), answers }] },
      ),
    );
  };
}
