const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const checkBanned = require('../middlewares/checkBanned');

// Lấy tất cả comment
router.get('/', commentController.getAllComments);

// ĐÚNG: Đặt các route cụ thể lên trên
router.get('/by-user', commentController.getCommentsByUser);

// check xem người dùng đã mua hàng  hay chưa
router.get('/check-permission', commentController.checkCanComment);

// Lấy comment theo sản phẩm (route động để cuối cùng)
router.get('/:productId', commentController.getAllCommentsByProduct);

// Thêm comment mới
router.post('/', checkBanned, commentController.addComment);

// Sửa comment
router.patch('/:id', checkBanned, commentController.editComment);

// Xóa comment
router.delete('/:id', commentController.deleteComment);

// Admin reply comment
router.patch('/:id/reply', commentController.replyComment);

// Admin delete comment
router.delete('/:id/reply', commentController.deleteReply);

// Đặt trạng thái hiển thị của comment
router.patch('/:id/visibility', commentController.setCommentVisibility);
module.exports = router;