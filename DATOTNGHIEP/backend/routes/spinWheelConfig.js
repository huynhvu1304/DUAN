const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/spinWheelConfigController');

// Lấy cấu hình hiện tại
router.get('/', getConfig);

// Cập nhật cấu hình
router.put('/', updateConfig);

module.exports = router;
