import { Prisma } from "@prisma/client";
import { Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const resetPasswordToken = (
  user: Partial<Prisma.UserCreateInput>,
  secret: Secret,
  expiresIn: string,
) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.firstName,
  };
  
  const token = jwt.sign(
    payload,
    secret as Secret,
    { expiresIn } as SignOptions,
  );

  return {
    resetPasswordToken: token,
  };
};
