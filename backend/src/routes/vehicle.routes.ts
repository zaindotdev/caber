import Router from "express";
import { addVehicle, getAllVehicles, getVehicleById } from "../controllers/vehicle.controller";
import {auth} from "../middlewares/driver.auth"

const router = Router();

router.post("/add", auth, addVehicle);
router.get("/get-all", auth, getAllVehicles);
router.get("/get/:id", auth, getVehicleById);

export default router;