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
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if(products.length > 0) {
      const tempData = [];
    
      for (const items of Object.entries(cartItems)) {
        const [itemId, itemDetails] = items;
    
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
          tempData.push({
            _id: itemId,
            size: 'default',
            quantity: itemDetails,
          });
        }
      }
    
      setCartData(tempData);
    }
  }, [cartItems, products]);

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

  const handleQuantityChange = (itemId, size, newQuantity) => {
    if (newQuantity === '' || newQuantity === '0') {
      handleDeleteItem(itemId, size);
    } else {
      updateQuantity(itemId, size, Number(newQuantity));
    }
  };

  if (cartData.length === 0) {
    return (
      <div className='border-t pt-14 px-4 sm:px-5 min-h-screen'>
        <div className="text-xl sm:text-2xl mb-6 sm:mb-8">
          <Title text1={'Your'} text2={'Cart'}/>
        </div>
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <img 
            src={assets.cart_icon} 
            alt="Empty Cart" 
            className="w-20 h-20 sm:w-24 sm:h-24 opacity-50 mb-3 sm:mb-4" 
          />
          <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-center text-sm sm:text-base mb-5 sm:mb-6 px-4">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <button 
            onClick={() => navigate('/collection')} 
            className="bg-black text-white px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='border-t pt-14 px-4 sm:px-5'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="text-xl sm:text-2xl">
          <Title text1={'Your'} text2={'Cart'}/>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-xs sm:text-sm text-gray-600">
            {cartData.length} item{cartData.length !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={handleClearCart}
            className="text-xs sm:text-sm text-red-600 hover:text-red-800 underline transition-colors"
            disabled={cartData.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-4">
        {cartData.map((item) => {
          const productData = products.find((product) => product._id === item._id);
          const isCurrentlyDeleting = isDeleting === `${item._id}-${item.size}`;
          
          if (!productData) return null;

          return (
            <div 
              key={`${item._id}-${item.size}`} 
              className={`py-3 sm:py-4 border-t border-b text-gray-700 grid grid-cols-12 gap-2 sm:gap-4 items-center transition-opacity ${
                isCurrentlyDeleting ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Product Info */}
              <div className="col-span-7 sm:col-span-5 flex items-start gap-3 sm:gap-6">
                <img 
                  src={productData.image[0]} 
                  alt={productData.name} 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover" 
                />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm md:text-base font-medium line-clamp-2">
                    {productData.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-2">
                    <p className="text-xs sm:text-sm font-medium">{currency}{productData.price}</p>
                    <p className="px-1.5 sm:px-2 py-0.5 border bg-slate-50 text-xs sm:text-sm rounded">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="col-span-3 sm:col-span-3 flex items-center justify-center gap-1 sm:gap-2">
                <button 
                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                  className="w-6 h-6 sm:w-8 sm:h-8 border rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base"
                  disabled={isCurrentlyDeleting || item.quantity <= 1}
                >
                  -
                </button>
                <input 
                  onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                  type="number" 
                  min={1} 
                  value={item.quantity} 
                  className="border w-10 sm:w-12 text-center px-1 py-1 rounded text-xs sm:text-sm"
                  disabled={isCurrentlyDeleting}
                />
                <button 
                  onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                  className="w-6 h-6 sm:w-8 sm:h-8 border rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base"
                  disabled={isCurrentlyDeleting}
                >
                  +
                </button>
              </div>

              {/* Total Price */}
              <div className="col-span-1 sm:col-span-2 text-right">
                <p className="text-xs sm:text-sm font-medium">
                  {currency}{(productData.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Delete Button */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => handleDeleteItem(item._id, item.size)}
                  disabled={isCurrentlyDeleting}
                  className="p-1 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                  title="Remove item"
                >
                  {isCurrentlyDeleting ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img src={assets.bin_icon} alt="Delete" className="w-3 sm:w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-10 sm:my-20">
        <div className="w-full sm:w-[400px] md:w-[450px]">
          <CartTotal/>
          <div className="w-full text-center sm:text-end mt-6 sm:mt-8">
            <button 
              onClick={() => navigate('/place-order')} 
              className='bg-black text-white text-xs sm:text-sm px-6 py-2.5 sm:px-8 sm:py-3 hover:bg-gray-800 transition-colors rounded w-full sm:w-auto'
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