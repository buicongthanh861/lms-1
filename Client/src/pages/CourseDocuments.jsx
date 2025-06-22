import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CourseDocuments = () => {
  const { courseId } = useParams();
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  // Hàm kiểm tra file có phải ảnh không (dựa trên đuôi file)
  const isImage = (url) => {
    return /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i.test(url);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/course/${courseId}/document`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setDocuments(res.data.documents);
        }
      } catch (err) {
        console.error("Lỗi khi tải tài liệu:", err);
      }
    };
    fetchDocuments();
  }, [courseId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="relative mt-10 mb-16 h-20 flex items-center justify-center">
          {/* Nút back - căn trái */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2"
          >
            <ArrowLeft size={18} />
          </Button>

          {/* Tiêu đề - căn giữa */}
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Tài liệu khóa học
          </h1>
        </div>

        {/* Content */}
        {documents.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">
          Không có tài liệu nào cho khóa học này.
          </p>
        ) : (
          <div className="space-y-5">
            {documents.map((doc) => (
              <Card
                key={doc._id}
                className="shadow-md hover:shadow-lg transition p-5"
              >
                <CardContent>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {doc.doctitle}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {doc.description ||  "Không có mô tả."}
                  </p>

                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-blue-600 underline block"
                    >
                      Mở tài liệu
                    </a>
                  ) : (
                    <p className="text-red-600 mt-3">Không có file đính kèm.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDocuments;
