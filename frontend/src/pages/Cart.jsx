import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';


const Cart = () => {

  const { 
    products, 
    currency, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    navigate 
  } = useContext(ShopContext);
  
  const [cartData, setCartData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null); // Track which item is being deleted

  useEffect(() => {
    if(products.length > 0){
       const tempData = [];
    
      for (const items of Object.entries(cartItems)) {
        const [itemId, itemDetails] = items; // Destructure key and value
    
        if (typeof itemDetails === 'object') {
          for (const [size, quantity] of Object.entries(itemDetails)) {
            if (typeof quantity === 'number' && quantity > 0) {
              tempData.push({
                _id: itemId,
                size: size,
                quantity: quantity,
              });
            }
          }
        } else if (typeof itemDetails === 'number' && itemDetails > 0) {
          // Handle case if cartItems[itemId] is a direct number
          tempData.push({
            _id: itemId,
            size: 'default', // Default size if no size property exists
            quantity: itemDetails,
          });
        }
      }
    
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Handle item deletion with confirmation
  const handleDeleteItem = async (itemId, size) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setIsDeleting(`${itemId}-${size}`);
      try {
        await removeFromCart(itemId, size);
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Handle clearing entire cart
  const handleClearCart = async () => {
    if (cartData.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Handle quantity update
  const handleQuantityChange = (itemId, size, newQuantity) => {
    if (newQuantity === '' || newQuantity === '0') {
      handleDeleteItem(itemId, size);
    } else {
      updateQuantity(itemId, size, Number(newQuantity));
    }
  };

  if (cartData.length === 0) {
    return (
      <div className='border-t pt-14 px-5 min-h-screen'>
        <div className="text-2xl mb-8">
          <Title text1={'Your'} text2={'Cart'}/>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <img src={assets.cart_icon} alt="Empty Cart" className="w-24 h-24 opacity-50 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <button 
            onClick={() => navigate('/collection')} 
            className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='border-t pt-14 px-5'>
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl">
          <Title text1={'Your'} text2={'Cart'}/>
        </div>
        <div className="flex gap-3">
          <span className="text-sm text-gray-600">
            {cartData.length} item{cartData.length !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-800 underline transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          const isCurrentlyDeleting = isDeleting === `${item._id}-${item.size}`;
          
          if (!productData) return null;

          return (
            <div 
              key={index} 
              className={`py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_1fr_1fr] sm:grid-cols-[4fr_2fr_1fr_1fr] items-center gap-4 transition-opacity ${
                isCurrentlyDeleting ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img src={productData.image[0]} alt="" className="w-16 sm:w-20 rounded-md" />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="font-medium">{currency}{productData.price}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-sm rounded">{item.size}</p>
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  disabled={isCurrentlyDeleting}
                >
                  -
                </button>
                <input 
                  onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                  type="number" 
                  min={1} 
                  value={item.quantity} 
                  className="border max-w-12 text-center px-1 py-1 rounded"
                  disabled={isCurrentlyDeleting}
                />
                <button 
                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  disabled={isCurrentlyDeleting}
                >
                  +
                </button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <p className="font-medium">{currency}{(productData.price * item.quantity).toLocaleString()}</p>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteItem(item._id, item.size)}
                  disabled={isCurrentlyDeleting}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                  title="Remove item"
                >
                  {isCurrentlyDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img src={assets.bin_icon} alt="Delete" className="w-4 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal/>
          <div className="w-full text-end">
            <button 
              onClick={() => navigate('/place-order')} 
              className='bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-800 transition-colors'
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  ) 
}

export default Cart
