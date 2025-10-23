// vnpayConfig.js (hoặc nơi bạn định nghĩa các biến này, thường là trong .env)
module.exports = {
  vnp_TmnCode: "11C2Q5KU",
  vnp_HashSecret: "CB28L4LQYPFT9DDL6HTL00XX5NTEY7FF",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: `http://localhost:3000/payment/vnpay_return`, // Đã thay đổi
  // Đừng quên thêm VNP_IPN_URL nếu bạn chưa có
  vnp_IpnUrl: `http://localhost:3000/payment/vnpay_ipn` // Đã thêm
};