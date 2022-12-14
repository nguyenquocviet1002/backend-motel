import Room from '../models/room.model';
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const Booking = require('../models/booking.model');
const Bill = require('../models/bill.model');

import { errorHandler } from '../helpers/dbErrorsHandler';

import _ from 'lodash';

const nodemailer = require('nodemailer');
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

export const listRoom = async (req, res) => {
  if (!req.params.idHouse || !req.params.idAuth) {
    return res.status(400).json({
      message: 'Phải điền đầy đủ thông tin bắt buộc',
    });
  }

  await Room.find({ idHouse: req.params.idHouse }, (error, room) => {
    if (room) {
      return res.status(200).json({
        data: room,
      });
    }
  });
};

export const getRoomBySubName = async (req, res) => {
  await Room.findOne({ subName: req.params.subname }, (err, data) => {
    if (err || !data) {
      return res.status(400).json({
        message: 'Phòng không tồn tại',
      });
    } else {
      return res.status(200).json({
        data: data,
      });
    }
  });
};

export const getRoomById = async (req, res) => {
  if (!req.params.idRoom.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: 'Có lỗi sảy ra',
    });
  }
  if (req.params.idRoom.match(/^[0-9a-fA-F]{24}$/)) {
    await Room.findById(req.params.idRoom, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Có lỗi sảy ra',
        });
      }
      if (data == null) {
        return res.status(400).json({
          message: 'Phòng không tồn tại',
        });
      } else {
        return res.status(200).json({
          data: data,
        });
      }
    });
  } else {
    return res.status(400).json({
      message: 'Thiếu parameter',
    });
  }
};

export const addRoom = async (req, res) => {
  const data = new Room({
    name: req.body.name,
    status: req.body.status,
    maxMember: req.body.maxMember,
    idAuth: req.body.idAuth,
    idHouse: req.body.idHouse,
    address: req.body.address,
    price: req.body.price,
    area: req.body.area,
    subName: req.nameRoom,
  });
  const addAllBillService = async (idRoom, nameRoom) => {
    await Service.find({ idHouse: req.body.idHouse }, async (err, data) => {
      const d = new Date();
      if (data) {
        const formatMonthUp = (Dmonth) => {
          if (Dmonth == 12) {
            return 1;
          }
          if (Dmonth < 12) {
            return Dmonth + 1;
          }
        };
        const formatYearUp = (year) => {
          if (d.getMonth() == 12) {
            return year + 1;
          }
          if (d.getMonth() < 12) {
            return year;
          }
        };
        // const setNewMont
        await data.map(async (item) => {
          const inputValue = 0;
          const outputValue = 0;
          const data = new BillService({
            idRoom: idRoom,
            nameRoom: nameRoom,
            idHouse: req.body.idHouse,
            name: item.name,
            month: formatMonthUp(d.getMonth()),
            year: formatYearUp(d.getFullYear()),
            inputValue,
            outputValue,
            price: item.price,
            unit: item.unit,
            amount: (outputValue - inputValue) * item.price,
          });
          const dataNextMonth = new BillService({
            idRoom: idRoom,
            nameRoom: nameRoom,
            idHouse: req.body.idHouse,
            name: item.name,
            month: formatMonthUp(d.getMonth() + 1),
            year: formatYearUp(d.getFullYear()),
            inputValue,
            outputValue,
            price: item.price,
            unit: item.unit,
            amount: (outputValue - inputValue) * item.price,
          });
          try {
            await data.save();
            await dataNextMonth.save();
          } catch (error) {
            return res.status(400).json({ massage: 'Có lỗi xảy ra' });
          }
        });
      }
    });
  };
  const addService = async (idHouse) => {
    await Service.find({ idHouse: idHouse }, async (err, docs) => {
      const newData2 = [
        {
          type: true,
          _id: '636c749c038dd74cdcfff3d9',
          idHouse: '636c749b038dd74cdcfff3d7',
          label: 'Mang',
          name: 'mang',
          price: 100,
          unit: 'VNĐ/Khối',
          __v: 0,
        },
        ...docs,
      ];
      const newData = docs.filter((item) => {
        return item.name !== 'dien' && item.name !== 'nuoc';
      });
      let length = newData.length;
      for (let i = 0; i < length; i++) {
        data.service.push(newData[i]);
      }
      await data.save((err, data) => {
        if (data) {
          addAllBillService(data._id, data.name);
          // addService(data.idHouse);
          return res.status(200).json({
            message: 'Đã tạo phòng thành công!',
            data,
          });
        }
        if (err) {
          return res.status(400).json({ err: err, massage: ' Tạo phòng không thành công' });
        }
      });
      // console.log('new', newData);
      // console.log('data', data);
    });
  };
  addService(data.idHouse);
};

export const updateRoom = async (req, res) => {
  await Room.findById(req.body.idRoom, async (err, docs) => {
    if (docs) {
      if (req.params.idRoom) {
        await Room.findByIdAndUpdate(req.params.idRoom, { ...req.body }, async (err, docs) => {
          if (err) {
            return res.status(400).json({
              message: errorHandler(err),
            });
          } else {
            if (req.body.name) {
              await BillService.find({ idRoom: req.body.idRoom }, (err, data) => {
                if (data) {
                  data.map(async (item) => await BillService.findByIdAndUpdate(item._id, { nameRoom: req.body.name }));
                }
              });
            }
            return res.status(200).json({
              message: 'Cập nhật phòng thành công',
              docs: docs,
            });
          }
        });
      } else {
        return res.status(400).json({
          message: 'Thiếu parameter',
        });
      }
    } else {
      return res.status(400).json({
        message: 'Cập nhật phòng không thành công',
        docs: docs,
      });
    }
  });
};

export const removeById = async (req, res) => {
  if (req.params.idRoom) {
    await Room.findByIdAndRemove(req.params.idRoom, async (err, docs) => {
      if (err) {
        return res.status(400).json({
          message: 'Phòng không tồn tại',
        });
      } else {
        await BillService.deleteMany({ idRoom: req.params.idRoom });
        await Service.deleteMany({ idRoom: req.params.idRoom });
        await Booking.deleteMany({ idRoom: req.params.idRoom });
        await Bill.deleteMany({ idRoom: req.params.idRoom });

        return res.status(200).json({
          message: 'Xóa phòng thành công',
          docs: docs,
        });
      }
    });
  } else {
    return res.status(400).json({
      message: 'Thiếu parameter',
    });
  }
};

export const getNameRoom = async (req, res) => {
  await Room.findById(req.params.idRoom, (err, data) => {
    if (err || !data) {
      return res.status(400).json({ message: 'Phòng không tồn tại' });
    } else {
      return res.status(200).json({ name: data.name });
    }
  });
};

export const addMember = async (req, res) => {
  const idRoom = req.params.idRoom;
  if (idRoom) {
    await Room.findById(idRoom, (err, data) => {
      if (err || !data) {
        return res.status(400).json({ message: 'Phòng không tồn tại' });
      } else {
        const { memberName, cardNumber, phoneNumber } = req.body.listMember;
        if (!memberName || !cardNumber || !phoneNumber) {
          return res.status(400).json({ message: 'Chưa nhập đủ dữ liệu' });
        } else {
          Room.findOneAndUpdate({ _id: idRoom, status: true }, { $push: req.body }, (err, data) => {
            if (err || !data) {
              return res.status(400).json({ message: 'Không thể thêm' });
            }
            return res.status(200).json({ data: data, message: 'Thêm thành viên thành công' });
          });
        }
      }
    });
  }
};

export const removeMember = async (req, res) => {
  const idRoom = req.params.idRoom;
  if (idRoom) {
    await Room.findById(idRoom, (err, data) => {
      if (err || !data) {
        return res.status(400).json({ message: 'Phòng không tồn tại' });
      } else {
        const { _id, memberName, cardNumber, phoneNumber } = req.body;
        if (!_id || !memberName || !cardNumber || !phoneNumber) {
          return res.status(400).json({ message: 'Nhập đủ dữ liệu để xóa' });
        } else {
          Room.updateOne({ _id: idRoom }, { $pullAll: { listMember: [req.body] } }, (err) => {
            if (err) {
              return res.status(400).json({ message: 'Không thể xóa' });
            }
            return res.status(200).json({ message: 'Xóa thành viên thành công' });
          });
        }
      }
    });
  }
};

export const updateCodeRoom = async (req, res) => {
  await Room.findByIdAndUpdate(req.body.idRoom, { subName: req.body.codeRoom }, async (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({
        message: 'Cập nhật mã đăng nhập người dùng không thành công!',
      });
    } else {
      const data = {
        to: docs.emailOfAuth,
        from: emailSMTP,
        template: 'change-code-room',
        subject: 'Tiếp nhận phòng trọ',
        context: {
          nameRoom: docs.name,
          codeRoom: docs.subName,
          linkFE: process.env.BASE_FE,
        },
      };

      await smtpTransport.sendMail(data);

      return res.status(200).json({
        message: 'Cập nhật mã người dùng thành công!',
      });
    }
  });
};

export const addServiceRoom = async (req, res) => {
  const idRoom = req.params.idRoom;
  if (idRoom) {
    await Room.findById(idRoom, (err, data) => {
      try {
        if (err || !data) {
          return res.status(400).json({ message: 'Phòng không tồn tại' });
        } else {
          Room.findOneAndUpdate({ _id: idRoom }, { $push: req.body }, async (err, data) => {
            let service = data.service;
            await service.map(async (item) => {
              await Room.findOneAndUpdate(
                { _id: idRoom },
                { $pull: { service: { _id: item._id } } },
                { multi: true },
                (err, data) => {},
              );
            });
            if (err || !data) {
              return res.status(400).json({ message: 'Không thể thêm' });
            }
            return res.status(200).json({ message: 'Thêm dịch vụ thành công' });
          });
        }
      } catch (err) {
        return res.status(500).json({ message: 'Error' });
      }
    });
  }
};
