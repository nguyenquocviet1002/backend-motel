const express = require('express');
const {
  editService,
  checkHouse,
  addService,
  listServiceByIdHouse,
  removeService,
} = require('../controllers/service.controller');
const { requireSignin } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/service-house/:idHouse', requireSignin, listServiceByIdHouse);

router.delete('/service/remove/:idHouse/:idService', requireSignin, removeService);

router.post('/service/create', requireSignin, checkHouse, addService);
router.patch('/service/update/:idService', requireSignin, editService);

module.exports = router;
