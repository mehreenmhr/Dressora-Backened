const express = require('express');
const router = express.Router();
const { getProducts, getProductById, updateProductStatus } = require('../controllers/productController');

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.put('/:id/status', updateProductStatus);

module.exports = router;
