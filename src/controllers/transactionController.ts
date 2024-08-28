import { Request, Response } from "express";
import { paymentApi } from "../app.js";
import Transaction from "../models/transaction.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.js";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const transaction = new Transaction({
      amount: body.amount,
      status: "pending",
      type: "deposit",
      date: new Date(),
      userId: req.user!.id,
      narration: body.narration,
      currency: body.currency,
      address: req.user!.address,
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
    req.user!.activeDeposit = transaction.amount;
    await req.user!.save();

    return res.json(SuccessResponse(payment));
  } catch (err) {
    console.log({ err });
    return res.status(400).json(ErrorResponse(err));
  }
};

export const createWithdrawRequest = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!req.user!.address) {
      return res
        .status(400)
        .json(
          ErrorResponse("Payout address required, please complete your profile")
        );
    }
    const TransactionDocs = await Transaction.find({
      userId: req.user!.id,
    });

    const totalDeposit = TransactionDocs.reduce(
      (prev, curr) => {
        if (curr.type === "deposit") {
          return prev + curr.amount;
        }
        return prev;
      },
      TransactionDocs[0].type === "deposit" ? TransactionDocs[0].amount : 0
    );
    const totalWithdrawal = TransactionDocs.reduce(
      (prev, curr) => {
        if (curr.type === "withdrawal") {
          return prev + curr.amount;
        }
        return prev;
      },
      TransactionDocs[0].type === "withdrawal" ? TransactionDocs[0].amount : 0
    );

    req.user!.totalDeposit = totalDeposit;
    req.user!.totalWithdrawal = totalWithdrawal;

    if (totalDeposit < body.amount) {
      return res
        .status(400)
        .json(ErrorResponse("Withdrawal amount is greater than your balance"));
    }

    const transaction = new Transaction({
      amount: body.amount,
      status: "pending",
      type: "withdrawal",
      date: new Date(),
      userId: req.user!.id,
      narration: body.narration,
      currency: body.currency,
      address: req.user!.address,
    });

    await transaction.save();
    req.user!.pendingWithdrawal = body.amount;
    await req.user!.save();

    return res.json(SuccessResponse(transaction));
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

    const transaction = await Transaction.findByIdAndUpdate(body.order_id, {
      status: body.payment_status,
    });
    if (!transaction) {
      console.log({
        err: `Transaction with id of ${body.order_id} not found `,
      });
      return;
    }
    if (body.payment_status === "finished") {
      req.user!.lastDeposit = transaction.amount;
      if (req.user!.activeDeposit === transaction.amount) {
        //No new active deposit
        req.user!.activeDeposit = 0;
      }
      await req.user!.save();
    }
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

    const transaction = await Transaction.findOneAndUpdate(
      { address: body.address, amount: body.amount },
      {
        status: body.status,
      }
    );
    console.log(transaction);
    if (!transaction) {
      console.log({
        err: `Transaction with id of ${body.order_id} not found `,
      });
      return;
    }
    if (body.status === "finished") {
      req.user!.lastWithdrawal = transaction.amount;
      if (req.user!.pendingWithdrawal === transaction.amount) {
        //No new active deposit
        req.user!.pendingWithdrawal = 0;
      }
      req.user!.totalBalance = req.user!.totalBalance - transaction.amount;
      await req.user!.save();
    }
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
