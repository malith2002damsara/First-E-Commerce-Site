import userModel from "../models/userModel.js";

//add products to user cart
const addToCart = async (req, res) => {

try{
   const { userId , itemId , size} = req.body
   const userData = await userModel.findById(userId)
   let cartData = await userData.cartData;

   if(cartData[itemId]){
    if (cartData[itemId][size]){
      cartData[itemId][size] += 1
    }else{
      cartData[itemId][size] = 1
    }
   }else{
    cartData[itemId] = {}
    cartData[itemId][size] = 1
   }

   await userModel.findByIdAndUpdate(userId, {cartData})

    res.status(200).json({success:true, message:"Item added to cart successfully"})


}catch(error){
   console.log(error);
    res.status(500).json({success:false, message:error.message})

}

}



//update user cart
const updateCart = async (req, res) => {

  try{

    const { userId , itemId , size, quantity} = req.body
    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;

    if (quantity <= 0) {
      // Remove the item if quantity is 0 or negative
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        // If no sizes left for this item, remove the item completely
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      // Update the quantity
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, {cartData})

     res.status(200).json({success:true, message:"Cart updated successfully"})

}catch(error){
    console.log(error);
    res.status(500).json({success:false, message:error.message})

  }

}

//remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (size && cartData[itemId][size]) {
        // Remove specific size
        delete cartData[itemId][size];
        // If no sizes left for this item, remove the item completely
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        // Remove entire item (all sizes)
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Item removed from cart successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//clear entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({ success: true, message: "Cart cleared successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//get user cart
const getUserCart = async (req, res) => {

  try{

    const { userId } = req.body
    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData;

    res.status(200).json({success:true, cartData})

  }catch(error){
    console.log(error);
    res.status(500).json({success:false, message:error.message})

  }


}


export { addToCart, updateCart, getUserCart, removeFromCart, clearCart }