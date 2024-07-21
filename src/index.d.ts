import "express";
import { Document } from "mongoose";
import { IUser } from "./models/User";
import { Types } from "mongoose";
declare module "express" {
  export interface Request {
    user?:
      | (Document<unknown, {}, IUser> &
          IUser & {
            _id: Types.ObjectId;
          })
      | null;
  }
}
