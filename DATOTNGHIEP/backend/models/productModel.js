// Tạo cấu trúc Schema cho dữ liệu products
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa cấu trúc Schema cho collection "products" trong MongoDB
const productSchema = new Schema({

  name: { type: String, required: true },
  description: { type: String },
  images_main: { type: String }, // Ảnh chính
  hot: { type: Number, default: 0 },
  status: { type: String, default: 'active' }, // Trạng thái (active, inactive,...)

  categoryId: { type: Schema.Types.ObjectId, ref: 'categories' }, // Danh mục
  brand: { type: Schema.Types.ObjectId, ref: 'brands' },           // Thương hiệu

  purchases: { type: Number, default: 0 }, // (tuỳ chọn) Thống kê số lượt mua
  variants: [{ type: Schema.Types.ObjectId, ref: 'variants' }],
  
}, { timestamps: true });

// Text index to support flexible, diacritic-insensitive search by name and description
// Note: default_language 'none' to avoid stemming altering Vietnamese terms
productSchema.index({ name: 'text', description: 'text' }, { default_language: 'none' });

// Tạo Model "products" từ Schema
const products = mongoose.model('products', productSchema);

module.exports = products;