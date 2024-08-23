import User from "../models/User.js";
import { Request, Response } from "express";
import {
  ErrorResponse,
  StatusCodes,
  SuccessResponse,
} from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
      return res.status(400).json(ErrorResponse("User already exists"));
    }
    body.password = await hashPassword(body.password);
    const newUser = new User({ ...body });

    await newUser.save();
    const { _id, ...user } = newUser.toJSON();
    return res.json(SuccessResponse({ ...user }));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await User.findOne({ email: body.email }).select("password");
    if (!user) {
      return res
        .status(400)
        .json(ErrorResponse("User not found or not verified"));
    }

    const correctPassword = await comparePassword(body.password, user.password);
    if (!correctPassword) {
      return res.status(400).json(ErrorResponse("Wrong credentials"));
    }

    const { refreshToken } = signToken(user.id, res);

    user.refreshToken = refreshToken;
    await user.save();
    const { _id, ...others } = user.toJSON();
    return res.json(SuccessResponse({ ...others }));
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

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(StatusCodes.BadRequest)
        .json(ErrorResponse("Please provide an Id"));
    }
    const user = await User.findById(id);
    if (!user)
      return res
        .status(StatusCodes.NotFound)
        .json(ErrorResponse("User not found"));
    return res.status(StatusCodes.Accepted).json(SuccessResponse(user));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    return res.json(SuccessResponse("Account deleted"));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    // const deleted = await User.findByIdAndDelete(req.params.id);
    // return res.json(SuccessResponse("Account deleted"));
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};

export const verifyTransaction = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    return res.status(400).json(ErrorResponse(err));
  }
};
