var express = require('express');
var router = express.Router();

const { getAllproducts, 
getProductsId,addpro,editpro,deletepro,
updateHot,statusPro,
searchProducts } = require('../controllers/productController');
const{verifyToken,verifyAdmin}=require('../controllers/userController');

// lay tat ca danh muc
router.get('/', getAllproducts);
// tìm kiếm header
router.get('/search', searchProducts);
// lay chi tiet 1 danh muc]
router.get('/:id', getProductsId);
router.post('/',verifyToken, verifyAdmin, addpro);
router.patch('/:id', verifyToken, verifyAdmin,editpro);
// Cập nhật trạng thái hot
router.patch('/hot/:id', verifyToken, verifyAdmin, updateHot);
router.delete('/:id', verifyToken, verifyAdmin,deletepro);
//cập nhật ẩn hiện sản phẩm
router.patch('/status/:id', verifyToken, verifyAdmin, statusPro);
module.exports = router;
