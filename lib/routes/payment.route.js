const express = require('express');
const { CreatePayment } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/payment/create-payment', CreatePayment);

module.exports = router;
