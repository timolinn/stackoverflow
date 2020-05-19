import { Model, Document } from "mongoose";
import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";
import { QuestionService, QuestionInterface } from "../question";
import { AnswerInterface } from "./answerModel";
import { AppError } from "../../handlers/error";
import { ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";

@Service("answer.service")
export class AnswerService<T extends Document> {
  constructor(
    @Inject("answer.model") private answer: Model<T>,
    @Inject("logger") private logger: LoggerInterface,
    @Inject("question.service") private questionService: QuestionService<QuestionInterface>,
  ) {
  }

  async createAnswer<A extends AnswerInterface>(answer: A): Promise<T> {
    const question = await this.questionService.findQuestionById(answer.question);
    if (!question) {
      throw new AppError(ErrorNames.ResourceNotFound, StatusCodes.NOT_FOUND, {
        description: "Sorry! we could not find that question",
        isOperational: true,
      });
    }
    return this.answer.create(answer);
  }

  async findAnswerById(
    userId: string,
    includes?: Array<string>,
  ): Promise<T | null> {
    const answer = await this.answer.findById(userId)
      .select(includes?.join(", "));

    if (!answer) {
      throw new AppError(ErrorNames.ResourceNotFound, StatusCodes.NOT_FOUND, {
        description: "Sorry! we could not find that question",
        isOperational: true,
      });
    }
    return answer;
  }
}
