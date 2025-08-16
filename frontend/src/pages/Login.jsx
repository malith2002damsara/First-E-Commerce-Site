import  { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {
  

  const [currentState , setCurrentState] = useState('Login');
  const {token , setToken, navigate, backendUrl} = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')

  const onSubmitHandler = async (event)=>{
    event.preventDefault();
    try{
      if(currentState === 'Sign Up'){

        const response = await axios.post(backendUrl + '/api/user/register' , {name,email,password})
        
        if(response.data.success){
           setToken(response.data.token)
           localStorage.setItem('token',response.data.token)
        }else{
          toast.error(response.data.message)
        }

      }else{
               const response = await axios.post(backendUrl + '/api/user/login' , {email,password})
               if(response.data.success){
                  setToken(response.data.token)
                  localStorage.setItem('token',response.data.token)
      }else{
                  toast.error(response.data.message)
               }
      }

        
    }catch(error){
        console.log(error)
        toast.error(error.message)
        // console.log("Making request to:", backendUrl + '/api/user/...');
    }
  }

  useEffect(()=>{

    if(token){
    navigate('/')
    }

  },[token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
                    flex items-center justify-center 
                    py-6 xs:py-8 sm:py-12 
                    px-3 xs:px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        
        {/* Main Card */}
        <div className="bg-white 
                        p-6 xs:p-8 sm:p-10 lg:p-12 
                        rounded-2xl sm:rounded-3xl 
                        shadow-xl sm:shadow-2xl 
                        border border-gray-100
                        transform transition-all duration-300 hover:shadow-3xl">
          
          {/* Header */}
          <div className="text-center mb-6 xs:mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl 
                             font-bold text-gray-800">
                {currentState}
              </h1>
              <div className='h-[2px] w-8 xs:w-10 sm:w-12 lg:w-14 
                              bg-gray-800 rounded-full'></div>
            </div>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 
                          leading-relaxed px-2">
              {currentState === 'Login' 
                ? 'Welcome back to Ceylon Fashion' 
                : 'Join the Ceylon Fashion community'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="space-y-5 xs:space-y-6 sm:space-y-8">
            
            {/* Name Field - Only for Sign Up */}
            {currentState === 'Sign Up' && (
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-700">
                  Full Name
                </label>
                <input 
                  onChange={(e)=>setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  className="w-full 
                             px-4 xs:px-5 sm:px-6 
                             py-3 xs:py-4 sm:py-4 
                             text-sm xs:text-base
                             border border-gray-300 
                             rounded-xl sm:rounded-2xl 
                             focus:ring-2 focus:ring-black focus:border-black 
                             transition-all duration-300 
                             shadow-sm focus:shadow-md
                             placeholder-gray-400" 
                  placeholder='Enter your full name' 
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-700">
                Email Address
              </label>
              <input  
                onChange={(e)=>setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className="w-full 
                           px-4 xs:px-5 sm:px-6 
                           py-3 xs:py-4 sm:py-4 
                           text-sm xs:text-base
                           border border-gray-300 
                           rounded-xl sm:rounded-2xl 
                           focus:ring-2 focus:ring-black focus:border-black 
                           transition-all duration-300 
                           shadow-sm focus:shadow-md
                           placeholder-gray-400" 
                placeholder='Enter your email address' 
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-700">
                Password
              </label>
              <input 
                onChange={(e)=>setPassword(e.target.value)} 
                value={password} 
                type="password" 
                className="w-full 
                           px-4 xs:px-5 sm:px-6 
                           py-3 xs:py-4 sm:py-4 
                           text-sm xs:text-base
                           border border-gray-300 
                           rounded-xl sm:rounded-2xl 
                           focus:ring-2 focus:ring-black focus:border-black 
                           transition-all duration-300 
                           shadow-sm focus:shadow-md
                           placeholder-gray-400" 
                placeholder='Enter your password' 
                required
              />
            </div>

            {/* Action Links */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between 
                            gap-3 xs:gap-0 text-sm sm:text-base pt-2">
              <button 
                type="button" 
                className="text-gray-600 hover:text-black transition-colors duration-300 
                           text-left xs:text-center underline decoration-dotted"
              >
                Forgot Your Password?
              </button>
              
              {currentState === 'Login' ? (
                <button 
                  type="button"
                  onClick={()=>setCurrentState('Sign Up')} 
                  className="text-black font-semibold hover:underline transition-all duration-300
                             text-left xs:text-right"
                >
                  Create New Account
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={()=>setCurrentState('Login')} 
                  className="text-black font-semibold hover:underline transition-all duration-300
                             text-left xs:text-right"
                >
                  Already have account? Login
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-black text-white 
                         py-3 xs:py-4 sm:py-4 
                         px-4 xs:px-6 sm:px-8 
                         text-sm xs:text-base sm:text-lg 
                         font-semibold
                         rounded-xl sm:rounded-2xl 
                         hover:bg-gray-800 active:bg-gray-900
                         transform hover:scale-[1.02] active:scale-[0.98] 
                         transition-all duration-300 
                         shadow-lg hover:shadow-xl active:shadow-md
                         uppercase tracking-wider
                         focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              {currentState === 'Login' ? 'Sign In to Account' : 'Create New Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 xs:mt-8 sm:mt-10 text-center">
            <p className="text-xs xs:text-sm text-gray-500 leading-relaxed px-4">
              By continuing, you agree to our 
              <button className="text-black hover:underline mx-1 font-medium">
                Terms of Service
              </button>
              and
              <button className="text-black hover:underline mx-1 font-medium">
                Privacy Policy
              </button>
            </p>
          </div>

          {/* Social Login Options - Optional */}
          <div className="mt-6 xs:mt-8 sm:mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons Placeholder */}
            <div className="mt-4 xs:mt-6 grid grid-cols-2 gap-3 xs:gap-4">
              <button className="flex justify-center items-center 
                                 px-4 py-3 xs:py-4 
                                 border border-gray-300 rounded-xl 
                                 bg-white hover:bg-gray-50 
                                 transition-colors duration-300
                                 text-sm font-medium text-gray-700">
                <span>Google</span>
              </button>
              <button className="flex justify-center items-center 
                                 px-4 py-3 xs:py-4 
                                 border border-gray-300 rounded-xl 
                                 bg-white hover:bg-gray-50 
                                 transition-colors duration-300
                                 text-sm font-medium text-gray-700">
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
