import express from "express"
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import { createCourse, createDocument, createLecture, deleteCourse, editCourse, editDocument, editLecture, getCourseById, getCourseDocuments, getCourseLecture, getCreatorCourses, getPublishedCourse, removeDocument, removeLecture, searchCourse, togglePublishedCourse,  } from "../controllers/course.controller.js"
import {singleUpload} from "../middleware/multer.js"

const router = express.Router()
router.route("/search").get(searchCourse);
router.route("/").post(isAuthenticated, createCourse)
router.route("/published-courses").get(getPublishedCourse)
router.route("/").get(isAuthenticated, getCreatorCourses)
router.route("/:courseId").put(isAuthenticated,singleUpload,editCourse)
router.route("/:courseId").get(isAuthenticated,getCourseById)
router.route("/:courseId").delete(isAuthenticated, deleteCourse);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture)
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture)
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture)
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture)
router.route("/:courseId").patch(togglePublishedCourse)
router.route("/:courseId/document").post(isAuthenticated,singleUpload, createDocument)
router.route("/:courseId/document").get(isAuthenticated, getCourseDocuments)
router.route("/:courseId/document/:documentId").post(isAuthenticated, editDocument)
router.route("/:courseId/document/:documentId").delete(isAuthenticated, removeDocument);





export default router;

