import { Router } from "express";
import {
  login,
  signup,
  logout,
  getUser,
  deleteUser,
  verifyUser,
  getUserHistory,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/jwt.js";
// import { verifyToken } from "../utils/jwt.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: bearer JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - fullName
 *         - username
 *         - country
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The Auto-generated id of a user
 *         password:
 *           type: string
 *           description: password fo user
 *         fullName:
 *           type: string
 *           description: fullName of user
 *         username:
 *           type: string
 *           description: username of user *
 *         country:
 *           type: string
 *           description: country of user *
 *         socialAccounts:
 *           type: object
 *           description: object containing social accounts of user
 *       example:
 *         id: dakjfasdfasdf
 *         password: dajlfsdkafdf
 *         fullName: user no1
 *         country: NGN
 *         socialAccounts: {x: x.com, facebook: facebook.com}
 *         username: user1
 *     Transaction:
 *       type: object
 *       properties:
 *        - id:
 *            type: integer
 *            format: int64
 *        - amount:
 *            type: number
 *            format: double
 *        - status:
 *            type: string
 *        - type:
 *            type: string
 *        - date:
 *            type: string
 *            format: date-time
 *        - userId:
 *            type: integer
 *            format: int64
 *        - narration:
 *            type: string
 *        - currency:
 *            type: string
 *        - address:
 *            type: string
 *       example:
 *         id: 1
 *         amount: 100
 *         status: pending
 *         type: deposit
 *         date: 2021-09-01T00:00:00.000Z
 *         userId: 1
 *         narration: deposit
 *         currency: ngn
 *         address: 1
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         id: 1
 *         email: example@gmail.com
 *         password: password
 */
const userRouter = Router();
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/User'
 *     responses:
 *       200:
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.post("/signup", signup);
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login to user account
 *     description: Login to user account
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.post("/login", login);
/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: Verify user account
 *     description: Verify user account
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              code:
 *                type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/requestBodies/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.use(verifyToken);
userRouter.post("/verify", verifyUser);
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user account
 *     description: Get user account
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", getUser);
/**
 * @swagger
 * /user/history:
 *   get:
 *     summary: Get user history
 *     description: Get user history
 *     responses:
 *       200:
 *         description: User details gotten successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/requestBodies/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.get("/history", getUserHistory);
// userRouter.get("/logout", logout);

// userRouter.use(verifyToken);
// userRouter.get("/history/:timeFrame?", getUserHistory);
// userRouter.delete("/:id", deleteUser);
export default userRouter;
