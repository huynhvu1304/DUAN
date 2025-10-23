const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs'); 
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const Variant = require("../models/variantModel");
const Product = require("../models/productModel");
const OrderDetail = require("../models/orderdetailModel");
const FlashSale = require("../models/flashsaleModel");

// VNPAY Config
const vnpConfig = require('../config/vnpayConfig');

// Hàm lấy IP client
function getClientIp(_req) { // getClientIp phải nhận req
    let ipAddr = _req.headers['x-forwarded-for'] ||
        _req.connection.remoteAddress || // req.connection sẽ có khi là request object
        _req.socket.remoteAddress ||     // req.socket sẽ có khi là request object
        _req.connection.socket.remoteAddress;

    if (ipAddr.includes('::ffff:')) {
        ipAddr = ipAddr.split('::ffff:')[1];
    }
    return ipAddr;
}

// 1. Tạo URL thanh toán VNPAY
const createPayment = async (_req, res) => {
    try {
         const { orderId, amount, bankCode, language = 'vn' } = _req.body;

 if (!orderId || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ code: '99', message: 'Invalid or missing orderId or amount.' });
        }

        // Lấy thông tin order từ DB để đảm bảo amount khớp
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            return res.status(404).json({ code: '99', message: 'Order not found.' });
        }
        if (parseFloat(amount) !== currentOrder.totalAmount) {
             return res.status(400).json({ code: '99', message: 'Invalid or mismatched amount with order total.' });
        }

        // Tìm bản ghi Payment đã tạo trong orderController (trạng thái pending)
        let existingPayment = await Payment.findOne({ orderId: orderId, paymentMethod: 'vnpay' });

        if (!existingPayment) {
            // Trường hợp này không nên xảy ra nếu logic Postorder đúng
            // Nhưng để phòng hờ, nếu chưa có thì tạo mới (hoặc báo lỗi)
            return res.status(400).json({ code: '99', message: 'Payment record for this order not found or not VNPAY.' });
        }

        const ipAddr = getClientIp(_req);
        const tmnCode = vnpConfig.vnp_TmnCode;
        const secretKey = vnpConfig.vnp_HashSecret;
        let vnpUrl = vnpConfig.vnp_Url;
        const returnUrl = vnpConfig.vnp_ReturnUrl;

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        const orderId_vnpay = existingPayment.vnp_TxnRef; // Sử dụng vnp_TxnRef đã lưu từ Payment model

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Amount'] = amount * 100; // Số tiền * 100
        if (bankCode) { // `if (bankCode)` sẽ loại bỏ undefined, null, và chuỗi rỗng ''
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_Locale'] = language;
        vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang: ${orderId_vnpay}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_TxnRef'] = orderId_vnpay; // Mã giao dịch của bạn

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        console.log("Sign Data String:", signData); // LOG CÁI NÀY
        const hmac = crypto.createHmac("sha512", secretKey);
        const secureHash = hmac.update(signData).digest("hex");
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        // Trả về URL cho frontend để redirect hoặc redirect trực tiếp
        res.status(200).json({
            code: '00',
            message: 'Success',
            data: vnpUrl,
            orderId: orderId,
        });

    } catch (err) {
        console.error('Error in createPayment:', err);
        res.status(500).json({ code: '99', message: 'Internal server error', error: err.message });
    }
};

const paymentReturn = async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = vnpConfig.vnp_HashSecret;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    const orderId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const transactionStatus = vnp_Params['vnp_TransactionStatus'];
    const vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];

    let message = "Giao dịch không xác định.";
    let paymentStatusDB = "pending"; 
    let orderStatusDB = "pending";   
    let orderDetails = [];
    let order = null;

    try {
        if (secureHash === signed) {
            const payment = await Payment.findOne({ orderId: orderId, vnp_TxnRef: orderId });
            order = await Order.findById(orderId);

            if (!payment || !order) {
                message = "Không tìm thấy thông tin thanh toán hoặc đơn hàng.";
                orderStatusDB = "cancelled";
                console.warn(`VNPAY_RETURN: Order or Payment record not found for Order ID: ${orderId}`);
            } else if (payment.paymentStatus === 'paid' || payment.paymentStatus === 'failed') {
                message = "Giao dịch đã được xác nhận trạng thái trước đó.";
                paymentStatusDB = payment.paymentStatus;
                orderStatusDB = order.status;
                console.log(`VNPAY_RETURN: Transaction for Order ID: ${orderId} already processed.`);

                orderDetails = await OrderDetail.find({ orderId: order._id })
                    .populate({
                        path: 'productVariantId',
                        populate: {
                            path: 'productID',
                            model: 'products'
                        }
                    });
            } else { // Giao dịch hợp lệ và chưa được xử lý
                if (responseCode === '00' && transactionStatus === '00') {
                    message = "Thanh toán thành công. Đơn hàng của bạn đã được xác nhận.";
                    paymentStatusDB = "paid";
                    orderStatusDB = "confirmed";

                    orderDetails = await OrderDetail.find({ orderId: order._id }).populate({
                        path: 'productVariantId',
                        populate: {
                            path: 'productID',
                            model: 'products'
                        }
                    });

                    let hasStockIssue = false;
                    for (const detail of orderDetails) {
                        const variant = await Variant.findById(detail.productVariantId).populate('productID');
                        if (!variant || variant.stock < detail.quantity) {
                            hasStockIssue = true;
                            const productName = variant?.productID?.name || 'Sản phẩm không xác định';
                            const variantIdentifier = `${productName} (Size: ${variant?.size}, Màu: ${variant?.color})`;
                            message = `Không đủ tồn kho cho biến thể "${variantIdentifier}". Vui lòng liên hệ hỗ trợ.`;
                            paymentStatusDB = "failed";
                            orderStatusDB = "cancelled";
                            break;
                        }
                    }

                    if (!hasStockIssue) {
                        try {
                          for (const detail of orderDetails) {
    // Trừ Variant stock
    await Variant.findByIdAndUpdate(
        detail.productVariantId,
        { $inc: { stock: -detail.quantity } }
    );

    // Tăng purchases cho Product
    const variant = await Variant.findById(detail.productVariantId);
    if (variant && variant.productID) {
        await Product.findByIdAndUpdate(variant.productID, { $inc: { purchases: 1 } });
    }

    // 🔥 Update FlashSale nếu variant nằm trong flash sale đang chạy
    await FlashSale.updateOne(
        {
            status: "Đang diễn ra",
            "products.variant_id": detail.productVariantId
        },
        {
            $inc: { "products.$.quantity": -detail.quantity }
        }
    );
}

                            console.log(`VNPAY_RETURN: Stock deducted and purchases updated for Order ID: ${orderId}`);
                        } catch (stockUpdateError) {
                            console.error(`VNPAY_RETURN: Error deducting stock/updating purchases for Order ID ${orderId}:`, stockUpdateError);
                            message = `Lỗi khi cập nhật tồn kho/lượt mua. Đơn hàng có thể cần kiểm tra thủ công.`;
                            paymentStatusDB = "failed";
                            orderStatusDB = "pending_manual_review";
                        }
                    }
                } else {
                    message = `Thanh toán không thành công. Mã lỗi: ${responseCode}. Trạng thái: ${transactionStatus}.`;
                    paymentStatusDB = "failed";
                    orderStatusDB = "cancelled";
                    console.log(`VNPAY_RETURN: Payment for Order ID ${orderId} failed. Code: ${responseCode}, Status: ${transactionStatus}`);
                }

                payment.paymentStatus = paymentStatusDB;
                payment.vnp_ResponseCode = responseCode;
                payment.vnp_TransactionStatus = transactionStatus;
                payment.vnp_TransactionNo = vnp_TransactionNo;
                // payment.vnp_PayDate = vnp_Params['vnp_PayDate'];
                // payment.vnp_CardType = vnp_Params['vnp_CardType'];
                await payment.save();

                order.status = orderStatusDB;
                await order.save();
                console.log(`VNPAY_RETURN: Final Updated Order ${orderId} to ${orderStatusDB}, Payment to ${paymentStatusDB}`);
            }
        } else {
            message = "Chữ ký không hợp lệ. Giao dịch không được xác minh.";
            paymentStatusDB = "failed";
            orderStatusDB = "cancelled";
            console.error(`VNPAY_RETURN: Invalid Secure Hash for Order ID: ${orderId}. Expected: ${signed}, Received: ${secureHash}`);
        }
    } catch (err) {
        console.error('Error in paymentReturn (outer catch):', err);
        message = 'Có lỗi xảy ra trong quá trình xử lý kết quả thanh toán.';
        paymentStatusDB = "failed";
        orderStatusDB = "cancelled";
    }
    
    let ejsTemplate = 'success.ejs';
    if (paymentStatusDB === 'failed' || orderStatusDB === 'cancelled') {
        ejsTemplate = 'failed.ejs';
    }
    
    // --- Bổ sung logic dịch sang tiếng Việt ở đây ---
    const paymentStatusDisplay = {
        'pending': 'Chờ thanh toán',
        'paid': 'Đã thanh toán',
        'failed': 'Thất bại'
    }[paymentStatusDB] || 'Không xác định';

    const orderStatusDisplay = {
        'pending': 'Chờ xử lý',
        'confirmed': 'Đã xác nhận',
        'cancelled': 'Đã hủy',
        'pending_manual_review': 'Chờ kiểm tra thủ công'
    }[orderStatusDB] || 'Không xác định';
 const clientUrl = process.env.CLIENT_URL || 'http://localhost:4000';
    res.render(ejsTemplate, {
        title: 'Kết quả Thanh toán',
        responseCode: responseCode,
        message: message,
        orderId: orderId,
        paymentStatus: paymentStatusDisplay, // Truyền trạng thái tiếng Việt vào EJS
        orderStatus: orderStatusDisplay,     // Truyền trạng thái tiếng Việt vào EJS
        vnp_TransactionNo: vnp_TransactionNo,
        orderDetails: orderDetails,
        orderCode: order.orderCode,
        totalAmount: order ? order.totalAmount : 0,
        clientUrl: clientUrl
    });
};


// 3. Xử lý IPN từ VNPAY (server-to-server)
const paymentIpn = async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = vnpConfig.vnp_HashSecret;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    const orderId = vnp_Params['vnp_TxnRef']; // Order ID của bạn
    const vnp_Amount = vnp_Params['vnp_Amount'] / 100; // Số tiền từ VNPAY
    const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
    const vnp_TransactionStatus = vnp_Params['vnp_TransactionStatus'];

    try {
        const payment = await Payment.findOne({ orderId: orderId, vnp_TxnRef: orderId });
        const order = await Order.findById(orderId);

        if (!payment || !order) {
            return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
        }

        // 1. Kiểm tra chữ ký (Quan trọng nhất)
        if (secureHash !== signed) {
            return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }

        // 2. Kiểm tra số tiền
        if (vnp_Amount !== payment.amount) {
            return res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
        }

        // 3. Kiểm tra trạng thái giao dịch
        // Nếu giao dịch đã được xử lý (paymentStatus đã là 'paid' hoặc 'failed')
        if (payment.paymentStatus === 'paid' || payment.paymentStatus === 'failed') {
            return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
        }

        // 4. Cập nhật trạng thái
        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
            // Giao dịch thành công
            payment.paymentStatus = 'paid';
            order.status = 'confirmed'; // Cập nhật trạng thái đơn hàng thành đã xác nhận
            await order.save(); // Lưu order trước khi save payment để đảm bảo đồng bộ
            console.log(`IPN: Order ${orderId} confirmed.`);

        } else {
            // Giao dịch thất bại hoặc các mã lỗi khác
            payment.paymentStatus = 'failed';
            order.status = 'cancelled'; // Hủy đơn hàng nếu thanh toán thất bại
            await order.save();
            console.log(`IPN: Order ${orderId} failed or cancelled. ResponseCode: ${vnp_ResponseCode}, TransactionStatus: ${vnp_TransactionStatus}`);
        }

        // Cập nhật các thông tin VNPAY vào Payment model
        payment.vnp_Amount = vnp_Amount * 100; // Lưu lại số tiền gốc VNPAY
        payment.vnp_BankCode = vnp_Params['vnp_BankCode'];
        // payment.vnp_CardType = vnp_Params['vnp_CardType'];
        payment.vnp_OrderInfo = vnp_Params['vnp_OrderInfo'];
        // payment.vnp_PayDate = vnp_Params['vnp_PayDate'];
        payment.vnp_ResponseCode = vnp_ResponseCode;
        payment.vnp_TmnCode = vnp_Params['vnp_TmnCode'];
        payment.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
        payment.vnp_TransactionStatus = vnp_TransactionStatus;
        payment.vnp_SecureHash = secureHash; // Lưu lại hash để kiểm tra sau
        await payment.save();

        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });

    } catch (err) {
        console.error('Error in paymentIpn:', err);
        res.status(200).json({ RspCode: '99', Message: 'Unknown error' }); // VNPAY yêu cầu trả về 00, 01, 02, 04, 97, 99
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    createPayment,
    paymentReturn,
    paymentIpn
};