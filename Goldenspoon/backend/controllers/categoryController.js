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

const categories = require('../models/categoryModel');

//Ham lay tat ca danh muc
const getAllCategories = async (req, res, next) => {
    try {
        const arr = await categories.find();
        res.status(200).json(arr);
      } catch (error) {
        res.status(500).json({message: error.message});
      }
}

//Ham lay chi tiet 1 danh muc
const getCategoriesId = async(req, res, next) => {
  try {
    const category = await categories.findById(req.params.id);
    // Ham findById lau du lieu theo id
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
const addCategory = [
  upload.single('img'), async (req, res, next) => {
    try{
      //lấy dữ liệu từ form gửi tới
      const category =req.body;
      //lấy ảnh từ file ảnh gửi đến
      category.img=req.file.originalname;
        // tạo 1 instance của productmodel
      const newCategory = new categories(category);
      //lưu sản phẩm vào databasse
      const data = await newCategory.save();
      res.json(data);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  } 
];

//sửa danh muc
const editCategory = [
  upload.single('img'), async (req, res, next) => {
    try{
      //lấy dữ liệu từ form gửi tới 
      const category =req.body;
      if(req.file){
      //lấy ảnh từ file ảnh gửi đến
      category.img=req.file.originalname;
      }
      
      const data = await categories.findByIdAndUpdate(req.params.id, category, {new: true});
      res.json(data);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  } 
]
const deleteCategory = async (req, res) => {
  try {
    await categories.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  //export ra de cac file khac co the su dung
  module.exports = {
    getAllCategories, 
    getCategoriesId,
    addCategory,
    editCategory,
    deleteCategory,
  }


