import express from 'express';
const router = express.Router();

import { userById, read, update, addRoom } from '../controllers/room.controller';
import { requireSignin, isAdmin, isAuth, isAuthHouse } from '../controllers/auth.controller';

// router.get('/list-room', requireSignin, isAuthHouse);
router.post('/room/add', requireSignin, addRoom);
// router.get('/user/:userId', requireSignin, isAuth, read);
// router.put('/user/:userId', requireSignin, isAuth, update);

// router.param('userId', userById);

module.exports = router;
