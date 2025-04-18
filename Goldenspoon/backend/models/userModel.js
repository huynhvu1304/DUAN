// Tao cau truc schema cho du lieu  categories
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name : { type: String, required: true },
  email: { type: String, required: true },
  password : { type: String, required: true },
  role:   { type: String, default: "user" },
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }] // ✅ sửa tại đây
}, { versionKey: false });


// Tao model tu Schema tren collection 
// Chay vo CSDL Mongo de kay du lieu cua categories ra
// Va kiem tra du lieu do co khop voi Schema du lieu vua tao
const userModel = mongoose.model('users', userSchema);

module.exports = userModel;