const express = require('express');
const {
  checkRequire,
  editBillService,
  checkAuth,
  checkValue,
  addBillService,
  getListService,
  // createBillForAllRoom,
  getServiceHouse,
  getAllBillByMonthYear,
  createAllBillForHouse,
} = require('../controllers/billService.controller');
const { requireSignin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/bill/create', requireSignin, checkRequire, addBillService);
// router.post('/bill/create-for-all', getServiceHouse, createBillForAllRoom);

router.patch('/bill/update/:idBillService', requireSignin, editBillService);
router.get('/bill/get-list/:idHouse/:type/:month/:year', requireSignin, getListService);
router.get('/bill/:type/:idHouse/:month/:year', getAllBillByMonthYear);
router.post('/bill/create-for-house', getServiceHouse, createAllBillForHouse);

module.exports = router;
