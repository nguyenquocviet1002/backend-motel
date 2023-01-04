const express = require('express');
const { CreateBillPayment, CheckReturnPayment, getPaymentMethodOfHouse } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/payment/:idHouse/create-payment', getPaymentMethodOfHouse, CreateBillPayment);
router.post('/payment/payment-return', CheckReturnPayment);

module.exports = router;
