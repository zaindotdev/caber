import { Router } from "express";
import {driverSignIn,driverSignOut,getDriversInfo, verifyOTP,register} from "../controllers/driver.controller";
import { auth } from "../middlewares/driver.auth";

const router = Router();

router.post("/register", register);
router.post("/verify", verifyOTP);
router.post("/sign-in", driverSignIn);
router.get("/sign-out",auth, driverSignOut);
router.get("/get-info",auth, getDriversInfo);

export default router;