import mongoose from "mongoose";

const connectDB = async()=>{
  try {
    // Make sure the URI is correctly formatted, ending with the database name
    // For example: mongodb+srv://username:password@cluster.mongodb.net/cloths
    // NOT: mongodb+srv://username:password@cluster.mongodb.net/cloths/cloths
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;