import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY not loaded. Check your .env and dotenv config.");
  }
  

// Place an order for frontend

const placeOrder=async(req,res)=>{

    const frontend_url="http://localhost:3000"
    try {
        const newOrder=new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId,{cartDarte:{}});

    const line_items=req.body.items.map((item)=>(
        {price_data:{
            currency:"inr",
            product_data:{
                name:item.name
            },
             unit_amount:item.price*100*80,
                   },
        quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })

        const session=await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        console.log("stripe session url",session.url);

        res.json({success:true,success_url:session.url})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder=async(req,res)=>{
    const {orderId,success}=req.body;
    try {
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
        
    } catch (error) {
         console.log(error);
         res.json({success:false,message:"Eroor"})
         
    }
}

// user orders for frontend

const userOrders=async(req,res)=>
{
  try {
     const orders=await orderModel.find({userId:req.body.userId})
     res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

// Listorders for admin panel

const ListOrders=async(req,res)=>{
 try {
    const orders=await orderModel.find({});
    res.json({succes:true,data:orders})
 } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
 }
}

// APi for undating the order status

const updatStatus=async(req,res)=>{
  try {
     await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
     res.json({succes:true,message:"Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export {placeOrder,verifyOrder,userOrders,ListOrders,updatStatus};