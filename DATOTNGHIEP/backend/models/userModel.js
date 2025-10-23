// userModel.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema ({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password : {type: String, required: false},
  phone: { type: String, default: " " },
  img: {type: String},
  address: { type: mongoose.Schema.Types.ObjectId, ref: "userAddresses", default: null },
  role:   {type:String, default:"user"},
  status: {type:String, default:"Hoạt động"},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  statuscomment: {
    type: String,
    enum: ['Cho phép bình luận', 'Cấm bình luận'],
    default: 'Cho phép bình luận'
  },
  statusquestion: {
    type: String,
    enum: ['Cho phép đặt câu hỏi', 'Cấm đặt câu hỏi'],
    default: 'Cho phép đặt câu hỏi'
  },

  // lấy lại mật khẩu
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }

},({versionKey: false}));


const userModel = mongoose.model('users', userSchema);
// lưu nhiều điểm giao hàng
const userAddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  name: { type: String, required: true },     
  phone: { type: String, required: true },    
  useraddress: { type: String, required: true },  
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const userAddress = mongoose.model("userAddresses", userAddressSchema);


module.exports = {
  userModel,
  userAddress
};
