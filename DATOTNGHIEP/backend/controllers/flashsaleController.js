// Giảm quantity của variant trong flash sale khi thanh toán thành công
// Gọi hàm này sau khi đơn hàng thanh toán thành công
// Truyền vào flashSaleId, productId, variantId, quantityToReduce

const mongoose = require("mongoose");
const flashSale = require("../models/flashsaleModel");

// Lấy tất cả flash sale
const getAllFlashSales = async (req, res) => {
    try {
        let flashSales = await flashSale.find().populate('products.product_id');
        // Cập nhật trạng thái động dựa vào ngày hiện tại
        const now = new Date();
        flashSales = flashSales.map(fs => {
            const start = new Date(fs.start_time);
            const end = new Date(fs.end_time);
            let status = 'Sắp tới';
            if (now >= start && now <= end) status = 'Đang diễn ra';
            else if (now > end) status = 'Đã kết thúc';

            // Tính giá đã giảm cho từng sản phẩm và gồm sản phẩm có quantity = 0
            const discount = fs.discount_value || 0;
            const productsWithDiscount = (fs.products || [])
                // .filter(item => typeof item.quantity === 'number' && item.quantity > 0) 
                .map(item => {
                    let originalPrice = 0;
                    if (item.product_id && item.product_id.cost_price) {
                        originalPrice = item.product_id.cost_price;
                    }
                    // Tính sale_price (giá bán sau giảm giá)
                    const sale_price = Math.round(originalPrice * (1 - discount / 100));
                    return {
                        ...item.toObject(),
                        original_price: originalPrice,
                        sale_price
                    };
                });

            return {
                ...fs.toObject(),
                status,
                products: productsWithDiscount
            };
        });
        res.status(200).json(flashSales);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách flash sale", error });
    }
};

// Thêm flash sale mới
const createFlashSale = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(req.body.start_time);
    const end = new Date(req.body.end_time);

    let status = 'Sắp tới';
    if (now >= start && now <= end) status = 'Đang diễn ra';
    else if (now > end) status = 'Đã kết thúc';

    // ❗ Thêm kiểm tra trùng thời gian
    const conflict = await flashSale.findOne({
      $or: [
        {
          start_time: { $lte: end },
          end_time: { $gte: start }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: "Đã có chương trình flash sale trùng thời gian!" });
    }

    const products = (req.body.products || []).map(item => ({
      ...item,
      initial_quantity: typeof item.initial_quantity === 'number' ? item.initial_quantity : item.quantity
    }));

    const newFlashSale = new flashSale({ ...req.body, products, status });
    await newFlashSale.save();
    res.status(201).json(newFlashSale);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm flash sale", error });
  }
};

// Sửa flash sale
const updateFlashSale = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(req.body.start_time);
    const end = new Date(req.body.end_time);

    let status = 'Sắp tới';
    if (now >= start && now <= end) status = 'Đang diễn ra';
    else if (now > end) status = 'Đã kết thúc';

    // ❗ Kiểm tra trùng thời gian (trừ chính nó)
    const conflict = await flashSale.findOne({
      _id: { $ne: req.params.id },
      $or: [
        {
          start_time: { $lte: end },
          end_time: { $gte: start }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: "Chương trình flash sale cập nhật bị trùng thời gian với chương trình khác!" });
    }

    let products = req.body.products;
    if (Array.isArray(products)) {
      const oldFS = await flashSale.findById(req.params.id);
      if (oldFS) {
        products = products.map(item => {
          const oldItem = (oldFS.products || []).find(
            oi => oi.product_id.toString() === item.product_id.toString() &&
                  oi.variant_id.toString() === item.variant_id.toString()
          );
          return {
            ...item,
            initial_quantity: oldItem && typeof oldItem.initial_quantity === 'number'
              ? oldItem.initial_quantity
              : (typeof item.initial_quantity === 'number' ? item.initial_quantity : item.quantity)
          };
        });
      }
    }

    const updated = await flashSale.findByIdAndUpdate(
      req.params.id,
      { ...req.body, products, status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy flash sale" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật flash sale", error });
  }
};


// Xoá flash sale
const deleteFlashSale = async (req, res) => {
    try {
        const deleted = await flashSale.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy flash sale" });
        res.status(200).json({ message: "Đã xoá flash sale thành công" });
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi xoá flash sale", error });
    }
};
const reduceFlashSaleQuantity = async (flashSaleId, productId, variantId, quantityToReduce) => {
    const fs = await flashSale.findById(flashSaleId);
    if (!fs) throw new Error('Không tìm thấy flash sale');
    let updated = false;
    fs.products = fs.products.map(item => {
        if (
            item.product_id.toString() === productId.toString() &&
            item.variant_id.toString() === variantId.toString()
        ) {
            if (typeof item.quantity === 'number' && item.quantity >= quantityToReduce) {
                item.quantity -= quantityToReduce;
                updated = true;
            }
        }
        return item;
    });
    if (updated) {
        await fs.save();
    }
    return updated;
};
module.exports = {
    getAllFlashSales,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    reduceFlashSaleQuantity,
};