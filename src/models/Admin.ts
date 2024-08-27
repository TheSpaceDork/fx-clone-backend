import { Schema, Types, model } from "mongoose";

export interface IAdmin {
  name: string;
  email: string;
  phone: string;
  type?: "sub";
  password: string;
  account?: string;
  percentage: number;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      // required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema);
export default Admin;
