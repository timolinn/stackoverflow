/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import mongooseAutopopulate from "mongoose-autopopulate";
import { QuestionVoterInterface } from "./Voter";

const Schema = mongoose.Schema;

export const DownVoteSchema: mongoose.Schema<QuestionVoterInterface> =
  new Schema({
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  }, {
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
  });

DownVoteSchema.plugin(mongooseAutopopulate);

const DownVoter = mongoose.model<QuestionVoterInterface>(
  "DownVoter",
  DownVoteSchema,
);

// Polymorphic models
// this makes it possible to save
// different models in the same table
// each records would differ by model
// This creates room to extend the upvoter module
// to add support for answer's voting
export const QuestionDownVote = DownVoter.discriminator<
QuestionVoterInterface
>(
  "QuestionDownVotes",
  new Schema({
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
  }, { discriminatorKey: "kind" }),
);
