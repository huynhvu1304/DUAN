const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new mongoose.Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['Chưa trả lời', 'Đã trả lời'], default: 'Chưa trả lời' },
  isVisible: { type: Boolean, default: true },
  parent_id: { type: Schema.Types.ObjectId, ref: 'questions', default: null },
  level: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index hỗ trợ truy vấn theo parent_id (lấy reply nhanh)
questionSchema.index({ parent_id: 1 });

module.exports = mongoose.model('questions', questionSchema);

