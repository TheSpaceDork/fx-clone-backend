import { Router } from "express";
import {
  createPayment,
  paymentStatusWebHook,
  payoutStatusWebHook,
} from "../controllers/transactionController.js";
import { verifyToken } from "../utils/jwt.js";
// import {
//   getBankCode,
//   confirmAccount,
// } from "../controllers/paymentController.js";

const transactionRoute = Router();

transactionRoute.post("/webhook", paymentStatusWebHook);
transactionRoute.post("/payout-webhook", payoutStatusWebHook);
transactionRoute.use(verifyToken);
/**
 * @swagger
 * /transaction/create:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               narration:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
transactionRoute.post("/create", createPayment);
/**
 * @swagger
 * /transaction/withdraw:
 *   post:
 *     summary: Create a new withdrawal transaction
 *     description: Create a new withdrawal transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               narration:
 *                 type: string
 *     responses:
 *       200:
 *         description: Withdrawal transaction created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
transactionRoute.post("/withdraw", createPayment);
// transactionRoute.get("/:name?", gettransactionCode);
export default transactionRoute;
// //
