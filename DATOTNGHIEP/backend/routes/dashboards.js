var express = require('express');
var router = express.Router();

const { 
    getDashboardOverviewCounts,
    getRevenueChartData,
    getOrderStatusDistribution,
    getTopSellingProductsChartData,
    getRecentOrders
  } = require('../controllers/dashboardController');
const{verifyToken,verifyAdmin}=require('../controllers/userController');
router.get('/counts',verifyToken, verifyAdmin, getDashboardOverviewCounts);
// Routes cho các biểu đồ
router.get('/revenue-chart-data',getRevenueChartData ); 
router.get('/order-status-distribution', getOrderStatusDistribution);
router.get('/top-selling-products-chart-data', getTopSellingProductsChartData);
router.get('/recent-orders', getRecentOrders); 
module.exports = router;
