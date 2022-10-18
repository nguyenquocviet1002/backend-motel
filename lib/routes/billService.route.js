const express = require('express');
const {
  checkRequire,
  editBillService,
  checkAuth,
  checkValue,
  addBillService,
  getListWaterService,
} = require('../controllers/billService.controller');
const { requireSignin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/bill/create', requireSignin, checkRequire, addBillService);

// router.get('/service-house/:idHouse', requireSignin, listServiceByIdHouse);

// router.delete('/service/remove/:idService', removeService);

router.patch('/bill/update/:idBillService', requireSignin, editBillService);
router.get('/bill/get-list/:idHouse/:type/:month/:year', requireSignin, getListWaterService);

module.exports = router;
