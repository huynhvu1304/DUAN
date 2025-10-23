// models/brandModel.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image_logo: { type: String, required: true }
}, { timestamps: true });

// Kiểm tra xem có thiếu tên collection không
// Text index to support flexible brand name search
brandSchema.index({ name: 'text' }, { default_language: 'none' });
const brands = mongoose.model('brands', brandSchema); 

module.exports = brands;
