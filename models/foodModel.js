// models/foodModel.js
import mongoose from "mongoose";

// Define food schema
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    category: { type: String, required: true },
});

// Create the food model
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

// Add Food Method
foodModel.addFood = async (foodData, imageFilename) => {
    const { name, description, price, category } = foodData;

    const foodItem = new foodModel({
        name,
        description,
        price,
        category,
        image: imageFilename,
    });

    try {
        await foodItem.save();  // Save the food item in the database
        return { success: true, message: "Food added successfully" };
    } catch (error) {
        console.error("Error saving food item:", error);
        throw new Error("Error saving food item");
    }
};

export default foodModel;
