// import Joi from "joi";
// import { IUser } from "../models/User.js";
// import { IEvent } from "../models/Event.js";
// import { Types } from "mongoose";
// import { ICartItem } from "../models/CartItem.js";
// import { ICart } from "../models/Cart.js";

// const validate = <T>(input: T, schema: Joi.ObjectSchema<T>) => {
//   const result = schema.validate(input);
//   if (result.error) {
//     throw Error(result.error.message);
//   } else return result.value;
// };
// type Signup = {
//   name: string;
//   phone: string;
//   password: string;
//   email: string;
//   type: "Buyer" | "Vendor" | "Moderator";
//   otp?: number;
// };

// type Login = {
//   email: string;
//   password: string;
//   phone?: string;
// };
// type Verify = {
//   otp: number;
//   email: string;
//   admin?: boolean;
// };

// type Ticket = {
//   eventId: string;
//   expires: string;
//   prices: {
//     ticketType: "VIP" | "Regular" | "Gold" | "Platinum" | "Diamond" | "Free";
//     price: number;
//     quantity: number;
//   }[];
// };

// export const validateSignup = (input: Signup) => {
//   const schema = Joi.object<Signup, true>({
//     phone: Joi.string()
//       .pattern(new RegExp("^[0-9]{3,15}$"))
//       .required()
//       .min(10)
//       .max(13)
//       .error((err) => {
//         console.log({ err });
//         return new Error("Phone must be formatted like this: 08112345678");
//       }),
//     password: Joi.string()
//       .min(8)
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error(
//           "Password must be minimum of 8 letters and it's required"
//         );
//       }),
//     email: Joi.string()
//       .email()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Email must be valid");
//       }),
//     name: Joi.string()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Name is required");
//       }),
//     type: Joi.string()
//       .allow("Buyer", "Vendor", "Moderator")
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Type can only be Buyer, Vendor or Moderator");
//       }),
//     otp: Joi.number(),
//   });

//   return validate<Signup>(input, schema);
// };
// export const validateLogin = (input: Login) => {
//   const schema = Joi.object<Login, true>({
//     phone: Joi.string()
//       .pattern(new RegExp("^[0-9]{3,15}$"))
//       .min(10)
//       .max(13)
//       .error((err) => {
//         console.log({ err });
//         return new Error("Phone must be formatted like this: 08112345678");
//       }),
//     password: Joi.string()
//       .min(8)
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error(
//           "Password must be minimum of 8 letters and it's required"
//         );
//       }),
//     email: Joi.string()
//       .email()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Email must be valid");
//       }),
//   });

//   return validate<Login>(input, schema);
// };

// export const validateVerify = (input: Verify) => {
//   const schema = Joi.object<Verify, true>({
//     email: Joi.string().error((err) => {
//       console.log({ err });
//       return new Error("Email must be valid");
//     }),
//     otp: Joi.number().required(),
//     admin: Joi.boolean(),
//   });
//   return validate(input, schema);
// };
// export const validateProfile = (
//   input: Partial<
//     Pick<IUser, "name" | "email" | "otp" | "password" | "subaccount" | "phone">
//   >
// ) => {
//   const schema = Joi.object<typeof input, true>({
//     name: Joi.string(),
//     subaccount: Joi.string(),
//     phone: Joi.string()
//       .pattern(new RegExp("^[0-9]{3,15}$"))
//       .min(10)
//       .max(13)
//       .error((err) => {
//         console.log({ err });
//         return new Error("Phone must be formatted like this: 08112345678");
//       }),
//     password: Joi.string()
//       .min(8)
//       .error((err) => {
//         console.log({ err });
//         return new Error(
//           "Password must be minimum of 8 letters and it's required"
//         );
//       }),
//     email: Joi.string()
//       .email()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Email must be valid");
//       }),
//     otp: Joi.number()
//   });
//   return validate(input, schema);
// };

// export const validateTicket = (input: Ticket) => {
//   const schema = Joi.object<Ticket, true>({
//     eventId: Joi.string().alphanum(),
//     expires: Joi.string(),
//     prices: Joi.array<Ticket["prices"]>(),
//   });
//   return validate(input, schema);
// };

// // export const validateUser = (input: IUser) => {
// //   const schema = Joi.object<IUser & {_id: string}>({
// //     _id: Joi.string().alphanum(),
// //     phone: Joi.string().pattern(new RegExp("^[0-9]{3,15}$")).required(),
// //     email: Joi.string().email().required(),
// //     password: Joi.string().required(),
// //     type: Joi.string().allow("Buyer", "Vendor", "Moderator").required(),
// //     name: Joi.string().required(),
// //     cart: Joi.alternatives<ICart[] | Types.ObjectId[]>(),
// //     tickets: Joi.alternatives<ITicket[] | Types.ObjectId[]>(),
// //   });
// //   return validate(input, schema)
// // };

// export const validateEvent = (input: Partial<IEvent>) => {
//   const schema = Joi.object<Partial<Omit<IEvent, "vendorId">>, true>({
//     name: Joi.string()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Name is required");
//       }),
//     desc: Joi.string()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Desc is required");
//       }),
//     prices: Joi.object({
//       VIP: Joi.number(),
//       Regular: Joi.number(),
//       Platinum: Joi.number(),
//       Gold: Joi.number(),
//       Diamond: Joi.number(),
//       Free: Joi.number(),
//     }).required(),
//     moderators: Joi.array<IUser[] | Types.ObjectId[]>(),
//     availability: Joi.boolean(),
//     category: Joi.string()
//       .allow(
//         "Comedy",
//         "Festival",
//         "Music",
//         "Religious",
//         "Tech",
//         "Gaming",
//         "Sports"
//       )
//       .required(),
//     ticketSold: Joi.number(),
//     totalTickets: Joi.number().required(),
//     img: Joi.string(),
//     time: Joi.object({
//       date: Joi.object({
//         from: Joi.string().required(),
//         to: Joi.string().required(),
//       }).required(),
//       timeRange: Joi.array().length(2).items(Joi.string()).required(),
//     }).required(),
//     views: Joi.number(),
//     status: Joi.string().allow("Approved", "Pending", "Done", "Rejected"),
//     subaccount: Joi.string(),
//     kyc: Joi.string(),
//     organizers: Joi.string().required(),
//     note: Joi.string(),
//     location: Joi.string().required(),
//     socialMedia: Joi.object<{ [keys: string]: string }>().required(),
//     percentage: Joi.number(),
//     discount: Joi.object({
//       amount: Joi.any(),
//       date: Joi.object({
//         from: Joi.string().required(),
//         to: Joi.string().required(),
//       }),
//       expired: Joi.boolean(),
//     }),
//   });
//   return validate(input, schema);
// };

// export const validateModerator = (input: any) => {
//   const schema = Joi.object();
//   return validate(input, schema);
// };

// export const validateUpdateCartItem = (input: any) => {
//   const schema = Joi.object<ICartItem>({
//     eventId: Joi.alternatives<IEvent | Types.ObjectId>(),
//     quantity: Joi.number(),
//     ticketType: Joi.string().allow("VIP", "REGULAR", "GOLD", "PLATINUM"),
//     price: Joi.number(),
//     cartId: Joi.alternatives<ICart | Types.ObjectId>(),
//   });
//   return validate(input, schema);
// };
// export const validateAdmin = (input: any) => {
//   const schema = Joi.object<any>({
//     email: Joi.string()
//       .email()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Email must be valid");
//       }),
//     password: Joi.string()
//       .min(8)
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error(
//           "Password must be minimum of 8 letters and it's required"
//         );
//       }),
//   });
//   return validate(input, schema);
// };

// export const validateRejectedStatus = (input: any) => {
//   const schema = Joi.object({
//     status: Joi.string().allow("Approved", "Rejected").required(),
//     reason: Joi.string().required(),
//   });

//   return validate(input, schema);
// };
// export const validateApprovedStatus = (input: any) => {
//   const schema = Joi.object({
//     status: Joi.string().allow("Approved", "Rejected").required(),
//   });

//   return validate(input, schema);
// };
// export const validateBank = (input: IUser["bank"]) => {
//   const schema = Joi.object<IUser["bank"]>({
//     accountName: Joi.string().required(),
//     accountNumber: Joi.string().required(),
//     bankCode: Joi.string().required(),
//   });

//   return validate(input, schema);
// };
// type Metadata = {
//   cart_id: string;
//   custom_fields: [
//     {
//       display_name: "Cart Items";
//       variable_name: "cart_items";
//       value: string;
//     }
//   ];
// };
// type Subaccounts = {
//   subaccount: string;
//   share: number;
// };
// type Init = {
//   amount: number;
//   email: string;
//   reference?: string;
//   callback_url: string;
//   metadata?: Metadata | string;
//   split: {
//     type: "flat" | "percentage";
//     subaccounts: Subaccounts[];
//     bearer_type: "all" | "all-proportional" | "account" | "subaccount";
//   };
// };

// export const validateInit = (input: Init) => {
//   const schema = Joi.object<Init>({
//     email: Joi.string()
//       .email()
//       .required()
//       .error((err) => {
//         console.log({ err });
//         return new Error("Email must be valid");
//       }),
//     reference: Joi.string(),
//     amount: Joi.number().required(),
//     callback_url: Joi.string(),
//     split: Joi.object<Init["split"]>({
//       type: Joi.string().allow("flat").required(),
//       subaccounts: Joi.array<Subaccounts[]>().required(),
//       bearer_type: Joi.string()
//         .allow("all", "all-proportional", "account", "subaccount")
//         .required(),
//     }).required(),
//   });

//   return validate(input, schema);
// };
