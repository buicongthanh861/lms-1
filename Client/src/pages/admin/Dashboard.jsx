import React from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const { user } = useSelector(store => store.auth)
  
  return (
    <>
      <div className="flex md:h-screen bg-gray-100">
        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col">
          {/* Phần nội dung dashboard */}
          <main className="p-6 space-y-6">
            {/* Phần chào mừng */}
            <section className="bg-blue-500 text-white rounded-lg p-6">
              <h1 className="text-2xl font-bold">Chào mừng trở lại, {user.name}!</h1>
              <button className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
                Xem khóa học mới
              </button>
            </section>

            {/* Thống kê nhanh */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Tổng khóa học đã đăng ký', value: 5 },
                { label: 'Bài tập đã hoàn thành', value: 12 },
                { label: 'Bài kiểm tra đang chờ', value: 3 },
                { label: 'Khóa học đã mua', value: 2 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white shadow rounded-lg p-4 text-center"
                >
                  <h2 className="text-xl font-bold text-gray-700">{stat.value}</h2>
                  <p className="text-gray-500">{stat.label}</p>
                </div>
              ))}
            </section>

            {/* Khóa học đang học */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-4">Khóa học đang học</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white shadow rounded-lg p-4 flex flex-col"
                  >
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Khóa học {index + 1}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(index + 1) * 20}%` }}
                      ></div>
                    </div>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600">
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Deadline sắp tới */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-4">Hạn chót sắp tới</h2>
              <ul className="space-y-4">
                {[
                  { title: 'Bài tập 1', due: '15/01/2025' },
                  { title: 'Bài kiểm tra 2', due: '18/01/2025' },
                ].map((deadline, index) => (
                  <li
                    key={index}
                    className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
                  >
                    <span className="font-semibold text-gray-700">
                      {deadline.title}
                    </span>
                    <span className="text-gray-500">Hạn chót: {deadline.due}</span>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default Dashboard