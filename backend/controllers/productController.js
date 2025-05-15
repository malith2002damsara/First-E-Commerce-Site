import {v2 as cloudinary}  from "cloudinary";
import productModel from "../models/productModel.js";


// function for add product
const addProduct = async (req, res) => {
   try {
     const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
 
     // Check for required fields
     if (!name || !description || !price || !category || !sizes) {
       return res.status(400).json({ success: false, message: "Missing required fields" });
     }
 
     // Handle file uploads
     let imagesUrl = [];
     if (req.files) {
       const images = [
         req.files.image1 && req.files.image1[0],
         req.files.image2 && req.files.image2[0],
         req.files.image3 && req.files.image3[0],
         req.files.image4 && req.files.image4[0]
       ].filter(item => item !== undefined);
 
       imagesUrl = await Promise.all(
         images.map(async (item) => {
           const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
           return result.secure_url;
         })
       );
     }
 
     // Prepare product data
     const productData = {
       name,
       description,
       category,
       price: Number(price),
       subcategory: subCategory, // Note: schema uses subcategory but you're using subCategory
       bestSeller: bestseller === 'true', // Note: schema uses bestSeller but you're using bestseller
       sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
       image: imagesUrl, // Changed from images to image to match schema
       date: Date.now()
     };
 
     const product = new productModel(productData);
     await product.save();
 
     res.json({ success: true, message: "Product added successfully" });
   } catch (error) {
     console.log(error);
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