const mongoose = require('mongoose');

const spinWheelConfigSchema = new mongoose.Schema({
  cooldownSeconds: { 
    type: Number, 
    default: 86400, 
    min: 0 
  },
  cooldownUnit: { 
    type: String, 
    enum: ['seconds', 'minutes', 'hours', 'days'], 
    default: 'hours' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  description: { 
    type: String, 
    default: 'Cấu hình thời gian chờ giữa các lần quay vòng quay' 
  }
}, { timestamps: true });

// Chỉ cho phép 1 bản ghi cấu hình
spinWheelConfigSchema.index({}, { unique: true });

const spinWheelConfigModel = mongoose.model('spinWheelConfigs', spinWheelConfigSchema);
module.exports = spinWheelConfigModel;
