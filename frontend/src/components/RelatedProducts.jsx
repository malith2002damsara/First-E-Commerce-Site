import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import PropTypes from 'prop-types';

const RelatedProducts = ({category,subCategory}) => {

 
  const {products} = useContext(ShopContext);
  const [related,setRelated]=useState([]);

  useEffect(()=>{
    
    if(products.length > 0){

       let productsCopy = products.slice();

       // Filter by category and subcategory (note: backend uses 'subcategory' not 'subCategory')
       productsCopy = productsCopy.filter((item)=> category===item.category);
       productsCopy = productsCopy.filter((item)=> subCategory===item.subcategory);

       setRelated(productsCopy.slice(0,10)); // Show more related products (up to 10)
    }

  },[products, category, subCategory])

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
        {related.length > 0 ? (
          related.map((item, index) => (
            <div key={index} onClick={scrollToTop}>
              <ProductItem 
                id={item._id} 
                name={item.name} 
                price={item.price} 
                image={item.image} 
              />
            </div>
          ))
        ) : (
          <div className='col-span-full text-center text-gray-500 py-8'>
            <p>No related products found.</p>
            <p className='text-sm'>Explore our other collections!</p>
          </div>
        )}
      </div>
    </div>
  );
  
}
RelatedProducts.propTypes = {
  category: PropTypes.string.isRequired,
  subCategory: PropTypes.string.isRequired
};

export default RelatedProducts

