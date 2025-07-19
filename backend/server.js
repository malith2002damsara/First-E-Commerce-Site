import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
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
app.use(cors())

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
// app.use('/api/reviews', reviewRouter)

app.get('/', (req, res) => {
  res.send('Api working!')
})

//Listener
// For local development only:
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log('server start on PORT : ' + port))
}

// For Vercel serverless deployment:
export default app;