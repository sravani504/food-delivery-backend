import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
import {OAuth2Client} from "google-auth-library";

dotenv.config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const client=new  OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({email});

    if(!user){
      return res.json({success:false,message:"User doesn't exist"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        
        return res.json({success:false,message:"Invalid credentials"})
    }

    const token=createToken(user._id);
    res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        console.log("Request Body:", req.body); // Debugging

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        const emailExist = await userModel.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        console.log("Password before hashing:", password); // Debugging bcrypt issue

        // Hash the password correctly
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({ success: true, token, message: "User registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const gooleLogin=async(req,res)=>{
try {
     const {token} =req.body;
     if(!token){
        return res.json({success:false,message:"Token is required"})
     }

    //  verify the token 

    const ticket=await client.verifyIdToken({
        idToken:token,
        audience:"34755078890-ijrrnfjjnfrec2ikvamq6udp70hov1va.apps.googleusercontent.com"
    });
     const payload=ticket.getPayload();
     const {email,name}=payload;

     let user=await userModel.findOne({email});
     if(!user){
        user=new userModel({
            name,
            email,
            password:"google-auth",

        })
         await user.save();
     }
    //  generate JWT token for session management
    const authToken=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).json({success:true,token:authToken,user})
} catch (error) {
    console.log(error);
    res.status(500).json({success:false, message:"Internal server error"})
}
}

export { registerUser,loginUser,gooleLogin };
