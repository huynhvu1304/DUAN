const mongoose = require('mongoose');
const Voucher = require('../models/voucherModel');

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/DB_DATN')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const createSpinWheelVouchers = async () => {
  try {
    console.log('Bắt đầu tạo voucher cho vòng quay may mắn...');

    // 1. Tạo voucher "Chúc bạn may mắn lần sau"
    let noPrizeVoucher = await Voucher.findOne({ code: 'NO_PRIZE' });
    
    if (!noPrizeVoucher) {
      noPrizeVoucher = new Voucher({
        code: 'NO_PRIZE',
        description: 'Chúc bạn may mắn lần sau',
        discountType: 'fixed',
        discountValue: 0,
        minOrderValue: 0,
        quantity: 999999, // Số lượng lớn để không bao giờ hết
        used: 0,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2030-12-31'),
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 50 // Trọng số mặc định cho "không trúng thưởng"
      });
      await noPrizeVoucher.save();
      console.log('✅ Đã tạo voucher NO_PRIZE');
    } else {
      console.log('ℹ️ Voucher NO_PRIZE đã tồn tại');
    }

    // 2. Tạo một số voucher mẫu cho vòng quay
    const sampleVouchers = [
      {
        code: 'SPIN10K',
        description: 'Giảm 10,000đ cho đơn hàng từ 100,000đ',
        discountType: 'fixed',
        discountValue: 10000,
        minOrderValue: 100000,
        quantity: 100,
        used: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 20
      },
      {
        code: 'SPIN20K',
        description: 'Giảm 20,000đ cho đơn hàng từ 200,000đ',
        discountType: 'fixed',
        discountValue: 20000,
        minOrderValue: 200000,
        quantity: 50,
        used: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 15
      },
      {
        code: 'SPIN10PERCENT',
        description: 'Giảm 10% tối đa 50,000đ cho đơn hàng từ 150,000đ',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 150000,
        maxDiscountValue: 50000,
        quantity: 30,
        used: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 10
      },
      {
        code: 'SPIN15PERCENT',
        description: 'Giảm 15% tối đa 100,000đ cho đơn hàng từ 300,000đ',
        discountType: 'percent',
        discountValue: 15,
        minOrderValue: 300000,
        maxDiscountValue: 100000,
        quantity: 20,
        used: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 5
      }
    ];

    for (const voucherData of sampleVouchers) {
      const existingVoucher = await Voucher.findOne({ code: voucherData.code });
      
      if (!existingVoucher) {
        const voucher = new Voucher(voucherData);
        await voucher.save();
        console.log(`✅ Đã tạo voucher ${voucherData.code} với trọng số ${voucherData.weight}`);
      } else {
        // Cập nhật voucher hiện có để tham gia vòng quay
        existingVoucher.isSpinWheelVoucher = true;
        existingVoucher.weight = voucherData.weight;
        await existingVoucher.save();
        console.log(`🔄 Đã cập nhật voucher ${voucherData.code} với trọng số ${voucherData.weight}`);
      }
    }

    // 3. Xóa trường spinWheelType khỏi tất cả voucher (nếu có)
    const result = await Voucher.updateMany(
      { spinWheelType: { $exists: true } },
      { $unset: { spinWheelType: "" } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`🗑️ Đã xóa trường spinWheelType khỏi ${result.modifiedCount} voucher`);
    }

    // 4. Hiển thị thống kê
    const totalVouchers = await Voucher.countDocuments({ isSpinWheelVoucher: true });
    const totalWeight = await Voucher.aggregate([
      { $match: { isSpinWheelVoucher: true, weight: { $gt: 0 } } },
      { $group: { _id: null, totalWeight: { $sum: "$weight" } } }
    ]);

    console.log('\n📊 Thống kê vòng quay may mắn:');
    console.log(`- Tổng số voucher tham gia: ${totalVouchers}`);
    console.log(`- Tổng trọng số: ${totalWeight[0]?.totalWeight || 0}`);
    
    // Hiển thị danh sách voucher và trọng số
    const spinWheelVouchers = await Voucher.find({ isSpinWheelVoucher: true }).select('code description weight');
    console.log('\n🎯 Danh sách voucher vòng quay:');
    spinWheelVouchers.forEach(voucher => {
      console.log(`  - ${voucher.code}: ${voucher.description} (trọng số: ${voucher.weight})`);
    });

    console.log('\n✅ Hoàn thành tạo voucher cho vòng quay may mắn!');
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo voucher:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Chạy script
createSpinWheelVouchers(); 