const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
  admin_reply: { type: String, default: "" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  isDeleted: { type: Boolean, default: false },
  status: { type: String, enum: ['Chưa trả lời', 'Đã trả lời'], default: 'Chưa trả lời' }
});

const comments = mongoose.model('comments', commentSchema);

module.exports = comments;