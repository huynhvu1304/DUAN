// Tao cau truc schema cho du lieu  categories
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
},{ timestamps: true });

// Tao model tu Schema tren collection 
// Chay vo CSDL Mongo de kay du lieu cua categories ra
// Va kiem tra du lieu do co khop voi Schema du lieu vua tao
// Text index to support flexible category name search
categorySchema.index({ name: 'text' }, { default_language: 'none' });
const categories = mongoose.model('categories', categorySchema);

module.exports = categories;