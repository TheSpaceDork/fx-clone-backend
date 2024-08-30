import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { StatusCodes, ErrorResponse } from "./response.js";
import User from "../models/User.js";
// import ms from "ms"

export const signToken = (id: Types.ObjectId, res: Response) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "1y",
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "1y",
  });
  res.cookie("accessToken", accessToken, {
    secure: false,
    httpOnly: true,
    partitioned: true,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    partitioned: true,
  });
  return { accessToken, refreshToken };
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.url.includes("refresh")) {
    next();
  }

  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json(ErrorResponse("Token not found"));
  }
  jwt.verify(token, process.env.JWT_ACCESS_SECRET!, async (err, decoded) => {
    if (err) {
      //   Check if's a expired Error
      if (err.name == "TokenExpiredError") {
        return res
          .status(StatusCodes.TokenExpired)
          .json(ErrorResponse("Token expired"));
      }
      return res
        .status(StatusCodes.BadRequest)
        .json(ErrorResponse("Invalid Token"));
    }
    req.user = await User.findById((decoded as { id: string }).id);
    next();
  });
};

export const getUserFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

      if (decoded && (decoded as { id: any })?.id) {
        req.user = await User.findById((decoded as { id: any }).id);
      }
    }
    return next();
  } catch (err) {
    console.log(err);
    return next();
  }
};
