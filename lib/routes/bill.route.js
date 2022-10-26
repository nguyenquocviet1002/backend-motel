const express = require('express');
const { getInfo, setAmount, setAmount2 } = require('../controllers/bill.controller');

const router = express.Router();

router.param('idRoom', getInfo);

router.post('/bill/:idRoom', setAmount, setAmount2);

module.exports = router;