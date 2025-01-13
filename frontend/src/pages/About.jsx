import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (

    
    <div className='px-5'>
       <div className='text-2xl text-center pt-8 border-t px-5'>
      <Title text1={'ABOUT'} text2={'US'} />
    </div>

    <div className="my-10 flex flex-col md:flex-row gap-16">
      <img src={assets.about_img} alt="" className="w-full md:max-w-[450px]" />
      <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
      <p>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney Colege in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
          </p>
          <p>
           It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney Colege in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
          </p>
          <b className='text-gray-800'>OUR MISSION</b>
          <p>Latin literature from 45 BC</p>
      </div>
    </div>

    <div className="text-xl py-4 px-5">
      <Title text1={'WHY'} text2={'CHOOSE US'} />
    </div>
           
           <div className="flex flex-col md:flex-row text-sm mb-20 px-5">
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
              <b>Quality Assurance:</b>
              <p className='text-gray-600'>looked up one of the more obscure Latin words, consectetur</p>
            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
              <b>Convenience:</b>
              <p className='text-gray-600'>looked up one of the more obscure Latin words, consectetur</p>
            </div>
            <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
              <b>Customer Service:</b>
              <p className='text-gray-600'>looked up one of the more obscure Latin words, consectetur</p>
            </div>
           </div>
                 
                 <NewsletterBox/>

    </div>
    

  )
}

export default About
