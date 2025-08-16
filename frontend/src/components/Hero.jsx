
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col md:flex-row border border-gray-400 
                    /* Android Phone Heights */
                    min-h-[380px] android-sm:min-h-[400px] android-md:min-h-[420px] 
                    android-lg:min-h-[450px] android-xl:min-h-[480px]
                    /* Standard Breakpoint Heights */
                    xs:min-h-[450px] sm:min-h-[500px] 
                    md:min-h-[550px] lg:min-h-[650px] xl:min-h-[750px] 2xl:min-h-[800px]
                    overflow-hidden bg-white'>
      
      {/* Hero left side */}
      <div className='w-full md:w-1/2 flex items-center justify-center 
                      /* Android Phone Padding */
                      py-6 android-sm:py-7 android-md:py-8 android-lg:py-9 android-xl:py-10
                      px-3 android-sm:px-4 android-md:px-5 android-lg:px-6 android-xl:px-7
                      /* Standard Breakpoint Padding */
                      xs:py-10 sm:py-12 md:py-16 lg:py-20 
                      xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16
                      order-2 md:order-1 bg-white relative z-10'>
        <div className='text-[#414141] w-full 
                        max-w-[280px] android-sm:max-w-[300px] android-md:max-w-[320px] 
                        android-lg:max-w-[350px] android-xl:max-w-[380px]
                        xs:max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl'>
          
          {/* Badge */}
          <div className='flex items-center gap-2 android-sm:gap-2 android-md:gap-3 
                          mb-3 android-sm:mb-4 android-md:mb-5 android-lg:mb-6
                          xs:gap-3 xs:mb-5 sm:mb-6 md:mb-8'>
            <div className='w-6 android-sm:w-7 android-md:w-8 android-lg:w-9 android-xl:w-10
                            xs:w-10 sm:w-12 md:w-14 lg:w-16 
                            h-[1.5px] xs:h-[2px] bg-[#414141]'></div>
            <p className='font-medium 
                          text-[9px] android-sm:text-[10px] android-md:text-xs android-lg:text-xs
                          xs:text-xs sm:text-sm md:text-base lg:text-lg
                          uppercase tracking-wider whitespace-nowrap'>
              OUR BEST SELLERS
            </p>
          </div>

          {/* Main heading */}
          <h1 className='prata-regular font-bold tracking-wide
                         /* Android Phone Text Sizes */
                         text-lg android-sm:text-xl android-md:text-xl android-lg:text-2xl android-xl:text-2xl
                         /* Standard Breakpoint Text Sizes */
                         xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl
                         leading-tight xs:leading-snug sm:leading-normal md:leading-relaxed 
                         mb-4 android-sm:mb-5 android-md:mb-6 android-lg:mb-7
                         xs:mb-8 sm:mb-10 md:mb-12 lg:mb-14'>
            LATEST ARRIVALS
          </h1>
          
          {/* CTA Button */}
          <div className='flex items-center cursor-pointer transition-all duration-300 group
                          gap-1.5 android-sm:gap-2 android-md:gap-2 android-lg:gap-3
                          hover:gap-3 android-sm:hover:gap-4 android-md:hover:gap-4 android-lg:hover:gap-5
                          xs:gap-3 xs:hover:gap-5'>
            <p className='prata-regular font-semibold uppercase tracking-wide
                          text-[10px] android-sm:text-xs android-md:text-xs android-lg:text-sm
                          xs:text-sm sm:text-base md:text-lg lg:text-xl
                          group-hover:text-gray-600 transition-colors duration-300'>
              SHOP NOW
            </p>
            <div className='bg-[#414141] h-[1px] transition-all duration-300
                            w-6 android-sm:w-7 android-md:w-8 android-lg:w-9
                            group-hover:w-8 android-sm:group-hover:w-10 android-md:group-hover:w-12 android-lg:group-hover:w-14
                            xs:w-10 sm:w-12 md:w-14 lg:w-16 
                            xs:group-hover:w-14 sm:group-hover:w-16 md:group-hover:w-20'></div>
          </div>
        </div>
      </div>
      
      {/* Hero right side - Image Container - Android Optimized */}
      <div className='w-full md:w-1/2 order-1 md:order-2 relative overflow-hidden 
                      bg-gradient-to-b from-gray-50 to-gray-100
                      /* Android Phone Specific Heights */
                      h-48 android-sm:h-52 android-md:h-56 android-lg:h-60 android-xl:h-64
                      /* Standard Heights */
                      xs:h-64 sm:h-72 md:h-auto 
                      min-h-[200px] android-sm:min-h-[210px] android-md:min-h-[220px] 
                      android-lg:min-h-[240px] android-xl:min-h-[260px]
                      max-h-[320px] android-sm:max-h-[340px] android-md:max-h-[360px] 
                      android-lg:max-h-[380px] android-xl:max-h-[400px]
                      md:max-h-none'>
        
        {/* Main Hero Image - Android Phone Optimized */}
        <div className='w-full h-full relative'>
          <img 
            className='w-full h-full will-change-transform
                       /* Android Phone Object Positioning */
                       object-cover object-center
                       android-sm:object-cover android-sm:object-[center_10%]
                       android-md:object-cover android-md:object-[center_15%]
                       android-lg:object-cover android-lg:object-[center_18%]
                       android-xl:object-cover android-xl:object-[center_20%]
                       /* Samsung Galaxy Fold Support */
                       android-fold:object-cover android-fold:object-[center_25%]
                       /* Standard Breakpoints */
                       xs:object-cover xs:object-[center_15%]
                       sm:object-cover sm:object-[center_20%]
                       md:object-contain md:object-right
                       lg:object-cover lg:object-center
                       xl:object-cover xl:object-center
                       2xl:object-cover 2xl:object-center
                       /* Android-Optimized Scaling */
                       hover:scale-108 active:scale-102
                       android-sm:hover:scale-105 android-md:hover:scale-106 
                       android-lg:hover:scale-107 android-xl:hover:scale-108
                       transition-all duration-500 ease-out
                       /* Enhanced Visual Quality for Android */
                       filter brightness-[1.01] contrast-[1.02] saturate-[1.03]
                       android-sm:filter android-sm:brightness-[1.02] android-sm:contrast-[1.03] android-sm:saturate-[1.04]' 
            src={assets.hero_img} 
            alt="Latest Fashion Collection" 
            loading="eager"
            style={{
              imageRendering: 'high-quality',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)', // Hardware acceleration for Android
              WebkitBackfaceVisibility: 'hidden', // Safari/WebView support
              WebkitTransform: 'translateZ(0)', // WebView support
            }}
          />
          
          {/* Android-Specific Gradient Overlays */}
          <div className='absolute inset-0 pointer-events-none transition-opacity duration-500
                          /* Small Android Phones */
                          bg-gradient-to-t from-black/2 via-transparent to-transparent
                          android-sm:bg-gradient-to-br android-sm:from-black/1.5 android-sm:via-transparent android-sm:to-transparent
                          /* Medium Android Phones */
                          android-md:bg-gradient-to-br android-md:from-black/1 android-md:via-transparent android-md:to-white/1
                          /* Large Android Phones */
                          android-lg:bg-gradient-to-tr android-lg:from-transparent android-lg:via-black/1 android-lg:to-transparent
                          android-xl:bg-gradient-to-tr android-xl:from-transparent android-xl:via-black/0.5 android-xl:to-white/1
                          /* Foldable Support */
                          android-fold:bg-gradient-to-l android-fold:from-transparent android-fold:via-transparent android-fold:to-white/2
                          /* Standard Breakpoints */
                          xs:bg-gradient-to-br xs:from-black/1 xs:via-transparent xs:to-transparent
                          sm:bg-gradient-to-tr sm:from-transparent sm:via-black/1 sm:to-transparent
                          md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-white/2
                          lg:bg-gradient-to-tr lg:from-transparent lg:via-black/0.5 lg:to-transparent'></div>
          
          {/* Android Screen Frame Enhancement */}
          <div className='absolute inset-0 pointer-events-none
                          ring-1 ring-inset ring-black/2 
                          android-sm:ring-black/1.5 android-md:ring-black/1 android-lg:ring-black/0.5
                          xs:ring-black/1 sm:ring-black/0.5
                          md:ring-0 
                          rounded-none android-sm:rounded-sm android-md:rounded-md md:rounded-none'></div>
          
          {/* Android Performance Indicator */}
          <div className='absolute top-2 right-2 android-sm:top-3 android-sm:right-3 
                          android-md:top-4 android-md:right-4 pointer-events-none
                          w-1 h-1 android-sm:w-1.5 android-sm:h-1.5 android-md:w-2 android-md:h-2
                          bg-white/15 rounded-full animate-android-pulse
                          block android-sm:block android-md:block android-lg:block
                          md:hidden lg:block xl:hidden'></div>
          
          {/* Loading State for Android WebView */}
          <div className='absolute inset-0 flex items-center justify-center
                          bg-gray-50 opacity-0 transition-opacity duration-300 pointer-events-none
                          android-sm:bg-gray-100'>
            <div className='w-6 h-6 android-sm:w-7 android-sm:h-7 android-md:w-8 android-md:h-8 
                            border-2 border-gray-300 border-t-black rounded-full animate-spin'></div>
          </div>
        </div>

        {/* Android-Specific Bottom Enhancement */}
        <div className='absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r 
                        from-transparent via-black/5 to-transparent
                        android-sm:via-black/3 android-md:via-black/2
                        md:hidden pointer-events-none'></div>
        
        {/* Android Fold Specific Enhancement */}
        <div className='absolute inset-y-0 right-0 w-px bg-gradient-to-b 
                        from-transparent via-black/10 to-transparent
                        android-fold:block hidden pointer-events-none'></div>
      </div>
    </div>
  )
}

export default Hero
