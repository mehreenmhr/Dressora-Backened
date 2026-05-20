const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/customer/:customerId', addressController.getCustomerAddresses);
router.post('/', addressController.addAddress);

module.exports = router;
