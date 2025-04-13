// controllers/foodController.js
import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from "path";
// Add Food Item
const addFood = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const { name, description, price, category } = req.body;
    const image_filename = req.file.filename;  // Get the image filename from the uploaded file

    try {
        const result = await foodModel.addFood({name, description, price, category }, image_filename);
        res.json(result);  // Return success or failure message from the model method
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding food item" });
    }
};

// Import food through excel
const importFood=async(req,res)=>{
    try {
        const foodItems=req.body;
        if(!Array.isArray(foodItems) || foodItems.length === 0){
            return res.status(400).json({success:false,message:"Invalid data format or empty data"})
        }

     const uploadDir = path.join(process.cwd(), "uploads"); // Fix: Define the uploads directory properly

        // handle images
        for(const item of foodItems){
            if(item.image){
                const imagepath=path.join(uploadDir,item.image);
                if(!fs.existsSync(imagepath)){
                    return res.json({success:false,message:"image file not found in uploads"})
                }
            }
        }
            // insert data
        await foodModel.insertMany(foodItems);
        res.json({success:true,message:"Food Items imported successfully"})
       
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Error importing data"});
        
    }
}

// All list food
 const listFood=async(req,res)=>{
  try {
    const foods=await foodModel.find({});
    res.json({success:true,Data:foods})
    
  } catch (error) {
   console.log(error);
   res.json({success:false,message:"Error"}) 
  }
 }

//  Remove Food Item

const removeFood=async(req,res)=>{
 try {
    const food=await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true, message:"Food Item Removed"});

} catch (error) {
    console.log(error);
    res.json({success:false, message:"error"})
}
}


export { addFood,listFood,removeFood,importFood};  // Make sure this export is correct
