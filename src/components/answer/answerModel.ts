/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import mongooseAutopopulate from "mongoose-autopopulate";

export interface CommentInterface extends mongoose.Document {
  answer: string;
  user: { fullName: string; userID: string };
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerInterface extends mongoose.Document {
  text: string;
  user: string;
  question: string;
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
    autopopulate: {
      select: [
        "firstName",
        "lastName",
        "email",
        "id",
      ],
    },
  },
  question: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Question",
    autopopulate: {
      select: [
        "title",
        "body",
        "slug",
      ],
    },
  },
  accepted: {
    type: Boolean,
    default: false,
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

CommentSchema.plugin(mongooseAutopopulate);
AnswerSchema.plugin(mongooseAutopopulate);

export const Answer = mongoose.model<AnswerInterface>("Answer", AnswerSchema);
export const Comment = mongoose.model<CommentInterface>(
  "Comment",
  CommentSchema,
);
