const mongoose = require('mongoose');
const Voucher = require('../models/voucherModel');
const UserVoucher = require('../models/userVoucher');

// Kết nối database
mongoose.connect('mongodb://localhost:27017/DATN', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSampleVouchers = async () => {
  try {
    // Xóa voucher cũ nếu có
    await Voucher.deleteMany({});
    await UserVoucher.deleteMany({});

    // Tạo voucher mẫu
    const sampleVouchers = [
      {
        code: 'WELCOME10',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 100000,
        maxDiscountValue: 50000,
        quantity: 100,
        used: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: false,
        weight: 0
      },
      {
        code: 'SAVE50K',
        description: 'Giảm 50,000 VND cho đơn hàng từ 500,000 VND',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderValue: 500000,
        quantity: 50,
        used: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: false,
        weight: 0
      },
      {
        code: 'FLASH20',
        description: 'Giảm 20% cho đơn hàng flash sale',
        discountType: 'percent',
        discountValue: 20,
        minOrderValue: 200000,
        maxDiscountValue: 100000,
        quantity: 30,
        used: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 15
      },
      {
        code: 'NEWUSER',
        description: 'Giảm 15% cho người dùng mới',
        discountType: 'percent',
        discountValue: 15,
        minOrderValue: 150000,
        maxDiscountValue: 75000,
        quantity: 200,
        used: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: false,
        weight: 0
      }
    ];

    // Lưu voucher vào database
    const savedVouchers = await Voucher.insertMany(sampleVouchers);
    console.log('Đã tạo voucher mẫu:', savedVouchers.length);

    // Tạo UserVoucher cho user test (thay đổi userId theo user thực tế)
    const testUserId = '507f1f77bcf86cd799439011'; // Thay đổi thành userId thực tế
    const userVouchers = savedVouchers.map(voucher => ({
      user_id: testUserId,
      voucher_id: voucher._id,
      voucherSnapshot: {
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrderValue: voucher.minOrderValue,
        maxDiscountValue: voucher.maxDiscountValue,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        isSpinWheelVoucher: voucher.isSpinWheelVoucher,
        weight: voucher.weight
      },
      status: 'received'
    }));

    await UserVoucher.insertMany(userVouchers);
    console.log('Đã tạo UserVoucher cho user test');

    console.log('Hoàn thành tạo voucher mẫu!');
    console.log('Danh sách voucher:');
    savedVouchers.forEach(voucher => {
      console.log(`- ${voucher.code}: ${voucher.description}`);
    });

  } catch (error) {
    console.error('Lỗi khi tạo voucher mẫu:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleVouchers(); 