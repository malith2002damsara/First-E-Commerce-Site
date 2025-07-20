
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center pt-16 pb-8'>
          <Title text1={'ABOUT'} text2={'US'} />
          <div className='w-24 h-1 bg-black mx-auto mt-4'></div>
        </div>

        <div className="my-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <img 
              src={assets.about_img} 
              alt="About Ceylon" 
              className="w-full rounded-2xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="text-lg">
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.
              </p>
              <p className="text-lg">
                It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.
              </p>
            </div>
            <div className="border-l-4 border-black pl-6 bg-gray-50 p-6 rounded-r-lg">
              <h3 className='text-2xl font-bold text-gray-800 mb-3'>OUR MISSION</h3>
              <p className="text-gray-600 text-lg">Latin literature from 45 BC</p>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="text-center mb-12">
            <Title text1={'WHY'} text2={'CHOOSE US'} />
            <div className='w-24 h-1 bg-black mx-auto mt-4'></div>
          </div>
           
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 hover:border-black transition-colors duration-300 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-center mb-4">Quality Assurance</h4>
              <p className='text-gray-600 text-center leading-relaxed'>looked up one of the more obscure Latin words, consectetur</p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 hover:border-black transition-colors duration-300 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-center mb-4">Convenience</h4>
              <p className='text-gray-600 text-center leading-relaxed'>looked up one of the more obscure Latin words, consectetur</p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 hover:border-black transition-colors duration-300 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-center mb-4">Customer Service</h4>
              <p className='text-gray-600 text-center leading-relaxed'>looked up one of the more obscure Latin words, consectetur</p>
            </div>
          </div>
        </div>
                 
        <div className="pb-16">
          <NewsletterBox/>
        </div>
      </div>
    </div>
  )
}

export default About
