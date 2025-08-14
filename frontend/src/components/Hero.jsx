
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'>
      {/* Hero left side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-8 sm:py-10 lg:py-0 px-4 sm:px-6 lg:px-8'>
        <div className='text-[#414141] max-w-md lg:max-w-lg'>
          <div className='flex items-center gap-2 mb-4 sm:mb-6'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-xs sm:text-sm md:text-base uppercase tracking-wider'>OUR BEST SELLERS</p>
          </div>

          <h1 className='prata-regular text-2xl sm:text-3xl lg:text-5xl xl:text-6xl leading-tight sm:leading-relaxed mb-6 sm:mb-8'>
            LATEST ARRIVALS
          </h1>
          
          <div className='flex items-center gap-2 cursor-pointer hover:gap-4 transition-all duration-300 group'>
            <p className='prata-regular font-semibold text-sm md:text-base group-hover:text-gray-600 transition-colors'>
              SHOP NOW
            </p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141] group-hover:w-12 md:group-hover:w-16 transition-all duration-300'></p>
          </div>
        </div>
      </div>
      
      {/* Hero right side */}
      <div className='w-full sm:w-1/2 h-64 sm:h-auto'>
        <img 
          className='w-full h-full object-cover sm:object-contain' 
          src={assets.hero_img} 
          alt="Latest Fashion Collection" 
        />
      </div>
    </div>
  )
}

export default Hero
