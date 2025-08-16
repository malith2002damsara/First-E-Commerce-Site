import { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = currentState === 'Sign Up' 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(backendUrl + endpoint, payload);
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        toast.success(currentState === 'Login' ? 'Login successful!' : 'Account created successfully!');
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {currentState}
              </h2>
              <div className='h-[2px] w-8 sm:w-12 bg-gray-800'></div>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              {currentState === 'Login' 
                ? 'Welcome back to Ceylon' 
                : 'Join the Ceylon community'
              }
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-6">
            {currentState === 'Sign Up' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  type="text"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 shadow-sm"
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                type="email"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 shadow-sm"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                type="password"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 shadow-sm"
                placeholder="Enter your password"
                required
                autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'}
                minLength={6}
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              {currentState === 'Login' && (
                <button 
                  type="button" 
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Forgot Password?
                </button>
              )}
              <button 
                type="button"
                onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
                className="text-black font-medium hover:underline ml-auto"
              >
                {currentState === 'Login' ? 'Create Account' : 'Login Here'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-md flex items-center justify-center ${
                isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                currentState === 'Login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;