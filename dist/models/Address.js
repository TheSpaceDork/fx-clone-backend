import { Schema, model } from "mongoose";
const AddressSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});
// Transaction.index({ name: "text" });
const Address = model("address", AddressSchema);
export default Address;
