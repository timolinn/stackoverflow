import { User, UserInterface } from "./UserModel";
import { Model, Document, Query } from "mongoose";
import { Service } from "typedi";
import {logger} from "../../util/logger";

@Service("user.service")
export default class UserService<T extends Document> {
  constructor(private user: Model<T>) {

  }

  async createUser(user: T): Promise<T> {
    return (await this.user.create(user)).set("password", null);
  }

  async findUserById(userId: string, includes?: Array<string>): Promise<T | null> {
    return this.user.findById(userId)
      .select(includes?.join(", "));
  }
  async findUserByEmail(email: string): Promise<T | null> {
    return this.user.findOne({ email }).select("+password");
  }
}
