import { Router } from "express";

import {
  login,
  signup,
  logout,
  deleteAdmin,
  getAllUsers,
  approveWithdrawalRequest,
  getWithdrawalRequests,
  rejectWithdrawalRequest,
} from "../controllers/adminController.js";
// import { verifyToken } from "../utils/jwt.js";

const adminRouter = Router();

adminRouter.post("/signup", signup);
adminRouter.post("/login", login);
adminRouter.get("/logout", logout);
adminRouter.get("/user", getAllUsers);
adminRouter.get("/withdrawal", getWithdrawalRequests);
adminRouter.post("/withdrawal/approve", approveWithdrawalRequest);
adminRouter.post("/withdrawal/reject", rejectWithdrawalRequest);

// adminRouter.use(verifyToken);
// adminRouter.get("/history/:timeFrame?", getadminHistory);
adminRouter.delete("/:id", deleteAdmin);
export default adminRouter;
