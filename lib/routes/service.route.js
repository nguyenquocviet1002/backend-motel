const express = require('express');
const {
  editService,
  checkHouse,
  addService,
  listServiceByIdHouse,
  removeService,
  getServiceById,
  getOneService,
} = require('../controllers/service.controller');
const { requireSignin } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/service-house/:idHouse', requireSignin, listServiceByIdHouse);
router.get('/service/:idService', requireSignin, getServiceById);
router.get('/service/get-service/:idHouse/:name', getOneService);
router.delete('/service/remove/:idHouse/:idService', requireSignin, removeService);

router.post('/service/create', requireSignin, addService);
router.patch('/service/update/:idService', requireSignin, editService);

module.exports = router;
