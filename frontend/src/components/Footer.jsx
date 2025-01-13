import React from 'react'
import { assets } from '../assets/assets'
import { Link} from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-5'>

        <div>
        <Link to='/'> <img on src={assets.logo} alt="" className='mb-5 w-32' /> </Link> 

          <p className='w-full md:w-1/2 text-gray-600'>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney Colege in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>HOME</li>
            <li>ABOUT US</li>
            <li>DELIVERY</li>
            <li>PRIVACY POLICY</li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>077 6270882</li>
            <li>malithdamsara76@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-center text-sm'>Copyright 2024@ miracle.com</p>
      </div>
    </div>
  )
}

export default Footer
