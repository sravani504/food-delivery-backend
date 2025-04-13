import userModel from "../models/userModel.js";

// Add items to the cart

const addToCart = async (req, res) => {
    let userData = await userModel.findById(req.body.userId );
    let cartData = await userData.cartData;
    try {
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        }
        else {
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to Cart" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// Remove Items from the cart

const removeItemsFromCart = async (req, res) => {
   try {
    let userData = await userModel.findById(req.body.userId );
    let cartData=userData.cartData;

    if(cartData[req.body.itemId] >0){
        cartData[req.body.itemId] -=1;
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData});
    res.json({success:true,message:"Removed from cart"})
   } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
   }
    

}

// get cart items

const getCart = async (req, res) => {
  try {
    let userData=await userModel.findById(req.body.userId);
    console.log("Received userId:", userData);
    let cartData=await userData.cartData;
     res.json({success:true,cartData})
    
  } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
  }
}

export { addToCart, removeItemsFromCart, getCart }