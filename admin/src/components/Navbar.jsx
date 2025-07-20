import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-4 px-6 justify-between bg-white shadow-md border-b border-gray-200 sticky top-0 z-50'>
      <div className='flex items-center space-x-3'>
        <img className='w-[max(10%,80px)] h-auto object-contain' src={assets.logo} alt="Ceylon Admin" />
        <div className='hidden sm:block'>
          <h1 className='text-xl font-bold text-gray-800'>Ceylon Admin</h1>
          <p className='text-sm text-gray-500'>Admin Dashboard</p>
        </div>
      </div>
      
      <div className='flex items-center space-x-4'>
        <div className='hidden md:flex items-center space-x-2 text-sm text-gray-600'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
          <span>Online</span>
        </div>
        
        <button 
          onClick={()=> setToken('')} 
          className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2'
        >
          <span className='flex items-center space-x-2'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'></path>
            </svg>
            <span>Logout</span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
