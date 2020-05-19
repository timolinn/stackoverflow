import { Model, Document } from "mongoose";
import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";
import { AppError, ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";

@Service("question.service")
export class QuestionService<T extends Document> {
  constructor(
    @Inject("question.model") private question: Model<T>,
    @Inject("logger") private logger: LoggerInterface,
  ) {
  }

  async createQuestion(question: T): Promise<T> {
    return this.question.create(question);
  }

  async findQuestionById(
    questionId: string,
    includes?: Array<string>,
  ): Promise<T | null> {
    const question = await this.question.findById(questionId)
      .select(includes?.join(", "));

    if (!question) {
      throw new AppError(ErrorNames.ResourceNotFound, StatusCodes.NOT_FOUND, {
        description: "Sorry! we could not find that question",
        isOperational: true,
      });
    }
    return question;
  }
}
