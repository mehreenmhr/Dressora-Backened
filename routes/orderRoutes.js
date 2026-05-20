const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.get('/seller/:sellerId', orderController.getSellerOrderItems);
router.put('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;
