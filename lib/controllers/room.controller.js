import Room from '../models/room.model';
import { errorHandler } from '../helpers/dbErrorsHandler';
import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';
const House = require('../models/house.model');

export const listRoom = async (req, res) => {
  if (!req.params.idHouse || !req.params.idAuth) {
    return res.status(400).json({
      error: 'Phải điền đầy đủ thông tin bắt buộc',
    });
  }

  await Room.find({ idHouse: req.params.idHouse }, (error, room) => {
    if (room) {
      return res.status(400).json({
        data: room,
      });
    }
  });
};

export const getRoomById = async (req, res) => {
  console.log(req.params.idRoom)
  console.log(req.params.idHouse)
  if (req.params.idRoom) {
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
  });

  if (req.body.idHouse) {
    await House.findById(req.body.idHouse).exec((err, house) => {
      if (err || !house) {
        return res.status(400).json({
          error: 'Nhà không tồn tại',
        });
      }
    });
  }

  // if (req.body.name && req.body.idHouse) {
  //   await Room.find({ name: req.body.name, idHouse: req.body.idHouse }, (error, room) => {
  //     if (room) {
  //       return res.status(400).json({
  //         message: 'Phòng đã tồn tại',
  //       });
  //     }
  //   });
  // }

  if (!data.name || !data.status || !data.maxMember || !data.idAuth || !data.idHouse) {
    return res.status(400).json({
      error: 'Phải điền đầy đủ thông tin bắt buộc',
    });
  }

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ massage: 'Phòng đã tồn tại . Tạo phòng không thành công' });
  }
};

export const updateRoom = async (req, res) => {
  console.log('req.body', req.body);

  // if (!req.body.name || !req.body.status || !req.body.maxMember || !req.body.idAuth || !req.body.idHouse) {
  //   return res.status(400).json({
  //     error: 'Phải điền đầy đủ thông tin bắt buộc',
  //   });
  // }

  console.log('req.param.idRoom', req.params.idRoom);

  if (req.params.idRoom) {
    await Room.findByIdAndUpdate(req.params.idRoom, { ...req.body }, (err, docs) => {
      if (err) {
        return res.status(400).json({
          error: 'Phòng không tồn tại',
        });
      } else {
        return res.status(200).json({
          error: 'Cập nhật phòng thành công',
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
