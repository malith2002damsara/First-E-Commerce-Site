import { v2 as cloudinary } from "cloudinary";

let isCloudinaryConfigured = false;

const connectCloudinary = async () => {
  if (isCloudinaryConfigured) {
    console.log('Cloudinary already configured');
    return;
  }

  try {
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
      throw new Error('Cloudinary environment variables are not properly configured');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    isCloudinaryConfigured = true;
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Cloudinary configuration error:', error);
    throw error;
  }
};

export default connectCloudinary;
