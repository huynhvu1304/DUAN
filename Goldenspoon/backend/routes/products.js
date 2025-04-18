var express = require('express');
var router = express.Router();

const { getAllproducts, 
getProductsId,addpro,editpro,deletepro, } = require('../controllers/productController');
const{verifyToken,verifyAdmin}=require('../controllers/userController');

// lay tat ca danh muc
router.get('/', getAllproducts);

// lay chi tiet 1 danh muc]
router.get('/:id', getProductsId);

router.post('/',  verifyToken, verifyAdmin,addpro);
router.patch('/:id', verifyToken, verifyAdmin,editpro);
router.delete('/:id', verifyToken, verifyAdmin,deletepro);

module.exports = router;
