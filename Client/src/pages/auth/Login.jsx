import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(input);
    
     try {
          const response = await axios.post('http://localhost:8000/api/v1/user/login', input, {
            headers:{
              "Content-Type":"application/json"
            },
            withCredentials:true
          })
          if(response.data.success){
            navigate("/")
            dispatch(setUser(response.data.user))
            toast.success(response.data.message)
          }else{
            toast.error("Đăng nhập thất bại")
          }
        } catch (error) {
           toast.error("Lỗi kết nối đến máy chủ")
        }
    
  } 
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 mt-10'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>Chào mừng bạn trở lại</h1>
        <p className='text-center text-gray-600 mb-8'>Vui lòng nhập tài khoản của bạn</p>
        <div className='mb-4'>
          <Label>Địa chỉ Email</Label>
          <Input placeholder="Nhập email của bạn"
          type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
          ></Input>
        </div>
        <div className='mb-4'>
          <Label>Mật khẩu</Label>
          <Input placeholder="Nhập mật khẩu của bạn"
          type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
          ></Input>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-blue-500 mt-2 hover:bg-blue-600">Login</Button>
        {/* divider */}
        <div className='flex items-center my-6'>
          <hr className='flex-grow border-gray-300' />
          <span className='mx-3 text-gray-500'>HOẶC</span>
          <hr className='flex-grow border-gray-300' />
        </div>
        <p className='text-center mt-4'>  Chưa có tài khoản? <Link to='/signup' className="text-blue-500 hover:underline">Đăng ký</Link></p>
      </div>
    </div>
  )
}

export default Login