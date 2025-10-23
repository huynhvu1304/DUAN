const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true, min: 0 },
    initial_quantity: { type: Number, required: true, min: 0 },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'variants', required: true },
  }],
  discount_value: { type: Number, required: true, min: 0, max: 100 }, // phần trăm giảm giá
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  status: { type: String, enum: ['Sắp tới', 'Đang diễn ra', 'Đã kết thúc'], default: 'Sắp tới' }
}, { timestamps: true });

module.exports = mongoose.model('flashsales', flashSaleSchema);
