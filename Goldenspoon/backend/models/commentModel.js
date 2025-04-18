const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Ensure this matches the Product model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Ensure this matches the User model
      required: true,
    },
    content: {
      type: String,
      required: [true, "Nội dung bình luận không được để trống"],
      maxlength: [1000, "Nội dung bình luận không được quá 1000 ký tự"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
