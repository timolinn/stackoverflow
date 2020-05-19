/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import validator from "validator";

export interface CommentInterface extends mongoose.Document {
  answer: mongoose.Types.ObjectId;
  user: { fullName: string; userID: mongoose.Types.ObjectId };
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerInterface extends mongoose.Document {
  text: string;
  user: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  comments: Array<CommentInterface>;
  createdAt: Date;
  updatedAt: Date;
}

const Schema = mongoose.Schema;

export const CommentSchema: mongoose.Schema<CommentInterface> = new Schema({
  text: String,
  user: {
    type: {
      fullName: String,
      userID: mongoose.Types.ObjectId,
    },
    required: true,
  },
  answer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Answer",
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

export const AnswerSchema: mongoose.Schema<AnswerInterface> = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  question: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Question",
  },
  comments: {
    type: [CommentSchema],
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

export const Answer = mongoose.model<AnswerInterface>("Answer", AnswerSchema);
export const Comment = mongoose.model<CommentInterface>("Comment", CommentSchema);
