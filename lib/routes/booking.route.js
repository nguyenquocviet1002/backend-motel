import express, { Router } from 'express';
const router = express.Router();

import { AcceptTakeRoom, create, listBookingByHouse, showDetailBooking } from '../controllers/booking.controller';
import { requireSignin } from '../controllers/auth.controller';
import { checkEmptyField, checkStatusRoom, getDataBooking } from '../validator/booking.validator';
import { checkIdBooking, checkIdBookingBody, checkIdHouse, checkIdRoomBody } from '../validator/index';

router.post('/booking/create', requireSignin, checkEmptyField, create);
router.get('/booking/list/:idHouse', requireSignin, checkIdHouse, listBookingByHouse);
router.get('/booking/get-detail/:idBooking', requireSignin, checkIdBooking, showDetailBooking);
// router.get('/booking/accept-take-room', requireSignin, checkIdRoomBody, checkStatusRoom, AcceptTakeRoom);
router.post(
  '/booking/accept-take-room',
  requireSignin,
  checkIdRoomBody,
  checkIdBookingBody,
  checkStatusRoom,
  getDataBooking,
  AcceptTakeRoom,
);

module.exports = router;
