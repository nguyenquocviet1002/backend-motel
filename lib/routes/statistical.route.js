const express = require('express');

const { requireSignin } = require('../controllers/auth.controller');
const { getAllStatusRoom, getAllBillServiceByYear } = require('../controllers/statistical.controller');
const { checkIdHouse } = require('../validator');

const router = express.Router();

router.param('idHouse', checkIdHouse);
// router.param('id', getBillId);

// router.post('/bill/:idRoom', requireSignin, setAmount, setAmount2);
// router.post('/bill/list/:idAuth', requireSignin, getBillAll);
// router.get('/bill/detail/:id', requireSignin, read);
// router.delete('/bill/delete/:id', requireSignin, removeBill);

router.get('/statistical/:idHouse/room-status', getAllStatusRoom);
router.get('/statistical/:idHouse/:year/:name/get-all-bill-service', getAllBillServiceByYear);

module.exports = router;
