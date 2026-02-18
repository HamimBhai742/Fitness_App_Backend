import { catchAsyncFn } from "../../utils/catchAsync";
import { userService } from "./user.service";

const userRegister=catchAsyncFn(async(req,res)=>{
    const data=req.body;
    const result=await userService.userRegister(data);
    res.send(result);
})

export const userController={
    userRegister
}