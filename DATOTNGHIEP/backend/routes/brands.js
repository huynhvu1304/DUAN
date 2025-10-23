var express = require('express');
var router = express.Router();

const { getAllBrands,addBrand,editBrand,deleteBrand,getBrandById } = require('../controllers/brandController');
const{verifyToken,verifyAdmin}=require('../controllers/userController');

// lay tat ca danh muc
router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.delete('/:id', verifyToken,verifyAdmin,deleteBrand);
router.post('/', verifyToken,verifyAdmin,addBrand);
router.patch('/:id', verifyToken,verifyAdmin,editBrand);


module.exports = router;
