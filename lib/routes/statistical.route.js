const express = require('express');

const { requireSignin } = require('../controllers/auth.controller');
const {
  getAllStatusRoom,
  getAllBillServiceByYear,
  getBillServiceByYear,
  getDetailBillServiceByMonthYear,
} = require('../controllers/statistical.controller');
const { checkIdHouse, checkYearParam, checkIdRoomParam, checkNameService, checkMonthParam } = require('../validator');

const router = express.Router();

router.param('idHouse', checkIdHouse);

router.get('/statistical/:idHouse/room-status', checkIdHouse, getAllStatusRoom);
router.get('/statistical/:idHouse/:year/:name/get-all-bill-service', getAllBillServiceByYear);
router.get(
  '/statistical/get-bill-service/:idRoom/:name/:year',
  checkIdRoomParam,
  checkNameService,
  checkYearParam,
  getBillServiceByYear,
);

router.get(
  '/statistical/get-detail-bill-service/:idRoom/:name/:month/:year',
  checkIdRoomParam,
  checkNameService,
  checkMonthParam,
  checkYearParam,
  getDetailBillServiceByMonthYear,
);

module.exports = router;
