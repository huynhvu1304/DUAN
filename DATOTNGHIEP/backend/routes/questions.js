const express = require('express');
const router = express.Router();
const { getAllQuestions, getQuestionsByProduct, createQuestion, deleteQuestion, getQuestionsWithProducts, editReply, toggleVisible } = require('../controllers/questionController');

// Lấy tất cả câu hỏi (admin)
router.get('/', getAllQuestions);

// Lấy câu hỏi và replies theo sản phẩm
router.get('/product/:productId', getQuestionsByProduct);

// Tạo câu hỏi hoặc trả lời (reply)
router.post('/', createQuestion);

// Xoá (admin hoặc người tạo)
router.delete('/:id', deleteQuestion);

// Lấy danh sách sản phẩm kèm tổng số câu hỏi (chỉ tính isDeleted: false)
router.get('/with-products', getQuestionsWithProducts);

// Sửa reply (admin)
router.put('/edit-reply', editReply);

// Cập nhật trạng thái ẩn/hiện (admin)
router.patch('/:id/visible', toggleVisible);

module.exports = router;