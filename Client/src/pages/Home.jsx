import Hero from '@/components/Hero'
import React from 'react'
import { coursesJson } from './Courses'
import CourseCard from '@/components/CourseCard'
import { useSelector } from 'react-redux'

const Home = () => {
  // Sử dụng useSelector để lấy dữ liệu khóa học từ Redux store
  const {course} = useSelector(store => store.course)
  
  return (
    <div>
      
      <Hero />
      
      {/* Phần danh sách khóa học */}
      <div className='py-10'>
        <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Các Khóa Học Của Chúng Tôi</h1>
        <p className='text-center text-gray-600 mb-12'>Khám phá các khóa học được tuyển chọn của chúng tôi để nâng cao kỹ năng và sự nghiệp của bạn. Dù bạn là người mới bắt đầu hay chuyên gia, chúng tôi đều có khóa học phù hợp.</p>
        
        {/* Lưới hiển thị khóa học */}
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {
            /* Hiển thị 6 khóa học đầu tiên */
            course?.slice(0, 6).map((course, index) => {
              return <CourseCard key={index} course={course} />
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Home