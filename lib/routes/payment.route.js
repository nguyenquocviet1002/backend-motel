const express = require('express');
const { CreateBillPayment, CheckReturnPayment } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/payment/create-payment', CreateBillPayment);
router.post('/payment/payment-return', CheckReturnPayment);

module.exports = router;
