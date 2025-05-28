import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';

// @desc    Add a new review
// @route   POST /api/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { productId, orderId, rating, comment } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!productId || !orderId || !rating || !comment) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if order exists and belongs to user
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
    status: 'Delivered'
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found or not eligible for review');
  }

  // Check if product exists in order
  const productInOrder = order.items.find(item => 
    item.product.toString() === productId
  );

  if (!productInOrder) {
    res.status(404);
    throw new Error('Product not found in this order');
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
    order: orderId
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Handle image upload if exists
  let imageData = {};
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'reviews',
        width: 800,
        height: 800,
        crop: 'limit'
      });
      imageData = {
        public_id: result.public_id,
        url: result.secure_url
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  // Create new review
  const review = new Review({
    user: userId,
    product: productId,
    order: orderId,
    rating,
    comment,
    image: imageData
  });

  const createdReview = await review.save();

  // Update order item to mark as reviewed
  order.items = order.items.map(item => {
    if (item.product.toString() === productId) {
      item.reviewed = true;
    }
    return item;
  });

  await order.save();

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review: {
      _id: createdReview._id,
      rating: createdReview.rating,
      comment: createdReview.comment,
      image: createdReview.image,
      createdAt: createdReview.createdAt
    }
  });
});