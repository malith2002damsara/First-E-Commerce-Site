
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section - Full width without horizontal padding */}
      <div className='w-full'>
        <Hero/>
      </div>
      
      {/* Content sections with responsive padding and spacing */}
      <div className='px-3 sm:px-6 lg:px-8 xl:px-12 max-w-8xl mx-auto'>
        <div className='space-y-12 sm:space-y-16 lg:space-y-20 py-8 sm:py-12 lg:py-16'>
          <LatestCollection/>
          <BestSeller/>
          <OurPolicy/>
          <NewsletterBox/>
        </div>
      </div>
    </div>
  )
}

export default Home
