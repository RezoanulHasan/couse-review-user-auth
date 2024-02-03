import express from 'express';
import {
  createReview,
  getCourseWithReviews,
  getAllReviews,
  getBestCourse,
} from '../controllers/review.controller';
import { authenticateToken, isUser } from '../middlewares/authMiddleware';

const router = express.Router();

//  creating a review
router.post('/api/reviews', authenticateToken, isUser, createReview);
// get best course by review
router.get('/api/course/best', getBestCourse);
// get  course by id by  review
router.get('/api/courses/:courseId/reviews', getCourseWithReviews);
// get all review
router.get('/api/reviews', getAllReviews);
export default router;
