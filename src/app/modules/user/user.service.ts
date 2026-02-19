import bcrypt from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../lib/prisma";
import { generateOTP } from "../../utils/generateOTP";
import { otpQueueEmail } from "../../bullMQ/init";
import { AppError } from "../../error/AppError";
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

const sendAgainOtp=async(email:string)=>{
  const user = await prisma.user.findFirst({
    where:{
      email:email
    }
  })

  if(!user){
    throw new AppError(404,"User not found")
  }

  if(user.isVerified){
    throw new AppError(400,"User already verified")
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
  )
  await prisma.user.update({
    where:{
      email:email
    },
    data:{
      otp:otp,
      otpExpiry:otpExpiry
    }
  })
}

export const userService = {
  userRegister,
  sendAgainOtp
};
