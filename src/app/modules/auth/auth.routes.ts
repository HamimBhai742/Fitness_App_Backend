import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { resetPasswordSchema } from "./auth.zod.schema";

const router=Router()

router.post('/verify-otp',authController.verifyRegisterOTP)
router.post('/login',authController.login)
router.post('/reset-password',validateRequest(resetPasswordSchema),authController.resetPassword)

export const authRoutes=router