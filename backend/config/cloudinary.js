import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async () => {
  try {
    // Check if all required Cloudinary environment variables exist
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary environment variables');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    console.log('Cloudinary connected successfully');
  } catch (error) {
    console.error('Cloudinary connection error:', error.message);
    throw error;
  }
}

export default connectCloudinary;
