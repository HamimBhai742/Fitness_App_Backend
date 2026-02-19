import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib/prisma";
import { createUserToken } from "../../utils/createUserToken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { otpQueueEmail } from "../../bullMQ/init";
import httpStatus from "http-status";

const verifyRegisterOTP = async (data: any) => {
  if (!data.email || !data.otp) {
    throw new AppError(400, "Email and OTP required");
  }
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(400, "User already verified");
  }

  if (user.otp !== data.otp) {
    throw new AppError(400, "Invalid OTP");
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(400, "OTP expired");
  }

  const token = createUserToken(user);

  await prisma.user.update({
    where: {
      email: data.email,
    },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    },
  });

  return token;
};

const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new AppError(400, "Incorrect password");
  }

  return createUserToken(user);
};

const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED,"Token invalid");
  }

  if(user && user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date()){
    throw new AppError(httpStatus.UNAUTHORIZED,"Token expired");
  }
  
  const hashedPassword = await bcrypt.hash(
    newPassword,
    config.bcrypt_salt_rounds,
  );

  const isMatchPassword = await bcrypt.compare(newPassword, user.password);
  if (isMatchPassword) {
    throw new AppError(
      400,
      "New password must be different from the old password",
    );
  }

  await otpQueueEmail.add(
    "resetPasswordSuccess",
    {
      userName: user.firstName,
      email: user.email,
      subject: "Your Password Reset",
      loginLink: `${config.client_url}/login`,
    },
    {
      jobId: `password-reset-${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken    : null,
      resetPasswordTokenExpiry: null
    },
  });
};

export const authService = {
  verifyRegisterOTP,
  login,
  resetPassword,
};
