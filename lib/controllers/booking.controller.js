import { errorHandler } from '../helpers/dbErrorsHandler';
const Room = require('../models/room.model');
const nodemailer = require('nodemailer');
const Booking = require('../models/booking.model');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

const emailSMTP = process.env.EMAIL_SMTP;
const passEmail = process.env.KEY_EMAIL;

const smtpTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailSMTP,
    pass: passEmail,
  },
});
let handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./lib/templates/'),
  extName: '.html',
};
smtpTransport.use('compile', hbs(handlebarsOptions));

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

    console.log('docs', docs.length);
    if (docs.length) {
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

export const updateBooking = async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.idBooking, { ...req.body }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    } else {
      return res.status(200).json({
        message: 'Cập nhật đặt cọc phòng thành công!',
        docs: docs,
      });
    }
  });
};

export const AcceptTakeRoom = async (req, res) => {
  const { phoneNumber, cardNumber } = req.body;
  const { fullName, email } = req.dataBooking;

  console.log(' req.dataBooking', req.dataBooking);

  const newDataOfRoom = {
    emailOfAuth: email,
    listMember: [
      {
        memberName: fullName,
        cardNumber: cardNumber,
        status: true,
        phoneNumber: req.dataBooking.phoneNumber ? req.dataBooking.phoneNumber : phoneNumber,
      },
    ],
    contract: {
      infoTenant: {
        name: fullName,
        cardNumber: cardNumber,
        phoneNumber: req.dataBooking.phoneNumber ? req.dataBooking.phoneNumber : phoneNumber,
      },
    },
  };
  await Room.findByIdAndUpdate(req.body.idRoom, { ...newDataOfRoom }, async (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({
        error: 'Tiếp nhận người dùng không thành công!',
      });
    } else {
      const data = {
        to: email,
        from: emailSMTP,
        template: 'accept-take-room',
        subject: 'Tiếp nhận phòng trọ',
        context: {
          name: fullName,
          codeRoom: docs.subName,
          nameRoom: docs.name,
          linkFE: process.env.BASE_FE,
        },
      };

      smtpTransport.sendMail(data);

      await Booking.findByIdAndRemove(req.body.idBooking);

      return res.status(200).json({
        data: docs,
        message: 'Tiếp nhận người dùng thành công!',
      });
    }
  });
};

export const removeBooking = async (req, res) => {
  await Booking.findByIdAndRemove(req.body.idBooking, (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({
        error: 'Xóa đặt cọc không thành công!',
      });
    } else {
      return res.status(200).json({
        error: 'Xóa đặt cọc thành công!',
      });
    }
  });
};
