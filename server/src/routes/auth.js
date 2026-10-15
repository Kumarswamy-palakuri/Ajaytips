import express from 'express';
import {
  register,
  verifyEmail,
  login,
  refreshTokens,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} from '../validators/authValidator.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter, sensitiveOpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.get('/verify-email', verifyEmail);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh', refreshTokens);
router.post('/forgot-password', sensitiveOpLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', sensitiveOpLimiter, validateResetPassword, resetPassword);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', sensitiveOpLimiter, validateChangePassword, changePassword);

export default router;
