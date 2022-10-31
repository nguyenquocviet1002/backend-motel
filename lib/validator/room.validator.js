const House = require('../models/house.model');
import Room from '../models/room.model';

export const checkBeforAddRoom = async (req, res, next) => {
  if (req.body.idHouse) {
    await House.findById(req.body.idHouse, (err, house) => {
      if (err || !house) {
        return res.status(400).json({
          error: 'Nhà không tồn tại',
        });
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
