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
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'aol.com']
    
    if (!email) {
      return 'Email is required'
    }
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (domain && !commonDomains.includes(domain) && !domain.includes('.')) {
      return 'Please use a valid email provider'
    }
    
    return ''
  }

  // Password strength validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required'
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    const missingRequirements = []
    if (!hasUpperCase) missingRequirements.push('uppercase letter')
    if (!hasLowerCase) missingRequirements.push('lowercase letter') 
    if (!hasNumbers) missingRequirements.push('number')
    if (!hasSymbols) missingRequirements.push('symbol')
    
    if (missingRequirements.length > 0) {
      return `Password must contain: ${missingRequirements.join(', ')}`
    }
    
    return ''
  }

  // Get password strength level
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
    
    if (score < 3) return { level: score, text: 'Weak', color: 'text-red-500' }
    if (score < 5) return { level: score, text: 'Medium', color: 'text-yellow-500' }
    return { level: score, text: 'Strong', color: 'text-green-500' }
  }

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    if (currentState === 'Sign Up') {
      setPasswordError(validatePassword(value))
    }
  }

  const onSubmitHandler = async (event)=>{
    event.preventDefault();
    
    // Validate email
    const emailValidation = validateEmail(email)
    if (emailValidation) {
      setEmailError(emailValidation)
      toast.error(emailValidation)
      return
    }
    
    // Validate password for signup
    if (currentState === 'Sign Up') {
      const passwordValidation = validatePassword(password)
      if (passwordValidation) {
        setPasswordError(passwordValidation)
        toast.error(passwordValidation)
        return
      }
    }
    
    try{
      if(currentState === 'Sign Up'){

        const response = await axios.post(backendUrl + '/api/user/register' , {name,email,password})
        
        if(response.data.success){
           setToken(response.data.token)
           localStorage.setItem('token',response.data.token)
           toast.success('Account created successfully!')
        }else{
          toast.error(response.data.message)
        }

      }else{
               const response = await axios.post(backendUrl + '/api/user/login' , {email,password})
               if(response.data.success){
                  setToken(response.data.token)
                  localStorage.setItem('token',response.data.token)
                  toast.success('Login successful!')
      }else{
                  toast.error(response.data.message)
               }
      }

        
    }catch(error){
        console.log(error)
        if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error('An error occurred. Please try again.')
        }
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
              <div className="relative">
                <input  
                  onChange={handleEmailChange}
                  value={email} 
                  type="email" 
                  className={`w-full 
                             px-4 xs:px-5 sm:px-6 
                             py-3 xs:py-4 sm:py-4 
                             text-sm xs:text-base
                             border ${emailError ? 'border-red-500' : 'border-gray-300'}
                             rounded-xl sm:rounded-2xl 
                             focus:ring-2 focus:ring-black focus:border-black 
                             transition-all duration-300 
                             shadow-sm focus:shadow-md
                             placeholder-gray-400`} 
                  placeholder='Enter your email address' 
                  required
                />
                {/* Email validation icon */}
                {email && !emailError && (
                  <div className="absolute right-3 xs:right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
              {emailError && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input 
                  onChange={handlePasswordChange}
                  value={password} 
                  type={showPassword ? "text" : "password"}
                  className={`w-full 
                             px-4 xs:px-5 sm:px-6 
                             py-3 xs:py-4 sm:py-4 
                             pr-12 xs:pr-14 sm:pr-16
                             text-sm xs:text-base
                             border ${passwordError ? 'border-red-500' : 'border-gray-300'}
                             rounded-xl sm:rounded-2xl 
                             focus:ring-2 focus:ring-black focus:border-black 
                             transition-all duration-300 
                             shadow-sm focus:shadow-md
                             placeholder-gray-400`} 
                  placeholder='Enter your password' 
                  required
                />
                {/* Eye icon for password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 xs:right-4 sm:right-5 top-1/2 transform -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors duration-200
                             focus:outline-none focus:text-gray-600"
                >
                  {showPassword ? (
                    // Eye slash icon (hide password)
                    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.242L15.536 8.464M14.12 14.12l1.415 1.415M14.12 14.12a3 3 0 01-4.243.007m6.02-4.127a10.05 10.05 0 01-1.563 3.029M21 3l-18 18"></path>
                    </svg>
                  ) : (
                    // Eye icon (show password)
                    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password strength indicator for Sign Up */}
              {currentState === 'Sign Up' && password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm text-gray-600">Password Strength:</span>
                    <span className={`text-xs sm:text-sm font-medium ${getPasswordStrength(password).color}`}>
                      {getPasswordStrength(password).text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getPasswordStrength(password).level < 3 
                          ? 'bg-red-500' 
                          : getPasswordStrength(password).level < 5 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(getPasswordStrength(password).level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Password error message */}
              {passwordError && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  {passwordError}
                </p>
              )}
              
              {/* Password requirements for Sign Up */}
              {currentState === 'Sign Up' && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least one uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least one lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least one number
                    </div>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least one symbol (!@#$%^&*)
                    </div>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Minimum 8 characters
                    </div>
                  </div>
                </div>
              )}
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
              disabled={emailError || (currentState === 'Sign Up' && passwordError) || !email || !password || (currentState === 'Sign Up' && !name)}
              className="w-full bg-black text-white 
                         py-3 xs:py-4 sm:py-4 
                         px-4 xs:px-6 sm:px-8 
                         text-sm xs:text-base sm:text-lg 
                         font-semibold
                         rounded-xl sm:rounded-2xl 
                         hover:bg-gray-800 active:bg-gray-900
                         disabled:bg-gray-400 disabled:cursor-not-allowed
                         transform hover:scale-[1.02] active:scale-[0.98] 
                         disabled:transform-none
                         transition-all duration-300 
                         shadow-lg hover:shadow-xl active:shadow-md
                         disabled:shadow-sm
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
