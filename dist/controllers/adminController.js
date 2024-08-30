import Admin from "../models/Admin.js";
import { ErrorResponse, StatusCodes, SuccessResponse, } from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";
import axios from "axios";
import Transaction from "../models/transaction.js";
const paymentRootApi = axios.create({
    baseURL: "https://api.nowpayments.io/v1/",
    timeout: 10000,
    headers: { "x-api-key": process.env.NP_API_KEY },
    validateStatus: () => true,
});
export const signup = async (req, res) => {
    try {
        const body = req.body;
        const userExist = await Admin.findOne({ email: body.email });
        if (userExist) {
            return res.status(400).json(ErrorResponse("User already exists"));
        }
        body.password = await hashPassword(body.password);
        const newAdmin = new Admin({ ...body });
        await newAdmin.save();
        const { accessToken } = signToken(newAdmin.id, res);
        return res.json(SuccessResponse({ accessToken }));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const login = async (req, res) => {
    try {
        const body = req.body;
        const admin = await Admin.findOne({ email: body.email }).select("password ");
        if (!admin) {
            return res.status(400).json(ErrorResponse("admin not found"));
        }
        const correctPassword = await comparePassword(body.password, admin.password);
        if (!correctPassword) {
            return res.status(400).json(ErrorResponse("Wrong credentials"));
        }
        const { accessToken } = signToken(admin.id, res);
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
export const deleteAdmin = async (req, res) => {
    try {
        const deleted = await Admin.findByIdAndDelete(req.params.id);
        return res.json(SuccessResponse("Account deleted"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .limit(req.params?.limit ? +req.params?.limit : 999999999)
            .sort({ createdAt: -1 })
            .skip(req.params?.skip ? +req.params?.skip : 0);
        return res.json(SuccessResponse(users));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const getWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await Transaction.find({
            status: "pending",
            type: "withdrawal",
        })
            .limit(req.params.limit ? +req.params.limit : 999999999)
            .sort({ createdAt: -1 })
            .skip(req.params.skip ? +req.params.skip : 0);
        return res.json(SuccessResponse(withdrawalRequests));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const approveWithdrawalRequest = async (req, res) => {
    try {
        const withdrawalRequest = await Transaction.findById(req.params.id);
        if (!withdrawalRequest) {
            return res
                .status(400)
                .json(ErrorResponse("Withdrawal request not found"));
        }
        const user = await User.findById(withdrawalRequest.userId);
        if (!user) {
            return res
                .status(400)
                .json(ErrorResponse("User who made withdrawal request not found"));
        }
        withdrawalRequest.status = "approved";
        // payout
        user.lastWithdrawal = withdrawalRequest.amount;
        user.pendingWithdrawal = 0;
        await withdrawalRequest.save();
        await user.save();
        // Send the money to the user
        return res.json(SuccessResponse("Withdrawal request approved"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const rejectWithdrawalRequest = async (req, res) => {
    try {
        const withdrawalRequest = await Transaction.findById(req.params.id);
        if (!withdrawalRequest) {
            return res
                .status(400)
                .json(ErrorResponse("Withdrawal request not found"));
        }
        withdrawalRequest.status = "rejected";
        await withdrawalRequest.save();
        return res.json(SuccessResponse("Withdrawal request rejected"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const getDepositRequests = async (req, res) => {
    try {
        const depositRequests = await Transaction.find({
            status: "pending",
            type: "deposit",
        })
            .limit(req.params.limit ? +req.params.limit : 999999999)
            .sort({ createdAt: -1 })
            .skip(req.params.skip ? +req.params.skip : 0);
        return res.json(SuccessResponse(depositRequests));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const approveDepositRequest = async (req, res) => {
    try {
        const depositRequest = await Transaction.findById(req.params.id);
        if (!depositRequest) {
            return res.status(400).json(ErrorResponse("deposit request not found"));
        }
        const user = await User.findById(depositRequest.userId);
        if (!user) {
            return res
                .status(400)
                .json(ErrorResponse("User who made withdrawal request not found"));
        }
        depositRequest.status = "approved";
        // Send the money to the user
        user.lastDeposit = depositRequest.amount;
        user.activeDeposit = 0;
        await depositRequest.save();
        await user.save();
        return res.json(SuccessResponse("deposit request approved"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const rejectDepositRequest = async (req, res) => {
    try {
        const depositRequest = await Transaction.findById(req.params.id);
        if (!depositRequest) {
            return res.status(400).json(ErrorResponse("deposit request not found"));
        }
        depositRequest.status = "rejected";
        await depositRequest.save();
        return res.json(SuccessResponse("deposit request rejected"));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const addToBalance = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id);
        if (!user)
            return res.status(400).json(ErrorResponse("User not found"));
        user.totalBalance = user.totalBalance + req.body.amount;
        await user.save();
        return res.json(SuccessResponse(user));
    }
    catch (error) {
        return res.status(400).json(ErrorResponse(error));
    }
};
export const removeFromBalance = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id);
        if (!user)
            return res.status(400).json(ErrorResponse("User not found"));
        user.totalBalance = user.totalBalance - req.body.amount;
        await user.save();
        return res.json(SuccessResponse(user));
    }
    catch (error) {
        return res.status(400).json(ErrorResponse(error));
    }
};
