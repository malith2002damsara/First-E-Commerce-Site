import productModel from "../models/productModel.js";

// Get all sellers
const getAllSellers = async (req, res) => {
  try {
    const products = await productModel.find({});
    const sellersMap = {};

    // Extract unique sellers from products
    products.forEach(product => {
      if (!sellersMap[product.sellername]) {
        sellersMap[product.sellername] = {
          name: product.sellername,
          phone: product.sellerphone,
          productCount: 0,
          products: []
        };
      }
      sellersMap[product.sellername].productCount++;
      sellersMap[product.sellername].products.push(product._id);
    });

    const sellers = Object.values(sellersMap);
    res.json({ success: true, sellers });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update seller information (name and phone)
const updateSeller = async (req, res) => {
  try {
    const { oldName, newName, newPhone } = req.body;

    if (!oldName || !newName || !newPhone) {
      return res.status(400).json({ 
        success: false, 
        message: "Old name, new name, and new phone are required" 
      });
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(newPhone)) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number must be exactly 10 digits" 
      });
    }

    // Check if new name already exists (if different from old name)
    if (oldName !== newName) {
      const existingSeller = await productModel.findOne({ sellername: newName });
      if (existingSeller) {
        return res.status(400).json({ 
          success: false, 
          message: "A seller with this name already exists" 
        });
      }
    }

    // Update all products with this seller name
    const updateResult = await productModel.updateMany(
      { sellername: oldName },
      { 
        sellername: newName.trim(),
        sellerphone: newPhone.trim()
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Seller not found or no changes made" 
      });
    }

    res.json({ 
      success: true, 
      message: `Seller updated successfully. ${updateResult.modifiedCount} products updated.`,
      modifiedCount: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete seller and all their products
const deleteSeller = async (req, res) => {
  try {
    const { sellerName } = req.body;

    if (!sellerName) {
      return res.status(400).json({ 
        success: false, 
        message: "Seller name is required" 
      });
    }

    // First, get all products for this seller to count them
    const sellerProducts = await productModel.find({ sellername: sellerName });
    
    if (sellerProducts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Seller not found" 
      });
    }

    // Delete all products for this seller
    const deleteResult = await productModel.deleteMany({ sellername: sellerName });

    res.json({ 
      success: true, 
      message: `Seller and ${deleteResult.deletedCount} products deleted successfully`,
      deletedProductsCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllSellers, updateSeller, deleteSeller };
