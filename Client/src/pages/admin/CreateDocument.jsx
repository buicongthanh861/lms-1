import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setDocument } from "@/redux/documentSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const CreateDocument = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [doctitle, setDoctitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Biến trạng thái loading riêng cho từng document khi xóa
  const [removeLoading, setRemoveLoading] = useState({});

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
        `http://localhost:8000/api/v1/course/${params.courseId}/document`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await getDocuments(); // Đợi load lại danh sách mới xong rồi mới reset form
        setDoctitle("");
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

  // Lấy danh sách tài liệu theo courseId
  const getDocuments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/course/${params.courseId}/document`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setDocument(res.data.documents));
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi tải danh sách tài liệu");
    }
  };

  // Xóa document theo id
  const removeDocumentHandler = async (documentId, e) => {
    // e.preventDefault() và e.stopPropagation() đảm bảo không gây reload hoặc chuyển trang
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      setRemoveLoading((prev) => ({ ...prev, [documentId]: true }));

      const res = await axios.delete(
        `http://localhost:8000/api/v1/course/${params.courseId}/document/${documentId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await getDocuments(); // Đợi tải lại danh sách mới rồi mới tắt loading
      } else {
        toast.error(res.data.message || "Xóa tài liệu thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi xóa tài liệu");
    } finally {
      setRemoveLoading((prev) => ({ ...prev, [documentId]: false }));
    }
  };

  useEffect(() => {
    if (params.courseId) {
      getDocuments();
    }
  }, [params.courseId]);

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
              onClick={() =>
                navigate(`/admin/course/${params.courseId}/document/${doc._id}`)
              }
            >
              <h3 className="font-bold text-gray-800">
                Document - {index + 1}: {doc.doctitle}
              </h3>
              <button
                disabled={removeLoading[doc._id]}
                onClick={(e) => removeDocumentHandler(doc._id, e)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                {removeLoading[doc._id] ? (
                  <>
                    <Loader2 className="mr-1 h-4 animate-spin inline-block" />
                    Đang xóa
                  </>
                ) : (
                  "Xóa"
                )}
              </button>
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
