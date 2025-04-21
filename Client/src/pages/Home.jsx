import Hero from '@/components/Hero'
import React from 'react'
import { coursesJson } from './Courses'
import CourseCard from '@/components/CourseCard'
const Home = () => {
  return (
    <div>
      <Hero />
      <div className='py-10'>
      <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Cac Khoa Hoc</h1>
      <p className='text-center text-gray-600 mb-12'>"Khám phá các khóa học được chọn lọc của chúng tôi để nâng cao kỹ năng và sự nghiệp của bạn. Dù bạn là người mới bắt đầu hay chuyên gia, chúng tôi đều có khóa học phù hợp cho mọi người."</p>
      <div className='max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
          coursesJson.slice(0, 6).map((course) => {
            return <CourseCard course={course} />
          })
        }
      </div>
      </div>


    </div>
  )
}

export default Home