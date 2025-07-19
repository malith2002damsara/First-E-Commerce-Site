// Minimal test to check basic functionality
import 'dotenv/config';

console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('CLOUDINARY_SECRET_KEY:', process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Not set');

// Test imports
try {
  const { default: express } = await import('express');
  console.log('Express imported successfully');
  
  const { default: mongoose } = await import('mongoose');
  console.log('Mongoose imported successfully');
  
  const { v2: cloudinary } = await import('cloudinary');
  console.log('Cloudinary imported successfully');
  
  console.log('All imports successful!');
} catch (error) {
  console.error('Import error:', error);
}
