require('dotenv').config();  
// import các model để sync index
const Product = require('./models/productModel');
const Brand = require('./models/brandModel');
const Category = require('./models/categoryModel');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/DB_DATN')
  .then(async () => {
    console.log('Connected to MongoDB successfully!');

    // Đồng bộ index cho các collection
    try {
      await Promise.all([
        Product.syncIndexes(),
        Brand.syncIndexes(),
        Category.syncIndexes(),
      ]);
      console.log("Index đã được đồng bộ cho Product, Brand, Category");
    } catch (err) {
      console.error("❌ Lỗi khi syncIndexes:", err);
    }
  })
  .catch(err => console.error('❌ Failed to connect to MongoDB:', err));

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
const variantRoutes = require('./routes/variants');
const brandRoutes = require('./routes/brands');
const commentRoutes = require('./routes/comments');
const ordersRoutes = require('./routes/orders');
const dashboardsRoutes = require('./routes/dashboards');
const questionRoutes = require('./routes/questions');
const flashsaleRouter = require('./routes/flashsale');

// liên hệ
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payment');
// reset mật khẩu
const forgotPasswordRouter = require('./routes/authRoutes');
//voucher
const voucherRoutes = require('./routes/vouchers');
// spin wheel
const spinWheelRoutes = require('./routes/spinWheel');
const spinWheelConfigRoutes = require('./routes/spinWheelConfig');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Đảm bảo cung cấp quyền truy cập cho thư mục hình ảnh
app.use('/img', express.static(path.join(__dirname, 'Frontend', 'img')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const allowedDomains = [
  'http://novashop.io.vn',
  'https://novashop.io.vn',
  'http://admin.novashop.io.vn',
  'https://admin.novashop.io.vn',
  'http://localhost:3000', // Next.js local
  'http://localhost:4200',  // Angular local
  'http://localhost:4000',
  'http://backend.novashop.io.vn',   // production frontend   
  'https://backend.novashop.io.vn'    // Angular local
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // cho Postman, server nội bộ
    if (allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/images', express.static('public/images'));
app.use('/variants', variantRoutes);
app.use('/brands', brandRoutes);
app.use('/comments', commentRoutes);
app.use('/orders', ordersRoutes);
app.use('/flashsales', flashsaleRouter);



app.use('/dashboards', dashboardsRoutes);
app.use('/questions', questionRoutes);
// liên hệ
app.use('/contact', contactRoutes);
app.use('/payment', paymentRoutes);
// quên mật khẩu
app.use('/auth', forgotPasswordRouter);
//voucher
app.use('/vouchers', voucherRoutes);
// spin wheel
app.use('/spin-wheel', spinWheelRoutes);
app.use('/spin-wheel-config', spinWheelConfigRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
