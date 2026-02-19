import jwt, { Secret, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { Prisma } from "@prisma/client";
export const createUserToken=(user:Partial<Prisma.UserCreateInput>)=>{
    const payload={
        id:user.id,
        name:user.firstName,
        email:user.email,
        role:user.role
    }
    const token=jwt.sign(payload,config.jwt.access_secret as Secret,{expiresIn:config.jwt.access_expires_in} as SignOptions)

    return{
        accessToken:token
    }
}