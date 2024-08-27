import { Router } from "express";
import { login, signup, logout, deleteAdmin, getAllUsers, approveWithdrawalRequest, getWithdrawalRequests, rejectWithdrawalRequest, } from "../controllers/adminController.js";
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
// adminRouter.use(verifyToken);
// adminRouter.get("/history/:timeFrame?", getadminHistory);
adminRouter.delete("/:id", deleteAdmin);
export default adminRouter;
