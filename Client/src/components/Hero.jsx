import { Award, Search, User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import HeroImg from '../assets/HeroImg.png'
import CountUp from 'react-countup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const [keyword, setKeyword] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = keyword.trim()
      if (trimmed) {
        axios.get(`http://localhost:8000/api/v1/course/search`, {
          params: { keyword: trimmed }
        })
          .then((res) => {
            if (res.data.success) {
              setSuggestions(res.data.courses)
            }
          })
          .catch(() => setSuggestions([]))
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [keyword])

  const handleSearchClick = () => {
    if (suggestions.length > 0) {
      navigate(`/courses/${suggestions[0]._id}`)

    }
  }

  const handleSuggestionClick = (id) => {
    navigate(`/courses/${id}`)
    setSuggestions([])
    setKeyword("")
  }

  return (
    <div className='bg-slate-800 pt-14'>
      <div className='lg:h-[700px] max-w-7xl mx-auto flex md:flex-row flex-col gap-10 items-center'>

        {/* Text section */}
        <div className='space-y-7 px-4 md:px-0'>
          <h1 className='text-4xl mt-10 md:mt-0 md:text-6xl font-extrabold text-gray-200'>
            Khám phá <span className='text-blue-500'> Hơn 14000+ <br /> khóa học tại đây</span>
          </h1>
          <p className='text-gray-300 text-lg'>
            Tất cả khóa học dành cho sinh viên ngành công nghệ thông tin và tra cứu tài liệu
          </p>

          <div className='relative w-[350px] md:w-[450px]'>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder='Tìm kiếm khóa học tại đây...'
              className='bg-gray-200 w-full text-gray-800 p-4 pr-40 rounded-lg rounded-r-xl placeholder:text-gray-500'
            />
            <button
              onClick={handleSearchClick}
              className='px-4 py-[14px] flex gap-1 items-center bg-blue-500 font-semibold absolute right-0 top-0 text-white rounded-r-lg text-xl'
            >
              Search <Search width={20} height={20} />
            </button>

            {suggestions.length > 0 && (
              <div className='absolute top-full left-0 w-full bg-white rounded-b-lg shadow-lg z-10 max-h-64 overflow-y-auto'>
                {suggestions.map(course => (
                  <div
                    key={course._id}
                    onClick={() => handleSuggestionClick(course._id)}
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 border-b last:border-none'
                  >
                    {course.courseTitle}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image section */}
        <div className='flex md:h-[700px] items-end relative px-4 md:px-0'>
          <img src={HeroImg} alt="hero" className='w-[600px] shadow-blue-500 drop-shadow-lg' />

          <div className='bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[35%] right-0 px-4 py-2'>
            <div className='rounded-full bg-blue-400 p-2 text-white'><User /></div>
            <div>
              <h2 className='font-bold text-2xl'><CountUp end={4500} />+</h2>
              <p className='italic text-sm text-gray-600 leading-none'>Số lượng sinh viên đang theo học</p>
            </div>
          </div>

          <div className='bg-slate-200 hidden md:flex gap-3 items-center rounded-md absolute top-[15%] left-0 px-4 py-2'>
            <div className='rounded-full bg-blue-400 p-2 text-white'><Award /></div>
            <div>
              <h2 className='font-bold text-2xl'><CountUp end={684} />+</h2>
              <p className='italic text-sm text-gray-600 leading-none'>Số chứng chỉ mà sinh viên nhận được</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
