import "express";
import { Document } from "mongoose";
import { IUser } from "./models/User";
import { Types } from "mongoose";
interface ReqUser extends Document<Types.ObjectId, {}, IUser> {
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

declare module "express" {
  export interface Request {
    user?: ReqUser | null;
  }
}
