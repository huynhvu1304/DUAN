const mongoose = require('mongoose');
const SpinWheelConfig = require('../models/spinWheelConfigModel');

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/DB_DATN')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const createSpinWheelConfig = async () => {
  try {
    console.log('🔄 Bắt đầu tạo cấu hình vòng quay may mắn...');

    // Kiểm tra xem đã có cấu hình chưa
    let config = await SpinWheelConfig.findOne();
    
    if (config) {
      console.log('ℹ️ Cấu hình vòng quay đã tồn tại:');
      console.log(`   - Thời gian chờ: ${config.cooldownSeconds} giây`);
      console.log(`   - Đơn vị: ${config.cooldownUnit}`);
      console.log(`   - Trạng thái: ${config.isActive ? 'Đang hoạt động' : 'Tạm dừng'}`);
      console.log(`   - Mô tả: ${config.description}`);
      
      // Hỏi người dùng có muốn cập nhật không
      console.log('\n💡 Bạn có muốn cập nhật cấu hình hiện tại không?');
      console.log('   Chạy script này với tham số --update để cập nhật');
      return;
    }

    // Tạo cấu hình mặc định
    config = new SpinWheelConfig({
      cooldownSeconds: 86400, // 24 giờ
      cooldownUnit: 'hours',
      isActive: true,
      description: 'Cấu hình thời gian chờ giữa các lần quay vòng quay may mắn - Mặc định 24 giờ'
    });

    await config.save();
    
    console.log('✅ Đã tạo cấu hình vòng quay mặc định:');
    console.log(`   - Thời gian chờ: ${config.cooldownSeconds} giây (24 giờ)`);
    console.log(`   - Đơn vị: ${config.cooldownUnit}`);
    console.log(`   - Trạng thái: ${config.isActive ? 'Đang hoạt động' : 'Tạm dừng'}`);
    console.log(`   - Mô tả: ${config.description}`);

    console.log('\n🎉 Cấu hình vòng quay đã được tạo thành công!');
    console.log('💡 Bạn có thể thay đổi cấu hình này thông qua admin panel.');

  } catch (error) {
    console.error('❌ Lỗi khi tạo cấu hình vòng quay:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
  }
};

// Xử lý tham số command line
const args = process.argv.slice(2);
if (args.includes('--update')) {
  console.log('🔄 Chế độ cập nhật cấu hình...');
  // Thêm logic cập nhật nếu cần
}

createSpinWheelConfig();
