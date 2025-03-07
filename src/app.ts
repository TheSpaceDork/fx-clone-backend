import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { getUserFromToken } from "./utils/jwt.js";
import adminRouter from "./routes/adminRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";
import morgan from "morgan";

const app = express();

// Logging middleware
app.use(morgan("dev"));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming origin:", origin);
      const allowedOrigins = [
        "https://fx-clone-gamma.vercel.app",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Fixed typo: "OPTIONS" instead of "OPTIONS"
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

// Handle preflight requests for all routes
app.options("*", cors());

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
