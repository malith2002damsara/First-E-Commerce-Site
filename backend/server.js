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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Connect to database
try {
  connectDB();
} catch (error) {
  console.error('Database connection failed:', error);
}

// Connect to cloudinary
try {
  connectCloudinary();
} catch (error) {
  console.error('Cloudinary connection failed:', error);
}

//Middlewares
app.use(express.json())
app.use(cors())

//API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
// app.use('/api/reviews', reviewRouter)

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Ceylon Wear API is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// For Vercel deployment
export default app

//Listener (only for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log('server start on PORT : ' + port))
}