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

const products = require('../models/productModel');
const categories = require('../models/categoryModel');



// Hàm lấy tất cả sản phẩm
const getAllproducts = async (req, res, next) => {
  try {
    const { ten_mon, idcate, limit, sort, page, hot, sale } = req.query;
    let query = {}; // Query chua dieu kien tim kiem
    let options = {}; // Các tùy chọn như limit và sort

    // Kiểm tra và thêm điều kiện lọc cho tên sản phẩm
    if (ten_mon) {
      query["thong_tin_mon_an.ten_mon"] = new RegExp(ten_mon, 'i'); // Tìm kiếm tên sản phẩm
    }

    // Kiểm tra và thêm điều kiện lọc cho sản phẩm hot
    if (hot) {
      query.hot = parseInt(hot); // Lọc sản phẩm hot
    }

    // Kiểm tra và thêm điều kiện lọc cho categoryId
    if (idcate) {
      query.categoryId = idcate; // Lọc sản phẩm theo danh mục
    }

    // Giới hạn số lượng sản phẩm trả về
    if (limit) {
      options.limit = parseInt(limit); 
    }

    // Sắp xếp theo giá nếu có
    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    // Thêm tính năng phân trang
    if (page) {
      options.skip = (parseInt(page) - 1) * options.limit;
    }

    // Lấy danh sách sản phẩm từ database và populate categoryId
    const arr = await products.find(query, null, options).populate('categoryId');
    res.json(arr);  // Trả về dữ liệu cho client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Hàm lấy chi tiết sản phẩm theo id
const getProductsId = async (req, res, next) => {
  try {
    const product = await products.findById(req.params.id).populate('categoryId');
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//thêm sản phẩm
const addpro = [
  upload.single('img'), async (req, res, next) => {
    try{
      //lấy dữ liệu từ form gửi tới
      const product =req.body;
      //lấy ảnh từ file ảnh gửi đến
      product.img=req.file.originalname;
        // tạo 1 instance của productmodel
      const newProduct = new products(product);
      //kiểm tra xem id danh mục có tôn tại ko
      const category = await categories.findById(product.categoryId);
      if(!category){
        throw new Error ('danh mục ko tồn tại');
      }
      //lưu sản phẩm vào databasse
      const data = await newProduct.save();
      res.json(data);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  } 
]
//sửa sản phẩm
const editpro = [
  upload.single('img'), async (req, res, next) => {
    try{
      //lấy dữ liệu từ form gửi tới
      const product =req.body;
      if(req.file){
      //lấy ảnh từ file ảnh gửi đến
      product.img=req.file.originalname;
      }
      
      
      //kiểm tra xem id danh mục có tôn tại ko
      const category = await categories.findById(product.categoryId);
      if(!category){
        throw new Error ('danh mục ko tồn tại');
      }
      const data = await products.findByIdAndUpdate(req.params.id, product, {new: true});
      res.json(data);
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
  } 
]
//xóa sản phẩm
const deletepro= async (req, res  ) => {
  try{
    const data = await products.findByIdAndDelete(req.params.id);
    res.json({messenger: 'xóa sản phẩm thành công'});
  }
  catch(error){
    res.status(500).json({ message: error.message });
  } 
}
// Export ra để các file khác có thể sử dụng
module.exports = {
  getAllproducts,
  getProductsId,
  addpro,
  editpro,
  deletepro
};
