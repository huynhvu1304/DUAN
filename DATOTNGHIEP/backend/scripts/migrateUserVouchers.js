// scripts/migrateUserVouchers.js
const mongoose = require('mongoose');
const UserVoucher = require('../models/userVoucher');
const Voucher = require('../models/voucherModel');

// Kết nối database
mongoose.connect('mongodb://localhost:27017/DATN', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const migrateUserVouchers = async () => {
  try {
    console.log('Bắt đầu migration userVouchers...');

    // Lấy tất cả userVoucher chưa có snapshot
    const userVouchers = await UserVoucher.find({
      $or: [
        { voucherSnapshot: { $exists: false } },
        { voucherSnapshot: null }
      ]
    });

    console.log(`Tìm thấy ${userVouchers.length} userVoucher cần migration`);

    let successCount = 0;
    let errorCount = 0;

    for (const userVoucher of userVouchers) {
      try {
        // Lấy thông tin voucher gốc
        const voucher = await Voucher.findById(userVoucher.voucher_id);
        
        if (!voucher) {
          console.log(`Voucher ${userVoucher.voucher_id} không tồn tại, bỏ qua userVoucher ${userVoucher._id}`);
          errorCount++;
          continue;
        }

        // Cập nhật userVoucher với snapshot
        await UserVoucher.findByIdAndUpdate(userVoucher._id, {
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
          }
        });

        successCount++;
        console.log(`Đã migration userVoucher ${userVoucher._id}`);
      } catch (error) {
        console.error(`Lỗi khi migration userVoucher ${userVoucher._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`Migration hoàn thành!`);
    console.log(`- Thành công: ${successCount}`);
    console.log(`- Lỗi: ${errorCount}`);

  } catch (error) {
    console.error('Lỗi trong quá trình migration:', error);
  } finally {
    mongoose.connection.close();
  }
};

migrateUserVouchers(); 