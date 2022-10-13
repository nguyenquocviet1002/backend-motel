import express from 'express';
const router = express.Router();

import { requireSignin } from '../controllers/auth.controller';
import { createBill } from '../controllers/service.controller';
router.get('/service/create-bill/:typeService', createBill);
// router.get('/list-room', listRoom);
// router.post('/room/add', addRoom);
// router.post('/room/update/:idRoom', updateRoom);
// router.delete('/room/remove/:idRoom', removeById);

module.exports = router;
