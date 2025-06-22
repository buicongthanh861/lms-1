import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Signup = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(),
    console.log(user);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/register', user, {
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      if(response.data.success){
        navigate("/login")
        toast.success(response.data.message)
      }else{
        toast.error("Đã xảy ra lỗi!")
      }
    } catch (error) {
      toast.error("Không thể kết nối máy chủ")
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 mt-10'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>Tạo Tài Khoản</h1>
        <p className='text-center text-gray-600 mb-8'>Hãy tham gia cùng chúng tôi</p>
        {/* Name input */}
        <div className='mb-4'>
          <Label>Họ và Tên</Label>
          <Input
            placeholder="Nhập tên đầy đủ"
            name="name"
            value={user.name}
            onChange={handleChange}
            type="text"
            id="name">
          </Input>
        </div>
        <div className='mb-4'>
          <Label>Địa chỉ Email</Label>
          <Input placeholder="Nhập Email của bạn"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          ></Input>
        </div>
        <div className='mb-4'>
          <Label>Mật khẩu</Label>
          <Input
            type="password"
            placeholder="Dien Mat Khau cua ban"
            name="password"
            value={user.password}
            onChange={handleChange}
          ></Input>
        </div>
        <div className='mb-4'>
          <Label>Vai trò</Label>
          <RadioGroup className="flex gap-4 mt-2 peer ">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="role1"
                name="role"
                value="student"
                checked={user.role === 'student'}
                onChange={handleChange}
              />
              <Label htmlFor="role1">Học viên</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                id="role2"
                name="role"
                value="instructor"
                checked={user.role === 'instructor'}
                onChange={handleChange}
              />
              <Label htmlFor="role2">Giảng viên</Label>
            </div>
          </RadioGroup>
        </div>
        <Button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600">Đăng ký</Button>
        <p className='text-center mt-4'> Đã có tài khoản? <Link to='/login' className="text-blue-500 hover:underline">Đăng nhập</Link></p>
      </div>
    </div>
  )
}

export default Signup