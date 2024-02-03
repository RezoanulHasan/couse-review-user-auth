import express from 'express';
import {
  createCourse,
  getCourses,
  updateCourse,
  getCourseById,
  deleteCourse,
} from '../controllers/coursesController';
import {
  authenticateToken,
  isAdmin,
  isUser,
} from '../middlewares/authMiddleware';
const router = express.Router();
// Create courses
router.post('/api/courses', authenticateToken, isAdmin, createCourse);
// get all  courses
router.get('/api/courses', getCourses);
// get single  courses  by id
router.get('/api/courses/:id', authenticateToken, isUser, getCourseById);
// delete  courses  by id
router.delete('/api/courses/:id', authenticateToken, isAdmin, deleteCourse);
//update course
router.put('/api/courses/:courseId', authenticateToken, isAdmin, updateCourse);

export default router;
