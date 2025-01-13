import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t px-5">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 px-5">
        <img src={assets.contact_img} alt="" className="w-full md:max-w-[480px]" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">OUR STORE</p>
          <p className="text-gray-500">536587 WILIAMS STATION <br /> Suite 350 , Washington , USA </p>
          <p className="text-gray-500">TEL : 0776270882 <br />Email : malithdamsara76@gmail.com</p>
          <p className="font-semibold text-xl text-gray-600">Careers at Forever</p>
          <p className="text-gray-500">my name is malith damsara</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'> Explore Jobs </button>
        </div>
      </div>
                <NewsletterBox/>    
    </div>
  )
}

export default Contact
