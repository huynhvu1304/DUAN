var express = require('express');
var router = express.Router();

const { getAllCategories, 
getCategoriesId, addCategory, editCategory, deleteCategory
} = require('../controllers/categoryController');
const{verifyToken,verifyAdmin}=require('../controllers/userController');

// lay tat ca danh muc
router.get('/',getAllCategories);

// lay chi tiet 1 danh muc]
router.get('/:id', getCategoriesId);

router.post('/',verifyToken, verifyAdmin,  addCategory);
router.patch('/:id',verifyToken, verifyAdmin, editCategory);
router.delete('/:id',verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
