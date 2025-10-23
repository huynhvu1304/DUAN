
const products = require('../models/productModel'); 
const paymentModel = require('../models/paymentModel'); 
const orderModel = require('../models/orderModel'); 
const orderdetailModel = require('../models/orderdetailModel'); 
const variantModel = require('../models/variantModel'); 
const userModel = require('../models/userModel').userModel; 

// Hàm lấy các chỉ số tổng quan (KPIs)
const getDashboardOverviewCounts = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments(); 
        const totalOrders = await orderModel.countDocuments();
        const totalProducts = await products.countDocuments();

        const revenueResult = await paymentModel.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        const totalStockResult = await variantModel.aggregate([ 
            { $group: { _id: null, totalStock: { $sum: '$stock' } } }
        ]);
        const totalStock = totalStockResult.length > 0 ? totalStockResult[0].totalStock : 0;

        const pendingOrdersCount = await orderModel.countDocuments({ status: "pending" }); 

        res.status(200).json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
            totalStock,
            pendingOrdersCount
        });

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tổng quan dashboard:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu tổng quan.', error: error.message });
    }
};

// Hàm lấy dữ liệu cho Biểu đồ Doanh thu theo thời gian (tháng và ngày)
const getRevenueChartData = async (req, res) => {
    try {
        const { period } = req.query;
        let matchStage = { paymentStatus: 'paid' };
        let groupStage;
        let sortStage = {};
        let dateProjection;

        const now = new Date();

        // Định nghĩa các tham số chỉ cho tháng và ngày 
        switch (period) {
            case 'daily': {
                const thirtyDaysAgo = new Date(now);
                thirtyDaysAgo.setDate(now.getDate() - 29);
                thirtyDaysAgo.setHours(0, 0, 0, 0);

                matchStage.createdAt = { $gte: thirtyDaysAgo, $lte: now };
                dateProjection = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                groupStage = { _id: dateProjection, revenue: { $sum: "$amount" } };
                sortStage = { "_id": 1 };
                break;
            }
            case 'monthly':
            default: {
                const sixMonthsAgo = new Date(now);
                sixMonthsAgo.setMonth(now.getMonth() - 5);
                sixMonthsAgo.setDate(1);
                sixMonthsAgo.setHours(0, 0, 0, 0);

                matchStage.createdAt = { $gte: sixMonthsAgo, $lte: now };
                dateProjection = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
                groupStage = { _id: dateProjection, revenue: { $sum: "$amount" } };
                sortStage = { "_id.year": 1, "_id.month": 1 };
                break;
            }
        }

        // Truy vấn dữ liệu
        const revenueData = await paymentModel.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $sort: sortStage }
        ]);

        let dataMap = new Map();
        revenueData.forEach(item => {
            dataMap.set(JSON.stringify(item._id), item.revenue);
        });

        let labels = [];
        let revenues = [];

        // Điền dữ liệu cho biểu đồ 
        switch (period) {
            case 'daily':
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(now.getDate() - i);
                    const dateString = d.toISOString().slice(0, 10);
                    labels.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
                    const key = JSON.stringify(dateString);
                    revenues.push(dataMap.get(key) || 0);
                }
                break;
            case 'monthly':
            default:
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now);
                    d.setMonth(now.getMonth() - i);
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();
                    labels.push(`T${month}/${year}`);
                    const key = JSON.stringify({ year, month });
                    revenues.push(dataMap.get(key) || 0);
                }
                break;
        }

        const responseData = { labels, data: revenues };
        res.status(200).json(responseData);

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu biểu đồ doanh thu:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu biểu đồ doanh thu.', error: error.message });
    }
};

// Hàm lấy dữ liệu cho Biểu đồ Tỷ lệ trạng thái đơn hàng 
const getOrderStatusDistribution = async (req, res) => {
    try {
        const statusData = await orderModel.aggregate([ 
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { name: "$_id", value: "$count", _id: 0 } } 
        ]);

        // Ánh xạ trạng thái tiếng Anh sang tiếng Việt sau khi nhận được dữ liệu
        const translatedStatusData = statusData.map(item => {
            let translatedName;
            switch (item.name) {
                case "pending":
                    translatedName = "Chờ xác nhận";
                    break;
                case "confirmed":
                    translatedName = "Đã xác nhận";
                    break;
                case "shipping":
                    translatedName = "Đang giao hàng";
                    break;
                case "delivered":
                    translatedName = "Đã giao hàng";
                    break;
                case "cancelled":
                    translatedName = "Đã hủy";
                    break;
                default:
                    translatedName = item.name; 
            }
            return { name: translatedName, value: item.value };
        });

        res.status(200).json(translatedStatusData);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu biểu đồ trạng thái đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu biểu đồ trạng thái đơn hàng.', error: error.message });
    }
};
//Hàm lấy dữ liệu cho Biểu đồ Top Sản phẩm bán chạy (dựa trên trường purchases)
const getTopSellingProductsChartData = async (req, res) => {
     try {
        const topProducts = await orderdetailModel.aggregate([
       
            {
                $lookup: {
                    from: 'orders',  
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'orderInfo'
                }
            },
            { $unwind: '$orderInfo' }, 
            // Lọc các đơn hàng có trạng thái là 'delivered' hoặc 'confirmed'
            { $match: { 'orderInfo.status': { $in: ['delivered', 'confirmed'] } } },

           
            {
                $lookup: {
                    from: 'variants', // Tên collection của variantModel 
                    localField: 'productVariantId',
                    foreignField: '_id',
                    as: 'variantInfo'
                }
            },
            { $unwind: '$variantInfo' }, // Mở rộng mảng variantInfo

           
            {
                $lookup: {
                    from: 'products', // Tên collection của products model
                    localField: 'variantInfo.productID', // Dùng productID từ variantInfo
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' }, // Mở rộng mảng productInfo

          
            {
                $group: {
                    _id: "$productInfo.name", // Nhóm các chi tiết đơn hàng theo tên sản phẩm
                    totalQuantitySold: { $sum: "$quantity" } // Tính tổng số lượng của sản phẩm đó
                }
            },
       
            { $sort: { totalQuantitySold: -1 } }, // Sắp xếp giảm dần (sản phẩm bán chạy nhất lên đầu)
            { $limit: 5 } // Chỉ lấy 5 sản phẩm hàng đầu
        ]);

        res.status(200).json(topProducts);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu biểu đồ top sản phẩm bán chạy từ orderdetail:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu biểu đồ top sản phẩm bán chạy.', error: error.message });
    }
};

// Hàm lấy các đơn hàng gần đây (cho bảng)
const getRecentOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');
        const convertStatusToVietnamese = (status) => {
            switch (status) {
                case "pending":
                    return "Đang chờ xử lý";
                case "confirmed":
                    return "Đã xác nhận";
                case "shipping":
                    return "Đang giao hàng";
                case "delivered":
                    return "Đã giao hàng";
                case "cancelled":
                    return "Đã hủy";
                default:
                    return status; 
            }
        };

        const ordersInVietnamese = orders.map(order => ({
            ...order.toObject(), 
            status: convertStatusToVietnamese(order.status)
        }));

        res.status(200).json(ordersInVietnamese);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đơn hàng gần đây', error: error.message });
    }
};

// Export tất cả các hàm
module.exports = {
    getDashboardOverviewCounts,
    getRevenueChartData,
    getOrderStatusDistribution,
    getTopSellingProductsChartData,
    getRecentOrders
};