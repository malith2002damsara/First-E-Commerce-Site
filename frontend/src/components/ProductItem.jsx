import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  
  return (
    <Link 
      className='text-gray-700 cursor-pointer group block' 
      to={`/product/${id}`}
    >
      <div className='relative overflow-hidden rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300'>
        <img 
          className='w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover 
                     group-hover:scale-110 transition-transform duration-500 ease-out' 
          src={image[0]} 
          alt={name} 
        />
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 
                        transition-all duration-300'></div>
      </div>
      
      <div className='pt-3 sm:pt-4 space-y-1 sm:space-y-2'>
        <p className='text-xs sm:text-sm lg:text-base font-medium text-gray-800 
                      line-clamp-2 group-hover:text-black transition-colors duration-300'>
          {name}
        </p>
        <p className='text-sm sm:text-base lg:text-lg font-bold text-gray-900'>
          {currency}{price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};

export default ProductItem;