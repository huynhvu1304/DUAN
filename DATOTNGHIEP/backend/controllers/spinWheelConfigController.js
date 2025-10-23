const SpinWheelConfig = require('../models/spinWheelConfigModel');

// Lấy cấu hình hiện tại
const getConfig = async (req, res) => {
  try {
    let config = await SpinWheelConfig.findOne();
    
    if (!config) {
      // Tạo cấu hình mặc định nếu chưa có
      config = new SpinWheelConfig({
        cooldownSeconds: 86400, // 24 giờ
        cooldownUnit: 'hours',
        isActive: true,
        description: 'Cấu hình thời gian chờ giữa các lần quay vòng quay'
      });
      await config.save();
    }
    
    res.json(config);
  } catch (error) {
    console.error('Error getting spin wheel config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cập nhật cấu hình
const updateConfig = async (req, res) => {
  try {
    const { cooldownValue, cooldownUnit, isActive, description } = req.body;
    
    // Chuyển đổi thời gian thành giây
    let cooldownSeconds = 0;
    switch (cooldownUnit) {
      case 'seconds':
        cooldownSeconds = cooldownValue;
        break;
      case 'minutes':
        cooldownSeconds = cooldownValue * 60;
        break;
      case 'hours':
        cooldownSeconds = cooldownValue * 3600;
        break;
      case 'days':
        cooldownSeconds = cooldownValue * 86400;
        break;
      default:
        return res.status(400).json({ message: 'Đơn vị thời gian không hợp lệ' });
    }
    
    let config = await SpinWheelConfig.findOne();
    
    if (!config) {
      config = new SpinWheelConfig();
    }
    
    config.cooldownSeconds = cooldownSeconds;
    config.cooldownUnit = cooldownUnit;
    config.isActive = isActive;
    config.description = description;
    
    await config.save();
    
    res.json({
      message: 'Cập nhật cấu hình thành công',
      config
    });
  } catch (error) {
    console.error('Error updating spin wheel config:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy thời gian cooldown hiện tại (cho spin controller)
const getCooldownSeconds = async () => {
  try {
    const config = await SpinWheelConfig.findOne();
    return config ? config.cooldownSeconds : 86400; // Mặc định 24 giờ
  } catch (error) {
    console.error('Error getting cooldown seconds:', error);
    return 86400; // Mặc định 24 giờ
  }
};

module.exports = {
  getConfig,
  updateConfig,
  getCooldownSeconds
};
