import express from 'express';
import { addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// POST /api/reviews - Add a new review
router.post('/', protect, upload.single('image'), addReview);

export default router;