import { Model, Document } from "mongoose";
import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";
import { QuestionService, QuestionInterface } from "../question";
import { AnswerInterface } from "./answerModel";
import { AppError } from "../../handlers/error";
import { ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";
import { Voter } from "../voter/Voter";

@Service("answer.service")
export class AnswerService<T extends Document & AnswerInterface> {
  constructor(
    private answer: Model<T>,
    private voter: Voter,
    @Inject("logger") private logger: LoggerInterface,
  ) {
  }

  async createAnswer(answer: T): Promise<T> {
    const exists = await this.answer.exists(
      { user: answer.user, question: answer.question },
    );

    if (exists) {
      throw new AppError(ErrorNames.BadRequestError, StatusCodes.BAD_REQUEST, {
        description: "user already answered this question",
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

  async findAnswerByQuestionId(questionId: string): Promise<Array<T>> {
    return this.answer.find({ question: questionId });
  }
}
