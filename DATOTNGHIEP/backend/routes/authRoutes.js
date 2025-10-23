const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/authController');

// Gửi email quên mật khẩu
router.post('/forgot-password', forgotPassword);

// Đặt lại mật khẩu
router.post('/reset-password/:token', resetPassword);

module.exports = router;
