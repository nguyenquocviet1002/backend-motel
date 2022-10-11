const express = require('express');
const { create, list, houseByID, remove, update } = require('../controllers/house');
const { requireSignin, isAuth } = require('../controllers/auth.controller')
const { userById } = require('../controllers/user.controller');


const router = express.Router();

router.param('houseId', houseByID);
router.param('userId', userById);

router.post('/house/:userId', requireSignin, isAuth, create);
router.get('/house/:userId', requireSignin, list);
router.delete('/house/:houseId', requireSignin, isAuth, remove);
router.put('/house/:houseId', requireSignin, isAuth, update);


module.exports = router;