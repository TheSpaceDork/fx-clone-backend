import { Schema, Types, model } from "mongoose";

export interface IUser {
  id?: string;
  fullName: string;
  username: string;
  country: string;
  email: string;
  socialAccounts: { [key: string]: string }[];
  password: string;
  refreshToken: string;
  verified?: boolean;
  balance: number;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    socialAccounts: {},
    password: {
      type: String,
      select: false,
      required: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next();
  }
});
const User = model("User", userSchema);

export default User;
