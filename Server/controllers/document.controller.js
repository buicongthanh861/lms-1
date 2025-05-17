import { Document } from "../models/document.model.js";
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js';
import { Course } from '../models/course.model.js';

export const createDocument = async (req, res) => {
  try {
    const { doctitle, description } = req.body;
    const { courseId } = req.params;
    const file = req.file;

    if (!doctitle || !file) {
      return res.status(400).json({ message: "Title and file are required" });
    }

    const fileUri = getDataUri(file);
    const uploaded = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto", 
    });

    const document = await Document.create({
      doctitle,
      description,
      fileUrl: uploaded.secure_url,
      course: courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload document", success: false });
  }
};

export const getCourseDocuments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const documents = await Document.find({ course: courseId });
    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get documents", success: false });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findByIdAndDelete(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }


    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

