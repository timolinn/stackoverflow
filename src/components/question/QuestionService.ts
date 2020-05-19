import { Model, Document } from "mongoose";
import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";

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

  async findUserById(
    userId: string,
    includes?: Array<string>,
  ): Promise<T | null> {
    return this.question.findById(userId)
      .select(includes?.join(", "));
  }
}
