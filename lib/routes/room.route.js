import express from 'express';
const router = express.Router();

import {
  getRoomById,
  updateRoom,
  addRoom,
  listRoom,
  removeById,
  addMember,
  removeMember,
  getNameRoom,
  getRoomBySubName,
} from '../controllers/room.controller';
import { requireSignin } from '../controllers/auth.controller';
import { checkIdRoom, checkIdUser } from '../validator';
import { checkBeforAddRoom, checkEmptyRoom } from '../validator/room.validator';

router.param('idRoom', checkIdRoom);
router.param('idAuth', checkIdUser);

router.get('/room/:idRoom', getRoomById);
router.get('/room/get-data/:subname', getRoomBySubName);
router.get('/list-room/:idAuth/:idHouse', requireSignin, listRoom);
router.post('/room/add', requireSignin, checkBeforAddRoom, checkEmptyRoom, addRoom);
router.put('/room/update/:idRoom', requireSignin, updateRoom);
router.delete('/room/remove/:idRoom', requireSignin, removeById);
router.get('/room/getName/:idRoom', getNameRoom);

router.post('/room/:idRoom/member/add', requireSignin, addMember);
router.post('/room/:idRoom/member/remove', requireSignin, removeMember);

module.exports = router;
