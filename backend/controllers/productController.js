import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs";
import path from "path";

// Ensure Cloudinary is configured
const ensureCloudinaryConfig = () => {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    // Ensure Cloudinary is configured
    ensureCloudinaryConfig();

    const { 
      name, 
      description, 
      sellername, 
      sellerphone, 
      price, 
      category, 
      subCategory, 
      sizes, 
      bestseller 
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !sizes || !sellername || !sellerphone) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Handle file uploads to Cloudinary
    const imageUrls = [];
    const files = ['image1', 'image2', 'image3', 'image4'];
    
    try {
      for (const file of files) {
        if (req.files && req.files[file]) {
          const filePath = req.files[file][0].path;
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "products",
            resource_type: "image"
          });
          imageUrls.push(result.secure_url);
          
          // Clean up the temporary file
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting temporary file ${filePath}:`, err);
          });
        }
      }
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({ 
        success: false, 
        message: "Image upload failed" 
      });
    }

    // Ensure at least one image was uploaded
    if (imageUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one product image is required" 
      });
    }

    // Create product data
    const productData = {
      name: name.trim(),
      description: description.trim(),
      sellername: sellername.trim(),
      sellerphone: sellerphone.trim(),
      category,
      price: Number(price),
      subcategory: subCategory || 'Topwear', // Default value
      bestSeller: bestseller === 'true' || bestseller === true,
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]'),
      image: imageUrls,
      date: Date.now()
    };

    // Save to database
    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ 
      success: true, 
      message: "Product added successfully",
      productId: product._id
    });

  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
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