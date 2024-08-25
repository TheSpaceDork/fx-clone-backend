import jwt from "jsonwebtoken";
import { StatusCodes, ErrorResponse } from "./response.js";
import User from "../models/User.js";
// import ms from "ms"
export const signToken = (id, res) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1y",
    });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
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
export const verifyToken = (req, res, next) => {
    if (req.url.includes("refresh")) {
        next();
    }
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(400).json(ErrorResponse("Token not found"));
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
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
        req.user = await User.findById(decoded.id);
        next();
    });
};
export const getUserFromToken = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        console.log(token);
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            if (decoded && decoded?.id) {
                req.user = await User.findById(decoded.id);
            }
            console.log(req.user, decoded);
        }
        return next();
    }
    catch (err) {
        return next();
    }
};
