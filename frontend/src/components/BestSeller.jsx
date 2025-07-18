import  { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext); // Use useContext to access the products
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  const testNavigation = () => {
    console.log('Testing navigation to collection page...');
    navigate('/collection');
  };

  useEffect(() => {
   // Check if products is defined and has items
      console.log('Products in BestSeller:', products.length);
      const bestProduct = products.filter((item) => item.bestSeller);
      console.log('Bestseller products found:', bestProduct.length);
      setBestSeller(bestProduct) // Show all bestseller products instead of limiting to 5
  }, [products]) // Add products as a dependency

  return (
    <div className='my-10 mx-5'>
      <div className='text-center text-3xl py-8 '>
        <Title text1='BEST' text2='SELLERS' />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-400'>
          Discover our top-selling products hand-picked for you.
        </p>
        {/* Test Button */}
        <button 
          onClick={testNavigation}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          Test Navigation to Collection
        </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.length > 0 ? (
          bestSeller.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
          ))
        ) : (
          <div className='col-span-full text-center text-gray-500 py-8'>
            <p>No bestseller products available at the moment.</p>
            <p className='text-sm'>Check back later for our top-selling items!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
