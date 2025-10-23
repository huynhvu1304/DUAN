var express = require('express');
var router = express.Router();

const {
  createVoucher,
  getAllVouchers,
  getVouchersWithFilter,
  updateVoucher,
  getMyVouchers,
  getVoucherById,
  validateVoucher,
  softDeleteVoucher,
  getAllVouchersWithDeleted
} = require('../controllers/voucherController');

const { verifyToken } = require('../controllers/userController');

// Tạo voucher mới
router.post('/createVoucher', createVoucher);

// Validate voucher
router.post('/validate', verifyToken, validateVoucher);

// Lấy tất cả voucher (chỉ voucher chưa bị xóa)
router.get('/', getAllVouchers);

// Lấy voucher với filter
router.get('/filter', getVouchersWithFilter);

// Lấy tất cả voucher bao gồm đã xóa (cho admin)
router.get('/all-with-deleted', getAllVouchersWithDeleted);

// Lấy voucher của user 
router.get('/my', verifyToken, getMyVouchers);

// Lấy voucher theo ID
router.get('/:id', getVoucherById);

// Sửa voucher
router.put('/:id', updateVoucher);

// Soft delete/restore voucher
router.patch('/:id/toggle-delete', softDeleteVoucher);

module.exports = router;