const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

const sendContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Liên hệ từ ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2ecc71;">Bạn có tin nhắn mới từ khách hàng</h2>
          <p><strong>Họ và tên:</strong> ${name}</p>
          <p><strong>Email khách:</strong> ${email}</p>
          <p><strong>Nội dung:</strong></p>
          <p style="background: #f0fff0; padding: 10px; border-left: 5px solid #2ecc71;">${message}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Gửi email thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gửi email thất bại.' });
  }
};

module.exports = {
  sendContact,
};
