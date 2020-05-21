import { Model, Document } from "mongoose";
import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";
import { AppError, ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";
import { QuestionInterface } from "./questionModel";
import slugify from "slugify";
import { DecodedUser } from "../../helpers";
import { Voter, VoteType } from "../voter/Voter";

@Service("question.service")
export class QuestionService<T extends Document & QuestionInterface> {
  constructor(
    private question: Model<T>,
    private voter: Voter,
    @Inject("logger") private logger: LoggerInterface,
  ) {
  }

  async createQuestion(question: T): Promise<T> {
    const exists = await this.question.exists(
      { user: question.user, slug: slugify(question.title) },
    );
    if (exists) {
      throw new AppError(ErrorNames.BadRequestError, StatusCodes.BAD_REQUEST, {
        description: "user already asked this question",
        isOperational: true,
      });
    }
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

  async upvote(questionId: string, userId: string) {
    const question = await this.findQuestionById(questionId);
    await this.voter.cast(question!, userId, VoteType.Upvote);
    return question;
  }

  async downvote(questionId: string, userId: string) {
    const question = await this.findQuestionById(questionId);
    await this.voter.cast(question!, userId, VoteType.Downvote);
    return question;
  }
}
