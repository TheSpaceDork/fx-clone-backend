import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookies from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { getUserFromToken } from "./utils/jwt.js";
import adminRouter from "./routes/adminRoutes.js";
import transactionRoute from "./routes/transactionRoutes.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              description: "The user's email.",
            },
            password: {
              type: "string",
              description: "The user's password.",
            },
            role: {
              type: "string",
              description: "The user's role.",
            },
            createdAt: {
              type: "string",
              description: "The user's created date.",
            },
            updatedAt: {
              type: "string",
              description: "The user's updated date.",
            },
          },
          example: {
            email: "example@gmail.com",
            password: "123456",
            role: "user",
            createdAt: "2021-09-01T00:00:00.000Z",
            updatedAt: "2021-09-01T00:00:00.000Z",
          },
        },
        Transaction: {
          type: "object",
          required: ["amount", "currency", "recipient"],
          properties: {
            amount: {
              type: "number",
              description: "The amount to be transferred.",
            },
            currency: {
              type: "string",
              description: "The currency to be transferred.",
            },
            recipient: {
              type: "string",
              description: "The recipient's email.",
            },
            sender: {
              type: "string",
              description: "The sender's email.",
            },
            status: {
              type: "string",
              description: "The transaction status.",
            },
            createdAt: {
              type: "string",
              description: "The transaction created date.",
            },
            updatedAt: {
              type: "string",
              description: "The transaction updated date.",
            },
          },
          example: {
            amount: 100,
            currency: "USD",
            recipient: "example@gmail.com",
            sender: "d@gmail.com",
            status: "pending",
            createdAt: "2021-09-01T00:00:00.000Z",
            updatedAt: "2021-09-01T00:00:00.000Z",
          },
          info: {
            title: "Bank API",
            version: "1.0.0",
            description: "A simple foreign exchange something API",
          },
        },

        Error: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              description: "The error message.",
            },
          },
          example: {
            message: "User already exists",
          },
        },
      },
    },
    routes: {
      "/user": {
        post: {
          tags: ["User"],
          summary: "Create a new user",
          description: "Create a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          responses: {
            200: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            400: {
              description: "User already exists",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ["User"],
          summary: "Get all users",
          description: "Get all users",
          responses: {
            200: {
              description: "Users retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            400: {
              description: "User already exists",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
        },
      },
      "/transaction": {
        post: {
          tags: ["Transaction"],
          summary: "Create a new transaction",
          description: "Create a new transaction",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Transaction",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Transaction created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Transaction",
                  },
                },
              },
            },
            400: {
              description: "Invalid transaction data",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ["Transaction"],
          summary: "Get all transactions",
          description: "Get all transactions",
          responses: {
            200: {
              description: "Transactions retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Transaction",
                  },
                },
              },
            },
            400: {
              description: "Invalid request",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
    },
    openapi: "3.0.0" as const,
    info: {
      title: "Bank API",
      version: "1.0.0",
      description: "A simple foreign exchange something API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: [
    path.join(path.dirname(fileURLToPath(import.meta.url)), "routes/*.js"),
  ],
} as swaggerJsDoc.Options;

const specs = swaggerJsDoc(options);
const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(
  cors({
    origin: ["localhost:3000", "localhost:3001", "http://localhost:3000", "http://localhost:3001"],
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
    origin: ["http://localhost:3000", "http://localhost:3001", "localhost:3000", "localhost:3001"],
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
import NowPaymentsApi from "@nowpaymentsio/nowpayments-api-js";
import { info } from "console";

const api = new NowPaymentsApi({ apiKey: "SG6ESJM-DKJM4GJ-PX3M2BE-GY6PS1M" }); // your api key
async function logCurrencies() {
  const a = await api.getCurrencies();
  // console.log(a);
}
logCurrencies();

export default app;
