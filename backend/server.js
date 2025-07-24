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

// Connect to database
connectDB()

// Connect to cloudinary
connectCloudinary()

//Middlewares
app.use(express.json())

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://ceylonadmin.vercel.app',
      'https://ceylonbackend.vercel.app'
    ];
    
    // Allow any vercel.app domain for your projects
    if (origin.includes('malith2002damsaras-projects.vercel.app') || 
        origin.includes('vercel.app') || 
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}

app.use(cors(corsOptions))

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
    error: err.message
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
  res.send('Api working!')
})

// Test endpoint to verify CORS
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly!',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString()
  })
})

//Listener
// For local development only:
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log('server start on PORT : ' + port))
}

// For Vercel serverless deployment:
export default app;
