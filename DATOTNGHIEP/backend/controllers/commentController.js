const Comment = require("../models/commentModel");
const OrderDetail = require("../models/orderdetailModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

// Lấy tất cả comment
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("user_id", "name img _id")
      .populate("product_id", "name")
      .sort({ created_at: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kiểm tra xem user có thể bình luận sản phẩm hay không
const checkCanComment = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    // 1. Kiểm tra xem user đã bình luận sản phẩm này chưa
    const existingComment = await Comment.findOne({
      user_id: userId,
      product_id: productId,
    });

    if (existingComment) {
      return res.json({
        canComment: false,
        hasCommented: true,
        message: 'Bạn đã bình luận sản phẩm này. Vui lòng chỉnh sửa bình luận cũ nếu muốn thay đổi.'
      });
    }

    // 2. Tìm tất cả đơn hàng của user có status = delivered
    const deliveredOrders = await Order.find({
      userId: userId, 
      status: 'delivered'
    });

    if (!deliveredOrders.length) {
      return res.json({
        canComment: false,
        hasCommented: false,
        message: 'Bạn cần phải mua và nhận hàng để có thể bình luận'
      });
    }

    // 3. Lấy các orderIds từ delivered orders
    const orderIds = deliveredOrders.map(order => order._id);

    // 4. Tìm trong orderDetail với populate variant và product
    const orderDetails = await OrderDetail.find({
      orderId: { $in: orderIds }
    }).populate({
      path: 'productVariantId',
      populate: {
        path: 'productID',
        model: 'products',
        select: '_id name'
      }
    });
    
    // 5. Kiểm tra xem user đã mua sản phẩm này chưa
    const hasBoughtProduct = orderDetails.some(detail => 
      detail.productVariantId.productID._id.toString() === productId
    );

    if (!hasBoughtProduct) {
      return res.json({
        canComment: false,
        hasCommented: false,
        message: 'Bạn cần phải mua và nhận hàng để có thể bình luận'
      });
    }

    // Đã thỏa điều kiện mua hàng và chưa bình luận
    res.json({
      canComment: true,
      hasCommented: false,
      message: 'Cảm ơn bạn vì đã đánh giá sản phẩm. Bạn có thể thay đổi đánh giá của mình bất cứ lúc nào.'
    });

  } catch (error) {
    res.status(500).json({
      canComment: false,
      hasCommented: false,
      message: error.message
    });
  }
};

// Lấy comment theo sản phẩm
const getAllCommentsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const comments = await Comment.find({
      product_id: productId
    })
      .populate("user_id", "name img _id")
      .sort({ created_at: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm comment mới
const addComment = async (req, res) => {
  try {
    const { content, rating, user_id, product_id } = req.body;

    // Kiểm tra xem user đã bình luận sản phẩm này chưa
    const existingComment = await Comment.findOne({
      user_id,
      product_id,
    });

    if (existingComment) {
      return res.status(400).json({ 
        message: "Bạn đã bình luận sản phẩm này. Vui lòng chỉnh sửa bình luận cũ nếu muốn thay đổi." 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Đánh giá phải từ 1-5 sao" });
    }

    const newComment = new Comment({
      content,
      rating,
      user_id,
      product_id,
      status: "Chưa trả lời",
    });

    const savedComment = await newComment.save();
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "user_id",
      "name img _id"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sửa comment
const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, user_id } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Đánh giá phải từ 1 đến 5 sao" });
    }

    // Validate user_id matches comment owner
    if (comment.user_id.toString() !== user_id) {
      return res
        .status(403)
        .json({ message: "Không có quyền chỉnh sửa bình luận này" });
    }

    // Cập nhật và populate đầy đủ thông tin user
    const updatedComment = await Comment.findByIdAndUpdate(id, {
      rating: rating || comment.rating,
      content: content || comment.content,
    }, { new: true }).populate("user_id", "name img _id");

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    // Đảo trạng thái isDeleted
    comment.isDeleted = !comment.isDeleted;
    await comment.save();

    res.status(200).json({ 
      message: `Đã ${comment.isDeleted ? "ẩn" : "hiện"} bình luận thành công`,
      isDeleted: comment.isDeleted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply comment
const replyComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_reply } = req.body;

    if (!admin_reply?.trim()) {
      return res
        .status(400)
        .json({ message: "Nội dung phản hồi không được trống" });
    }

    const updated = await Comment.findByIdAndUpdate(
      id,
      {
        admin_reply,
        status: "Đã trả lời",
      },
      { new: true }
    ).populate("user_id", "name img _id");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm hàm xử lý xóa reply
const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Comment.findByIdAndUpdate(
      id,
      {
        admin_reply: "",
        status: "Chưa trả lời",
      },
      { new: true }
    ).populate("user_id", "name img _id");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đặt trạng thái hiển thị của bình luận (ẩn/show)
const setCommentVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    comment.isDeleted = isDeleted;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy comment của user
const getCommentsByUser = async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ message: "Thiếu user_id" });

    let queryUserId = userId;
    // Nếu là ObjectId hợp lệ thì dùng new mongoose.mongo.ObjectId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      queryUserId = new mongoose.mongo.ObjectId(userId);
    }

    const comments = await Comment.find({ user_id: queryUserId, isDeleted: false }).populate("product_id");
    res.json(comments);
  } catch (error) {
    console.error("getCommentsByUser error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xuất hàm mới
module.exports = {
  getAllComments,
  getAllCommentsByProduct,
  addComment,
  editComment,
  deleteComment,
  replyComment,
  deleteReply,
  checkCanComment,
  setCommentVisibility,
  getCommentsByUser
};