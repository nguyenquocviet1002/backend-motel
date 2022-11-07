import express from 'express';
const router = express.Router();

import { AcceptTakeRoom, create, listBookingByHouse, showDetailBooking } from '../controllers/book.controller';
import { requireSignin } from '../controllers/auth.controller';
import { checkEmptyField, checkStatusRoom } from '../validator/booking.validator';
import { checkIdBooking, checkIdHouse, checkIdRoomBody } from '../validator/index';

router.get('booking/create', requireSignin, checkEmptyField, create);
router.get('booking/list/:idHouse', requireSignin, checkIdHouse, listBookingByHouse);
router.get('booking/get-detail/:idBooking', requireSignin, checkIdBooking, showDetailBooking);
router.get('booking/accept-take-room', requireSignin, checkIdRoomBody, checkStatusRoom, AcceptTakeRoom);
module.exports = router;
