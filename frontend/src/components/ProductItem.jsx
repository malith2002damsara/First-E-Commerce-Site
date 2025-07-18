import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  
  // Ensure image array exists and has at least one item
  const imageUrl = image && image.length > 0 ? image[0] : '';
  
  if (!imageUrl) {
    console.warn('ProductItem: No image provided for product', { id, name });
  }
  
  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        {imageUrl ? (
          <img 
            className='hover:scale-110 transition ease-in-out' 
            src={imageUrl} 
            alt={name}
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className='h-48 bg-gray-200 flex items-center justify-center'>
            <span className='text-gray-500'>No Image</span>
          </div>
        )}
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
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