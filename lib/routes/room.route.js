import express from 'express';
const router = express.Router();

import { getRoomById, updateRoom, addRoom, listRoom, removeById } from '../controllers/room.controller';
import { requireSignin, isAdmin, isAuth, isAuthHouse } from '../controllers/auth.controller';

router.get('/room/:idRoom', requireSignin, getRoomById);
router.get('/list-room', requireSignin, listRoom);
router.post('/room/add', requireSignin, addRoom);
router.post('/room/update/:idRoom', requireSignin, updateRoom);
router.delete('/room/remove/:idRoom', requireSignin, removeById);

module.exports = router;
