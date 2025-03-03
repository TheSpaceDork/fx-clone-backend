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
        /^(http:\/\/)?localhost:\d{1,5}$/,
        /^(http:\/\/|https:\/\/)?foreign-exchange-nine\.vercel\.app\/?.*$/,
        /^(http:\/\/|https:\/\/)?(www\.)?keystonefx\.live\/?.*$/,
    ],
    credentials: true,
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
            url: "https://fx-clone-backend.vercel.app/",
            description: "Live version",
        },
        { url: `http://localhost:6001`, description: "test" },
    ],
    basePath: "/",
    produces: ["application/json"],
    apis: ["./dist/routes/*.js"], // files containing annotations as above
};
const specs = swaggerJsDoc(options);
const app = express();
app.use(cors(origin));
app.options("*", cors(origin));
app.use(morgan("dev"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// body parser
app.use(express.json({
    limit: "10mb",
}));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookies());
// 3) ROUTES
app.use(getUserFromToken);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/transaction", transactionRoute);
app.all("*", (req, res, next) => {
    return res.json("You've reached the backend");
});
export default app;
