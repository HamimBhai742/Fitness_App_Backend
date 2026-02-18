import { NextFunction, Request, Response } from "express"

type asyncFn=(req:Request,res:Response,next:NextFunction)=>Promise<void>

export const catchAsyncFn=(fn:asyncFn)=>(req:Request,res:Response,next:NextFunction)=>{
    fn(req,res,next).catch(err=>next(err))
}