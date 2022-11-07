const express = require('express');

const { requireSignin } = require('../controllers/auth.controller');
const { getAllStatusRoom, getAllBillServiceByYear } = require('../controllers/statistical.controller');
const { checkIdHouse } = require('../validator');

const router = express.Router();

router.param('idHouse', checkIdHouse);

router.get('/statistical/:idHouse/room-status', getAllStatusRoom);
router.get('/statistical/:idHouse/:year/:name/get-all-bill-service', getAllBillServiceByYear);

module.exports = router;
