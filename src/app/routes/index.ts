import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router=Router();

const routes=[
    {
        path:'/user',   
        router:userRoutes
    },
    {
        path:"/auth",
        router:authRoutes
    }
]

routes.forEach(route=>{
    router.use(route.path,route.router)
})

export default router;