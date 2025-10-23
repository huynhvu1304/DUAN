const mongoose = require('mongoose');
const Variant = require('../models/variantModel');
const products = require('../models/productModel');

const categories = require('../models/categoryModel');
const brands = require('../models/brandModel');
require('../models/brandModel');
//chèn multer để upload file
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }

})
const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'))
  }
  return cb(null, true)
}
const upload = multer({ storage: storage, fileFilter: checkfile })



// Hàm lấy tất cả sản phẩm
const getAllproducts = async (req, res, next) => {
  try {
    const { name, idcate, limit, sort, page, hot, status, categoryId, brandId } = req.query;
    let query = {};
    let options = {};
    if (req.query.status) {
      if (req.query.status !== 'all') {
        query.status = req.query.status; // 'active' hoặc 'inactive'
      }
    }
    if (name) {
      query.name = new RegExp(name, 'i');
    }

    if (hot) {
      query.hot = parseInt(hot);
    }

    if (idcate) {
      query.categoryId = idcate;
    }
if (brandId) {
            try {
                // Đảm bảo brandId là một ObjectId để khớp với Schema của bạn
                query.brand = mongoose.Types.ObjectId(brandId);
            } catch (error) {
                // Xử lý nếu brandId không hợp lệ
                return res.json([]);
            }
        }
    if (limit) {
      options.limit = parseInt(limit);
    }

    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    if (page && options.limit) {
      options.skip = (parseInt(page) - 1) * options.limit;
    }

    if (categoryId) {
      try {
        // Sử dụng mongoose.Types.ObjectId để tìm kiếm đúng kiểu dữ liệu
        query.categoryId = mongoose.Types.ObjectId(categoryId);
      } catch (e) {
        // Nếu ID không hợp lệ, trả về mảng rỗng để frontend xử lý đúng
        return res.json([]);
      }
    }
    const arr = await products.find(query, null, options)
      .populate('categoryId')
      .populate('brand')
    const productsWithVariants = await Promise.all(
      arr.map(async (product) => {
        const variants = await Variant.find({ productID: product._id })
          .select('id image cost_price sale_price size color stock');
        return {
          ...product.toObject(),
          variants
        };
      })
    );

    res.json(productsWithVariants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Hàm lấy sản phẩm theo ID kèm danh sách các biến thể
const getProductsId = async (req, res) => {
  try {

    const productId = req.params.id;

    // Kiểm tra ID sản phẩm hợp lệ
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    // Lấy sản phẩm và thông tin danh mục
    const product = await products.findById(productId)
      .populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Lấy danh sách các biến thể liên quan đến sản phẩm (chú ý productID viết hoa D)
    const variants = await Variant.find({ productID: productId })
      .select('id image cost_price sale_price size color stock');

    // Gộp thông tin sản phẩm và biến thể
    const productWithVariants = {
      ...product.toObject(),
      variants,
    };

    // Trả kết quả JSON
    res.status(200).json(productWithVariants);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo ID:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// xử lý thanh tìm kiếm header
const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q;

    if (!keyword || keyword.trim() === '') {
      return res.json([]);
    }

    const results = await products.find({
      name: { $regex: keyword, $options: 'i' }
    }).limit(10);

    res.json(results);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};


//thêm sản phẩm
const addpro = [
  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'variantImages', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      const category = await categories.findById(body.categoryId);
      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }

      const brand = await brands.findById(body.brandId);
      if (!brand) {
        throw new Error('Thương hiệu không tồn tại');
      }

      const newProduct = new products({
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        brand: body.brandId,
        images_main: req.files['img'] ? req.files['img'][0].filename : null
      });

      const savedProduct = await newProduct.save();

      // Parse variants an toàn
      let variantList = [];
      if (body.variants && body.variants !== "undefined") {
        try {
          variantList = JSON.parse(body.variants);
        } catch (e) {
          return res.status(400).json({ message: "Dữ liệu variants không hợp lệ" });
        }
      }

      const variantPromises = variantList.map((v, index) => {
        const variantImage = req.files['variantImages'] ? req.files['variantImages'][index]?.filename : null;
        return new Variant({
          ...v,
          productID: savedProduct._id,
          image: variantImage
        }).save();
      });

      const savedVariants = await Promise.all(variantPromises);

      await products.findByIdAndUpdate(savedProduct._id, {
        $set: { variants: savedVariants.map(v => v._id) }
      });

      res.status(201).json({
        message: 'Thêm sản phẩm thành công!',
        product: savedProduct,
        variants: savedVariants
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
];



//sửa sản phẩm
const editpro = [
  upload.any(),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, brand, categoryId, description, variants } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!name || !brand || !categoryId || !description) {
        return res.status(400).json({ message: 'Thiếu các trường bắt buộc: name, brand, categoryId, description' });
      }

      // Kiểm tra category tồn tại
      const category = await categories.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: `Danh mục với ID ${categoryId} không tồn tại` });
      }

      // Kiểm tra brand tồn tại
      const brandDoc = await brands.findById(brand);
      if (!brandDoc) {
        return res.status(400).json({ message: `Thương hiệu với ID ${brand} không tồn tại` });
      }
      const mainImageFile = req.files.find(file => file.fieldname === 'img');
      // Cập nhật thông tin sản phẩm
      const productUpdate = {
        name,
        brand,
        categoryId,
        description,
        images_main: mainImageFile ? mainImageFile.filename : undefined,
      };

      const updatedProduct = await products.findByIdAndUpdate(productId, productUpdate, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: `Sản phẩm với ID ${productId} không tồn tại` });
      }
      const files = req.files; // Array of all uploaded files
      // Xử lý danh sách biến thể
      let variantList = [];
      if (variants && variants !== 'undefined') {
        try {
          variantList = JSON.parse(req.body.variants);

          // Kiểm tra các trường bắt buộc của biến thể
          for (const v of variantList) {
            if (!v.size || !v.color || v.cost_price == null || v.sale_price == null || v.stock == null) {
              return res.status(400).json({
                message: 'Biến thể thiếu các trường bắt buộc: size, color, cost_price, sale_price, stock',
              });
            }
          }
        } catch (err) {
          return res.status(400).json({ message: 'Dữ liệu variants không hợp lệ: ' + err.message });
        }
      }

      // Lấy danh sách biến thể hiện tại của sản phẩm
      const existingVariants = await Variant.find({ productID: productId });
      const existingVariantIds = existingVariants.map((v) => v._id.toString());
      const incomingVariantIds = variantList.map((v) => v._id).filter((id) => id);

      // Xóa các biến thể không còn trong danh sách gửi lên
      const variantsToDelete = existingVariantIds.filter((id) => !incomingVariantIds.includes(id));
      if (variantsToDelete.length > 0) {
        await Variant.deleteMany({ _id: { $in: variantsToDelete } });
      }

      // Cập nhật hoặc tạo mới biến thể
      const variantPromises = variantList.map(async (v, index) => {
        const variantFile = files.find(file => file.fieldname === `variantImages_${index}`);
        let variant;

        if (v._id && mongoose.Types.ObjectId.isValid(v._id)) {
          variant = await Variant.findById(v._id);
          if (variant) {
            variant.set({
              size: v.size,
              color: v.color,
              cost_price: v.cost_price,
              sale_price: v.sale_price,
              stock: v.stock,
              image: variantFile ? variantFile.filename : variant.image,
            });
            return await variant.save();
          }
        }

        // Tạo mới nếu chưa có ID
        return await new Variant({
          size: v.size,
          color: v.color,
          cost_price: v.cost_price,
          sale_price: v.sale_price,
          stock: v.stock,
          productID: updatedProduct._id,
          image: variantFile ? variantFile.filename : v.image || null,
        }).save();
      });
      const updatedVariants = await Promise.all(variantPromises);

      // Cập nhật danh sách variant cho sản phẩm
      updatedProduct.variants = updatedVariants.map((v) => v._id);
      await updatedProduct.save();

      // Trả về thông tin sản phẩm và biến thể
      const productWithVariants = {
        ...updatedProduct.toObject(),
        variants: updatedVariants.map((v) => ({
          ...v.toObject(),
          image: v.image ? `http://localhost:3000/images/${v.image}` : null,
        })),
      };

      res.json({
        message: 'Cập nhật sản phẩm thành công!',
        product: productWithVariants,
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
  },
];

//xóa sản phẩm
const deletepro = async (req, res) => {
  try {
    const data = await products.findByIdAndDelete(req.params.id);
    res.json({ messenger: 'xóa sản phẩm thành công' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const statusPro = async (req, res) => {
  try {
    const productId = req.params.id;

    // Tìm sản phẩm theo id
    const product = await products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Đổi trạng thái: nếu active -> inactive, ngược lại
    product.status = product.status === 'active' ? 'inactive' : 'active';

    await product.save();

    res.json({
      message: `Sản phẩm đã được ${product.status === 'active' ? 'hiển thị' : 'ẩn'}`,
      status: product.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }

}

// cập nhật hot
const updateHot = async (req, res) => {
  try {
    const { id } = req.params;
    const { hot } = req.body;

    if (typeof hot !== 'number') {
      return res.status(400).json({ message: 'Invalid hot value' });
    }

    const product = await products.findByIdAndUpdate(id, { hot }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Error updating hot:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Export ra để các file khác có thể sử dụng
module.exports = {
  getAllproducts,
  getProductsId,
  addpro,
  editpro,
  deletepro,
  updateHot,
  statusPro,
  searchProducts
};
