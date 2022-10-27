import Room from '../models/room.model';
import { errorHandler } from '../helpers/dbErrorsHandler';
import _ from 'lodash';
const House = require('../models/house.model');

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
  if (req.body.idHouse) {
    await House.findById(req.body.idHouse, (err, house) => {
      if (err || !house) {
        return res.status(400).json({
          error: 'Nhà không tồn tại',
        });
      }
    });
  }

  if (!data.name || !data.maxMember || !data.idAuth || !data.idHouse || !data.price || !data.area) {
    return res.status(400).json({
      error: 'Phải điền đầy đủ thông tin bắt buộc',
    });
  }

  try {
    const dataToSave = await data.save();
    return res.status(200).json(dataToSave);
  } catch (error) {
    return res.status(400).json({ massage: 'Phòng đã tồn tại . Tạo phòng không thành công' });
  }
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
          Room.findOneAndUpdate({ _id: idRoom }, { $push: req.body }, (err) => {
            if (err) {
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
  // Room.update(
  //   { _id: req.params.id, listMember: { $elemMatch: { id: req.body.id } } },
  //   {
  //     $set: {
  //       'listMember.$.memberName': req.body.memberName,
  //       'listMember.$.cardNumber:': req.body.cardNumber,
  //       'listMember.$.phoneNumber:': req.body.phoneNumber,
  //       'listMember.$.status:': req.body.status
  //     }
  //   }, { 'new': true, 'safe': true, 'upsert': true }, (err, data) => {
  //     console.log('error', err);
  //     console.log('date', data)
  //   }
  // )
};
