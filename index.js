import express from"express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config'
import orderRouter from "./routes/orderRouter.js";
import dotenv from "dotenv";
dotenv.config();





// app config
const app=express();
const port=process.env.PORT || 4000;


//middleware
app.use(express.json())
app.use(cors())


// Db connection

connectDB();

// API endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.get("/",(req,res)=>{
   res.send("API Working")
})


app.listen(port, ()=>{
    console.log(`server started on  http://localhost:${port}`);
})
// mongodb+srv://narrasravani02:a2H3HHQzTc56gVOM@cluster0.unsirpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0