const express = require("express");
const router = express.Router();

// Import các controller liên quan đến bình luận
const {
  getCommentsByProduct,
  createComment,
  updateComment,
  deleteComment
} = require("../controllers/commentController");
const{verifyToken}=require('../controllers/userController');


// Route lấy danh sách bình luận theo sản phẩm (không yêu cầu đăng nhập)
router.get("/:productId", getCommentsByProduct);

// Route thêm bình luận mới (yêu cầu đăng nhập)
router.post("/", verifyToken, createComment);

// Route sửa bình luận (yêu cầu đăng nhập)
router.put("/:id", verifyToken, updateComment);

// Route xóa bình luận (yêu cầu đăng nhập)
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
