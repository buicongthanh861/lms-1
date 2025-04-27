import CourseCard from '@/components/CourseCard'
import { setCourse } from '@/redux/courseSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Danh sách các khóa học mẫu
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
  }
]

const Courses = () => {
  const dispatch = useDispatch()
  const {course} = useSelector(store => store.course)

  // Gọi API để lấy danh sách khóa học đã xuất bản
  useEffect(()=> {
    const getAllPublishedCourse = async ()=> {
      try {
        const res = await axios.get(`http://localhost:8080/api/course/published-courses`, {withCredentials:true})
        if(res.data.success){
          dispatch(setCourse(res.data.courses))
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAllPublishedCourse()
  }, []) // Thêm mảng phụ thuộc rỗng để chỉ chạy 1 lần khi mount

  return (
    <div className='bg-gray-100 pt-14'>
      <div className='min-h-screen max-w-7xl mx-auto py-10'>
        <div className='px-4'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Danh Sách Khóa Học</h1>
          <p className='text-center text-gray-600 mb-12'>Khám phá các khóa học được tuyển chọn của chúng tôi để nâng cao kỹ năng và sự nghiệp. Dù bạn là người mới bắt đầu hay chuyên gia, chúng tôi đều có khóa học phù hợp.</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
             {
              course?.map((course)=> {
               return <CourseCard key={course.id} course={course}/>
              })
             }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses










// http://localhost:8080/api/course/published-courses