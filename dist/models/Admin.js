import { Schema, model } from "mongoose";
const adminSchema = new Schema({
    email: {
        type: String,
        trim: true,
        match: /.+\@.+\..+/,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        // required: true,
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    account: {
        type: String,
        select: false,
    },
    refreshToken: {
        type: String,
    },
    otp: {
        type: Number,
    },
    percentage: {
        type: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
const Admin = model("Admin", adminSchema);
export default Admin;
