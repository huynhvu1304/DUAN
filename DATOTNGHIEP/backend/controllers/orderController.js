const mongoose = require('mongoose');
const Order = require("../models/orderModel");
const OrderDetail = require("../models/orderdetailModel");
const Payment = require("../models/paymentModel");
const Variant = require("../models/variantModel");
const Product = require("../models/productModel");
const FlashSale = require('../models/flashsaleModel'); 
const paymentController = require('../controllers/paymentController'); 
const generateOrderCode = require('../utils/generateOrderCode'); 

const Postorder = async (req, res) => {
    let savedOrder;
    try {
        const {
            receiverName,
            receiverPhone,
            receiverAddress, 
            totalAmount,
            paymentMethod, 
            cartItems,
            bankCode, 
            language, 
            voucher_id 
        } = req.body;

        if (!req.userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập hoặc không hợp lệ." });
        }

        // Validate cartItems
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng không được để trống." });
        }
        for (const item of cartItems) {
            if (!item.productVariantId || !item.quantity || !item.price || isNaN(item.quantity) || isNaN(item.price) || item.quantity <= 0 || item.price <= 0) {
                return res.status(400).json({ message: "Thông tin sản phẩm trong giỏ hàng không hợp lệ." });
            }
        }

        // Basic validation for other fields
        if (!receiverName || !receiverPhone || !receiverAddress || isNaN(totalAmount) || totalAmount <= 0 || !paymentMethod) {
            return res.status(400).json({ message: "Thông tin đơn hàng không đầy đủ hoặc không hợp lệ." });
        }

        // Xử lý voucher nếu có
        let finalAmount = totalAmount;
        let voucherDiscount = 0;
        let appliedVoucher = null;

        if (voucher_id) {
            try {
                const Voucher = require('../models/voucherModel');
                const UserVoucher = require('../models/userVoucher');

                // Kiểm tra voucher có tồn tại và hợp lệ không
                const voucher = await Voucher.findById(voucher_id);
                if (!voucher || voucher.isDeleted || !voucher.isActive) {
                    return res.status(400).json({ message: "Voucher không hợp lệ hoặc đã bị vô hiệu hóa." });
                }

                // Kiểm tra thời gian hiệu lực
                const now = new Date();
                if (now < new Date(voucher.startDate) || now > new Date(voucher.endDate)) {
                    return res.status(400).json({ message: "Voucher không trong thời gian hiệu lực." });
                }

                // Kiểm tra user có voucher này không
                const userVoucher = await UserVoucher.findOne({ 
                    user_id: req.userId, 
                    voucher_id: voucher._id,
                    status: 'received'
                });

                if (!userVoucher) {
                    return res.status(400).json({ message: "Bạn không sở hữu voucher này hoặc đã sử dụng." });
                }

                // Tính toán giảm giá để kiểm tra tính hợp lệ
                let calculatedDiscount = 0;
                if (voucher.discountType === 'percent') {
                    calculatedDiscount = (totalAmount * voucher.discountValue) / 100;
                    if (voucher.maxDiscountValue && calculatedDiscount > voucher.maxDiscountValue) {
                        calculatedDiscount = voucher.maxDiscountValue;
                    }
                } else {
                    calculatedDiscount = voucher.discountValue;
                }

                // Kiểm tra giá trị đơn hàng tối thiểu (sử dụng totalAmount gốc)
                const originalAmount = totalAmount + calculatedDiscount;
                if (originalAmount < voucher.minOrderValue) {
                    return res.status(400).json({ 
                        message: `Đơn hàng phải có giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()} VND để sử dụng voucher này.` 
                    });
                }

                voucherDiscount = calculatedDiscount;
                appliedVoucher = voucher;

                // Cập nhật trạng thái voucher thành đã sử dụng
                userVoucher.status = 'used';
                userVoucher.usedAt = new Date();
                await userVoucher.save();

                // Tăng số lượng đã sử dụng của voucher
                voucher.used += 1;
                await voucher.save();

            } catch (voucherError) {
                console.error("Lỗi khi xử lý voucher:", voucherError);
                return res.status(400).json({ message: "Có lỗi xảy ra khi xử lý voucher." });
            }
        }

        // Sinh orderCode unique
        let orderCode;
        let isUnique = false;
        while (!isUnique) {
          orderCode = generateOrderCode();
          const existed = await Order.findOne({ orderCode });
          if (!existed) isUnique = true;
        }
        console.log("orderCode:", orderCode);
        // --- 1. Tạo đơn hàng ---
        const order = new Order({
            userId: req.userId,
            voucher_id: voucher_id || null,
            receiverName,
            receiverPhone,
            receiverAddress,
            totalAmount: totalAmount,
            items: cartItems,
            status: "pending",
            orderCode
        });
        savedOrder = await order.save();

        // --- 2. Tạo chi tiết đơn hàng ---
        const orderDetails = cartItems.map(item => ({
            orderId: savedOrder._id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price
        }));
        await OrderDetail.insertMany(orderDetails);

        let payment; 

        // --- 3. Xử lý thanh toán dựa trên paymentMethod ---
        if (paymentMethod === "vnpay" || paymentMethod === "bank_transfer") { 
            payment = new Payment({
                orderId: savedOrder._id,
                userId: req.userId,
                amount: totalAmount, 
                paymentMethod: "vnpay", 
                paymentStatus: "pending", 
                vnp_TxnRef: savedOrder._id.toString()
            });
            await payment.save();

            try {
                // Tạo request body đúng cấu trúc cho paymentController.createPayment
                const vnpayRequestBody = {
                    orderId: savedOrder._id.toString(), 
                    amount: finalAmount,
                    bankCode: bankCode,
                    language: language
                };

                // Gọi paymentController.createPayment với request object giả lập đúng cấu trúc
                await paymentController.createPayment({
                    body: vnpayRequestBody,
                    headers: req.headers,
                    connection: req.connection,
                    socket: req.socket
                }, res);

                return;
            } catch (vnpayCreationError) {
                console.error("Error initiating VNPAY payment:", vnpayCreationError);
                await Payment.findByIdAndDelete(payment._id);
                await OrderDetail.deleteMany({ orderId: savedOrder._id });
                await Order.findByIdAndDelete(savedOrder._id);
                return res.status(500).json({ message: "Lỗi khi khởi tạo thanh toán VNPAY. Đơn hàng đã bị hủy. Vui lòng thử lại." });
            }

        } else if (paymentMethod === "cod") {
            payment = new Payment({
                orderId: savedOrder._id,
                userId: req.userId,
                amount: totalAmount,
                paymentMethod: "cod",
                paymentStatus: "unpaid"
            });
            await payment.save();
            savedOrder.status = "pending"; 
            await savedOrder.save();

            // --- Populate và trả về dữ liệu cho COD ---
            const populatedOrder = await Order.findById(savedOrder._id)
                .populate('userId', 'username email')
                .populate('voucher_id')
                .lean();

            const populatedOrderDetails = await OrderDetail.find({ orderId: savedOrder._id }).lean();
            const populatedPayment = await Payment.findOne({ orderId: savedOrder._id }).lean();

            return res.status(201).json({
                message: "Đặt hàng thành công!",
                order: populatedOrder,
                orderCode: populatedOrder.orderCode,
                orderDetails: populatedOrderDetails,
                payment: populatedPayment,
                voucherInfo: appliedVoucher ? {
                    voucher: appliedVoucher,
                    discountAmount: voucherDiscount,
                    originalAmount: totalAmount + voucherDiscount,
                    finalAmount: totalAmount
                } : null
            });
        } else {
            // Handle other payment methods or invalid paymentMethod
            await OrderDetail.deleteMany({ orderId: savedOrder._id });
            await Order.findByIdAndDelete(savedOrder._id);
            return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ." });
        }


        // --- 4. Populate và trả về dữ liệu cho các phương thức không phải VNPAY ---
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('userId', 'username email')
            .populate('voucher_id')
            .lean();

        const populatedOrderDetails = await OrderDetail.find({ orderId: savedOrder._id }).lean();
        const populatedPayment = await Payment.findOne({ orderId: savedOrder._id }).lean();

        return res.status(201).json({
            message: "Đặt hàng thành công!",
            order: populatedOrder,
            orderCode: populatedOrder.orderCode,
            orderDetails: populatedOrderDetails,
            payment: populatedPayment,
            voucherInfo: appliedVoucher ? {
                voucher: appliedVoucher,
                discountAmount: voucherDiscount,
                originalAmount: totalAmount + voucherDiscount,
                finalAmount: totalAmount
            } : null
        });

    } catch (error) {
        // Nếu đã tạo đơn hàng, hãy rollback
        if (savedOrder && savedOrder._id) {
            await OrderDetail.deleteMany({ orderId: savedOrder._id });
            await Payment.deleteMany({ orderId: savedOrder._id });
            await Order.findByIdAndDelete(savedOrder._id);
        }
        console.error("Lỗi đặt hàng:", error); 
        return res.status(500).json({ message: "Đặt hàng thất bại!", error: error.message });
    }
};

// lấy thông tin đơn hàng của user
const getOrdersByUser = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập hoặc không hợp lệ." });
        }
        const orders = await Order.find({ userId: req.userId })
            .populate('voucher_id') 
            .sort({ createdAt: -1 })
            .lean();

        const detailedOrders = await Promise.all(
            orders.map(async (order) => {
                const orderDetails = await OrderDetail.find({ orderId: order._id })
                    .populate({
                        path: 'productVariantId',
                        select: 'size color sale_price image productID',
                        populate: {
                            path: 'productID',
                            select: 'name',
                        },
                    })
                    .lean();

                const payment = await Payment.findOne({ orderId: order._id }).lean();

                const items = orderDetails.map((detail) => {
                    const variant = detail.productVariantId || {};
                    const product = variant.productID || {};

                    return {
                        productId: product._id || null, 
                        productName: product.name || 'Sản phẩm không tồn tại',
                        variant: {
                            size: variant.size || 'Không rõ',
                            color: variant.color || 'Không rõ',
                            image: variant.image || '',
                        },
                        quantity: detail.quantity,
                        price: detail.price,
                    };
                });

                return {
                    ...order,
                    items,
                    payment: {
                        method: payment?.paymentMethod || 'unknown',
                        status: payment?.paymentStatus || 'unknown',
                        amount: payment?.amount || 0 
                    },
                };
            })
        );

        res.status(200).json({ orders: detailedOrders });

    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ message: 'Không thể lấy đơn hàng.' });
    }
};

// xử lý các trạng thái cho phép hủy đơn hàng từ khách hàng
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

        if (order.userId.toString() !== req.userId)
            return res.status(403).json({ message: "Không có quyền hủy đơn này." });

        const payment = await Payment.findOne({ orderId: order._id });

        if (!payment) {
            return res.status(400).json({ message: "Không tìm thấy thông tin thanh toán cho đơn hàng này." });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Chỉ được hủy đơn hàng khi đang chờ xác nhận hoặc chưa được thanh toán." });
        }

        if (payment.paymentStatus === "paid") {
            return res.status(400).json({ message: "Không thể hủy đơn hàng đã thanh toán thành công. Vui lòng liên hệ hỗ trợ để được hoàn tiền." });
        }

        // Lấy lý do hủy từ body
        const { cancelReason, cancelReasonText } = req.body;
        order.status = "cancelled";
        order.cancelReason = cancelReason || "other";
        order.cancelReasonText = cancelReasonText || "";
        payment.paymentStatus = "failed"; 
        await order.save();
        await payment.save();

        res.status(200).json({ message: "Đơn hàng đã được hủy.", order });
    } catch (err) {
        console.error("Lỗi khi hủy đơn hàng:", err);
        res.status(500).json({ message: "Có lỗi xảy ra khi hủy đơn hàng." });
    }
};


// lấy tất cả đơn hàng / admin
const getAllOrdersForAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "fullName email")
            .sort({ createdAt: -1 });

        const orderIds = orders.map(o => o._id);

        const [detailsList, paymentsList] = await Promise.all([
            OrderDetail.find({ orderId: { $in: orderIds } }).populate({
                path: "productVariantId",
                populate: { path: "productID", select: "name" }
            }),
            Payment.find({ orderId: { $in: orderIds } })
        ]);

        const fullOrders = orders.map(order => {
            const orderDetails = detailsList.filter(d => d.orderId.toString() === order._id.toString());
            const payment = paymentsList.find(p => p.orderId.toString() === order._id.toString());

            return {
                _id: order._id,
                orderCode: order.orderCode, 
                createdAt: order.createdAt,
                user: order.userId,
                receiverName: order.receiverName,
                receiverPhone: order.receiverPhone,
                receiverAddress: order.receiverAddress,
                totalAmount: order.totalAmount,
                status: order.status,
                cancelReason: order.cancelReason,         
                cancelReasonText: order.cancelReasonText,
                payment: payment ? {
                    method: payment.paymentMethod,
                    status: payment.paymentStatus,
                    amount: payment.amount,
                    // Thêm các thông tin VNPAY nếu có
                    vnp_TxnRef: payment.vnp_TxnRef,
                    vnp_TransactionNo: payment.vnp_TransactionNo,
                    vnp_ResponseCode: payment.vnp_ResponseCode,
                    vnp_BankCode: payment.vnp_BankCode,
                    vnp_PayDate: payment.vnp_PayDate
                } : null,
                items: orderDetails.map(detail => {
                    const variant = detail.productVariantId;
                    return {
                        quantity: detail.quantity,
                        price: detail.price,
                        variant: {
                            size: variant?.size,
                            color: variant?.color,
                            image: variant?.image,
                            productName: variant?.productID?.name || "Không rõ"
                        }
                    };
                })
            };
        });

        res.status(200).json({
          orders: fullOrders.map(order => ({
            _id: order._id,
            orderCode: order.orderCode, 
            createdAt: order.createdAt,
            user: order.user,
            receiverName: order.receiverName,
            receiverPhone: order.receiverPhone,
            receiverAddress: order.receiverAddress,
            totalAmount: order.totalAmount,
            status: order.status,
            cancelReason: order.cancelReason,         
            cancelReasonText: order.cancelReasonText,
            payment: order.payment, 
            items: order.items      
          }))
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn cho admin:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// cập nhật trạng thái vận chuyển đơn hàng
const STATUS_STEPS = ['pending', 'confirmed', 'shipping', 'delivered'];

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) { return res.status(404).json({ message: 'Không tìm thấy đơn hàng' }); }
        if (order.status === 'cancelled') { return res.status(400).json({ message: 'Không thể cập nhật trạng thái đơn hàng đã bị hủy' }); }

        const currentIndex = STATUS_STEPS.indexOf(order.status);
        if (currentIndex === -1 || currentIndex >= STATUS_STEPS.length - 1) { return res.status(400).json({ message: 'Không thể cập nhật trạng thái tiếp theo.' }); }

        const nextStatus = STATUS_STEPS[currentIndex + 1];

        // --- Logic khi chuyển sang 'confirmed' ---
        if (order.status === 'pending' && nextStatus === 'confirmed') {
            const payment = await Payment.findOne({ orderId: order._id });
            if (!payment) {
                return res.status(400).json({ message: "Không tìm thấy thông tin thanh toán cho đơn hàng này." });
            }
            // Chỉ cho phép confirm nếu thanh toán là 'paid' hoặc là COD 'unpaid'
            if (payment.paymentMethod === 'vnpay' && payment.paymentStatus !== 'paid') {
                return res.status(400).json({ message: "Đơn hàng VNPAY chưa được thanh toán thành công, không thể xác nhận." });
            }
            if (payment.paymentMethod === 'cod' && payment.paymentStatus !== 'unpaid') {
                // Điều này có thể xảy ra nếu bạn có trạng thái COD khác
                // Ví dụ: COD đã được thanh toán offline
            }


            const orderDetails = await OrderDetail.find({ orderId: order._id });

            // Bước 1: Kiểm tra tồn kho (quan trọng)
            for (const detail of orderDetails) {
                const variant = await Variant.findById(detail.productVariantId).populate('productID');

                if (!variant) {
                    return res.status(400).json({ message: `Biến thể với ID ${detail.productVariantId} không tồn tại.` });
                }

                if (variant.stock < detail.quantity) {
                    const productName = variant.productID?.name || 'Sản phẩm không xác định';
                    const variantIdentifier = `${productName} (Size: ${variant.size}, Màu: ${variant.color})`;

                    return res.status(400).json({
                        message: `Không đủ tồn kho cho biến thể "${variantIdentifier}". Tồn kho hiện tại: ${variant.stock}, Số lượng đặt: ${detail.quantity}. Vui lòng kiểm tra lại.`
                    });
                }
            }

            try {
                // Thực hiện giảm tồn kho và tăng lượt mua
                for (const detail of orderDetails) {
                    // Giảm tồn kho trong Variant
                    await Variant.findByIdAndUpdate(
                        detail.productVariantId,
                        { $inc: { stock: -detail.quantity } }
                    );

                    // Tăng lượt mua sản phẩm
                    const variant = await Variant.findById(detail.productVariantId);
                    if (variant && variant.productID) {
                        await Product.findByIdAndUpdate(
                            variant.productID,
                            { $inc: { purchases: 1 } }
                        );
                    }

                    // Trừ quantity trong FlashSale nếu có chương trình áp dụng
                    const flashSale = await FlashSale.findOne({
                        status: 'Đang diễn ra',
                        'products.variant_id': detail.productVariantId
                    });

                    if (flashSale) {
                        await FlashSale.updateOne(
                            {
                                _id: flashSale._id,
                                'products.variant_id': detail.productVariantId
                            },
                            {
                                $inc: { 'products.$.quantity': -detail.quantity }
                            }
                        );
                    }
                }

                order.status = nextStatus;
                await order.save();

                return res.json({ message: 'Cập nhật trạng thái thành công', newStatus: nextStatus });

            } catch (updateError) {
                console.error('Lỗi khi cập nhật stock/purchases:', updateError);
                for (const detail of orderDetails) {
                    try {
                        await Variant.findByIdAndUpdate(
                            detail.productVariantId,
                            { $inc: { stock: detail.quantity } }
                        );
                        const variant = await Variant.findById(detail.productVariantId);
                        if (variant && variant.productID) {
                            await Product.findByIdAndUpdate(
                                variant.productID,
                                { $inc: { purchases: -1 } }
                            );
                        }
                    } catch (rollbackError) {
                        console.error('Lỗi khi hoàn tác stock/purchases:', rollbackError);
                    }
                }
                return res.status(500).json({ message: 'Đã xảy ra lỗi khi xác nhận đơn hàng và cập nhật tồn kho. Vui lòng thử lại.' });
            }
        }

        // Nếu không phải chuyển sang 'confirmed' hoặc các bước sau
        order.status = nextStatus;
        await order.save();
        return res.json({ message: 'Cập nhật trạng thái thành công', newStatus: nextStatus });

    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ', error: error.message });
    }
};

const adminCancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelReasonText } = req.body; 

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
        }

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này." });
        }

        // Các trạng thái không thể hủy
        if (order.status === 'cancelled') {
            return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó." });
        }
        if (order.status === 'shipping') {
            return res.status(400).json({ message: "Không thể hủy đơn hàng đang giao (shipping). Vui lòng xử lý qua quy trình hoàn trả hàng nếu cần." });
        }
        if (order.status === 'delivered') {
            return res.status(400).json({ message: "Không thể hủy đơn hàng đã giao thành công (delivered). Vui lòng xử lý qua quy trình hoàn trả hàng nếu có." });
        }

        // Lấy thông tin thanh toán
        const payment = await Payment.findOne({ orderId: order._id });
        if (!payment) {
            return res.status(400).json({ message: "Không tìm thấy thông tin thanh toán cho đơn hàng này." });
        }

        // Logic hoàn trả tiền nếu đã thanh toán
        if (payment.paymentStatus === 'paid') {
            // TODO: Implement actual refund logic with VNPAY API if needed
            // For now, just mark payment as refunded
            payment.paymentStatus = 'refunded';
            await payment.save();
            // In a real application, you would call VNPAY refund API here.
            // If VNPAY refund fails, you might want to rollback the order status change.
            console.log(`Order ${order._id} was paid, marked as 'refunded'. Actual VNPAY refund needs to be implemented.`);
        } else if (payment.paymentStatus === 'pending') {
            // If payment is still pending (e.g., VNPAY not yet processed), mark as failed
            payment.paymentStatus = 'failed';
            await payment.save();
        }


        // Hoàn lại tồn kho và giảm lượt mua nếu đơn hàng đã được 'confirmed'
        if (order.status === 'confirmed') {
            const orderDetailsToRestore = await OrderDetail.find({ orderId: order._id });

            for (const detail of orderDetailsToRestore) {
                try {
                    await Variant.findByIdAndUpdate(
                        detail.productVariantId,
                        { $inc: { stock: detail.quantity } },
                        { new: true }
                    );
                } catch (variantErr) {
                    console.error(`Lỗi khi hoàn lại tồn kho cho biến thể ${detail.productVariantId}:`, variantErr);
                }

                try {
                    const variant = await Variant.findById(detail.productVariantId);
                    if (variant && variant.productID) {
                        await Product.findByIdAndUpdate(
                            variant.productID,
                            { $inc: { purchases: -1 } },
                            { new: true }
                        );
                    }
                } catch (productErr) {
                    console.error(`Lỗi khi giảm lượt mua cho sản phẩm cha của biến thể ${detail.productVariantId}:`, productErr);
                }
            }
        }

        // Cập nhật trạng thái đơn hàng cuối cùng
        order.status = "cancelled";
        order.cancelReason = "other"; 
        order.cancelReasonText = cancelReasonText || ""; 
        await order.save();

        return res.status(200).json({ message: "Admin đã hủy đơn hàng thành công.", order });

    } catch (err) {
        console.error("Lỗi khi admin hủy đơn hàng:", err);
        return res.status(500).json({ message: "Có lỗi xảy ra khi admin hủy đơn hàng.", error: err.message });
    }
};

// Cập nhật trạng thái thanh toán hóa đơn đã thanh toán, chưa thanh toán
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        const payment = await Payment.findOne({ orderId: id });
        if (!payment) {
            return res.status(404).json({ message: 'Không tìm thấy thanh toán cho đơn hàng này' });
        }

        // Optional: Add validation for allowed status transitions
        if (!['paid', 'unpaid', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ.' });
        }

        // If transitioning to 'paid' for a COD order, you might want to confirm the order
        if (payment.paymentMethod === 'cod' && status === 'paid' && payment.paymentStatus !== 'paid') {
            const order = await Order.findById(id);
            if (order && order.status === 'pending') { 
                order.status = 'confirmed';
                await order.save();
            }
        }

        payment.paymentStatus = status;
        await payment.save();

        return res.status(200).json({
            message: 'Cập nhật trạng thái thanh toán thành công',
            payment,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

// lấy doanh thu tổng các đơn hàng có trạng thái là đã thanh toán
const getRevenue = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: "payments", 
                    localField: "_id",
                    foreignField: "orderId",
                    as: "payment"
                }
            },
            { $unwind: "$payment" },
            { $match: { "payment.paymentStatus": "paid", "status": "delivered" } }, 
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue = orders[0]?.totalRevenue || 0;
        res.json({ totalRevenue });
    } catch (error) {
        console.error("Lỗi khi tính doanh thu:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};


module.exports = {
    Postorder,
    getOrdersByUser,
    cancelOrder,
    getAllOrdersForAdmin,
    updateOrderStatus,
    updatePaymentStatus,
    getRevenue,
    adminCancelOrder,
};