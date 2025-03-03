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

const origin = {
  origin: [
    /^(http:\/\/)?localhost:\d{1,5}$/, // Matches localhost with any port
    /^(http:\/\/|https:\/\/)?fx-clone-gamma\.vercel\.app\/?.*$/, // Matches fx-clone-gamma.vercel.app
  ],
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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FX",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "https://fx-clone-backend.onrender.com",
      description: "Live version",
    },
    { url: `http://localhost:6001`, description: "test" },
  ],
  basePath: "/",
  produces: ["application/json"],
  apis: ["./dist/routes/*.js"], // Files containing annotations
} as swaggerJsDoc.Options;

const specs = swaggerJsDoc(options);
const app = express();

// Enable CORS with the specified configuration
app.use(cors(origin));
app.options("*", cors(origin)); // Enable preflight requests for all routes

// Logging middleware
app.use(morgan("dev"));

// Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

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
