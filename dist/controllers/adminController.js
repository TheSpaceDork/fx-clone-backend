import Admin from "../models/Admin.js";
import { ErrorResponse, StatusCodes, SuccessResponse, } from "../utils/response.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
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
        const { _id, ...user } = newAdmin.toJSON();
        return res.json(SuccessResponse({ ...user }));
    }
    catch (err) {
        return res.status(400).json(ErrorResponse(err));
    }
};
export const login = async (req, res) => {
    try {
        const body = req.body;
        const admin = await Admin.findOne({ email: body.email }).select("password verified ");
        if (!admin) {
            return res
                .status(400)
                .json(ErrorResponse("admin not found or not verified"));
        }
        const correctPassword = await comparePassword(body.password, admin.password);
        if (!correctPassword) {
            return res.status(400).json(ErrorResponse("Wrong credentials"));
        }
        const { refreshToken } = signToken(admin.id, res);
        admin.refreshToken = refreshToken;
        await admin.save();
        const { _id, ...others } = admin.toJSON();
        return res.json(SuccessResponse({ ...others }));
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
