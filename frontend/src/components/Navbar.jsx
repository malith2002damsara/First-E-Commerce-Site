import  { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})

  }




  return (
    <div className='flex items-center justify-between py-5 px-10 font-medium'>
      {/* Logo */}

      <Link to='/'> <img src={assets.logo} className='w-32' alt="Logo" /> </Link>

      {/* Navigation Links */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        {['Home', 'Collection', 'About', 'Contact'].map((item) => (
          <NavLink
            key={item}
            to={item === 'Home' ? './' : `/${item.toLowerCase()}`}
            className='flex flex-col items-center gap-1'
          >
            <p>{item}</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
        ))}
      </ul>


      {/* Icons Section */}
      <div className='flex items-center gap-6'>
        {/* Search Icon */}
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="Search Icon" />

        {/* Profile Icon with Dropdown */}
        <div className='group relative'>
          <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} className='w-5 cursor-pointer' alt="Profile Icon" />
          {/* DropDown Menu */}
          {
            token &&
            <div className='hidden group-hover:block absolute right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700 rounded shadow-lg'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Log Out</p>
              </div>
            </div>
          }

        </div>

        {/* Cart Icon */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart Icon" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt="Menu Icon"
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div className={`fixed top-0 right-0 bottom-0 bg-white z-50 transition-all duration-300 ${visible ? 'w-64' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="Back Icon" />
            <p>Back</p>
          </div>
          {['Home', 'Collection', 'About', 'Contact'].map((item) => (
            <NavLink
              key={item}
              onClick={() => setVisible(false)}
              className='py-2 pl-6 border-t'
              to={item === 'Home' ? './' : `/${item.toLowerCase()}`}
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
