import User from "../models/User.js";
import { ErrorResponse, StatusCodes, SuccessResponse, } from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import Transaction from "../models/transaction.js";
export const signup = async (req, res) => {
    try {
        const body = req.body;
        const userExist = await User.findOne({ email: body.email });
        if (userExist) {
            return res.status(400).json(ErrorResponse("User already exists"));
        }
        body.password = await hashPassword(body.password);
        const newUser = new User({ ...body });
        await newUser.save();
        const { accessToken } = signToken(newUser.id, res);
        return res.json(SuccessResponse({ accessToken }));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const login = async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findOne({ username: body.username }).select("password");
        if (!user) {
            return res.status(400).json(ErrorResponse("User not found"));
        }
        const correctPassword = await comparePassword(body.password, user.password);
        if (!correctPassword) {
            return res.status(400).json(ErrorResponse("Wrong credentials"));
        }
        const { accessToken } = signToken(user.id, res);
        return res.json(SuccessResponse({ accessToken }));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const logout = async (req, res) => {
    try {
        if (!req.user) {
            return res
                .status(StatusCodes.NotFound)
                .json(ErrorResponse("User not found"));
        }
        req.user.refreshToken = "";
        req.user.save();
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.json(SuccessResponse("User logged out"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res
                .status(StatusCodes.NotFound)
                .json(ErrorResponse("User not found"));
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
        req.user.totalBalance = totalDeposit - totalWithdrawal;
        await req.user.save();
        return res.status(StatusCodes.Success).json(SuccessResponse(req.user));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const getUserHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res
                .status(StatusCodes.NotFound)
                .json(ErrorResponse("User not found"));
        }
        const history = await Transaction.find({ userId: req.user.id });
        if (history.length === 0 && process.env.NODE_ENV === "development") {
            return res.status(StatusCodes.Success).json(SuccessResponse([
                {
                    id: 1,
                    type: "Deposit",
                    method: "Bitcoin",
                    amount: 1000,
                    status: "Success",
                    dummy: true,
                    data: new Date(),
                    narration: "Deposit for new business",
                },
                {
                    id: 2,
                    type: "Withdrawal",
                    method: "Etc",
                    amount: 1000,
                    status: "Success",
                    dummy: true,
                    data: new Date(),
                    narration: "Withdrawal for new business",
                },
            ]));
        }
        return res.status(StatusCodes.Success).json(SuccessResponse(history));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        return res.json(SuccessResponse("Account deleted"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const verifyUser = async (req, res) => {
    try {
        if (!req.user) {
            return res
                .status(StatusCodes.NotFound)
                .json(ErrorResponse("User not found"));
        }
        const user = await User.findByIdAndUpdate(req.user.id, { ...req.body, verified: true }, { returnDocument: "after" });
        if (user) {
            const { id, password, ...others } = user.toJSON();
            return res
                .status(StatusCodes.Success)
                .json(SuccessResponse({ ...others }));
        }
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const verifyTransaction = async (req, res) => {
    try {
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
