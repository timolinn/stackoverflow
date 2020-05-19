/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import slugify from "slugify";
import mongooseAutopopulate from "mongoose-autopopulate";
import { AnswerInterface, CommentSchema } from "../answer";

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

export interface QuestionInterface extends mongoose.Document {
  title: string;
  user: mongoose.Types.ObjectId;
  body: string;
  answers: Array<AnswerInterface>;
  slug: string;
  tags: Array<string>;
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

export const Question = mongoose.model<QuestionInterface>("Question", QuestionSchema);
