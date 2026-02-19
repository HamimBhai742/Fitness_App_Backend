import bcrypt from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../lib/prisma";
import { generateOTP } from "../../utils/generateOTP";
import { otpQueueEmail } from "../../bullMQ/init";
import { AppError } from "../../error/AppError";
import crypto from "crypto";
const userRegister = async (data: any) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    config.bcrypt_salt_rounds,
  );
  data.password = hashedPassword;

  const otp = generateOTP();
  data.otp = otp;
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  data.otpExpiry = otpExpiry;
  const user = await prisma.user.create({
    data,
  });

  await otpQueueEmail.add(
    "registrationOtp",
    {
      userName: data.firstName,
      email: data.email,
      otpCode: otp,
      subject: "Your Registration OTP",
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );
  return data;
};

const sendAgainOtp = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(400, "User already verified");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  await otpQueueEmail.add(
    "registrationOtp",
    {
      userName: user.firstName,
      email: user.email,
      otpCode: otp,
      subject: "Your Registration OTP",
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      otp: otp,
      otpExpiry: otpExpiry,
    },
  });
};

const requestForgetPassword = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

  await otpQueueEmail.add(
    "forgetPasswordOtp",
    {
      userName: user.firstName,
      email: user.email,
      otpCode: otp,
      subject: "Your Forget Password OTP",
    },
    {
      jobId: `${user.id}-${Date.now()}`,
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    },
  );

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      otp: otp,
      otpExpiry: otpExpiry,
    },
  });
};

const verifyForgetPasswordOtp = async (data: {
  email: string;
  otp: string;
}) => {
  if (!data.email || !data.otp) {
    throw new AppError(400, "Email and OTP are required");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.otp !== data.otp) {
    throw new AppError(400, "Invalid OTP");
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError(400, "OTP expired");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
      otp: null,
      otpExpiry: null,
    },
  });

  return resetToken;
};

export const userService = {
  userRegister,
  sendAgainOtp,
  requestForgetPassword,
  verifyForgetPasswordOtp,
};
