const mongoose = require('mongoose');

const spinWheelSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  voucherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'vouchers', 
    required: true 
  },
  spinDate: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Index để tối ưu truy vấn
spinWheelSchema.index({ userId: 1, spinDate: -1 });
spinWheelSchema.index({ userId: 1, isActive: 1 });

const spinWheelModel = mongoose.model('spinWheels', spinWheelSchema);
module.exports = spinWheelModel; 