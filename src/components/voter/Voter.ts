import mongoose from "mongoose";
import { AppError, ErrorNames } from "../../handlers/error";
import { StatusCodes } from "../../handlers/http";

export interface VotableInterface {
  totalUpvotes: number;
  totalDownvotes: number;
  upvote: (qualified: boolean, voterId: string) => Promise<VotableInterface>;
  downvote: (qualified: boolean, voterId: string) => Promise<VotableInterface>;
}

export interface QuestionVoterInterface extends mongoose.Document {
  user: string;
  question: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum VoteType {
  Upvote = 1,
  Downvote = 0
}

/**
 * Separating voter into a different
 * class gives room for centralized house keeping
 * for all Votable modules.
 */
export class Voter {

  public async cast(candidate: VotableInterface, voterId: string, type: VoteType) {

    if (type === VoteType.Upvote) {
      return await this.add(candidate, voterId);
    } else if (type === VoteType.Downvote) {
      return await this.remove(candidate, voterId);
    }

    throw new AppError(ErrorNames.InvalidVoteTypeError, StatusCodes.BAD_REQUEST, {
      description: "invalid vote type.",
      isOperational: true,
    });
  }

  public async add(candidate: VotableInterface, voter: string) {
    // TODO: Do house keeping, like checking if the voter is qualified to upvote
    const qualified = true;
    return candidate.upvote(qualified, voter);
  }

  public async remove(candidate: VotableInterface, voter: string) {
    // TODO: Do house keeping, like checking if the voter is qualified to downvote
    const qualified = true;
    return candidate.downvote(qualified, voter);
  }
}
