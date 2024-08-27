import { Router } from "express";
import {
  createPayment,
  paymentStatusWebHook,
  payoutStatusWebHook,
} from "../controllers/transactionController.js";
// import {
//   getBankCode,
//   confirmAccount,
// } from "../controllers/paymentController.js";

const transactionRoute = Router();

transactionRoute.post("/webhook", paymentStatusWebHook);
transactionRoute.post("/payout-webhook", payoutStatusWebHook);
transactionRoute.post("/create", createPayment);
transactionRoute.post("/withdraw", createPayment);
// transactionRoute.get("/:name?", gettransactionCode);
export default transactionRoute;
// //
