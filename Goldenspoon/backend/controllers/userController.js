//chèn multer để upload file
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})
const checkfile = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
    return cb(new Error('Bạn chỉ được upload file ảnh'))
  }
  return cb(null, true)
}
const upload = multer({storage: storage, fileFilter: checkfile})

const userModel= require('../models/userModel')
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const mongoose = require('mongoose'); // Thêm dòng này

const getAllUsers = async (req, res) => {
  try {
      const Users = await userModel.find();
      res.status(200).json(Users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
//thêm người dùng
const register = [
  upload.single('img'), async (req, res, next) => {
    try{
      console.log(req.body);
      // kiểm tra email đã đăng kí chưa
      const checkuser = await userModel.findOne({email: req.body.email});
      if(checkuser){
        throw new Error("Email đã đăng ký");
      }
      //mã hóa mật khẩu bằng bcrypt
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      //tạo một instance mới của usermodel
      const newuser= new userModel({
          name: req.body.username,
          email:req.body.email,
          password: hashPassword,
    
      })
      const data = await newuser.save();
      res.json(data);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  } 
]


  const login = [
    upload.single('img'), 
    async (req, res, next) => {
      try {
        console.log(req.body);
  
        // Kiểm tra email đã đăng ký chưa
        const checkuser = await userModel.findOne({ email: req.body.email });
        if (!checkuser) {
          throw new Error("Email không tồn tại");
        }
  
        // Mã hóa mật khẩu bằng bcrypt
        const isMatch = await bcrypt.compare(req.body.password, checkuser.password);
        if (!isMatch) {
          throw new Error("Mật khẩu không đúng");
        }
        
        // Tạo token JWT
        const token = jwt.sign({ id: checkuser._id, role: checkuser.role, name: checkuser.name}, 'hello', { expiresIn: '1h' });
      
        // Trả về token
        res.json({ token, role: checkuser.role, name: checkuser.name });
  
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  ];
  //Bảo mật token
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.slice(7);
    console.log(token);
    if (!token) {
      return res.status(403).json({ message: 'không có token' });
    }
    //xác thực token với mã bí mật
    jwt.verify(token, 'hello', (err, decoded) => {
      if (err) {
       if(err.name === 'TokenExpiredError'){
        return res.status(401).json({ message: 'token đã hết hạn' });
       } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'token không hợp le' });
       }
        return res.status(401).json({ message: 'lỗi xác thực token' });
      }
      // decoed chưa thông tin user đã mã hóa trong token và lưu vào req
      req.userId = decoded.id;
      console.log(req.userId);
      next();
    });
  }

// lấy thông tin user khi có token
const getUser = async (req, res) => {
  try{
    const user = await userModel.findById(req.userId, {password: 0});
    if(!user){
      throw new Error('không tìm thấy user');
    }
    res.json(user);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}
const verifyAdmin = async (req, res, next) => {
   try{
    const user = await userModel.findById(req.userId);
    if(!user){
      throw new Error('không tìm thấy user');
    }
    if(user.role !== 'admin'){
      throw new Error('không có quyền truy cập');
    }
    next();
   }
   catch(error){
    res.status(500).json({ message: error.message });
   }
  
}

const addFavorite = async (req, res) => {
  try {
    const { email, productId } = req.params;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const objectId = new mongoose.Types.ObjectId(productId);

    // Kiểm tra trùng ID
    if (user.favorite.some(fav => fav.equals(objectId))) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }

    user.favorite.push(objectId);
    await user.save();

    res.status(200).json({ message: 'Đã thêm vào yêu thích', favorite: user.favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const checkFavorite = async (req, res) => {
  try {
    const { email, productId } = req.params;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const objectId = new mongoose.Types.ObjectId(productId);

    const isFavorite = user.favorite.some(fav => fav.equals(objectId));
    
    res.status(200).json({ isFavorite }); // true hoặc false
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Xóa sp yêu thích
const removeFavorite = async (req, res) => {
  try {
    const { email, productId } = req.params;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    // Xóa productId khỏi danh sách yêu thích
    user.favorite = user.favorite.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getFavorites = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userModel.findOne({ email }).populate('favorite');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ favoriteProducts: user.favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports= {
    register,
    login,
    verifyToken,
    getUser, 
    verifyAdmin,
    getAllUsers,
    addFavorite,
    checkFavorite,
    getFavorites,
    removeFavorite
}