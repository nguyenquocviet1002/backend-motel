const Room = require('../models/room.model');
const Booking = require('../models/booking.model');

export const checkEmptyField = (req, res, next) => {
  const { idRoom, idHouse, fullName, email, phoneNumber, bookMoney, expectTime } = req.body;

  if (!idRoom || !idHouse || !fullName || !email || !phoneNumber || !bookMoney || !expectTime) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin!' });
  } else {
    next();
  }
};

export const checkStatusRoom = async (req, res, next) => {
  await Room.findById(req.body.idRoom, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: 'Có lỗi sảy ra!',
      });
    }
    if (!docs) {
      return res.status(400).json({
        error: 'Phòng không tồn tại!',
      });
    } else {
      if (docs.status == false) {
        return res.status(400).json({
          error: 'Phòng đang bảo trì , không thể nhận phòng này hiện tại',
        });
      }
      if (docs.listMember.length) {
        return res.status(400).json({
          error: 'Phòng đang có người sử dụng , không thể chuyển người khác vào ở!',
        });
      } else {
        next();
      }
    }
  });
};

export const getDataBooking = async (req, res, next) => {
  await Booking.findById(req.body.idBooking, (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({
        error: 'Đặt cọc phòng không thành công!',
      });
    } else {
      req.dataBooking = docs;
      next();
    }
  });
};
