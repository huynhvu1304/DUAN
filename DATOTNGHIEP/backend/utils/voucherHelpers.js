const UserVoucher = require('../models/userVoucher');
const Voucher = require('../models/voucherModel');

/**
 * Tạo userVoucher với snapshot của voucher
 * @param {string} userId - ID của user
 * @param {string} voucherId - ID của voucher
 * @returns {Promise<Object>} - UserVoucher đã tạo
 */
const createUserVoucherWithSnapshot = async (userId, voucherId) => {
  try {
    // Lấy thông tin voucher
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      throw new Error('Voucher không tồn tại');
    }

    // Tạo userVoucher với snapshot
    const userVoucher = new UserVoucher({
      user_id: userId,
      voucher_id: voucherId,
      voucherSnapshot: {
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrderValue: voucher.minOrderValue,
        maxDiscountValue: voucher.maxDiscountValue,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        isSpinWheelVoucher: voucher.isSpinWheelVoucher,
        weight: voucher.weight
      },
      status: 'received'
    });

    await userVoucher.save();
    return userVoucher;
  } catch (error) {
    throw error;
  }
};

/**
 * Validate voucher sử dụng snapshot
 * @param {string} userId - ID của user
 * @param {string} code - Code của voucher
 * @param {number} totalAmount - Tổng tiền đơn hàng
 * @returns {Promise<Object>} - Kết quả validation
 */
const validateVoucherWithSnapshot = async (userId, code, totalAmount) => {
  try {
    // Tìm userVoucher theo code trong snapshot
    const userVoucher = await UserVoucher.findOne({ 
      user_id: userId, 
      'voucherSnapshot.code': code.toUpperCase(),
      status: { $in: ['received', 'used'] }
    });

    if (!userVoucher) {
      return {
        isValid: false,
        message: "Bạn chưa sở hữu voucher này hoặc voucher không tồn tại"
      };
    }

    if (userVoucher.status === 'used') {
      return {
        isValid: false,
        message: "Bạn đã sử dụng voucher này"
      };
    }

    const voucherSnapshot = userVoucher.voucherSnapshot;

    // Kiểm tra thời gian hiệu lực từ snapshot
    const now = new Date();
    if (now < new Date(voucherSnapshot.startDate) || now > new Date(voucherSnapshot.endDate)) {
      return {
        isValid: false,
        message: "Voucher không trong thời gian hiệu lực"
      };
    }

    // Kiểm tra giá trị đơn hàng tối thiểu từ snapshot
    if (totalAmount < voucherSnapshot.minOrderValue) {
      return {
        isValid: false,
        message: `Đơn hàng phải có giá trị tối thiểu ${voucherSnapshot.minOrderValue.toLocaleString()} VND`
      };
    }

    // Tính toán giảm giá từ snapshot
    let discountAmount = 0;
    if (voucherSnapshot.discountType === 'percent') {
      discountAmount = (totalAmount * voucherSnapshot.discountValue) / 100;
      if (voucherSnapshot.maxDiscountValue && discountAmount > voucherSnapshot.maxDiscountValue) {
        discountAmount = voucherSnapshot.maxDiscountValue;
      }
    } else {
      discountAmount = voucherSnapshot.discountValue;
    }

    const finalAmount = totalAmount - discountAmount;

    return {
      isValid: true,
      message: "Voucher hợp lệ",
      voucher: voucherSnapshot,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      userVoucherId: userVoucher._id
    };

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUserVoucherWithSnapshot,
  validateVoucherWithSnapshot
}; 