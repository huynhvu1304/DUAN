const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/userController');
const {
  checkSpinEligibility,
  spinWheel,
  getSpinHistory,
  getSpinWheelVouchers
} = require('../controllers/spinController');

// Kiểm tra quyền quay (không cần auth để check)
router.get('/check-eligibility', verifyToken, checkSpinEligibility);

// Quay vòng quay (cần auth)
router.post('/spin', verifyToken, spinWheel);

// Lấy lịch sử quay (cần auth)
router.get('/history', verifyToken, getSpinHistory);

// Lấy danh sách voucher cho vòng quay (không cần auth)
router.get('/vouchers', getSpinWheelVouchers);

// Lấy tất cả voucher có thể tham gia vòng quay (cho admin)
router.get('/', getSpinWheelVouchers);

module.exports = router; 