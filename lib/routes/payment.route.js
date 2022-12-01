const express = require('express');
const { CreatePayment, CheckReturnPayment } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/payment/create-payment', CreatePayment);
router.post('/payment/payment-return', CheckReturnPayment);

module.exports = router;
