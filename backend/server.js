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

// Global connection status
let isInitialized = false;

// Connect to services for Vercel
async function initializeServices() {
  if (!isInitialized) {
    try {
      await connectDB();
      await connectCloudinary();
      isInitialized = true;
      console.log('Services connected successfully');
    } catch (error) {
      console.error('Failed to connect to services:', error);
      throw error;
    }
  }
}

// Middleware to ensure services are initialized
app.use(async (req, res, next) => {
  try {
    await initializeServices();
    next();
  } catch (error) {
    console.error('Service initialization failed:', error);
    res.status(500).json({ success: false, message: 'Service initialization failed' });
  }
});

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API working!' });
});

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Initialize services and start server if not in Vercel
if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 5000;
  initializeServices().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export for Vercel
export default app;