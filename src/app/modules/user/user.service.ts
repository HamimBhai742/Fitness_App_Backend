import bcrypt from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../lib/prisma";
import { generateOTP } from "../../utils/generateOTP";
import { otpQueueEmail } from "../../bullMQ/init";
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

export const userService = {
  userRegister,
};
