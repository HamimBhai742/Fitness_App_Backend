import { AppError } from "../../error/AppError"
import { prisma } from "../../lib/prisma"
import { createUserToken } from "../../utils/createUserToken"

const verifyRegisterOTP=async(data:any)=>{
    if(!data.email || !data.otp){
        throw new AppError(400,"Email and OTP required")
    }
    const user = await prisma.user.findFirst({
        where:{
            email:data.email       
        }
    })

    if(!user){
        throw new AppError(404,"User not found")
    }

    if(user.isVerified){
        throw new AppError(400,"User already verified")
    }

    if(user.otp!==data.otp){
        throw new AppError(400,"Invalid OTP")
    }

    if(user.otpExpiry && user.otpExpiry < new Date()){
        throw new AppError(400,"OTP expired")
    }

    const token=createUserToken(user)

    await prisma.user.update({
        where:{
            email:data.email
        },
        data:{
            isVerified:true,
            otp:null,
            otpExpiry:null
        }
    })

    return token
}


export const authService = {
    verifyRegisterOTP
}