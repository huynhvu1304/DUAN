var express = require('express');
var router = express.Router();

const {
    getAllFlashSales,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale } = require('../controllers/flashsaleController');

router.get('/', getAllFlashSales);
router.post('/', createFlashSale);
router.put('/:id', updateFlashSale);
router.delete('/:id', deleteFlashSale);

module.exports = router;