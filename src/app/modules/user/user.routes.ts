import { Router } from "express";
import { userController } from "./user.controller";

const router= Router()

router.post('/register',userController.userRegister)
router.post('/send-again-otp',userController.sendAgainOtp)

export const userRoutes=router;