var express = require('express');
var router = express.Router();

const { Postorder, getOrdersByUser, cancelOrder, getAllOrdersForAdmin, updateOrderStatus, updatePaymentStatus, getRevenue, adminCancelOrder} = require('../controllers/orderController');
const{verifyToken}=require('../controllers/userController');

router.post('/postorder',verifyToken, Postorder);
// lấy đơn hàng của người dùng
router.get('/myorders', verifyToken, getOrdersByUser);
// xem trạng thái 
router.patch('/cancel/:id', verifyToken, cancelOrder);
// lấy id cập nhật trạng thái đơn hàng
router.put('/:id/status', verifyToken, updateOrderStatus);
// cập nhật trạng thái thanh toán
router.put('/:id/payment-status', verifyToken, updatePaymentStatus);
// lấy tổng doanh thu
router.get('/revenue', getRevenue);
// lấy tất cả đơn hàng từ data / admin
router.get("/admin", verifyToken, getAllOrdersForAdmin);
// huy đơn hàng bằng admin
router.put('/:id/cancel-by-admin', verifyToken, adminCancelOrder);

module.exports = router;
