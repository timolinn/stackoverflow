import { Service, Inject } from "typedi";
import { QuestionInterface, QuestionService } from ".";
import { LoggerInterface } from "../../util/logger";
import { Request, Response, NextFunction } from "express";
import { success } from "../../middleware/response";
import { StatusCodes } from "../../handlers/http";
import { MailerInterface } from "../../services/Mailer";
import { UserInterface } from "../user/userModel";
import { DecodedUser } from "../../helpers";

@Service("question.controller")
export class QuestionController {
  constructor(
    @Inject("question.service") private questionService: QuestionService<
    QuestionInterface
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
    const question = await this.questionService.findUserById(req.params.question);
    return res.status(StatusCodes.OK).json(
      success(
        "question fetched successfully",
        { kind: "Question", items: [question] },
      ),
    );
  };
}
