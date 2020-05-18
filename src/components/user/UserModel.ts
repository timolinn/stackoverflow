/* eslint-disable no-underscore-dangle */
/* eslint-disable id-blacklist */
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt-nodejs";
import { signJWT, signRefreshJWT } from "../../helpers";
import config from "../../config";
import uuid from "uuid";

enum Gender {
  Male = 1,
  Female = 0,
  Other = 2
}

const Schema = mongoose.Schema;
export const UserSchema: mongoose.Schema<UserInterface> = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    required: "Please enter your email address",
  },
  password: {
    type: String,
    required: "You must enter a password",
    trim: true,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "paiduser", "reviewer", "admin"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: Number,
    enum: [0, 1, 2],
  },
  refreshToken: String,
  lastLogin: String,
  lastLogout: String,
  userAgent: String,
  loginAttempts: String,
  ipAddress: String,
  avatar: String,
  twitter: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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

export interface UserInterface extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  active: boolean;
  isVerified: boolean;
  role: "user" | "paiduser" | "reviewer" | "admin";
  refreshToken?: string;
  lastLogin?: string;
  loginAttempts?: string;
  ipAddress?: string;
  avatar?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  resetPasswordToken?: string;
  gender?: Gender;
  resetPasswordExpires?: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: () => string;
  encryptPassword: (plainText: string) => string;
  comparePassword: (password: string) => boolean;
  serializeAuthenticatedUser: () => {
    id: any; email: string; isVerified: boolean; fullName: string;
    accessToken: string; refreshToken: string;
  };
}

// Hash password
UserSchema.pre<UserInterface>("save", function(next) {
  if (!this.isModified("password")) return next();
  this.password = this.encryptPassword(this.password);
  next();
});

UserSchema.methods = <UserInterface> {
  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  },
  encryptPassword: (plainTextWord: string) => {
    if (!plainTextWord) return "";
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainTextWord, salt);
  },
  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  },
  serializeAuthenticatedUser() {
    const jti = uuid.v4();
    return {
      id: this.id,
      email: this.email,
      isVerified: this.isVerified,
      fullName: this.fullName(),
      accessToken: signJWT(this, { expiresIn: config.jwt.expiresIn, jwtid: jti }),
      refreshToken: signRefreshJWT(this, { expiresIn: config.jwt.refreshTokenExpiresIn,
        jwtid: jti }),
    };
  },
};

export const User = mongoose.model<UserInterface>("User", UserSchema);
