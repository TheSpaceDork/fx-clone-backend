import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { getUserFromToken } from "./utils/jwt.js";
import adminRouter from "./routes/adminRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import morgan from "morgan";
import { GetCurrenciesReturn } from "@nowpaymentsio/nowpayments-api-js/src/actions/get-currencies/index.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FX",
      version: "1.0.0",
    },
  },
  servers: [
    { url: "https://fx-xoxa.onrender.com", description: "Live version" },
    { url: `http://localhost:6001`, description: "test" },
  ],
  basePath: "/",
  produces: ["application/json"],
  apis: ["./dist/routes/*.js"], // files containing annotations as above
} as swaggerJsDoc.Options;

const specs = swaggerJsDoc(options);
const app = express();

app.use(morgan("dev"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(
  cors({
    origin: [
      "localhost:3000",
      "localhost:3001",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
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
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "localhost:3000",
      "localhost:3001",
      "http://localhost:3002",
    ],
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
