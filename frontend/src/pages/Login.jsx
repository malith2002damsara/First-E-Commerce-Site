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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-gray-800">{currentState}</h2>
              <div className='h-[2px] w-12 bg-gray-800'></div>
            </div>
            <p className="text-gray-600">
              {currentState === 'Login' ? 'Welcome back to Ceylon' : 'Join the Ceylon community'}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {currentState === 'Sign Up' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  onChange={(e)=>setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors shadow-sm" 
                  placeholder='Enter your full name' 
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input  
                onChange={(e)=>setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors shadow-sm" 
                placeholder='Enter your email' 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                onChange={(e)=>setPassword(e.target.value)} 
                value={password} 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors shadow-sm" 
                placeholder='Enter your password' 
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <button type="button" className="text-gray-600 hover:text-black transition-colors">
                Forgot Your Password?
              </button>
              {currentState === 'Login' ? (
                <button 
                  type="button"
                  onClick={()=>setCurrentState('Sign Up')} 
                  className="text-black font-medium hover:underline"
                >
                  Create Account
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={()=>setCurrentState('Login')} 
                  className="text-black font-medium hover:underline"
                >
                  Login Here
                </button>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {currentState === 'Login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
