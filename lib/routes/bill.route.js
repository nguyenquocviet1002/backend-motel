const express = require('express');
const { getInfo, setAmount, setAmount2, getBillAll, getBillId, read, removeBill } = require('../controllers/bill.controller');
const { requireSignin } = require('../controllers/auth.controller');

const router = express.Router();

router.param('idRoom', getInfo);
router.param('id', getBillId);

router.post('/bill/:idRoom', requireSignin, setAmount, setAmount2);
router.post('/bill/list/:idAuth', requireSignin, getBillAll);
router.get('/bill/detail/:id', requireSignin, read);
router.delete('/bill/delete/:id', requireSignin, removeBill);


module.exports = router;