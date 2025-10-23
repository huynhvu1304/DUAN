const { userModel } = require('../models/userModel');

const checkBanned = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.user_id);
    
    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra trạng thái bình luận
    if (user.statuscomment === 'Cấm bình luận') {
      return res.status(403).json({
        message: 'Tài khoản của bạn đã bị cấm bình luận'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server khi kiểm tra trạng thái',
      error: error.message  
    });
  }
};

module.exports = checkBanned;