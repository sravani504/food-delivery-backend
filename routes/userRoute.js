import express from "express";

import {loginUser,registerUser,gooleLogin} from "../controllers/userController.js";


const userRouter=express.Router();
userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/google",gooleLogin)

export default userRouter;