const Voucher = require("../models/voucherModel");
const UserVoucher = require("../models/userVoucher");
const { validateVoucherWithSnapshot } = require("../utils/voucherHelpers");

const createVoucher = async (req, res) => {
  try {
    const {
      discountValue,
      minOrderValue,
      maxDiscountValue,
      weight,
      code,
      discountType
    } = req.body;

    // Validate các số không âm
    if (
      discountValue < 0 ||
      (minOrderValue !== undefined && minOrderValue < 0) ||
      (maxDiscountValue !== undefined && maxDiscountValue < 0) ||
      (weight !== undefined && weight < 0)
    ) {
      return res.status(400).json({ message: "Giá trị không được là số âm" });
    }

    // Validate discountType
    if (!['percent', 'fixed'].includes(discountType)) {
      return res.status(400).json({ message: "Loại giảm giá không hợp lệ" });
    }

    // Validate code
    if (!code || code.trim() === "") {
      return res.status(400).json({ message: "Mã voucher là bắt buộc" });
    }

    const voucher = new Voucher(req.body);
    await voucher.save();
    res.status(201).json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Lấy tất cả voucher (chỉ lấy những voucher chưa bị xóa)
const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ isDeleted: false });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy voucher với filter
const getVouchersWithFilter = async (req, res) => {
  try {
    const { code, status, startDate, endDate, isSpinWheelVoucher, isDeleted } = req.query;
    
    let filter = {};
    
    // Filter theo mã voucher
    if (code) {
      filter.code = { $regex: code, $options: 'i' };
    }
    
    // Filter theo trạng thái
    if (status && status !== 'all') {
      const now = new Date();
      switch (status) {
        case 'active':
          filter.isActive = true;
          filter.startDate = { $lte: now };
          filter.endDate = { $gte: now };
          break;
        case 'inactive':
          filter.isActive = false;
          break;
        case 'expired':
          filter.endDate = { $lt: now };
          break;
      }
    }
    
    // Filter theo ngày hiệu lực
    if (startDate) filter.startDate = { $gte: new Date(startDate) };
    if (endDate) filter.endDate = { $lte: new Date(endDate) };
    
    // Filter theo voucher vòng quay
    if (isSpinWheelVoucher !== undefined) {
      filter.isSpinWheelVoucher = isSpinWheelVoucher === 'true';
    }
    
    // Filter theo trạng thái xóa
    if (isDeleted !== undefined) {
      filter.isDeleted = isDeleted === 'true';
    } else {
      filter.isDeleted = false; // mặc định chỉ lấy voucher chưa xóa
    }
    
    const vouchers = await Voucher.find(filter).sort({ createdAt: -1 });
    
    // Xử lý NO_PRIZE
    const result = vouchers.map(v => {
      if (v.isNoPrize) {
        return {
          _id: v._id,
          code: v.code,
          description: v.description,
          weight: v.weight,
          isActive: v.isActive,
          startDate: v.startDate,
          endDate: v.endDate,
          isNoPrize: true
        };
      }
      return v;
    });
    
    res.json(result);
    
  } catch (error) {
    console.error("Error filtering vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Sửa voucher

const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });

    // 🎯 Nếu là NO_PRIZE thì chỉ validate weight
    if (voucher.isNoPrize) {
      if (req.body.weight !== undefined && req.body.weight < 0) {
        return res.status(400).json({ message: "Giá trị không được là số âm" });
      }
      voucher.weight = req.body.weight ?? voucher.weight;
      voucher.isActive = req.body.isActive ?? voucher.isActive;
      await voucher.save();
      return res.json(voucher);
    }

    // ✅ Validate không cho nhập số âm
    const {
      discountValue,
      minOrderValue,
      maxDiscountValue,
      weight
    } = req.body;

    if (
      (discountValue !== undefined && discountValue < 0) ||
      (minOrderValue !== undefined && minOrderValue < 0) ||
      (maxDiscountValue !== undefined && maxDiscountValue < 0) ||
      (weight !== undefined && weight < 0)
    ) {
      return res.status(400).json({ message: "Giá trị không được là số âm" });
    }

    // Cập nhật voucher bình thường
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Lấy voucher theo ID
const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });
    res.json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy voucher của user (sử dụng snapshot)
const getMyVouchers = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Sử dụng voucherSnapshot thay vì populate
    const userVouchers = await UserVoucher.find({ user_id: userId });
    
    // Chuyển đổi dữ liệu để tương thích với frontend
    const vouchers = userVouchers.map(uv => ({
      _id: uv._id,
      user_id: uv.user_id,
      voucher_id: uv.voucher_id,
      received_at: uv.received_at,
      usedAt: uv.usedAt,
      status: uv.status,
      // Sử dụng snapshot thay vì voucher gốc
      code: uv.voucherSnapshot.code,
      description: uv.voucherSnapshot.description,
      discountType: uv.voucherSnapshot.discountType,
      discountValue: uv.voucherSnapshot.discountValue,
      minOrderValue: uv.voucherSnapshot.minOrderValue,
      maxDiscountValue: uv.voucherSnapshot.maxDiscountValue,
      startDate: uv.voucherSnapshot.startDate,
      endDate: uv.voucherSnapshot.endDate,
      isSpinWheelVoucher: uv.voucherSnapshot.isSpinWheelVoucher,
      weight: uv.voucherSnapshot.weight
    }));
    
    res.json(vouchers);
  } catch (error) {
    console.error("Error fetching user vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate voucher (sử dụng snapshot)
const validateVoucher = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
    }

    if (!code || !totalAmount) {
      return res.status(400).json({ message: "Code voucher và tổng tiền đơn hàng là bắt buộc" });
    }

    // Sử dụng helper function để validate
    const result = await validateVoucherWithSnapshot(userId, code, totalAmount);

    if (!result.isValid) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      isValid: true,
      message: result.message,
      voucher: result.voucher,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount
    });

  } catch (error) {
    console.error("Error validating voucher:", error);
    res.status(500).json({ message: "Lỗi server khi kiểm tra voucher" });
  }
};

// Soft delete voucher
const softDeleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Toggle trạng thái isDeleted
    voucher.isDeleted = !voucher.isDeleted;
    await voucher.save();

    res.json({ 
      message: voucher.isDeleted ? "Voucher đã được xóa" : "Voucher đã được khôi phục",
      voucher 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả voucher bao gồm cả đã xóa (cho admin)
const getAllVouchersWithDeleted = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVoucher,
  getAllVouchers,
  getVouchersWithFilter,
  updateVoucher,
  getMyVouchers,
  getVoucherById,
  validateVoucher,
  softDeleteVoucher,
  getAllVouchersWithDeleted
};