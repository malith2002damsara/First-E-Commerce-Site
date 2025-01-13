import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './Productitem';

const RelatedProducts = ({category,subCategory}) => {

 
  const {products} = useContext(ShopContext);
  const [related,setRelated]=useState([]);

  useEffect(()=>{
    
    if(products.length > 0){

       let productsCopy = products.slice();

       productsCopy = productsCopy.filter((item)=> category===item.category);
       productsCopy = productsCopy.filter((item)=> subCategory===item.subCategory);

       setRelated(productsCopy.slice(0,5));
    }

  },[products])

  const scrollToTop = () => {
    const scrollDuration = 1; // Duration in ms
    const scrollStep = -window.scrollY / (scrollDuration / 15);
  
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };
  

  return (
    <div className='my-24 px-5'>
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
  
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <div key={index} onClick={scrollToTop}>
            <ProductItem 
              id={item._id} 
              name={item.name} 
              price={item.price} 
              image={item.image} 
            />
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default RelatedProducts
