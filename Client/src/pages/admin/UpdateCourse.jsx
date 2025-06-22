import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'

const UpdateCourse = () => {
  return (
    <div className='md:p-10 p-4'>
      <div className='flex items-center mb-5 gap-2'>
        <h1 className='font-bold text-xl flex-grow'>Thêm thông tin chi tiết cho khóa học</h1>
        <Link to="lecture">
          <Button className="hover:text-blue-600">Chuyển đến trang bài giảng</Button>
        </Link>
        <Link to="document">
          <Button className="hover:text-blue-600">Chuyển đến trang tài liệu</Button>
        </Link>
      </div>
      <CourseTab/>
    </div>
  )
}

export default UpdateCourse
