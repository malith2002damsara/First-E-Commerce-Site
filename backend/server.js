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

//App config
const app = express()
const port = process.env.PORT || 5000

// Initialize connections
let isConnected = false;

const initializeConnections = async () => {
  if (!isConnected) {
    try {
      await connectDB()
      await connectCloudinary()
      isConnected = true;
      console.log('Database and Cloudinary connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
    }
  }
}

//Middlewares
app.use(express.json({ limit: '10mb' }))
app.use(cors({
  origin: [
    'https://ceylonadmin.vercel.app',
    'https://ceylonfrontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}))

// Initialize connections before handling requests
app.use(async (req, res, next) => {
  await initializeConnections();
  next();
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
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

//API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/seller', sellerRouter)

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Ceylon Backend API is working!',
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy',
    database: isConnected ? 'connected' : 'disconnected'
  })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log('Server started on PORT: ' + port))
}

// Export for Vercel
export default app;