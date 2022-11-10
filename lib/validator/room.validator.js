const House = require('../models/house.model');
import { toLowerCaseNonAccentVietnamese } from '../validator';
import Room from '../models/room.model';
const { v1: uuidv1 } = require('uuid');

export const checkBeforAddRoom = async (req, res, next) => {
  if (req.body.idHouse) {
    await House.findById(req.body.idHouse, (err, house) => {
      if (err || !house) {
        return res.status(400).json({
          error: 'Nhà không tồn tại',
        });
      } else {
        const format2 = toLowerCaseNonAccentVietnamese(req.body.name);
        const matches2 = format2.match(/\b(\w)/g);
        const newNameRoom = matches2.join('');

        const format1 = toLowerCaseNonAccentVietnamese(house.name);
        const matches1 = format1.match(/\b(\w)/g);
        const newNameHouse = matches1.join('');

        const newName = `${newNameHouse}_${newNameRoom}_${uuidv1().slice(-5)}`;

        req.nameRoom = newName;
      }
    });
  }

  if (
    !req.body.name ||
    !req.body.maxMember ||
    !req.body.idAuth ||
    !req.body.idHouse ||
    !req.body.price ||
    !req.body.area
  ) {
    return res.status(400).json({
      error: 'Phải điền đầy đủ thông tin bắt buộc',
    });
  }

  if (req.body.idHouse) {
    await Room.find({ idHouse: req.body.idHouse }, async (err, house) => {
      if (house) {
        req.checkEmpty = house.find((element) => element.name == req.body.name);
      }
    });
  }

  next();
};

export const checkEmptyRoom = (req, res, next) => {
  if (req.checkEmpty) {
    return res.status(400).json({ massage: 'Tên phòng đã tồn tại !' });
  } else {
    next();
  }
};

export const checkEmptyCodeRoom = async (req, res, next) => {
  const ValidatorCodeRoom = /^[a-zA-Z0-9&@.$%\-_,():;`]+$/;

  if (req.body.idRoom || req.body.codeRoom) {
    await Room.find({ subName: req.body.codeRoom }, (err, docs) => {
      if (err) {
        return res.status(400).json({
          error: 'Có lỗi sảy ra',
        });
      }
      if (docs.length) {
        return res.status(400).json({
          error: 'Mã đăng nhập của người thuê đã tồn tại',
        });
      }
      if (!docs.length) {
        if (ValidatorCodeRoom.test(req.body.codeRoom)) {
          next();
        } else {
          return res.status(400).json({
            message: 'Mã đăng nhập của người dùng không đúng định dang!',
          });
        }
      } else {
        return res.status(400).json({
          error: 'Có lỗi sảy ra',
        });
      }
    });
  } else {
    return res.status(400).json({
      error: 'Thiếu mã đăng nhập',
    });
  }
};
