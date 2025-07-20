import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Add product with detailed logging
productRouter.post('/add', adminAuth, (req, res, next) => {
  console.log('POST /add route hit');
  console.log('Headers:', req.headers);
  next();
}, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]), (req, res, next) => {
  console.log('Files received:', req.files);
  console.log('Body received:', req.body);
  next();
}, addProduct);

productRouter.get('/list', listProducts);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.get('/single', singleProduct);

export default productRouter;
