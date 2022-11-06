const express = require('express');
const { getBillRoom, getBillAll, getBillId, read, removeBill, getBillHouse } = require('../controllers/bill.controller');
const { requireSignin } = require('../controllers/auth.controller');
const { checkIdHouse } = require('../validator');


const router = express.Router();
router.param('id', getBillId);

router.param('idHouse', checkIdHouse);
router.post('/bill-house-all/:idHouse', requireSignin, getBillHouse);
router.post('/bill-room', getBillRoom);
router.get('/bill-all/list/:idAuth/:year/:month', requireSignin, getBillAll);
router.get('/bill/detail/:id', requireSignin, read);
router.delete('/bill/delete/:id', requireSignin, removeBill);


module.exports = router;