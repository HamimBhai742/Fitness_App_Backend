import { Request, Response } from "express";
import { catchAsyncFn } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const userRegister = catchAsyncFn(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await userService.userRegister(data);
  res.send(result);
});

const sendAgainOtp = catchAsyncFn(async (req: Request, res: Response) => {
  const email = req.body.email;
  await userService.sendAgainOtp(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully",
    data: null,
  });
});

const requestForgetPassword = catchAsyncFn(
  async (req: Request, res: Response) => {
    const email = req.body.email;
    await userService.requestForgetPassword(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  },
);

const verifyForgetPasswordOtp = catchAsyncFn(
  async (req: Request, res: Response) => {
    const data = req.body;
    const result = await userService.verifyForgetPasswordOtp(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  },
);

export const userController = {
  userRegister,
  sendAgainOtp,
  requestForgetPassword,
  verifyForgetPasswordOtp,
};
