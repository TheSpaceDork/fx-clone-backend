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
    country: {},
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
    totalBalance: {
        type: Number,
        default: 0,
    },
    activeDeposit: {
        type: Number,
        default: 0,
    },
    earnings: {
        type: Number,
        default: 0,
    },
    totalDeposit: {
        type: Number,
        default: 0,
    },
    totalWithdrawal: {
        type: Number,
        default: 0,
    },
    lastDeposit: {
        type: Number,
        default: 0,
    },
    lastWithdrawal: {
        type: Number,
        default: 0,
    },
    pendingWithdrawal: {
        type: Number,
        default: 0,
    },
    address: {
        type: String,
        default: "",
    },
    age: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    contact: {},
    dob: {
        type: Date,
        default: new Date(1990),
    },
    gender: {
        type: String,
        default: "",
    },
    facebook: {
        type: String,
        default: "",
    },
    twitter: {
        type: String,
        default: "",
    },
    instagram: {
        type: String,
        default: "",
    },
    whatsapp: {
        type: String,
        default: "",
    },
    marital: {
        type: String,
        default: "",
    },
    zipCode: {
        type: String,
        default: "",
    },
    idFront: {},
    idBack: {},
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
