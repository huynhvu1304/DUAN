const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const { userModel: User } = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();


// Gửi email quên mật khẩu
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const htmlContent = `
   <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 30px;">
      
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://novashop.io.vn/img/logo.png" alt="Logo" style="height: 50px;" />
      </div>

      <!-- Title -->
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Yêu cầu đặt lại mật khẩu</h2>

      <!-- Nội dung -->
      <p style="font-size: 16px; color: #333;">Xin chào <strong>${user.name || user.email}</strong>,</p>
      <p style="font-size: 16px; color: #333;">
        Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
        Vui lòng nhấn vào nút bên dưới để tiếp tục. Liên kết sẽ hết hạn sau <strong>1 giờ</strong>.
      </p>

      <!-- Nút đặt lại mật khẩu -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background-color: #28a745; color: #fff; padding: 14px 30px; text-decoration: none; font-size: 16px;">
          Đặt lại mật khẩu
        </a>
      </div>

      <!-- Link dự phòng -->
      <p style="font-size: 14px; color: #555;">Hoặc sao chép liên kết sau và dán vào trình duyệt:</p>
      <p style="font-size: 14px; color: #555;"><a href="${resetURL}" style="color: #007bff;">${resetURL}</a></p>
      <p style="font-size: 14px; color: #999;">Vui lòng không chia sẻ liên kết này với bất kỳ ai!.</p>

      <p style="font-size: 14px; color: #999;">Nếu bạn không yêu cầu hành động này, hãy bỏ qua email này.</p>

      <hr style="margin: 40px 0 20px;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} NovaShop. All rights reserved.<br>
        Hotline: 0794346995 | Email: novashopvn12@gmail.comn<br>
        Địa chỉ:  Ấp Bàu Bông xã Phước An, huyện Nhơn Trạch, Đồng Nai<br>
      </p>
    </div>
  </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: htmlContent,
    });

    res.json({ message: 'Email đặt lại mật khẩu đã được gửi!' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({ message: 'Gửi email thất bại' });
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu không khớp' });
  }

  // Kiểm tra độ mạnh của mật khẩu
  const passwordRegex = /^.{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    });
  }


  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: 'Liên kết không còn hiệu lực. Vui lòng thử gửi lại yêu cầu.' });
  }

  // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Đặt lại mật khẩu thành công' });
};


module.exports = {
  forgotPassword,
  resetPassword,
};
