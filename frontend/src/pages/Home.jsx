
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <Hero/>
        <div className='space-y-16 py-12'>
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
