const mongoose = require("mongoose");
const orderDetailSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: true },
  productVariantId: { type: mongoose.Schema.Types.ObjectId, ref: "variants", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});


const orderdetailModel = mongoose.models.orderdetails || mongoose.model("orderdetails", orderDetailSchema);
module.exports = orderdetailModel;
