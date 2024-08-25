import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        match: /.+\@.+\..+/,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        trim: true,
        required: true,
    },
    country: {
        type: String,
        trim: true,
    },
    socialAccounts: {},
    password: {
        type: String,
        select: false,
        required: true,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    balance: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
userSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new Error("There was a duplicate key error"));
    }
    else {
        next();
    }
});
const User = model("User", userSchema);
export default User;
