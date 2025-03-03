import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { getUserFromToken } from "./utils/jwt.js";
import adminRouter from "./routes/adminRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";

import morgan from "morgan";

const origin = {
  origin: true,
  //   [
  //   /^(http:\/\/)?localhost:\d{1,5}$/, // Matches localhost with any port
  //   /^(http:\/\/|https:\/\/)?fx-clone-gamma\.vercel\.app\/?.*$/, // Matches fx-clone-gamma.vercel.app
  // ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ], // Allowed headers
  credentials: true, // Allow credentials (e.g., cookies)
  maxAge: 86400, // Cache preflight requests for 24 hours
};

const app = express();

app.use(
  cors({
    origin: [
      /^(http:\/\/)?localhost:\d{1,5}$/,
      /^(http:\/\/|https:\/\/)?(www\.)?fx-clone-gamma\.vercel\.app\/?.*$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Logging middleware
app.use(morgan("dev"));

// Swagger documentation

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookies());

// Middleware to get user from token
app.use(getUserFromToken);

// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/transaction", transactionRoute);

// Catch-all route
app.all("*", (req, res, next) => {
  return res.json("You've reached the backend");
});

export default app;
