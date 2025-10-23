const SpinWheel = require('../models/spinWheelModel');
const Voucher = require('../models/voucherModel');
const { createUserVoucherWithSnapshot } = require('../utils/voucherHelpers');
const { getCooldownSeconds } = require('./spinWheelConfigController');

// Lấy danh sách voucher khả dụng cho vòng quay
const getAvailableVouchers = async () => {
  return await Voucher.find({
    isActive: true,
    isDeleted: { $ne: true },
    isSpinWheelVoucher: true,
    weight: { $gt: 0 }, // Chỉ lấy voucher có trọng số > 0
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    $expr: { $lt: ["$used", "$quantity"] }
  }).select('code description discountType discountValue minOrderValue maxDiscountValue quantity used weight endDate');
};

// Tạo voucher "Chúc bạn may mắn lần sau" nếu chưa có
const ensureNoPrizeVoucher = async () => {
  let noPrizeVoucher = await Voucher.findOne({ code: 'NO_PRIZE' });
  
  if (!noPrizeVoucher) {
    noPrizeVoucher = new Voucher({
      code: 'NO_PRIZE',
      description: 'Chúc bạn may mắn lần sau',
      discountType: 'fixed',
      discountValue: 0,
      minOrderValue: 0,
      quantity: 999999, // Số lượng lớn để không bao giờ hết
      used: 0,
      startDate: new Date('2020-01-01'),
      endDate: new Date('2030-12-31'),
      isActive: true,
      isDeleted: false,
      isSpinWheelVoucher: true,
      weight: 50,
       isNoPrize: true,
    });
    await noPrizeVoucher.save();
  }
  
  return noPrizeVoucher;
};

const checkSpinEligibility = async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({
        canSpin: false,
        message: "Vui lòng đăng nhập để tham gia vòng quay may mắn"
      });
    }

    // Đảm bảo có voucher NO_PRIZE
    await ensureNoPrizeVoucher();
    
    const availableVouchers = await getAvailableVouchers();

    if (availableVouchers.length === 0) {
      return res.json({
        canSpin: false,
        message: "Hiện tại chưa có voucher nào để quay. Vui lòng thử lại sau!",
        noVouchers: true
      });
    }
   
    // Lấy thời gian cooldown từ cấu hình
    const cooldownSeconds = await getCooldownSeconds();
    
    const lastSpin = await SpinWheel.findOne({
      userId: req.userId,
      isActive: true
    }).sort({ spinDate: -1 });

    if (!lastSpin) {
      return res.json({
        canSpin: true,
        message: "Chào mừng bạn đến với vòng quay may mắn!"
      });
    }

    const now = new Date();
    const lastSpinTime = new Date(lastSpin.spinDate);
    const timeDiff = now.getTime() - lastSpinTime.getTime();
    const secondsDiff = timeDiff / 1000;

    if (secondsDiff >= cooldownSeconds) {
      return res.json({
        canSpin: true,
        message: "Bạn có thể quay lại rồi!"
      });
    } else {
      const remainingSeconds = Math.ceil(cooldownSeconds - secondsDiff);
      return res.json({
        canSpin: false,
        message: `Bạn đã quay hôm nay. Vui lòng thử lại sau !`,
        remainingTime: remainingSeconds
      });
    }
  } catch (error) {
    console.error('Lỗi kiểm tra quyền quay:', error);
    res.status(500).json({
      message: "Có lỗi xảy ra khi kiểm tra quyền quay",
      canSpin: false
    });
  }
};

const spinWheel = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập để tham gia vòng quay may mắn" });
    }

    // Cooldown dựa trên cấu hình admin
    const cooldownSeconds = await getCooldownSeconds();

    const lastSpin = await SpinWheel.findOne({ userId: req.userId }).sort({ spinDate: -1 });
    if (lastSpin) {
      const now = new Date();
      const timeDiff = now.getTime() - new Date(lastSpin.spinDate).getTime();
      const secondsDiff = timeDiff / 1000;
      if (secondsDiff < cooldownSeconds) {
        const remainingSeconds = Math.ceil(cooldownSeconds - secondsDiff);
        return res.status(400).json({
          message: `Bạn đã quay hôm nay. Vui lòng thử lại sau ${remainingSeconds} giây.`,
          spinResult: 'cooldown'
        });
      }
    }

    // Đảm bảo có voucher NO_PRIZE
    await ensureNoPrizeVoucher();
    
    // Lấy danh sách voucher khả dụng
    const availableVouchers = await getAvailableVouchers();

    if (availableVouchers.length === 0) {
      return res.status(500).json({ 
        message: "Không có voucher nào khả dụng cho vòng quay.", 
        spinResult: 'error' 
      });
    }

    // Tính tổng trọng số
    const totalWeight = availableVouchers.reduce((sum, voucher) => sum + voucher.weight, 0);
    
    if (totalWeight <= 0) {
      return res.status(500).json({ 
        message: "Lỗi cấu hình: Tổng trọng số phải lớn hơn 0", 
        spinResult: 'error' 
      });
    }

    // Random dựa trên trọng số
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    let selectedVoucher = null;

    for (const voucher of availableVouchers) {
      cumulativeWeight += voucher.weight;
      if (random <= cumulativeWeight) {
        selectedVoucher = voucher;
        break;
      }
    }

    // Nếu không chọn được voucher nào (trường hợp hiếm), chọn voucher đầu tiên
    if (!selectedVoucher) {
      selectedVoucher = availableVouchers[0];
    }

    // Lưu kết quả quay
    const spinEntry = new SpinWheel({
      userId: req.userId,
      voucherId: selectedVoucher._id,
      spinDate: new Date()
    });
    await spinEntry.save();

    // Xử lý kết quả
    let responseMessage = "";
    let spinResultValue = "no_prize";

    if (selectedVoucher.code === 'NO_PRIZE') {
      responseMessage = "Chúc bạn may mắn lần sau!";
      spinResultValue = "no_prize";
    } else {
      // Giảm quantity và tăng used cho voucher thật
      await Voucher.findByIdAndUpdate(selectedVoucher._id, { $inc: { used: 1 } });
      
      // Tạo user voucher cho voucher thật
      await createUserVoucherWithSnapshot(req.userId, selectedVoucher._id);
      
      responseMessage = `Chúc mừng bạn đã trúng voucher ${selectedVoucher.code}!`;
      spinResultValue = "voucher";
    }

    res.json({
      message: responseMessage,
      spinResult: spinResultValue,
      voucher: selectedVoucher.code === 'NO_PRIZE' ? null : {
        _id: selectedVoucher._id,
        code: selectedVoucher.code,
        description: selectedVoucher.description,
        discountType: selectedVoucher.discountType,
        discountValue: selectedVoucher.discountValue,
        minOrderValue: selectedVoucher.minOrderValue,
        maxDiscountValue: selectedVoucher.maxDiscountValue,
        endDate: selectedVoucher.endDate,
        remaining: selectedVoucher.quantity - selectedVoucher.used - (selectedVoucher.code === 'NO_PRIZE' ? 0 : 1)
      }
    });

  } catch (error) {
    console.error('Lỗi khi quay vòng quay:', error);
    res.status(500).json({ message: "Có lỗi xảy ra khi quay vòng quay may mắn", spinResult: 'error' });
  }
};

const getSpinHistory = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Vui lòng đăng nhập để xem lịch sử quay"
      });
    }

    const spinHistory = await SpinWheel.find({
      userId: req.userId,
      isActive: true
    })
      .populate('voucherId')
      .sort({ spinDate: -1 })
      .limit(10);

    res.json({ spinHistory });
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử quay:', error);
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy lịch sử quay"
    });
  }
};

const getSpinWheelVouchers = async (req, res) => {
  try {
    // Đảm bảo có voucher NO_PRIZE
    await ensureNoPrizeVoucher();
    
    const vouchers = await getAvailableVouchers();

    const vouchersWithRemaining = vouchers.map(voucher => {
      const remaining = voucher.code === 'NO_PRIZE' ? 999999 : voucher.quantity - voucher.used;
      return {
        ...voucher.toObject(),
        remaining: remaining
      };
    });

    res.json({
      vouchers: vouchersWithRemaining,
      hasVouchers: vouchers.length > 0,
      message: vouchers.length > 0 ? "Có voucher khả dụng" : "Hiện tại chưa có voucher nào khả dụng"
    });
  } catch (error) {
    console.error('Lỗi khi lấy voucher cho vòng quay:', error);
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy voucher cho vòng quay",
      hasVouchers: false
    });
  }
};

module.exports = {
  checkSpinEligibility,
  spinWheel,
  getSpinHistory,
  getSpinWheelVouchers
};