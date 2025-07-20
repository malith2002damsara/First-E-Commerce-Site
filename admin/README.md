# Ceylon Wear - Admin Panel

## Overview
This is the admin panel for the Ceylon Wear e-commerce application. It provides comprehensive management tools for products, orders, sellers, and analytics.

## Features

### Real Database Integration
The admin panel now fetches real data from the MongoDB database through the backend API:

### 1. Dashboard
- **Real-time Analytics**: Displays actual sales data, revenue, and order statistics
- **Data Sources**: 
  - Products from `/api/product/list`
  - Orders from `/api/order/list`
- **Features**:
  - Total products count
  - Total orders count  
  - Total revenue calculation
  - Monthly/weekly/yearly revenue trends
  - Top performing sellers
  - Recent orders
  - Category-wise product distribution

### 2. Product Management (`/list`)
- **Real Product Data**: Fetches all products from the database
- **Features**:
  - View all products with images, prices, and seller information
  - Filter by category, subcategory, and name
  - Edit product details (name, price, description, etc.)
  - Delete products with confirmation
  - Real-time updates after modifications

### 3. Order Management (`/orders`) 
- **Real Order Data**: Fetches all orders from the database
- **Features**:
  - View all customer orders with complete details
  - Filter by status, payment method, and date range
  - Update order status (Order Placed → Packing → Shipped → Delivered)
  - Real-time status updates
  - Order item details with images and quantities

### 4. Seller Management (`/sellers`)
- **Real Seller Data**: Fetches sellers from the database via `/api/seller/list`
- **Features**:
  - View all sellers with their contact information
  - Product count for each seller
  - Edit seller information (name and phone)
  - Delete sellers (removes all their products)
  - Search functionality

### 5. Add Products (`/add`)
- **Database Integration**: Adds products directly to MongoDB
- **Features**:
  - Image upload to Cloudinary
  - Complete product information form
  - Seller information capture
  - Form validation
  - Success/error notifications

### 6. Analytics (`/analytics`)
- **Comprehensive Analytics**: Advanced analytics with real data
- **Features**:
  - Sales by category and subcategory
  - Seller performance metrics
  - Monthly sales trends
  - Order status distribution
  - Revenue by payment method
  - Date range filtering

## API Endpoints Used

### Product Endpoints
- `GET /api/product/list` - Fetch all products
- `POST /api/product/add` - Add new product
- `POST /api/product/remove` - Delete product

### Order Endpoints  
- `POST /api/order/list` - Fetch all orders (admin auth required)
- `POST /api/order/status` - Update order status

### Seller Endpoints
- `GET /api/seller/list` - Fetch all sellers
- `POST /api/seller/update` - Update seller information
- `POST /api/seller/delete` - Delete seller and their products

### Authentication
- `POST /api/user/admin` - Admin login

## Environment Setup

Create a `.env` file in the admin directory:
```
VITE_BACKEND_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run server
```

2. Start the admin panel:
```bash
cd admin  
npm run dev
```

3. Login with admin credentials:
- Email: malithdamsara87@gmail.com
- Password: malith123

## Data Flow

1. **Authentication**: Admin logs in and receives JWT token
2. **Data Fetching**: Each page component calls respective API endpoints
3. **Real-time Updates**: Changes are immediately reflected in the database
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Loading States**: Loading indicators during API calls

## Key Benefits

- **Real Data**: All information comes from the actual MongoDB database
- **Live Updates**: Changes are immediately saved and reflected
- **Comprehensive Management**: Full CRUD operations for all entities
- **Analytics**: Real business insights from actual data
- **Responsive Design**: Works on all device sizes
- **Error Handling**: Robust error handling and user feedback

The admin panel now provides a complete business management solution with real database integration, ensuring all data is persistent and accurate.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
