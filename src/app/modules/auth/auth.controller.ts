import e, { Request, Response } from "express";
import { catchAsyncFn } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const verifyRegisterOTP = catchAsyncFn(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authService.verifyRegisterOTP(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

const login = catchAsyncFn(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authService.login(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const resetPassword = catchAsyncFn(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body.token, req.body.newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful",
    data: result,
  })
});

export const authController = {
  verifyRegisterOTP,
  login,
  resetPassword,
};
