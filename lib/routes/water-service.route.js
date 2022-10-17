const express = require('express');
const { checkAuth, checkValue, addWaterService } = require('../controllers/water-service.controller');
const { requireSignin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/service/create', requireSignin, checkValue, addWaterService);

// router.get('/service-house/:idHouse', requireSignin, listServiceByIdHouse);

// router.delete('/service/remove/:idService', removeService);

// router.patch('/service/update/:idService', requireSignin, editService);

module.exports = router;
