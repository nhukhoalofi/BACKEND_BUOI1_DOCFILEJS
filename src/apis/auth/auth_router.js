import express from 'express';
import AuthController from './auth_controller.js';  // Đảm bảo bạn import đúng file controller
const router = express.Router();

// Route đăng ký người dùng
router.post('/register', AuthController.register);

export default router;
