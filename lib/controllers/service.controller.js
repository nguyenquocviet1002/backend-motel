import Room from '../models/room.model';
const House = require('../models/house');

export const createBill = async (req, res) => {
  if (req.params.typeService) {
    return res.status(400).json({
      error: 'Chưa có param',
    });
  }
  const dataBody = req.body;
  if (
    !dataBody.idRoom ||
    !dataBody.roomId ||
    !dataBody.year ||
    !dataBody.month ||
    !dataBody.firstValue ||
    !dataBody.lastValue ||
    // !dataBody.consumed ||
    !dataBody.unit ||
    !dataBody.toPrice
  ) {
    return res.status(400).json({
      error: 'Phải điền đầy đủ thông tin bắt buộc',
    });
  }

  await House.find({ idHouse: dataBody.idHouse }, (error, room) => {
    if (room) {
      let m;
    }
  });
};
