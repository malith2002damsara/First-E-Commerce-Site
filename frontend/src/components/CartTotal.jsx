import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className='w-full px-4 sm:px-5 md:px-6 max-w-md mx-auto'>
      <div className="text-xl sm:text-2xl">
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className="flex flex-col gap-3 mt-3 sm:mt-4 text-sm sm:text-base">
        <div className="flex justify-between">
          <p className="text-gray-700">Subtotal</p>
          <p className="font-medium">{currency}{subtotal}.00</p>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between">
          <p className="text-gray-700">Shipping Fee</p>
          <p className="font-medium">{currency}{delivery_fee}.00</p>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between mt-1">
          <b className="text-base sm:text-lg">Total</b>
          <b className="text-base sm:text-lg">{currency}{total}.00</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal