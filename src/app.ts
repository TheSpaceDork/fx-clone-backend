import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookies from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { getUserFromToken } from "./utils/jwt.js";
import adminRouter from "./routes/adminRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";

const app = express();
app.use(
  cors({
    origin: ["localhost:3000", "localhost:3001"],
    credentials: true,
    // exposedHeaders: ["set-cookie"]
  })
);

// body parser
app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookies());

// 3) ROUTES
app.options(
  "*",
  cors({
    origin: ["localhost:3000", "localhost:3001"],
    credentials: true,
    // exposedHeaders: ["set-cookie"]
  })
);
app.use(getUserFromToken);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/transaction", transactionRoute);
app.all("*", (req, res, next) => {
  return res.json("You've reached the backend");
});

export default app;
