import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

// Transaction.index({ name: "text" });

const Transaction = model("transaction", TransactionSchema);

export default Transaction;
