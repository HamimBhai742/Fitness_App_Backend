import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";

const router=Router();

const routes=[
    {
        path:'/user',   
        router:userRoutes
    }
]

routes.forEach(route=>{
    router.use(route.path,route.router)
})

export default router;