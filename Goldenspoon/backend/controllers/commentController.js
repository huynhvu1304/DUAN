const Comment = require("../models/commentModel");
const User = require("../models/userModel");
// Lấy danh sách bình luận theo sản phẩm
const getCommentsByProduct = async (req, res) => {
  console.log('Request received');
  const { productId } = req.params;
  console.log('Received Product ID:', productId);

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }

  try {
    const comments = await Comment.find({ productId })
      .populate('userId', 'name'); // ✨ Hiện tên + avatar người bình luận
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Thêm bình luận mới
const createComment = async (req, res) => {
  try {
    const { productId, content } = req.body;

    // Lấy thông tin userId từ middleware verifyToken
    const userId = req.userId;

    if (!productId || !content || content.trim() === "") {
      console.error("Missing required fields: productId or content.");
      return res.status(400).json({ error: "Product ID and content are required." });
    }

    const newComment = new Comment({
      productId,
      userId,
      content,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error while creating comment:", error); // Log the error for debugging
    res.status(500).json({ error: "Lỗi khi thêm bình luận." });
  }
};

// Sửa bình luận
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const userId = req.userId;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Nội dung bình luận không được để trống." });
    }

    // Kiểm tra xem bình luận có thuộc về user không
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền sửa bình luận này." });
    }

    comment.content = content;
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi sửa bình luận." });
  }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.userId;

    // Kiểm tra xem bình luận có thuộc về user không
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền xóa bình luận này." });
    }

    await comment.remove();
    res.status(200).json({ message: "Đã xóa bình luận thành công." });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa bình luận." });
  }
};

module.exports = {
  getCommentsByProduct,
  createComment,
  updateComment,
  deleteComment,
};
