import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  reviewed: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  items: [orderItemSchema],
  amount: { 
    type: Number, 
    required: true 
  },
  address: { 
    type: Object, 
    required: true 
  },
  status: { 
    type: String, 
    required: true, 
    default: "Order Placed",
    enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['COD', 'Card', 'PayPal'] 
  },
  payment: { 
    type: Boolean, 
    required: true,
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;