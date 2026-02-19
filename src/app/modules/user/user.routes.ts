import { Router } from "express";
import { userController } from "./user.controller";

const router= Router()

router.post('/register',userController.userRegister)
router.post('/send-again-otp',userController.sendAgainOtp)
router.post('/forget-password',userController.requestForgetPassword)
router.post('/verify-forget-password-otp',userController.verifyForgetPasswordOtp)

export const userRoutes=router;