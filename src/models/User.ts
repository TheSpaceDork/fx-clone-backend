import { Schema, Types, model } from "mongoose";

export interface IUser {
  id?: string;
  fullName: string;
  username: string;
  country: any;
  email: string;
  socialAccounts: { [key: string]: string }[];
  password: string;
  refreshToken: string;
  verified?: boolean;
  totalBalance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  lastWithdrawal: number;
  pendingWithdrawal: number;
  earnings: number;
  activeDeposit: number;
  lastDeposit: number;
  gender: string;
  dob: Date;
  age: number;
  maritalStatus: string;
  contact: number;
  city: string;
  zipCode: string;
  address: string;
  currency: string;
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
    username: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    country: {},
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
    totalBalance: {
      type: Number,
      default: 0,
    },
    activeDeposit: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    totalDeposit: {
      type: Number,
      default: 0,
    },
    totalWithdrawal: {
      type: Number,
      default: 0,
    },
    lastDeposit: {
      type: Number,
      default: 0,
    },
    lastWithdrawal: {
      type: Number,
      default: 0,
    },
    pendingWithdrawal: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
    },
    age: {
      type: Number,
    },
    city: {
      type: String,
    },
    contact: {},
    dob: {
      type: Date,
      default: new Date(1990),
    },
    gender: {
      type: String,
    },
    maritalStatus: {
      type: String,
      default: "single",
    },
    zipCode: {
      type: String,
      default: "22202",
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
