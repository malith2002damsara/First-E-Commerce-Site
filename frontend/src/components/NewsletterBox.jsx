

const NewsletterBox = () => {

const onSubmitHandler= (event) =>{
  event.preventDefault();

}

  return (
    <div className='text-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20'>
      <div className='max-w-2xl mx-auto'>
        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
          SUBSCRIBE NOW & GET 20% OFF
        </h2>
        <p className='text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed px-4'>
          Join our newsletter to get exclusive offers, latest fashion updates, and be the first to know about new arrivals.
        </p>
        
        <form onSubmit={onSubmitHandler} className='w-full max-w-md mx-auto'>
          <div className='flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 
                          border border-gray-300 rounded-lg sm:rounded-none overflow-hidden
                          shadow-sm hover:shadow-md transition-shadow duration-300'>
            <input 
              className='flex-1 px-4 py-3 sm:py-4 outline-none text-sm sm:text-base
                         placeholder-gray-400 border-0 sm:border-r border-gray-300' 
              type="email" 
              placeholder='Enter your email address' 
              required
            />
            <button 
              type='submit' 
              className='bg-black hover:bg-gray-800 text-white font-medium 
                         text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4
                         transition-colors duration-300 uppercase tracking-wider'
            >
              SUBSCRIBE
            </button>
          </div>
        </form>
        
        <p className='text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6'>
          *Offer valid for new subscribers only. Terms and conditions apply.
        </p>
      </div>
    </div>
  )
}

export default NewsletterBox
