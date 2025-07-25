import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'LKR';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  // Initialize cartItems with proper fallback
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch {
      return {};
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`, 
          { itemId, size }, 
          { headers: { token } }
        );
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.response?.data?.message || 'Error adding to cart');
      }
    }
  };

  const getCartCount = () => {
    if (!cartItems || typeof cartItems !== 'object') {
      return 0;
    }

    let totalCount = 0;
    
    Object.values(cartItems).forEach(items => {
      if (typeof items === 'number') {
        totalCount += items > 0 ? items : 0;
      } else if (items && typeof items === 'object') {
        Object.values(items).forEach(count => {
          if (typeof count === 'number' && count > 0) {
            totalCount += count;
          }
        });
      }
    });

    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!cartItems[itemId]) return;

    const newQuantity = Math.max(0, quantity); // Ensure not negative
    const cartData = structuredClone(cartItems);
    
    if (newQuantity === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = newQuantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity: newQuantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast.error(error.response?.data?.message || 'Error updating quantity');
      }
    }
  };

  // Remove specific item and size from cart
  const removeFromCart = async (itemId, size) => {
    const cartData = structuredClone(cartItems);
    
    if (cartData[itemId] && cartData[itemId][size]) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/remove`,
            { itemId, size },
            { headers: { token } }
          );
          toast.success('Item removed from cart');
        } catch (error) {
          console.error('Error removing from cart:', error);
          toast.error(error.response?.data?.message || 'Error removing from cart');
        }
      }
    }
  };

  // Remove entire item (all sizes) from cart
  const removeEntireItem = async (itemId) => {
    const cartData = structuredClone(cartItems);
    
    if (cartData[itemId]) {
      delete cartData[itemId];
      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/remove`,
            { itemId },
            { headers: { token } }
          );
          toast.success('Item removed from cart');
        } catch (error) {
          console.error('Error removing item from cart:', error);
          toast.error(error.response?.data?.message || 'Error removing item');
        }
      }
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems({});

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/clear`,
          {},
          { headers: { token } }
        );
        toast.success('Cart cleared successfully');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error(error.response?.data?.message || 'Error clearing cart');
      }
    }
  };

  const getCartAmount = () => {
    if (!cartItems || typeof cartItems !== 'object') return 0;

    let totalAmount = 0;
    
    Object.entries(cartItems).forEach(([itemId, sizes]) => {
      const itemInfo = products.find(product => product._id === itemId);
      if (!itemInfo) return;

      Object.values(sizes).forEach(quantity => {
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      });
    });

    return totalAmount;
  };

  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Error loading products');
    }
  }, [backendUrl]);

  const getUserCart = useCallback(async (userToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );
      
      setCartItems(response.data.success ? response.data.cartData || {} : {});
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems({});
    }
  }, [backendUrl]);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else if (localStorage.getItem('token')) {
      const savedToken = localStorage.getItem('token');
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, [token, getUserCart]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    removeFromCart,
    removeEntireItem,
    clearCart,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ShopContextProvider;