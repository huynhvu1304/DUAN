const brands = require('../models/brandModel'); 
const products = require('../models/productModel'); 
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
const upload = multer({storage: storage, fileFilter: checkfile});


// Lấy danh sách tất cả các thương hiệu
const getAllBrands = async (req, res) => {
  try {
    const brand = await brands.find();
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving brands', error });
  }
};
// Lấy thông tin chi tiết một thương hiệu theo ID
const getBrandById = async (req, res) => { 
  const { id } = req.params;

  try {
    const brand = await brands.findById(id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving brand', error });
  }
};

// Thêm một thương hiệu mới với upload logo
const addBrand = [
  upload.single('image_logo'), // Xử lý upload ảnh với key 'image_logo'
  async (req, res, next) => {
    try {
      // Lấy dữ liệu từ form gửi tới
      const brand = req.body;

      if (req.file) {
        // Lấy đường dẫn ảnh từ file ảnh gửi đến
        brand.image_logo = req.file.originalname;
      }

      // Tạo một instance của Brand model
      const newBrand = new brands(brand);

      // Lưu thương hiệu vào database
      const data = await newBrand.save();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const editBrand = [
  upload.single('image_logo'), // Xử lý upload ảnh với key 'image_logo'
  async (req, res, next) => {
    try {
      // Lấy dữ liệu từ form gửi tới
      const brand = req.body;

      if (req.file) {
        // Lấy ảnh từ file ảnh gửi đến
        brand.image_logo = req.file.originalname;
      }

      // Cập nhật thông tin thương hiệu trong cơ sở dữ liệu
      const data = await brands.findByIdAndUpdate(req.params.id, brand, { new: true });

      if (!data) {
        return res.status(404).json({ message: 'Brand not found' });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];



// Xóa thương hiệu
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // 💡 BƯỚC QUAN TRỌNG: Kiểm tra xem có sản phẩm nào thuộc thương hiệu này không
    const productsInBrand = await products.find({ brand: id });

    if (productsInBrand.length > 0) {
      // Nếu có sản phẩm, trả về lỗi 409 và không thực hiện xóa
      return res.status(409).json({ message: 'Không thể xóa thương hiệu này vì nó vẫn chứa sản phẩm.' });
    }

    // Nếu không có sản phẩm, tiến hành xóa thương hiệu
    const deletedBrand = await brands.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting brand', error });
  }
};
// Xuất các hàm controller
module.exports = {
  getAllBrands,
  addBrand,
  editBrand,
  deleteBrand,
  getBrandById
};
