import Transaction from "../models/transaction.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.js";
import Address from "../models/Address.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: process.env.NODE_ENV === "production" ? true : false,
});
export const createPayment = async (req, res) => {
    try {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: "image",
        };
        if (!req.file) {
            return res.status(400).json(ErrorResponse("Proof of payment required"));
        }
        // Upload the image
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, options);
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
            proof: result.url,
            email: req.user.email,
            username: req.user.username,
            ...body,
        });
        await transaction.save();
        req.user.activeDeposit = transaction.amount;
        await req.user.save();
        return res.json(SuccessResponse(transaction));
    }
    catch (err) {
        console.log({ err });
        return res.status(400).json(ErrorResponse(err));
    }
};
export const getAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ code: req.params.code });
        return res.json(SuccessResponse(address));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const createWithdrawRequest = async (req, res) => {
    try {
        const body = req.body;
        if (!req.user.address) {
            return res
                .status(400)
                .json(ErrorResponse("Payout address required, please complete your profile"));
        }
        const TransactionDocs = await Transaction.find({
            userId: req.user.id,
        });
        const totalDeposit = TransactionDocs.reduce((prev, curr) => {
            if (curr.type === "deposit") {
                return prev + curr.amount;
            }
            return prev;
        }, TransactionDocs[0].type === "deposit" ? TransactionDocs[0].amount : 0);
        const totalWithdrawal = TransactionDocs.reduce((prev, curr) => {
            if (curr.type === "withdrawal") {
                return prev + curr.amount;
            }
            return prev;
        }, TransactionDocs[0].type === "withdrawal" ? TransactionDocs[0].amount : 0);
        req.user.totalDeposit = totalDeposit;
        req.user.totalWithdrawal = totalWithdrawal;
        if (req.user.totalBalance < body.amount) {
            return res
                .status(400)
                .json(ErrorResponse("Withdrawal amount is greater than your balance"));
        }
        const transaction = new Transaction({
            amount: body.amount,
            status: "pending",
            type: "withdrawal",
            date: new Date(),
            userId: req.user.id,
            narration: body.narration,
            currency: body.currency,
            address: req.user.address,
            email: req.user.email,
            username: req.user.username,
        });
        await transaction.save();
        req.user.pendingWithdrawal = body.amount;
        await req.user.save();
        return res.json(SuccessResponse(transaction));
    }
    catch (err) {
        console.log({ err });
        return err;
    }
};
export const paymentStatusWebHook = async (req, res) => {
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
            req.user.lastDeposit = transaction.amount;
            if (req.user.activeDeposit === transaction.amount) {
                //No new active deposit
                req.user.activeDeposit = 0;
            }
            await req.user.save();
        }
        console.log(transaction);
        console.log({ webhook: body });
        return;
    }
    catch (err) {
        console.log({ err });
    }
};
export const payoutStatusWebHook = async (req, res) => {
    try {
        const body = req.body;
        const transaction = await Transaction.findOneAndUpdate({ address: body.address, amount: body.amount }, {
            status: body.status,
        });
        console.log(transaction);
        if (!transaction) {
            console.log({
                err: `Transaction with id of ${body.order_id} not found `,
            });
            return;
        }
        if (body.status === "finished") {
            req.user.lastWithdrawal = transaction.amount;
            if (req.user.pendingWithdrawal === transaction.amount) {
                //No new active deposit
                req.user.pendingWithdrawal = 0;
            }
            req.user.totalBalance = req.user.totalBalance - transaction.amount;
            await req.user.save();
        }
        console.log({ webhook: body });
        return;
    }
    catch (err) {
        console.log({ err });
    }
};
