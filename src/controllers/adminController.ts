import Admin from "../models/Admin.js";
import { Request, Response } from "express";
import {
  ErrorResponse,
  StatusCodes,
  SuccessResponse,
} from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Withdrawal from "../models/Withdrawal.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userExist = await Admin.findOne({ username: body.username });
    if (userExist) {
      return res.status(400).json(ErrorResponse("User already exists"));
    }
    body.password = await hashPassword(body.password);
    const newAdmin = new Admin({ ...body });
    await newAdmin.save();
    const { accessToken } = signToken(newAdmin.id, res);
    return res.json(SuccessResponse({ accessToken }));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const admin = await Admin.findOne({ username: body.username }).select(
      "password "
    );
    if (!admin) {
      return res.status(400).json(ErrorResponse("admin not found"));
    }

    const correctPassword = await comparePassword(
      body.password,
      admin.password
    );
    if (!correctPassword) {
      return res.status(400).json(ErrorResponse("Wrong credentials"));
    }

    const { accessToken } = signToken(admin.id, res);
    return res.json(SuccessResponse({ accessToken }));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const logout = async (req: Request, res: Response) => {
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
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};
export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    return res.json(SuccessResponse("Account deleted"));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .limit(req.params.limit ? +req.params.limit : 999999999)
      .sort({ createdAt: -1 })
      .skip(req.params.skip ? +req.params.skip : 0);
    return res.json(SuccessResponse(users));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const getWithdrawalRequests = async (req: Request, res: Response) => {
  try {
    const withdrawalRequests = await Withdrawal.find({ status: "pending" })
      .limit(req.params.limit ? +req.params.limit : 999999999)
      .sort({ createdAt: -1 })
      .skip(req.params.skip ? +req.params.skip : 0);
    return res.json(SuccessResponse(withdrawalRequests));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const approveWithdrawalRequest = async (req: Request, res: Response) => {
  try {
    const withdrawalRequest = await Withdrawal.findById(req.params.id);
    if (!withdrawalRequest) {
      return res
        .status(400)
        .json(ErrorResponse("Withdrawal request not found"));
    }
    withdrawalRequest.status = "approved";
    await withdrawalRequest.save();
    // Send the money to the user
    return res.json(SuccessResponse("Withdrawal request approved"));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const rejectWithdrawalRequest = async (req: Request, res: Response) => {
  try {
    const withdrawalRequest = await Withdrawal.findById(req.params.id);
    if (!withdrawalRequest) {
      return res
        .status(400)
        .json(ErrorResponse("Withdrawal request not found"));
    }
    withdrawalRequest.status = "rejected";
    await withdrawalRequest.save();

    return res.json(SuccessResponse("Withdrawal request rejected"));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};
