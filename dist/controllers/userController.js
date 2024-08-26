import User from "../models/User.js";
import { ErrorResponse, StatusCodes, SuccessResponse, } from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
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
        const { _id, password, ...user } = newUser.toJSON();
        return res.json(SuccessResponse({ ...user }));
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
            return res
                .status(400)
                .json(ErrorResponse("User not found or not verified"));
        }
        const correctPassword = await comparePassword(body.password, user.password);
        if (!correctPassword) {
            return res.status(400).json(ErrorResponse("Wrong credentials"));
        }
        const { refreshToken, accessToken } = signToken(user.id, res);
        user.refreshToken = refreshToken;
        await user.save();
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
        console.log("wtf", req.user);
        if (!req.user) {
            console.log("why");
            return res
                .status(StatusCodes.NotFound)
                .json(ErrorResponse("User not found"));
        }
        return res.status(StatusCodes.Success).json(SuccessResponse(req.user));
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
            console.log(user);
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
