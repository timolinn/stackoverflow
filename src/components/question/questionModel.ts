/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import slugify from "slugify";
import mongooseAutopopulate from "mongoose-autopopulate";
import { CommentSchema, CommentInterface } from "../answer";
import { VotableInterface } from "../voter/Voter";
import { QuestionUpVote, QuestionDownVote } from "../voter";

const Schema = mongoose.Schema;
export const QuestionSchema: mongoose.Schema<QuestionInterface> = new Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
    autopopulate: {
      select: [
        "firstName",
        "lastName",
        "email",
        "id",
      ],
    },
  },
  body: {
    type: String,
    required: true,
  },
  comments: [CommentSchema],
  slug: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  views: Number,
  totalUpvotes: {
    type: Number,
    default: 0,
  },
  totalDownvotes: {
    type: Number,
    default: 0,
  },
}, { timestamps: true, toJSON: {
  virtuals: true,
  transform(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
}, toObject: {
  virtuals: true,
  transform(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
} });

export interface QuestionInterface extends mongoose.Document, VotableInterface {
  title: string;
  user: mongoose.Types.ObjectId;
  body: string;
  slug: string;
  tags: Array<string>;
  comments: Array<CommentInterface>;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// Slugify question's title
QuestionSchema.pre<QuestionInterface>("save", function(next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title);
  next();
});

// Slugify question's title
// This is to prevent validation errors
QuestionSchema.pre<QuestionInterface>("validate", function(next) {
  this.slug = slugify(this.title);
  next();
});

QuestionSchema.plugin(mongooseAutopopulate);

QuestionSchema.methods = <QuestionInterface> {
  async upvote(qualified: boolean, userId: string): Promise<VotableInterface> {
    const data = {
      question: this.id,
      user: userId,
    };

    const vote = await QuestionUpVote.findOne(data);
    if (!vote) {
      await QuestionUpVote.create(data);
    } else {
      vote.count += 1;
      vote.save();
    }

    if (qualified) {
      this.totalDownvotes++;
      await this.save();
    }

    return this;
  },
  async downvote(qualified: boolean, userId: string): Promise<VotableInterface> {
    const data = {
      question: this.id,
      user: userId,
    };

    const vote = await QuestionDownVote.findOne(data);
    if (!vote) {
      await QuestionDownVote.create(data);
    } else {
      vote.count++;
      vote.save();
    }

    if (qualified) {
      this.totalDownvotes--;
      await this.save();
    }

    return this;
  },
};

export const Question = mongoose.model<QuestionInterface>("Question", QuestionSchema);
