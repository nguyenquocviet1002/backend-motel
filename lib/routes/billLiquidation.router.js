const express = require('express');
const router = express.Router();

const { saveBillLiquidation } = require('../controllers/billLiquidation.controller');

router.post('/bill-liqui/create', saveBillLiquidation);

module.exports = router;
