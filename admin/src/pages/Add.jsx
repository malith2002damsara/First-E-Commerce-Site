import React, {useState} from 'react'
import { assets } from '../assets/assets'
import  axios from 'axios'
import {backendUrl} from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name,setName]= useState('');
  const [description,setDescription]= useState('');
  const [price,setPrice]= useState('');
  const [category,setCategory]= useState('Men');
  const [subCategory,setSubCategory]= useState('Topwear');
  const [bestseller,setBestseller]= useState(false);
  const [sizes,setSizes]= useState([]);
  const [sellername,setSellername]= useState('')
  const [sellerphone,setSellerphone]= useState('')


  const onSubmitHandler = async (e)=> {

    e.preventDefault();
    try{

      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      formData.append("sellername", sellername)
formData.append("sellerphone", sellerphone)

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if(response.data.success){
        
       toast.success("Product Added Successfully")
       setName('')
       setDescription('')
       setPrice('')
       setCategory('Men') // Reset to default value
       setSubCategory('Topwear') // Reset to default value
       setBestseller(false) // Reset to default value
       setSizes([]) // Reset to empty array
       setSellername('') // This was the issue - reset to empty string is correct
       setSellerphone('') // This was the issue - reset to empty string is correct
       setImage1(false)
       setImage2(false)
       setImage3(false)
       setImage4(false)
      }else{
        toast.error(response.data.message)
      }

    }catch(error){
      console.log(error);
      toast.error(error.message)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 '>
    <div >
      <p className="mb-2 text-lg font-semibold text-purple-800">Upload Image</p>

      <div className="flex gap-4">
        <label htmlFor='image1' className="cursor-pointer hover:scale-105 transition-transform">
          <div className='w-32 h-32 flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border-2 border-dashed border-pink-300 hover:border-pink-500'>
            <img className='w-full h-full opacity-70' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
          </div>
          <input onChange={(e)=>setImage1(e.target.files[0])} type='file' id='image1' className="hidden" />
        </label>
        <label htmlFor='image2' className="cursor-pointer hover:scale-105 transition-transform">
          <div className='w-32 h-32 flex items-center justify-center bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500'>
            <img src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" className='w-full h-full opacity-70' />
          </div>
          <input onChange={(e)=>setImage2(e.target.files[0])} type='file' id='image2' className="hidden" />
        </label>
        <label htmlFor='image3' className="cursor-pointer hover:scale-105 transition-transform">
          <div className='w-32 h-32 flex items-center justify-center bg-gradient-to-r from-green-100 to-teal-100 rounded-lg border-2 border-dashed border-green-300 hover:border-green-500'>
            <img src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" className='w-full h-full opacity-70' />
          </div>
          <input onChange={(e)=>setImage3(e.target.files[0])} type='file' id='image3' className="hidden" />
        </label>
        <label htmlFor='image4' className="cursor-pointer hover:scale-105 transition-transform">
          <div className='w-32 h-32 flex items-center justify-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-dashed border-orange-300 hover:border-orange-500'>
            <img src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" className='w-full h-full opacity-70' />
          </div>
          <input onChange={(e)=>setImage4(e.target.files[0])} type='file' id='image4' className="hidden" />
        </label>
      </div>
    </div>

     <div className="w-full">
      <p className="mb-2">Product Name</p>
      <input onChange={(e)=> setName(e.target.value)} value = {name} className='w-full max-w-[500px] px-3 py-2' type = 'text' placeholder='Type Here' required/>
     </div>

     <div className="w-full">
      <p className="mb-2">Product Description</p>
      <textarea onChange={(e)=> setDescription(e.target.value)} value = {description} className='w-full max-w-[500px] px-3 py-2' type = 'text' placeholder='Write Content Here' required/>
     </div>

      <div className="w-full">
      <p className="mb-2">Seller Name</p>
      <input onChange={(e)=> setSellername(e.target.value)} value = {sellername} className='w-full max-w-[500px] px-3 py-2' type = 'text' placeholder='Type Here' required/>
     </div>
     
      <div className="w-full">
      <p className="mb-2">Seller Phone Number</p>
      <input onChange={(e)=> setSellerphone(e.target.value)} value = {sellerphone} className='w-full max-w-[500px] px-3 py-2' type = 'tel' placeholder='Type Here' required/>
     </div>

     <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">

      <div className="">
        <p className="mb-2">Product Category</p>
        <select onChange={(e)=> setCategory(e.target.value)} value={category} className="w-full px-3 py-2">
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>

      <div className="">
        <p className="mb-2">Sub Category</p>
        <select onChange={(e)=> setSubCategory(e.target.value)} value={subCategory} className="w-full px-3 py-2">
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Winterwear">Winterwear</option>
        </select>
      </div>

      <div className="">
        <p className="mb-2">Product Price</p>
        <input onChange={(e)=> setPrice(e.target.value)} value = {price} className='w-full px-3 py-2 sm:w-[120px]' type = 'number' placeholder='25' required/>

      </div>

     </div>

     <div className="">
      <p className="mb-2">Product Sizes</p>
      <div className="flex gap-3">
        <div onClick={()=>setSizes(prev => prev.includes('S') ? prev.filter( item => item !== 'S') : [...prev, 'S'] )} className="">
          <p className={`${sizes.includes('S') ? 'bg-blue-500 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>S</p>
        </div>
        <div onClick={()=>setSizes(prev => prev.includes('M') ? prev.filter( item => item !== 'M') : [...prev, 'M'] )} className="">
          <p className={`${sizes.includes('M') ? 'bg-blue-500 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>M</p>
        </div>
        <div onClick={()=>setSizes(prev => prev.includes('L') ? prev.filter( item => item !== 'L') : [...prev, 'L'] )} className="">
          <p className={`${sizes.includes('L') ? 'bg-blue-500 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>L</p>
        </div>
        <div onClick={()=>setSizes(prev => prev.includes('XL') ? prev.filter( item => item !== 'XL') : [...prev, 'XL'] )} className="">
          <p className={`${sizes.includes('XL') ? 'bg-blue-500 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>XL</p>
        </div>
        <div onClick={()=>setSizes(prev => prev.includes('XXL') ? prev.filter( item => item !== 'XXL') : [...prev, 'XXL'] )} className="">
          <p className={`${sizes.includes('XXL') ? 'bg-blue-500 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>XXL</p>
        </div>
        <div onClick={()=>setSizes(prev => prev.includes('XXXL') ? prev.filter( item => item !== 'XXXL') : [...prev, 'XXXL'] )} className="">
          <p className={`${sizes.includes('XXXL') ? 'bg-blue-500 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>XXXL</p>
        </div>
      </div>
     </div>


    <div className="mt-2">
      <input onChange={()=> setBestseller(prev=>!prev)} checked={bestseller} type='checkbox' id='bestseller'/>
      <label className='cursor-pointer ml-2' htmlFor='bestseller'>Add To Bestseller</label>
    </div>

   <button type='submit' className='w-28 py-3 mt-4 bg-black text-white '>ADD</button>

  </form>
  )
}

export default Add;