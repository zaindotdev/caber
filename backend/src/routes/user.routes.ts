import { Router } from "express";
import { signIn, signOut, verifyOTP } from "../controllers/user.controller";
import { auth } from "../middlewares/auth";
const router = Router();

router.post("/sign-in", signIn);
router.get("/sign-out", auth, signOut);
router.post("/verify", verifyOTP);

export default router;
