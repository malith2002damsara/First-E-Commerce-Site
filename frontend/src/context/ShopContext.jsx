import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import {assets} from '../assets/assets'

export const ShopContext = createContext();

const ShopContextProvider =(props) => {


  const currency = 'LKR';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search,setSearch]= useState('');
  const [showSearch,setShowSearch]=useState(false);
  const [cartItems,setCartItems]=useState({});
  const [products,setProducts]= useState([]);
  const [token,setToken]= useState('')
  const navigate = useNavigate();

  const addToCart = async (itemId,size)=> {

    if(!size){
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){

      if(cartData[itemId][size]){
        cartData[itemId][size] +=1;
      }
      else{
        cartData[itemId][size]=1;
      }
    }
    else{
      cartData[itemId]= {};
      cartData[itemId][size]=1;
    }
    setCartItems(cartData)

    if(token){
      try{
        await axios.post(backendUrl + '/api/cart/add',{itemId,size}, {headers:{token}})

      }catch(error){
        console.log(error);
        toast.error('Error adding to cart');


  }
}
    }

  const getCartCount = () => {
    let totalCount = 0;
  
    for (const items of Object.values(cartItems)) {
      try {
        if (typeof items === 'number' && items > 0) {
          totalCount += items;
        } else if (typeof items === 'object') {
          for (const count of Object.values(items)) {
            if (typeof count === 'number' && count > 0) {
              totalCount += count;
            }
          }
        }
      } catch (error) {
        console.error('Error calculating cart count:', error);
      }
    }
  
    return totalCount;
  };

  const updateQuantity = async(itemId,size,quantity) =>{

    let cartData = structuredClone(cartItems);
    cartData[itemId][size]= quantity;

    setCartItems(cartData);
     
    if(token){
      try{
        await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity}, {headers:{token}})
      }catch(error){

         console.log(error);
        toast.error(error.message)
    }

  }

  }

  const getCartAmount =()=> {
            
    let totalAmount =0;
    for(const items in cartItems){
      let itemInfo = products.find((product)=> product._id === items);
      for(const item in cartItems[items]){
        try{
          if(cartItems[items][item] > 0){
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error){
          console.error('Error calculating cart amount:', error);

        }
      }
    }
    return totalAmount;
  }

  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
        
      if(response.data.success){
        setProducts(response.data.products);
      }else{
        toast.error(response.data.message);
      }
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl])

  useEffect(() => {
    getProductsData();
  },[getProductsData])


  const getUserCart = async (token) => {
    try{
      const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}})
        if(response.data.success){
          setCartItems(response.data.cartData);
    }}catch(error){
      console.log(error);
      toast.error(error.message);
    }

  }

  useEffect(() => {
    if(!token && localStorage.getItem('token')){
           setToken(localStorage.getItem('token'))
           getUserCart(localStorage.getItem('token'))
    }
  },[token])

  

    const value ={
      products,currency,delivery_fee,
      search,setSearch,showSearch,setShowSearch,
      cartItems,addToCart,setCartItems,
      getCartCount,updateQuantity,
      getCartAmount,navigate ,backendUrl,
      setToken,token

    }
    
    return(
      <ShopContext.Provider value={value}>
        {props.children}
      </ShopContext.Provider>
    )
}
ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ShopContextProvider;
