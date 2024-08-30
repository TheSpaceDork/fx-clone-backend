import { Schema, Types, model } from "mongoose";

const TransactionSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  narration: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  address: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
proof: {
    type: String,
    default: "",
  },
});

// Transaction.index({ name: "text" });

const Transaction = model("transaction", TransactionSchema);

export default Transaction;
