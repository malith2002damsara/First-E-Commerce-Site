import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import PropTypes from 'prop-types';

const RelatedProducts = ({category,subCategory}) => {

 
  const {products} = useContext(ShopContext);
  const [related,setRelated]=useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    
    if(products.length > 0){
       setLoading(true);

       let productsCopy = products.slice();

       // First priority: Same category and subcategory
       let sameSubCategory = productsCopy.filter((item)=> 
         category === item.category && subCategory === item.subcategory
       );

       // Second priority: Same category but different subcategory
       let sameCategory = productsCopy.filter((item)=> 
         category === item.category && subCategory !== item.subcategory
       );

       // Third priority: Different category but similar items (bestsellers)
       let bestsellers = productsCopy.filter((item)=> 
         category !== item.category && item.bestseller
       );

       // Fourth priority: All other products if we still need more
       let otherProducts = productsCopy.filter((item)=> 
         category !== item.category && !item.bestseller
       );

       // Combine results with priorities and remove duplicates
       let combinedResults = [...sameSubCategory, ...sameCategory, ...bestsellers, ...otherProducts];
       
       // Remove duplicates based on product ID
       const uniqueProducts = combinedResults.filter((product, index, self) =>
         index === self.findIndex((p) => p._id === product._id)
       );

       setRelated(uniqueProducts.slice(0, 8)); // Show up to 8 related products
       setLoading(false);
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
  
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : related.length > 0 ? (
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
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No related products found</p>
        </div>
      )}
    </div>
  );
  
}
RelatedProducts.propTypes = {
  category: PropTypes.string.isRequired,
  subCategory: PropTypes.string.isRequired
};

export default RelatedProducts

