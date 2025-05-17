import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createDocument, deleteDocument, getCourseDocuments } from "../controllers/document.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Tạo document cho course cụ thể
router.route("/:courseId/document").post(isAuthenticated, singleUpload, createDocument);

// Lấy tất cả document của course cụ thể
router.route("/:courseId/document").get(isAuthenticated, getCourseDocuments);

// Xóa một document cụ thể
router.route("/document/:documentId").delete(isAuthenticated, deleteDocument);

export default router;
