const Question = require('../models/questionModel');
const Product = require('../models/productModel'); // Thêm dòng này nếu chưa có
const { userModel } = require('../models/userModel');
const mongoose = require('mongoose');

// Lấy tất cả câu hỏi gốc + replies theo product_id
const getQuestionsByProduct = async (req, res) => {
  try {
    const questions = await Question.find({
      product_id: req.params.productId
    })
      .populate('user_id', 'name role img')
      .sort({ createdAt: 1 }); // theo thứ tự cũ nhất

    const questionMap = {};
    const roots = [];

    const list = questions.map(q => q.toObject());

    // Xây dựng cây reply
    list.forEach(q => {
      q.replies = [];
      questionMap[q._id] = q;
    });

    list.forEach(q => {
      if (q.parent_id) {
        const parent = questionMap[q.parent_id];
        if (parent) parent.replies.push(q);
      } else {
        roots.push(q);
      }
    });

    res.json(roots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mới câu hỏi hoặc trả lời
const createQuestion = async (req, res) => {
  try {
    const { content, product_id, parent_id, user_id, isVisible } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }
    if (!product_id) {
      return res.status(400).json({ message: 'Thiếu product_id' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Thiếu nội dung câu hỏi' });
    }

    let level = 0;

    if (parent_id) {
      const parent = await Question.findById(parent_id);
      if (!parent) return res.status(404).json({ message: 'Không tìm thấy parent question' });
      level = parent.level + 1;
    }

    // Lấy thông tin user trả lời
    const user = await userModel.findById(user_id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const newQuestion = await Question.create({
      content,
      product_id,
      user_id,
      parent_id: parent_id || null,
      level,
      status: parent_id ? 'Chưa trả lời' : 'Chưa trả lời',
      isVisible: typeof isVisible === 'boolean' ? isVisible : true // luôn có trường này
    });

    // Nếu là reply và user là admin, cập nhật status cha thành "Đã trả lời"
    if (parent_id && user && user.role === 'admin') {
      await Question.findByIdAndUpdate(parent_id, { status: 'Đã trả lời' });
    }

    await newQuestion.populate('user_id', 'name role img');

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Lỗi tạo câu hỏi:', error);
    res.status(500).json({ message: error.message });
  }
};
// Xoá mềm câu hỏi hoặc reply
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, isAdmin } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
    }

    if (!isAdmin && user_id !== question.user_id.toString()) {
      return res.status(403).json({ message: 'Không có quyền xoá' });
    }

    // Xóa cứng câu hỏi
    await Question.findByIdAndDelete(id);
    await Question.deleteMany({ parent_id: id });

    res.json({ message: 'Đã xoá bình luận (cứng)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy toàn bộ (admin)
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('user_id', 'name role img')
      .populate('product_id', 'name images_main')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách sản phẩm kèm tổng số câu hỏi (chỉ tính isDeleted: false)
const getQuestionsWithProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const result = [];

    for (const product of products) {
      // Đếm tổng số câu hỏi gốc (không phải reply, chỉ câu hỏi hiện)
      const total = await Question.countDocuments({ 
        product_id: product._id, 
        parent_id: null, 
       
      });
      if (total === 0) continue;

      // Đếm số câu hỏi gốc đã trả lời (chỉ câu hỏi hiện)
      const answered = await Question.countDocuments({ 
        product_id: product._id, 
        parent_id: null, 
        status: 'Đã trả lời',
     
      });

      // Đếm số câu hỏi gốc chưa trả lời (chỉ câu hỏi hiện)
      const unanswered = await Question.countDocuments({ 
        product_id: product._id, 
        parent_id: null, 
        status: 'Chưa trả lời',
      
      });

      // Lấy danh sách câu hỏi gốc (không phải reply, bao gồm cả câu hỏi ẩn và hiện)
      const questions = await Question.find({ 
          product_id: product._id, 
          parent_id: null // <-- KHÔNG lọc isVisible
        })
        .populate('user_id', 'name img')
        .sort({ createdAt: -1 });

      // Với mỗi câu hỏi, tìm reply của admin (nếu có)
      const questionsWithReply = [];
      for (const q of questions) {
        // Tìm reply của admin cho câu hỏi này
        const adminReply = await Question.findOne({
          parent_id: q._id,
        }).populate('user_id', 'name role img');

        let replyContent = null;
        let replyId = null;
        if (adminReply && adminReply.user_id && adminReply.user_id.role === 'admin') {
          replyContent = adminReply.content;
          replyId = adminReply._id;
        }

        questionsWithReply.push({
          ...q.toObject(),
          replyContent,
          replyId,
        });
      }

      result.push({
        product,
        questionCount: { total, answered, unanswered },
        questions: questionsWithReply,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editReply = async (req, res) => {
  try {
    const { replyId, content } = req.body;
    if (!replyId || !content) {
      return res.status(400).json({ message: 'Thiếu replyId hoặc nội dung' });
    }
    const reply = await Question.findById(replyId);
    if (!reply) return res.status(404).json({ message: 'Không tìm thấy reply' });

    reply.content = content;
    await reply.save();

    res.json({ message: 'Đã cập nhật phản hồi', reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ẩn/hiện câu hỏi
const toggleVisible = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ message: 'isVisible phải là true hoặc false' });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
    }
    res.json({ message: 'Cập nhật trạng thái thành công', question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestionsByProduct,
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionsWithProducts,
  editReply,
  toggleVisible 
};