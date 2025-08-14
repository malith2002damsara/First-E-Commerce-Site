
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='py-12 sm:py-16 lg:py-20'>
      <div className='flex flex-col sm:flex-row justify-around items-center 
                      gap-8 sm:gap-6 lg:gap-12 text-center 
                      text-sm sm:text-base text-gray-600 px-4 sm:px-0'>
        
        <div className='flex flex-col items-center max-w-xs'>
          <img src={assets.exchange_icon} className='w-12 sm:w-14 lg:w-16 mb-4 sm:mb-5' alt="Easy Exchange" />
          <p className='font-semibold text-gray-800 text-base sm:text-lg mb-2'>Easy Exchange Policy</p>
          <p className='text-gray-500 text-sm sm:text-base leading-relaxed'>
            We offer hassle free exchange policy for your convenience
          </p>
        </div>
        
        <div className='flex flex-col items-center max-w-xs'>
          <img src={assets.quality_icon} className='w-12 sm:w-14 lg:w-16 mb-4 sm:mb-5' alt="Return Policy" />
          <p className='font-semibold text-gray-800 text-base sm:text-lg mb-2'>7 Days Free Return</p>
          <p className='text-gray-500 text-sm sm:text-base leading-relaxed'>
            We provide a 7-day free return policy with no questions asked
          </p>
        </div>
        
        <div className='flex flex-col items-center max-w-xs'>
          <img src={assets.support_img} className='w-12 sm:w-14 lg:w-16 mb-4 sm:mb-5' alt="Customer Support" />
          <p className='font-semibold text-gray-800 text-base sm:text-lg mb-2'>Best Customer Support</p>
          <p className='text-gray-500 text-sm sm:text-base leading-relaxed'>
            We provide 24/7 customer service for all your needs
          </p>
        </div>

      </div>
    </div>
  )
}

export default OurPolicy
