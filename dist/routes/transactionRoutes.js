import { Router } from "express";
import { createPayment, paymentStatusWebHook, } from "../controllers/transactionController.js";
// import {
//   getBankCode,
//   confirmAccount,
// } from "../controllers/paymentController.js";
const transactionRoute = Router();
transactionRoute.post("/webhook", paymentStatusWebHook);
transactionRoute.post("/create", createPayment);
// transactionRoute.get("/:name?", gettransactionCode);
export default transactionRoute;
// //
