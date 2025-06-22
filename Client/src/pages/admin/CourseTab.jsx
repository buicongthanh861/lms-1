import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCourse } from "@/redux/courseSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const params = useParams();
  const id = params.courseId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);
  const selectCourse = course.find((course) => course._id === id);

  const [selectedCourse, setSelectedCourse] = useState(selectCourse);
  const [loading, setLoading] = useState(false);
  const { publish, setPublish } = useState(false);

  const getCourseById = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/course/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSelectedCourse(res.data.course);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCourseById();
  });

  const [input, setInput] = useState({
    courseTitle: selectedCourse?.courseTitle,
    subTitle: selectedCourse?.subTitle,
    description: selectedCourse?.description,
    category: selectedCourse?.category,
    courseLevel: selectedCourse?.courseLevel,
    coursePrice: selectedCourse?.coursePrice,
    file: "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectedCourse?.Thumbnail
  );

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  //get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onload = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("file", input.courseThumbnail);

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:8000/api/v1/course/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate(`lecture`);
        toast.success(res.data.message);
        dispatch([...course, setCourse(res.data.course)]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteCourseHandler = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa khóa học này không? Hành động này sẽ không thể hoàn tác."
      )
    )
      return;

    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:8000/api/v1/course/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/course");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/course/${id}`,
        {
          params: {
            action,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex md:flex-row justify-between">
        <div>
          <CardTitle>Thông tin cơ bản của khóa học</CardTitle>
          <CardDescription>
            Chỉnh sửa thông tin khóa học tại đây. Nhấn lưu khi bạn hoàn tất.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() =>
              togglePublishUnpublish(
                selectedCourse.isPublished ? "false" : "true"
              )
            }
            className="bg-gray-800"
          >
            {selectedCourse.isPublished ? "Ngừng xuất bản" : "Xuất bản"}
          </Button>
          <Button
            variant="destructive"
            onClick={deleteCourseHandler}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa khóa học"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Tiêu đề</Label>
            <Input
              value={input.courseTitle}
              onChange={changeEventHandler}
              type="text"
              name="courseTitle"
              placeholder="Ex. Fullstack developer"
            ></Input>
          </div>
          <div>
            <Label>Phụ đề</Label>
            <Input
              value={input.subTitle}
              onChange={changeEventHandler}
              type="text"
              name="subTitle"
              placeholder="Ex. Become a fullstack developer from zero to hero in 2 months"
            ></Input>
          </div>
          <div>
            <Label>Mô tả</Label>
            <RichTextEditor input={input} setInput={setInput} />
            {/* <Input input={input} setInput={setInput} type="text" name="Description" placeholder="Ex. Description course"></Input> */}
          </div>
          <div className="flex md:flex-row flex-wrap gap-1 items-center md:gap-5">
            <div>
              <Label>Danh mục</Label>
              <Select
                defaultValue={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Danh mục</SelectLabel>
                    <SelectItem value="Next Js">Next Js</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Backend Development">
                      Backend Development
                    </SelectItem>
                    <SelectItem value="MernStack Development">
                      MernStack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Trình độ</Label>
              <Select
                defaultValue={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trình độ</SelectLabel>
                    <SelectItem value="Beginner">Người mới bắt đầu</SelectItem>
                    <SelectItem value="Medium">Trung bình</SelectItem>
                    <SelectItem value="Advance">Nâng cao</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Giá (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Ảnh đại diện khóa học</Label>
            <Input
              type="file"
              id="file"
              onChange={selectThumbnail}
              placeholder="199"
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="Thumbnail"
                className="w-64 my-2"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button
              className="bg-gray-800 "
              disabled={loading}
              onClick={updateCourseHandler}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin">
                   Vui lòng chờ...
                  </Loader2>
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
