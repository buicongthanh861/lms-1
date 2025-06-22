import { Course } from "../models/course.model.js";
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js'
import {Lecture} from '../models/lecture.model.js';
import {Document} from '../models/document.model.js';

export const createCourse = async(req,res)=> {
    try {
        const {courseTitle,category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course title and category is required",
                success:false
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        })
        return res.status(201).json({
            success:true,
            course,
            message:"Course created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course",
            success:false
        })
    }
}
export const getPublishedCourse = async(_, res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl description"})
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            success:true,
            courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to get course",
            success:false
        })
    }
}
export const getCreatorCourses = async (req, res)=>{
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId}).populate('lectures');
        if(!courses){
            return res.status(404).json({
                message:"Course not found",
                courses:[],
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to get course",
            success:false
        })
    }
}

export const editCourse = async(req,res)=>{
    try {
        const courseId = req.params.courseId;
        const {courseTitle,subTitle,description,category,courseLevel,coursePrice} = req.body;
        const file = req.file;

        let course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({
                message:"Course not found",
            })
        }
        let courseThumbnail;
        if(file){
            const fileUri = getDataUri(file)
            courseThumbnail = await cloudinary.uploader.upload(fileUri)
        }
        const updateData = {courseTitle,subTitle,description,category,courseLevel,coursePrice,courseThumbnail:courseThumbnail?.secure_url};
        course = await Course.findByIdAndUpdate(courseId,updateData,{new:true})
        return res.status(200).json({
            success:true,
            course,
            message:"Course updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update course",
            success:false
        })
    }
}

export const getCourseById = async(req,res)=> {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                message:"Course not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course",
            success:false
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Xóa các lecture liên quan trước
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
          success: false,
        });
      }
  
      await Lecture.deleteMany({ _id: { $in: course.lectures } });
  
      // Sau đó xóa khóa học
      await Course.findByIdAndDelete(courseId);
  
      return res.status(200).json({
        success: true,
        message: "Course and its lectures deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to delete course",
        success: false,
      });
    }
  };

//lecture controllers

export const createLecture = async(req, res)=>{
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        }
        const lecture = await Lecture.create({lectureTitle});
        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save()
        }
        return res.status(201).json({
            success:true,
            lecture,
            message:"Lecture created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create Lecture"
        })
        
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({
                message:"course not found"
            })
        }
        return res.status(200).json({
            success:true,
            lectures:course.lectures
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get Lectures"
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        console.log("📦 Incoming videoInfo:", videoInfo); // DEBUG

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!",
            });
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            success: true,
            lecture,
            message: "Lecture updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lectures",
            success: false,
        });
    }
};



export const removeLecture = async(req,res)=>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }
        await Course.updateOne(
            {lectures: lectureId}, 
            {$pull: {lectures:lectureId}} 
        );
        return res.status(200).json({
            success:true,
            message:"Lecture removed successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}


export const togglePublishedCourse = async (req, res)=>{
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true , false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        course.isPublished = !course.isPublished
        await course.save()

        const statusMessage = course.isPublished ? "Published":"Unpublished";
        return res.status(200).json({
          success:true,
          message:`Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}

export const createDocument = async (req, res) => {
  try {
    const { doctitle, description } = req.body;
    const { courseId } = req.params;
    const file = req.file;

    if (!doctitle || !file || !courseId) {
      return res.status(400).json({
        message: "Document title, file, and courseId are required",
        success: false,
      });
    }

    // Tìm kiếm khoá học
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Upload file lên Cloudinary
    const fileUri = getDataUri(file);
    const uploaded = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
    });

    // Tạo tài liệu mới
    const document = await Document.create({
      doctitle,
      description,
      fileUrl: uploaded.secure_url,
      course: courseId,
    });

    // Gắn document vào course
    course.documents.push(document._id);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to upload document",
      success: false,
    });
  }
};

export const getCourseDocuments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Tìm tất cả documents thuộc course
    const documents = await Document.find({ course: courseId });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get documents" });
  }
};

export const editDocument = async (req, res) => {
  try {
    const { doctitle, description, fileInfo } = req.body; 
    const { courseId, documentId } = req.params;

    console.log("📦 Incoming fileInfo:", fileInfo); // DEBUG

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        message: "Document not found!",
        success: false,
      });
    }

    if (doctitle) document.doctitle = doctitle;
    if (description !== undefined) document.description = description;

    // Chỉ cập nhật fileUrl, bỏ publicId
    if (fileInfo?.fileUrl) document.fileUrl = fileInfo.fileUrl;

    await document.save();

    const course = await Course.findById(courseId);
    if (course && !course.documents.includes(document._id)) {
      course.documents.push(document._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      document,
      message: "Document updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to edit document",
      success: false,
    });
  }
};

export const removeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Xóa document theo ID
    const document = await Document.findByIdAndDelete(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found!",
        success: false,
      });
    }

    // Loại bỏ documentId khỏi mảng documents của course
    await Course.updateOne(
      { documents: documentId },
      { $pull: { documents: documentId } }
    );

    return res.status(200).json({
      success: true,
      message: "Document removed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove document",
      success: false,
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        message: "Search keyword is required",
        success: false,
      });
    }

    const courses = await Course.find({
      isPublished: true, // chỉ hiển thị khoá học đã public
      courseTitle: { $regex: keyword, $options: "i" }, // không phân biệt hoa thường
    }).select("courseTitle _id courseThumbnail subTitle"); // chọn thêm trường hiển thị gợi ý

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to search courses",
    });
  }
};



