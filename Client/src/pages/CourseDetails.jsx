import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { ArrowLeft, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLecture } from "@/redux/lectureSlice";

const CourseDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const { course } = useSelector((store) => store.course);
  const selectedCourse = course.find((course) => course._id === courseId);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { lecture } = useSelector((state) => state.lecture);

  const creatorInfo =
    typeof selectedCourse?.creator === "object"
      ? selectedCourse.creator
      : {
          _id: user?._id,
          name: user?.name,
          photoUrl: user?.photoUrl,
          description: user?.description,
        };

  const [courseLecture, setCourseLecture] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    const getCourseLecture = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/course/${courseId}/lecture`,
          { withCredentials: true }
        );
        if (res.data.success) {
          const publicLectures = res.data.lectures.filter(
            (lec) => lec.isPreviewFree
          );
          setCourseLecture(publicLectures);
          if (publicLectures.length > 0) {
            setSelectedLecture(publicLectures[0]);
          }
          dispatch(setLecture(publicLectures));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLecture();
  }, [courseId, dispatch]);

  useEffect(() => {
    if (lecture && lecture.length > 0) {
      const publicLectures = lecture.filter((lec) => lec.isPreviewFree);
      setCourseLecture(publicLectures);
    }
  }, [lecture]);

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  return (
    <div className="bg-gray-100 md:p-10 ">
      <Card className="max-w-7xl rounded-md mx-auto bg-white shadow-md pt-5 mt-14">
        {/* Tiêu đề khóa học */}
        <div className="px-4 py-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} />
              </Button>
              <h1 className="md:text-2xl font-bold text-gray-800">
                {selectedCourse.courseTitle}
              </h1>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Đăng ký ngay
            </Button>
          </div>
        </div>

        {/* Tổng quan */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <img
              src={selectedCourse.courseThumbnail}
              alt="Ảnh đại diện"
              className="w-full lg:w-1/3 rounded-md mb-4 lg:mb-0"
            />
            <div>
              <p className="text-gray-800 mb-4 font-semibold capitalize">
                {selectedCourse.subTitle}
              </p>
              <p
                className="mb-4 text-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedCourse.description }}
              />
              <p className="text-gray-800 font-semibold">
                ⭐⭐⭐⭐⭐ (4.8) | 1,200 đánh giá
              </p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-gray-800">
                  ₹{selectedCourse.coursePrice}
                </p>
                <p className="text-gray-500 line-through">₹599</p>
              </div>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>✔ Hơn 30 giờ video bài giảng</li>
                <li>✔ Truy cập trọn đời tài liệu</li>
                <li>✔ Chứng chỉ hoàn thành</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chi tiết */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Bạn sẽ học được gì
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Xây dựng web động với React và Node.js</li>
            <li>Triển khai với các công cụ hiện đại như Vercel và Netlify</li>
            <li>Hiểu về REST APIs và tích hợp cơ sở dữ liệu</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Yêu cầu
          </h2>
          <p className="text-gray-700">
            Kiến thức lập trình cơ bản là lợi thế nhưng không bắt buộc.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Dành cho ai?
          </h2>
          <p className="text-gray-700">
            Người mới bắt đầu, lập trình viên muốn nâng cao kỹ năng.
          </p>
        </div>

        {/* Bài giảng */}
        <div className="flex flex-col md:flex-row justify-between gap-10 p-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">
              Nội dung khóa học
            </h2>
            <p className="text-gray-700 italic my-2">
              {courseLecture.length} bài giảng
            </p>
            {courseLecture.length === 0 ? (
              <p className="text-gray-500">Chưa có bài giảng nào.</p>
            ) : (
              <div className="space-y-4">
                {courseLecture.map((lecture) => (
                  <div
                    key={lecture._id}
                    className="flex items-center gap-3 bg-gray-200 p-4 rounded-md cursor-pointer hover:bg-gray-300 transition"
                    onClick={() => handleLectureClick(lecture)}
                  >
                    <PlayCircle size={20} />
                    <p>{lecture.lectureTitle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trình phát video */}
          {selectedLecture && (
            <div className="w-full lg:w-1/3">
              <Card>
                <CardContent className="p-4 flex flex-col">
                  <div className="w-full aspect-video mb-4">
                    {selectedLecture?.videoUrl ? (
                      <ReactPlayer
                        width="100%"
                        height="100%"
                        url={selectedLecture.videoUrl}
                        controls
                        onError={(e) =>
                          console.log("Lỗi video hoặc sai URL:", e)
                        }
                      />
                    ) : (
                      <div className="text-gray-500 text-center">
                        Video không khả dụng cho bài giảng này.
                      </div>
                    )}
                  </div>
                  <h1>{selectedLecture?.lectureTitle || "Tiêu đề bài giảng"}</h1>
                  <Separator className="my-2" />
                  <p>
                    {selectedLecture?.description ||
                      "Không có mô tả cho bài giảng này."}
                  </p>
                </CardContent>
                <CardFooter className="flex p-4">
                  <Button
                    onClick={() => navigate(`/course/${courseId}/documents`)}
                  >
                    Tiếp tục khóa học
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        {/* Giảng viên */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Giảng viên</h2>
          <div className="flex items-center space-x-4">
            <img
              src={creatorInfo.photoUrl}
              alt="Giảng viên"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {creatorInfo.name}
              </h3>
              <p className="text-gray-600">Lập trình viên Full-Stack cao cấp</p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">{creatorInfo.description}</p>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetails;
