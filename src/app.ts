import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { getUserFromToken } from "./utils/jwt.js";
import adminRouter from "./routes/adminRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";
import morgan from "morgan";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://fx-clone-gamma.vercel.app",
  "https://keystonefx.live",
];

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://fx-clone-gamma.vercel.app",
        "https://keystonefx.live",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

app.options("*", cors());

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use(getUserFromToken);

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/transaction", transactionRoute);

app.all("*", (req, res, next) => {
  return res.json("You've reached the backend");
});

export default app;
