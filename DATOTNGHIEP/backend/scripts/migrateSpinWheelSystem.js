const mongoose = require('mongoose');
const Voucher = require('../models/voucherModel');

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/DB_DATN')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const migrateSpinWheelSystem = async () => {
  try {
    console.log('🔄 Bắt đầu migrate hệ thống vòng quay may mắn...');

    // 1. Xóa trường spinWheelType khỏi tất cả voucher
    const removeSpinWheelTypeResult = await Voucher.updateMany(
      { spinWheelType: { $exists: true } },
      { $unset: { spinWheelType: "" } }
    );
    
    if (removeSpinWheelTypeResult.modifiedCount > 0) {
      console.log(`🗑️ Đã xóa trường spinWheelType khỏi ${removeSpinWheelTypeResult.modifiedCount} voucher`);
    }

    // 2. Thêm trường weight cho tất cả voucher (mặc định = 0)
    const addWeightResult = await Voucher.updateMany(
      { weight: { $exists: false } },
      { $set: { weight: 0 } }
    );
    
    if (addWeightResult.modifiedCount > 0) {
      console.log(`➕ Đã thêm trường weight cho ${addWeightResult.modifiedCount} voucher`);
    }

    // 3. Thêm trường isSpinWheelVoucher cho tất cả voucher (mặc định = false)
    const addSpinWheelVoucherResult = await Voucher.updateMany(
      { isSpinWheelVoucher: { $exists: false } },
      { $set: { isSpinWheelVoucher: false } }
    );
    
    if (addSpinWheelVoucherResult.modifiedCount > 0) {
      console.log(`➕ Đã thêm trường isSpinWheelVoucher cho ${addSpinWheelVoucherResult.modifiedCount} voucher`);
    }

    // 4. Tạo voucher NO_PRIZE nếu chưa có
    let noPrizeVoucher = await Voucher.findOne({ code: 'NO_PRIZE' });
    
    if (!noPrizeVoucher) {
      noPrizeVoucher = new Voucher({
        code: 'NO_PRIZE',
        description: 'Chúc bạn may mắn lần sau',
        discountType: 'fixed',
        discountValue: 0,
        minOrderValue: 0,
        quantity: 999999,
        used: 0,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2030-12-31'),
        isActive: true,
        isDeleted: false,
        isSpinWheelVoucher: true,
        weight: 50
      });
      await noPrizeVoucher.save();
      console.log('✅ Đã tạo voucher NO_PRIZE');
    } else {
      // Cập nhật voucher NO_PRIZE hiện có
      noPrizeVoucher.isSpinWheelVoucher = true;
      noPrizeVoucher.weight = 50;
      await noPrizeVoucher.save();
      console.log('🔄 Đã cập nhật voucher NO_PRIZE');
    }

    // 5. Cập nhật các voucher hiện có để tham gia vòng quay với trọng số mặc định
    const updateExistingVouchers = await Voucher.updateMany(
      { 
        isActive: true, 
        isDeleted: false,
        isSpinWheelVoucher: false,
        // Chỉ cập nhật voucher có discountValue > 0 (không phải voucher rỗng)
        discountValue: { $gt: 0 }
      },
      { 
        $set: { 
          isSpinWheelVoucher: true,
          weight: 10 // Trọng số mặc định cho voucher thường
        } 
      }
    );

    if (updateExistingVouchers.modifiedCount > 0) {
      console.log(`🔄 Đã cập nhật ${updateExistingVouchers.modifiedCount} voucher hiện có để tham gia vòng quay`);
    }

    // 6. Hiển thị thống kê sau migration
    const totalVouchers = await Voucher.countDocuments({ isSpinWheelVoucher: true });
    const totalWeight = await Voucher.aggregate([
      { $match: { isSpinWheelVoucher: true, weight: { $gt: 0 } } },
      { $group: { _id: null, totalWeight: { $sum: "$weight" } } }
    ]);

    console.log('\n📊 Thống kê sau migration:');
    console.log(`- Tổng số voucher tham gia vòng quay: ${totalVouchers}`);
    console.log(`- Tổng trọng số: ${totalWeight[0]?.totalWeight || 0}`);

    // Hiển thị danh sách voucher và trọng số
    const spinWheelVouchers = await Voucher.find({ isSpinWheelVoucher: true })
      .select('code description weight discountValue discountType')
      .sort({ weight: -1 });

    console.log('\n🎯 Danh sách voucher vòng quay (sắp xếp theo trọng số):');
    spinWheelVouchers.forEach(voucher => {
      const discountInfo = voucher.discountType === 'percent' 
        ? `${voucher.discountValue}%` 
        : `${voucher.discountValue.toLocaleString()}đ`;
      console.log(`  - ${voucher.code}: ${voucher.description} (${discountInfo}, trọng số: ${voucher.weight})`);
    });

    console.log('\n✅ Hoàn thành migrate hệ thống vòng quay may mắn!');
    console.log('\n💡 Hướng dẫn cấu hình:');
    console.log('1. Điều chỉnh trọng số (weight) của từng voucher để thay đổi xác suất trúng');
    console.log('2. Trọng số càng cao thì xác suất trúng càng lớn');
    console.log('3. Voucher NO_PRIZE có trọng số 50, bạn có thể điều chỉnh để thay đổi tỉ lệ "không trúng thưởng"');
    console.log('4. Tổng trọng số hiện tại:', totalWeight[0]?.totalWeight || 0);

  } catch (error) {
    console.error('❌ Lỗi khi migrate:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Chạy migration
migrateSpinWheelSystem();
