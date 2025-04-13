import express from "express";
import {authMiddleware} from "../middleware/auth.js";
import { placeOrder,verifyOrder,userOrders ,ListOrders,updatStatus} from "../controllers/orderController.js";

const orderRouter=express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",ListOrders);
orderRouter.post("/status",updatStatus)

export default orderRouter;