import { ChartColumnBig, FolderPlus, FileText } from 'lucide-react'  // thêm icon FileText cho Document
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='bg-gray-700 w-80 h-screen hidden md:block sticky top-0'>
      <div className='text-center pt-10 px-3 space-y-2'>
        <NavLink
          to='/admin/dashboard'
          className={({ isActive }) =>
            `text-2xl text-gray-200 ${isActive ? 'bg-gray-950' : 'bg-transparent'} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <ChartColumnBig />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to='/admin/course'
          className={({ isActive }) =>
            `text-2xl text-gray-200 ${isActive ? 'bg-gray-950' : 'bg-transparent'} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <FolderPlus />
          <span>Course</span>
        </NavLink>

        <NavLink
          to='/admin/document'
          className={({ isActive }) =>
            `text-2xl text-gray-200 ${isActive ? 'bg-gray-950' : 'bg-transparent'} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`
          }
        >
          <FileText />
          <span>Document</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
