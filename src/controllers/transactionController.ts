import { Request, Response } from "express";
import { paymentApi } from "../app.js";
import Transaction from "../models/transaction.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.js";
import axios from "axios";
const paymentRootApi = axios.create({
  baseURL: "https://api.nowpayments.io/v1/",
  timeout: 10000,
  headers: { "x-api-key": paymentApi.apiKey },
  validateStatus: () => true,
});
export const createPayment = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const transaction = new Transaction({
      amount: body.amount,
      status: "pending",
      type: "deposit",
      date: new Date(),
      userId: req.user.id,
      narration: body.narration,
      currency: body.currency,
      address: req.user.address,
    });
    const payment = await paymentApi.createPayment({
      pay_currency: "ngn",
      price_currency: body.currency,
      price_amount: body.amount,
      order_id: transaction.id,
      ipn_callback_url: "https://fx-xoxa.onrender.com/transaction/webhook",
    });
    console.log(payment);
    await transaction.save();

    return res.json(SuccessResponse(payment));
  } catch (err) {
    console.log({ err });
    return err;
  }
};

export const createWithdrawRequest = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const transaction = new Transaction({
      amount: body.amount,
      status: "pending",
      type: "withdrawal",
      date: new Date(),
      userId: req.user.id,
      narration: body.narration,
      currency: body.currency,
      address: req.user.address,
    });
    if (!req.user.address) {
      return res
        .status(400)
        .json(
          ErrorResponse("Payout address required, please complete your profile")
        );
    }
    const payment = await paymentRootApi.post("/payout", {
      withdrawals: [
        {
          address: req.user.address,
          amount: body.amount,
          currency: body.currency,
        },
      ],
      ipn_callback_url:
        "https://fx-xoxa.onrender.com/transaction/payout-webhook",
    });

    // const payment = await paymentApi.createPayment({
    //   pay_currency: "ngn",
    //   price_currency: body.method,
    //   price_amount: body.amount,
    //   order_id: transaction.id,
    //   ipn_callback_url: "https://fx-xoxa.onrender.com/transaction/webhook",
    // });
    console.log(payment.data);
    await transaction.save();

    return res.json(SuccessResponse(payment.data));
  } catch (err) {
    console.log({ err });
    return err;
  }
};
// export const getPaymentStatus = async () => {
//   try {
//     const paymentStatus = await paymentApi.getPaymentStatus({
//       payment_id: "pay_2e7b4e4e-7b4e-4e2e-9b4e-2e4e7b4e2e4e",
//     });
//     console.log(paymentStatus);
//     return paymentStatus;
//   } catch (err) {
//     console.log({ err });
//     return err;
//   }
// };

export const paymentStatusWebHook = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const transaction = Transaction.findByIdAndUpdate(body.order_id, {
      status: body.payment_status,
    });
    console.log(transaction);
    console.log({ webhook: body });
    return;
  } catch (err) {
    console.log({ err });
  }
};
export const payoutStatusWebHook = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const transaction = Transaction.findOneAndUpdate(
      { address: body.address, amount: body.amount },
      {
        status: body.status,
      }
    );
    console.log(transaction);
    console.log({ webhook: body });
    return;
  } catch (err) {
    console.log({ err });
  }
};
export const getListOfPayment = async () => {
  try {
    const listOfPayment = await paymentApi.getListPayments({ limit: 1000 });
    return listOfPayment;
  } catch (err) {
    console.log({ err });
    return err;
  }
};
