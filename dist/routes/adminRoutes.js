import { Router } from "express";
import { login, signup, logout, getAllUsers, approveWithdrawalRequest, getWithdrawalRequests, rejectWithdrawalRequest, approveDepositRequest, getDepositRequests, rejectDepositRequest, addToBalance, removeFromBalance, } from "../controllers/adminController.js";
import { verifyToken } from "../utils/jwt.js";
// import { verifyToken } from "../utils/jwt.js";
const adminRouter = Router();
/**
 * @swagger
 * /admin/signup:
 *   post:
 *     summary: Create a new admin account
 *     description: Create a new admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin account created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 * */
adminRouter.post("/signup", signup);
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login to admin account
 *     description: Login to admin account
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       400:
 *        description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/login", login);
adminRouter.get("/logout", logout);
/**
 * @swagger
 * /admin/user:
 *   get:
 *     summary: Get all users
 *     description: Get all users
 *     responses:
 *       200:
 *         description: All users
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */
adminRouter.use(verifyToken);
adminRouter.get("/user", getAllUsers);
/**
 * @swagger
 * /admin/withdrawal:
 *   get:
 *     summary: Get all withdrawal requests
 *     description: Get all withdrawal requests
 *     responses:
 *       200:
 *         description: All withdrawal requests
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/withdrawal", getWithdrawalRequests);
/**
 * @swagger
 * /admin/withdrawal/approve/{id}:
 *   post:
 *     summary: Approve a withdrawal request
 *     description: Approve a withdrawal request
 *     responses:
 *       200:
 *         description: Withdrawal request approved
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/withdrawal/approve/:id", approveWithdrawalRequest);
/**
 * @swagger
 * /admin/withdrawal/reject/{id}:
 *   post:
 *     summary: reject a withdrawal request
 *     description: reject a withdrawal request
 *     responses:
 *       200:
 *         description: Withdrawal request rejected
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/withdrawal/reject/:id", rejectWithdrawalRequest);
/**
 * @swagger
 * /admin/deposit:
 *   get:
 *     summary: Get all withdrawal requests
 *     description: Get all withdrawal requests
 *     responses:
 *       200:
 *         description: All withdrawal requests
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/deposit", getDepositRequests);
/**
 * @swagger
 * /admin/deposit/approve/{id}:
 *   post:
 *     summary: Approve a withdrawal request
 *     description: Approve a withdrawal request
 *     responses:
 *       200:
 *         description: Withdrawal request approved
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/deposit/approve/:id", approveDepositRequest);
/**
 * @swagger
 * /admin/user/add/{id}:
 *   post:
 *     summary: add to user account balance
 *     description: add to user account balance
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *     responses:
 *       200:
 *         description: balance updated
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/user/add/:id", addToBalance);
/**
 * @swagger
 * /admin/user/remove/{id}:
 *   post:
 *     summary: remove from user account balance
 *     description: remove from user account balance
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *     responses:
 *       200:
 *         description: balance updated
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/user/remove/:id", removeFromBalance);
/**
 * @swagger
 * /admin/deposit/reject/{id}:
 *   post:
 *     summary: reject a withdrawal request
 *     description: reject a withdrawal request
 *     responses:
 *       200:
 *         description: Withdrawal request rejected
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/deposit/reject/:id", rejectDepositRequest);
// adminRouter.use(verifyToken);
// adminRouter.get("/history/:timeFrame?", getadminHistory);
// adminRouter.delete("/:id", deleteAdmin);
export default adminRouter;
