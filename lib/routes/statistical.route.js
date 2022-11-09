const express = require('express');

const { requireSignin } = require('../controllers/auth.controller');
const { getAllStatusRoom, getAllBillServiceByYear } = require('../controllers/statistical.controller');
const { checkIdHouse, checkYearParam, checkIdRoomParam, checkNameService } = require('../validator');

const router = express.Router();

router.param('idHouse', checkIdHouse);

router.get('/statistical/:idHouse/room-status', checkIdHouse, getAllStatusRoom);
router.get('/statistical/:idHouse/:year/:name/get-all-bill-service', getAllBillServiceByYear);
router.get(
  '/statistical/:idRoom/:nameService/:year/get-bill-service',
  checkIdRoomParam,
  checkNameService,
  checkYearParam,
);

module.exports = router;
