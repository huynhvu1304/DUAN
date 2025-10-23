const express = require('express');
const router = express.Router();
const {getAllVariants,getVariantById} = require('../controllers/variantController');
// Get all variants
router.get('/', getAllVariants);

// Get a single variant by ID
router.get('/:id', getVariantById);


module.exports = router;