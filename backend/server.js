import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import sellerRouter from './routes/sellerRoute.js'
// import reviewRouter from './routes/reviewRoute.js';

//App config
const app = express()
const port = process.env.PORT || 5000

// Initialize connections with error handling
const initializeApp = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log('All services connected successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error.message);
    // Don't throw error in serverless environment
  }
};

// Initialize the app
initializeApp();

//Middlewares
app.use(express.json({ limit: '10mb' }))
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

//API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/seller', sellerRouter)
// app.use('/api/reviews', reviewRouter)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File size too large'
    });
  }
  
  if (err.message && err.message.includes('Only images')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

//Listener
// For local development only:
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log('server start on PORT : ' + port))
}

// For Vercel serverless deployment:
export default app;