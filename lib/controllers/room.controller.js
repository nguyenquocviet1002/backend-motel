import Room from '../models/room.model';
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');

import { errorHandler } from '../helpers/dbErrorsHandler';
import _ from 'lodash';

export const listRoom = async (req, res) => {
  if (!req.params.idHouse || !req.params.idAuth) {
    return res.status(400).json({
      error: 'Phải điền đầy đủ thông tin bắt buộc',
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

export const getRoomById = async (req, res) => {
  if (!req.params.idRoom.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'Có lỗi sảy ra',
    });
  }
  if (req.params.idRoom.match(/^[0-9a-fA-F]{24}$/)) {
    await Room.findById(req.params.idRoom, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Có lỗi sảy ra',
        });
      }
      if (data == null) {
        return res.status(400).json({
          error: 'Phòng không tồn tại',
        });
      } else {
        return res.status(200).json({
          data: data,
        });
      }
    });
  } else {
    return res.status(400).json({
      error: 'Thiếu parameter',
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
  });

  // await listServiceByIdHouse;

  const addAllBillService = async (idRoom) => {
    await Service.find({ idHouse: req.body.idHouse }, async (err, data) => {
      const d = new Date();
      if (data) {
        await data.map(async (item) => {
          const inputValue = 0;
          const outputValue = 0;
          const data = new BillService({
            idRoom: idRoom,
            idHouse: item.idHouse,
            name: item.name,
            month: d.getMonth() + 1,
            year: d.getFullYear(),
            inputValue,
            outputValue,
            price: item.price,
            unit: item.unit,
            idHouse: req.idHouse,
            amount: (outputValue - inputValue) * item.price,
          });

          try {
            await data.save();
          } catch (error) {
            return res.status(400).json({ massage: 'Có lỗi sảy ra' });
          }
        });
      }
    });
  };

  await data.save((err, data) => {
    if (data) {
      addAllBillService(data._id);
      return res.status(200).json({
        message: 'Đã tạo phòng thành công!',
        data,
      });
    }
    if (err) {
      return res.status(400).json({ err: err, massage: ' Tạo phòng không thành công' });
    }
  });
};

export const updateRoom = async (req, res) => {
  await Room.find({ idHouse: req.body.idHouse, name: req.body.name }, async (err, docs) => {
    if (docs.length == 0) {
      if (req.params.idRoom) {
        await Room.findByIdAndUpdate(req.params.idRoom, { ...req.body }, (err, docs) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {
            return res.status(200).json({
              message: 'Cập nhật phòng thành công',
              docs: docs,
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Thiếu parameter',
        });
      }
    } else {
      return res.status(400).json({
        error: 'Cập nhật phòng không thành công',
        docs: docs,
      });
    }
  });
};

export const removeById = async (req, res) => {
  if (req.params.idRoom) {
    await Room.findByIdAndRemove(req.params.idRoom, (err, docs) => {
      if (err) {
        return res.status(400).json({
          error: 'Phòng không tồn tại',
        });
      } else {
        return res.status(200).json({
          error: 'Xóa phòng thành công',
          docs: docs,
        });
      }
    });
  } else {
    return res.status(400).json({
      error: 'Thiếu parameter',
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

export const addMember = (req, res) => {
  const idRoom = req.params.idRoom;
  if (idRoom) {
    Room.findById(idRoom, (err, data) => {
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
            return res.status(200).json({ message: 'Thêm thành viên thành công' });
          });
        }
      }
    });
  }
};

export const removeMember = (req, res) => {
  const idRoom = req.params.idRoom;
  if (idRoom) {
    Room.findById(idRoom, (err, data) => {
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
