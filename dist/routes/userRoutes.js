import { Router } from "express";
import { login, signup, logout, getUser, deleteUser, verifyUser, getUserHistory, } from "../controllers/userController.js";
// import { verifyToken } from "../utils/jwt.js";
/**
 * @swagger
 * components:
 *   securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/GeneralError'
 *     NotFound:
 *       description: Entity not found.
 *     IllegalInput:
 *       description: Illegal input for operation.
 *     GeneralError:
 *       description: General Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralError'
 *   requestBodies:
 *     User:
 *       content:
 *        application/json:
 *        schema:
 *         $ref: '#/components/schemas/User'
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    userId:
 *      name: id
 *      in: path
 *      description: ID of the user
 *      required: true
 *      schema:
 *        type: integer
 *        format: int64
 *
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
 *     GeneralError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         statusCode:
 *            type: integer
 *            format: int32
 *         data:
 *            type: object
 *       example:
 *         message: "Error has occured"
 *         statusCode: 500
 *         data: {x: x.com, facebook: facebook.com}
 *     Transaction:
 *       type: object
 *       properties:
 *        - id:
 *            type: integer
 *            format: int64
 *        - amount:
 *            type: number
 *            format: double
 *     Category:
 *      type: object
 *      properties:
 *       - id:
 *          type: integer
 *          format: int64
 *       - name:
 *          type: string
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *          type: string
 
 */
const userRouter = Router();
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/verify", verifyUser);
userRouter.get("/", getUser);
userRouter.get("/history", getUserHistory);
userRouter.get("/logout", logout);
// userRouter.use(verifyToken);
// userRouter.get("/history/:timeFrame?", getUserHistory);
userRouter.delete("/:id", deleteUser);
export default userRouter;
