import mongoose from "mongoose";


export const connectDB=async ()=>{
  await mongoose.connect("mongodb+srv://narrasravani02:a2H3HHQzTc56gVOM@cluster0.unsirpx.mongodb.net/food-del")
  .then(()=>console.log("Db connected"));
} 