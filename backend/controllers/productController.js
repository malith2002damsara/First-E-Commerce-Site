import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import productModel from "../models/productModel.js";
import fs from "fs";


// function for add product
const addProduct = async (req, res) => {
  try {
    // For FormData, text fields are available in req.body
    // Note: Field names must match what frontend sends: sellername, sellerphone
    const { name, description, sellername, sellerphone, price, category, subCategory, sizes, bestseller } = req.body;

    console.log("Received data:", req.body); // Debug log

    // Validate required fields
    if (!name || !description || !price || !category || !sizes || !sellername || !sellerphone) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields",
        received: { name, description, sellername, sellerphone, price, category, subCategory, sizes, bestseller }
      });
    }

    // Handle file uploads
    let imagesUrl = [];
    if (req.files) {
      const files = ['image1', 'image2', 'image3', 'image4'];
      for (const file of files) {
        if (req.files[file]) {
          try {
            const result = await cloudinary.uploader.upload(req.files[file][0].path, {
              folder: "products"
            });
            imagesUrl.push(result.secure_url);
            fs.unlinkSync(req.files[file][0].path); // Clean up local file
          } catch (err) {
            console.error("Cloudinary upload error:", err.message, err.stack);
            return res.status(500).json({ success: false, message: "Image upload failed: " + err.message });
          }
        }
      }
    }

    // Ensure at least one image is uploaded
    if (!imagesUrl.length) {
      return res.status(400).json({ success: false, message: "At least one product image is required." });
    }

    // Prepare product data - field names must match schema
    const productData = {
      name: name.trim(),
      description: description.trim(),
      sellername: sellername.trim(), // Match schema field name
      sellerphone: sellerphone.trim(), // Match schema field name
      category,
      price: Number(price),
      subcategory: subCategory,
      bestSeller: bestseller === 'true' || bestseller === true,
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
      image: imagesUrl,
      date: Date.now()
    };

    console.log("Product data to save:", productData); // Debug log

    const product = new productModel(productData);
    await product.save();

    console.log("Product saved successfully:", product); // Debug log

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error in addProduct:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};


// function for get all products

const listProducts = async (req, res) => {

   try{
      const products = await productModel.find({});
      res.json({success:true, products})
   }catch(error){
      console.log(error);
      res.status(500).json({success:false, message:error.message})
   }


}

//function for remove product

const removeProduct = async (req, res) => {

  try{
   await productModel.findByIdAndDelete(req.query.id)
   res.json({success:true, message:"Product removed successfully"})
 
}catch(error){
   console.log(error);
   res.status(500).json({success:false, message:error.message})
}
}

// function for single product info

const singleProduct = async (req, res) => {

   try{

      const { productId } = req.body
      const product = await productModel.findById(productId)
      res.json({success:true, product})

   }catch(error){
      console.log(error);
      res.status(500).json({success:false, message:error.message})
}

}

export { addProduct, listProducts, removeProduct, singleProduct }