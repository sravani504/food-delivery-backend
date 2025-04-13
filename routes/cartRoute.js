import express from "express";
import { addToCart,removeItemsFromCart,getCart } from "../controllers/cartController.js";
import {authMiddleware} from "../middleware/auth.js";

const cartRouter=express.Router();

cartRouter.post("/add",authMiddleware,addToCart);
cartRouter.post("/remove",authMiddleware,removeItemsFromCart);
cartRouter.post("/get",authMiddleware,getCart);

export default cartRouter