import { Schema, model } from "mongoose";

const WithdrawalSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  method: {
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
});

// Transaction.index({ name: "text" });

const Withdrawal = model("withdrawal", WithdrawalSchema);

export default Withdrawal;
