import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to services
async function initialize() {
  try {
    await connectDB();
    await connectCloudinary();
    console.log('Services connected successfully');
  } catch (error) {
    console.error('Failed to connect to services:', error);
    process.exit(1);
  }
}

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('API working!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize services and start server if not in Vercel
if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 5000;
  initialize().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  });
}

// Export for Vercel
export default app;