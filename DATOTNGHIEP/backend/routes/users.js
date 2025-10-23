var express = require('express');
var router = express.Router();

const{register,
    login,
    getUser,
    verifyToken,
    getAllUsers,
    editUser,
    getFavorites,
    addFavorite,
    removeFavorite,
    updateUserStatus,
    updateStatusQuestion,
    changePassword,
    addUserAddress,
    getDefaultAddress,
    getAllUserAddresses,
    setDefaultUserAddress,
    updateAddress,
    deleteAddress,
    updateStatusComment,
    googleLogin
    }=require('../controllers/userController');


//dăng kí người dùng
router.get('/', getAllUsers)
router.post('/register',register);
router.post('/login',login);
router.get('/getuser',verifyToken, getUser);
router.get('/favorites', verifyToken,  getFavorites);
router.patch('/:id/status',updateUserStatus);
router.patch('/:id/statuscomment', updateStatusComment);
router.patch('/:id/statusquestion', updateStatusQuestion);
// cập nhật thông tin user
router.patch('/update',verifyToken, editUser);
// Đổi mật khẩu
router.post('/change-password', changePassword);
router.post('/:userId/favorites/:productId', verifyToken, addFavorite);
router.delete('/favorites/:productId', verifyToken, removeFavorite);

// lưu nhiều địa chỉ 
// --- Quản lý Địa chỉ Giao hàng ---
// Thêm địa chỉ mới cho người dùng đã đăng nhập
router.post('/addresses', verifyToken, addUserAddress);

// Lấy tất cả địa chỉ của người dùng đã đăng nhập
router.get('/addresses', verifyToken, getAllUserAddresses);

// Lấy địa chỉ mặc định của người dùng đã đăng nhập
router.get('/addresses/default', verifyToken, getDefaultAddress);

// Đặt một địa chỉ đã có làm địa chỉ mặc định cho người dùng đã đăng nhập
router.patch('/addresses/set-default', verifyToken, setDefaultUserAddress);

// cập nhật địa chi, tên hoặc sđt
router.put('/addresses/:id', verifyToken, updateAddress);
// Xóa địa chỉ cụ thể của người dùng
router.delete('/addresses/:id', verifyToken, deleteAddress);
// google login
router.post('/google-login', googleLogin);
module.exports = router;
