import { Model, Document } from "mongoose";
import { Service, Inject } from "typedi";
import { LoggerInterface } from "../../util/logger";

@Service("answer.service")
export class AnswerService<T extends Document> {
  constructor(
    @Inject("answer.model") private answer: Model<T>,
    @Inject("logger") private logger: LoggerInterface,
  ) {
  }

  async createAnswer(answer: T): Promise<T> {
    return this.answer.create(answer);
  }

  async findUserById(
    userId: string,
    includes?: Array<string>,
  ): Promise<T | null> {
    return this.answer.findById(userId)
      .select(includes?.join(", "));
  }
}
