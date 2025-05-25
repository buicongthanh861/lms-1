import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setDocument } from "@/redux/documentSlice"; // Giả sử bạn có slice document tương tự lectureSlice
import axios from "axios";
import { Edit, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateDocument = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State form
  const [doctitle, setDoctitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy document list từ redux
  const { document } = useSelector((store) => store.document);

  // Tạo tài liệu mới
  const createDocumentHandler = async () => {
    if (!doctitle.trim() || !file) {
      toast.error("Vui lòng nhập tiêu đề và chọn file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("doctitle", doctitle);
      formData.append("description", description);
      formData.append("file", file);

      const res = await axios.post(
        `http://localhost:8000/api/v1/course/${params?.courseId}/document`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        getDocuments(); // Tải lại danh sách tài liệu sau khi thêm
        setDoctitle(""); // Reset input
        setDescription("");
        setFile(null);
      } else {
        toast.error("Tạo tài liệu thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo tài liệu");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách tài liệu
  const getDocuments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/course/${params?.courseId}/document`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setDocument(res.data.documents));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="p-4 md:p-10 md:pr-20 h-screen">
      <h1 className="text-2xl font-bold mb-2">
        Thêm <span className="text-blue-600">Tài liệu</span>
      </h1>
      <p>Nhập thông tin chi tiết để thêm tài liệu mới cho khóa học.</p>

      <div className="mt-10 space-y-5">
        <div>
          <Label>Tiêu đề tài liệu</Label>
          <Input
            type="text"
            placeholder="Nhập tiêu đề tài liệu"
            className="bg-white"
            value={doctitle}
            onChange={(e) => setDoctitle(e.target.value)}
          />
        </div>

        <div>
          <Label>Mô tả</Label>
          <Textarea
            rows={4}
            placeholder="Mô tả (tuỳ chọn)"
            className="bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Chọn file</Label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <Button
          onClick={() => navigate(`/admin/course/${params.courseId}`)}
          variant="outline"
        >
          Quay lại khoá học
        </Button>
        <Button
          disabled={loading}
          onClick={createDocumentHandler}
          className="bg-gray-800 hover:bg-gray-800"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 h-4 animate-spin" />
              Đang xử lý
            </>
          ) : (
            "Tạo tài liệu"
          )}
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Danh sách tài liệu</h2>
        {Array.isArray(document) && document.length > 0 ? (
          document.map((doc, index) => (
            <div
              key={doc._id || index}
              className="flex items-center justify-between bg-[#F7F9FA] px-4 py-2 rounded-md my-2 cursor-pointer hover:bg-blue-50"
              onClick={() => navigate(`${doc._id}`)}
            >
              <h3 className="font-bold text-gray-800">
                Document - {index + 1}: {doc.doctitle}
              </h3>
              <Edit
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${doc._id}`);
                }}
                size={20}
                className="cursor-pointer text-gray-600 hover:text-blue-600"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có tài liệu nào.</p>
        )}
      </div>
    </div>
  );
};

export default CreateDocument;
