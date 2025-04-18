var express = require('express');
var router = express.Router();



const{register,login,getUser,verifyToken,addFavorite, getFavorites,checkFavorite, getAllUsers, removeFavorite}=require('../controllers/userController');


//dăng kí người dùng
router.get('/getalluser', getAllUsers)
router.post('/register',register);
router.post('/login',login);
router.get('/getuser',verifyToken, getUser);
router.post('/:email/favorite/:productId', addFavorite);
router.get('/:email/favorites', getFavorites);
router.get('/:email/favorite/:productId', checkFavorite);
router.delete('/:email/favorite/:productId', removeFavorite);






module.exports = router;
