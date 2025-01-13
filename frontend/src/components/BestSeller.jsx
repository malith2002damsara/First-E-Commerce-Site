import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './Productitem';

const BestSeller = () => {
  const { products } = useContext(ShopContext); // Use useContext to access the products
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products?.length) { // Check if products is defined and has items
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, []); // Add products as a dependency

  return (
    <div className='my-10 mx-5'>
      <div className='text-center text-3xl py-8 '>
        <Title text1='BEST' text2='SELLERS' />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-400'>
          Discover our top-selling products hand-picked for you.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          bestSeller.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
          ))
        }
      </div>
      </div>
     
  );
};

export default BestSeller;
