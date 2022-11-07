const Booking = require('../models/book.model');

export const create = async (req, res) => {
  const { idRoom, idHouse, fullName, email, cardNumber, phoneNumber, bookMoney, expectTime } = req.body;
  const data = new Booking({
    idRoom,
    idHouse,
    fullName,
    email,
    cardNumber,
    phoneNumber,
    bookMoney,
    expectTime,
  });

  await Booking.find({ idHouse: idHouse, idRoom: idRoom }, async (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: 'Có lỗi sảy ra !',
      });
    }
    if (docs) {
      return res.status(400).json({
        error: 'Phòng này đã có người đặt cọc !',
      });
    } else {
      await data.save((err, docs) => {
        if (err) {
          return res.status(400).json({
            error: 'Đặt phòng trước không thành công !',
          });
        } else {
          return res.status(200).json({
            message: 'Đặt cọc phòng thành công !',
            data: docs,
          });
        }
      });
    }
  });
};

export const listBookingByHouse = async (req, res) => {
  await Booking.find({ idHouse: req.paramrs.idHouse }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: 'Có lỗi trong lúc lấy danh sách !',
      });
    } else {
      return res.status(200).json({
        data: docs,
      });
    }
  });
};

export const showDetailBooking = async (req, res) => {
  await Booking.findById(req.paramrs.idBooking, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: 'Có lỗi sảy ra !',
      });
    }
    if (!docs) {
      return res.status(400).json({
        error: 'Không có thông tin của người đặt trước!',
      });
    } else {
      return res.status(200).json({
        data: docs,
      });
    }
  });
};

export const AcceptTakeRoom = async (req, res) => {};
