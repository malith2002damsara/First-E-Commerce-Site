import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../utils/axios'
import { backendUrl } from '../constants/config'

const Login = ({setToken}) => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            console.log('Attempting login with backend URL:', backendUrl);
            
            const response = await axiosInstance.post('/api/user/admin', {email, password});
            
            if (response.data.success) {
                setToken(response.data.token)
                toast.success('Login successful!')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log('Login error:', error);
            console.log('Error response:', error.response?.data);
            console.log('Error status:', error.response?.status);
            console.log('Error config:', error.config);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else if (error.response?.status === 0 || error.code === 'ERR_NETWORK') {
                toast.error('Network error: Unable to connect to server. Please check your internet connection.')
            } else if (error.code === 'ECONNABORTED') {
                toast.error('Request timeout: Server is taking too long to respond.')
            } else if (error.message) {
                toast.error(`Login failed: ${error.message}`)
            } else {
                toast.error('Login failed. Please try again.')
            }
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required/>
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' required/>
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login