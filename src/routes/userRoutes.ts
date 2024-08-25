import { Router } from "express";
import {
  login,
  signup,
  logout,
  getUser,
  deleteUser,
  verifyUser,
} from "../controllers/userController.js";
// import { verifyToken } from "../utils/jwt.js";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/verify", verifyUser);
userRouter.get("/", getUser);
userRouter.get("/logout", logout);

// userRouter.use(verifyToken);
// userRouter.get("/history/:timeFrame?", getUserHistory);
userRouter.delete("/:id", deleteUser);
export default userRouter;
