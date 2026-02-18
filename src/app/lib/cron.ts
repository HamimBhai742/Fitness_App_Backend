// src/app/lib/cron.ts
import cron from "node-cron";
import { prisma } from "./prisma";

export const startOtpCleaner = () => {
  cron.schedule("* * * * *", async () => {
    await prisma.user.updateMany({
      where: {
        otpExpiry: { lt: new Date() },
        isVerified: false,
      },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });
  });
};
