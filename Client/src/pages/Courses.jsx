import CourseCard from '@/components/CourseCard'
import React from 'react'

export const coursesJson = [
  {
    "id": 1,
    "title": "Làm chủ JavaScript toàn tập",
    "description": "Học JavaScript từ cơ bản đến nâng cao, bao gồm ES6+, thao tác DOM và các dự án thực tế.",
    "image": "https://example.com/images/javascript-course.jpg"
  },
  {
    "id": 2,
    "title": "Khóa học cấp tốc React",
    "description": "Làm chủ React.js với các dự án thực hành, hooks, context API và quản lý trạng thái.",
    "image": "https://example.com/images/react-course.jpg"
  },
  {
    "id": 3,
    "title": "Node.js và Express cơ bản",
    "description": "Hiểu về phát triển backend với Node.js, Express.js và cách tạo REST API.",
    "image": "https://example.com/images/node-course.jpg"
  },
  {
    "id": 4,
    "title": "Làm chủ MongoDB",
    "description": "Học các khái niệm cơ sở dữ liệu MongoDB, thao tác CRUD và cách tích hợp với Node.js.",
    "image": "https://example.com/images/mongodb-course.jpg"
  },
  {
    "id": 5,
    "title": "Phát triển Full-Stack MERN",
    "description": "Trở thành lập trình viên full-stack bằng cách làm chủ MERN stack: MongoDB, Express, React và Node.js.",
    "image": "https://example.com/images/mern-course.jpg"
  },
  {
    "id": 6,
    "title": "WordPress cho người mới bắt đầu",
    "description": "Học cách tạo và quản lý website bằng WordPress, bao gồm themes, plugins và SEO.",
    "image": "https://example.com/images/wordpress-course.jpg"
  },
  {
    "id": 7,
    "title": "Khóa học Digital Marketing chuyên sâu",
    "description": "Khám phá các chiến lược digital marketing bao gồm SEO, mạng xã hội, email marketing và quảng cáo PPC.",
    "image": "https://example.com/images/digital-marketing-course.jpg"
  },
  {
    "id": 8,
    "title": "Khóa học cấp tốc Tailwind CSS",
    "description": "Học cách sử dụng Tailwind CSS để tạo website đẹp, responsive với các lớp utility-first.",
    "image": "https://example.com/images/tailwind-course.jpg"
  },
  {
    "id": 9,
    "title": "Xây dựng Hệ thống Quản lý Học tập (LMS) với MERN",
    "description": "Tạo một Hệ thống Quản lý Học tập sử dụng React, Node.js, Express.js và MongoDB.",
    "image": "https://example.com/images/lms-course.jpg"
  },
  {
    "id": 10,
    "title": "Các mẫu JavaScript nâng cao",
    "description": "Đào sâu vào JavaScript với các khái niệm nâng cao như closures, kế thừa nguyên mẫu và các mẫu thiết kế.",
    "image": "https://example.com/images/advanced-js-course.jpg"
  }
]


const Courses = () => {
  return (
    <div className='bg-gray-100 pt-14'>
      <div className='min-h-screen max-w-7xl mx-auto py-10'>
        <div className='px-4'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Cac Khoa Hoc</h1>
          <p className='text-center text-gray-600 mb-12'>"Khám phá các khóa học được chọn lọc của chúng tôi để nâng cao kỹ năng và sự nghiệp của bạn. Dù bạn là người mới bắt đầu hay chuyên gia, chúng tôi đều có khóa học phù hợp cho mọi người."</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
              coursesJson?.map((course) => {
                return <CourseCard course={course} />
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses