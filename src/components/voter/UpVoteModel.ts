/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import { QuestionVoterInterface } from "./Voter";
import mongooseAutopopulate from "mongoose-autopopulate";

const Schema = mongoose.Schema;

export const UpVoteSchema: mongoose.Schema<QuestionVoterInterface> = new Schema(
  {
    user: {
      type: {
        fullName: String,
        userID: mongoose.Types.ObjectId,
      },
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

UpVoteSchema.plugin(mongooseAutopopulate);

const UpVoter = mongoose.model<QuestionVoterInterface>("UpVoter", UpVoteSchema);

// Polymorphic models
// this makes it possible to save
// different models in the same table
// each records would differ by model
// This creates room to extend the upvoter module
// to add support for answer's voting
export const QuestionUpVote = UpVoter.discriminator<QuestionVoterInterface>(
  "QuestionUpVotes",
  new Schema({
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
  }, { discriminatorKey: "kind" }),
);
