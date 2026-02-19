import e, { Request, Response } from "express";
import { catchAsyncFn } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const verifyRegisterOTP = catchAsyncFn(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authService.verifyRegisterOTP(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully",
    data: result
  });
});


export const authController ={
    verifyRegisterOTP
}
