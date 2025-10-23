const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({

  image: { type: String, required: true },
  cost_price: { type: Number, required: true },
  sale_price: {type: Number}, 
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, default: 0},
  productID: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products', 
    required: true
  }
}, { timestamps: true });

const variantModel = mongoose.model('variants', variantSchema);
module.exports = variantModel;
