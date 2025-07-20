import express from "express";
import { getAllSellers, updateSeller, deleteSeller } from '../controllers/sellerController.js';
import adminAuth from "../middleware/adminAuth.js";

const sellerRouter = express.Router();

// Get all sellers
sellerRouter.get('/list', getAllSellers);

// Update seller information
sellerRouter.post('/update', adminAuth, updateSeller);

// Delete seller and all their products
sellerRouter.post('/delete', adminAuth, deleteSeller);

export default sellerRouter;
