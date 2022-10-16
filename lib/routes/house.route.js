const express = require('express');
const { create, list, houseByID, read, remove, update, addService, houseByIDService } = require('../controllers/house.controller');
const { requireSignin } = require('../controllers/auth.controller')
const { userById } = require('../controllers/user.controller');


const router = express.Router();

router.param('houseId', houseByID);
router.param('idHouse', houseByIDService);
router.param('userId', userById);

router.post('/house/:userId', requireSignin, create);
router.get('/house/:userId', requireSignin, list);
router.get('/house/detail/:houseId', requireSignin, read);
router.delete('/house/:houseId', requireSignin, remove);
router.put('/house/:houseId', requireSignin, update);
router.put('/house/service/:idHouse', requireSignin, addService);


module.exports = router;