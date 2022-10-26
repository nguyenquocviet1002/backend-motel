const express = require('express');
const { getRoom, setAmount, setAmount2 } = require('../controllers/bill.controller');

const router = express.Router();

router.param('idRoom', getRoom);

router.post('/bill/:idRoom', setAmount, setAmount2);

module.exports = router;