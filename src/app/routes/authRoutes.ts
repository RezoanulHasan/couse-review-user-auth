import express from 'express';
import {
  login,
  register,
  changePassword,
  logout,
  refreshToken,
} from '../controllers/authController';
import { authenticateToken, isUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/change-password', authenticateToken, isUser, changePassword);
export default router;
