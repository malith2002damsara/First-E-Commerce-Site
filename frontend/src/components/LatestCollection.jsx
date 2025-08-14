import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className='my-8 sm:my-12 lg:my-16'>
      <div className='text-center py-6 sm:py-8'>
        <Title text1={'LATEST'} text2={'COLLECTION'} />
        <p className='w-11/12 sm:w-3/4 lg:w-2/3 mx-auto text-sm sm:text-base text-gray-600 mt-4 leading-relaxed'>
          Discover our newest arrivals featuring the latest trends in fashion. 
          From casual wear to elegant pieces, find your perfect style.
        </p>
      </div>

      {/* rendering products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                      gap-3 sm:gap-4 lg:gap-6 gap-y-6 sm:gap-y-8 px-2 sm:px-4'>
        {latestProducts.length > 0 ? (
          latestProducts.map((item, index) => (
            <ProductItem 
              key={index} 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price}
            />
          ))
        ) : (
          <div className='col-span-full text-center text-gray-500 py-8 sm:py-12'>
            <div className='max-w-md mx-auto'>
              <p className='text-lg sm:text-xl font-medium mb-2'>No products available</p>
              <p className='text-sm sm:text-base'>Check back soon for our latest collection!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestCollection;