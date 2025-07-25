import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
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

    // Handle file uploads to Cloudinary using memory storage
    const imageUrls = [];
    const files = ['image1', 'image2', 'image3', 'image4'];
    
    try {
      for (const file of files) {
        if (req.files && req.files[file] && req.files[file][0]) {
          const fileBuffer = req.files[file][0].buffer;
          
          // Upload buffer directly to Cloudinary
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "products",
                resource_type: "image"
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(fileBuffer);
          });
          
          imageUrls.push(result.secure_url);
        }
      }
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({ 
        success: false, 
        message: "Image upload failed: " + uploadError.message 
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

    console.log("Product data to save:", productData); // Debug log

    // Save to database
    const product = new productModel(productData);
    await product.save();

    console.log("Product saved successfully:", product._id); // Debug log

    res.status(201).json({ 
      success: true, 
      message: "Product added successfully",
      productId: product._id
    });

  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error: " + error.message,
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
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false, 
        message: "Product ID is required"
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false, 
        message: "Product not found"
      });
    }

    res.json({
      success: true, 
      message: "Product removed successfully"
    });
 
  } catch(error){
    console.log(error);
    res.status(500).json({
      success: false, 
      message: error.message
    });
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

// function for updating product

const updateProduct = async (req, res) => {
  try {
    const { 
      productId,
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
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    // Find existing product
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Handle file uploads to Cloudinary if new images are provided
    const imageUrls = [...existingProduct.image]; // Start with existing images
    const files = ['image1', 'image2', 'image3', 'image4'];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (req.files && req.files[file] && req.files[file][0]) {
          const fileBuffer = req.files[file][0].buffer;
          
          // Upload buffer directly to Cloudinary
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "products",
                resource_type: "image"
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(fileBuffer);
          });
          
          // Replace the image at the corresponding index
          if (i < imageUrls.length) {
            imageUrls[i] = result.secure_url;
          } else {
            imageUrls.push(result.secure_url);
          }
        }
      }
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({ 
        success: false, 
        message: "Image upload failed: " + uploadError.message 
      });
    }

    // Prepare update data
    const updateData = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (sellername !== undefined) updateData.sellername = sellername.trim();
    if (sellerphone !== undefined) updateData.sellerphone = sellerphone.trim();
    if (category !== undefined) updateData.category = category;
    if (subCategory !== undefined) updateData.subcategory = subCategory;
    if (price !== undefined) updateData.price = Number(price);
    if (bestseller !== undefined) updateData.bestSeller = bestseller === 'true' || bestseller === true;
    if (sizes !== undefined) updateData.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]');
    
    // Always update images (either new ones or existing ones)
    updateData.image = imageUrls;

    console.log("Update data:", updateData); // Debug log

    // Update product in database
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );

    console.log("Product updated successfully:", updatedProduct._id); // Debug log

    res.json({ 
      success: true, 
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error: " + error.message,
      error: error.message 
    });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct }