// Tao cau truc schema cho du lieu  categories
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema ({
  name : {type: String, required: true},
});

// Tao model tu Schema tren collection 
// Chay vo CSDL Mongo de kay du lieu cua categories ra
// Va kiem tra du lieu do co khop voi Schema du lieu vua tao
const categories = mongoose.model('categories', categorySchema);

module.exports = categories;