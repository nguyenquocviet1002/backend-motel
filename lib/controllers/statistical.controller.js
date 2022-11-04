const Room = require('../models/room.model');
const BillService = require('../models/billService.model');
const _ = require('lodash');

export const getAllStatusRoom = async (req, res) => {
  try {
    await Room.find({ idHouse: req.params.idHouse, status: true }, (error, rooms) => {
      if (rooms) {
        req.HouseActive = rooms.filter((room) => room.listMember.length > 0);
        req.HouseNotMember = rooms.length - req.HouseActive.length;
        req.numberMemberInHouse = req.HouseActive.reduce((prev, curr) => prev + curr.listMember.length, 0);
      }
      if (error || !rooms) {
        req.HouseActive = 0;
        req.HouseNotMember = 0;
      }
    });

    await Room.find({ idHouse: req.params.idHouse, status: false }, (error, room) => {
      if (room) {
        req.HouseNotActive = room.length;
      }
      if (error || !room) {
        req.HouseNotActive = 0;
      }
    });
    return res.status(200).json({
      data: {
        HouseNotActive: req.HouseNotActive,
        HouseNotMember: req.HouseNotMember,
        HouseMember: req.HouseActive.length,
        countRoom: req.HouseNotActive + req.HouseNotMember + req.HouseActive.length,
        numberMemberInHouse: req.numberMemberInHouse,
      },
    });
  } catch (error) {
    return res.status(404).json({
      error: 'Không tìm thấy dữ liệu',
    });
  }
};

export const getAllBillServiceByYear = async (req, res) => {
  if (!req.params.year || req.params.year < 1) {
    return res.status(400).json({
      error: 'Năm không hợp lệ!',
    });
  }
  if (!req.params.name) {
    return res.status(400).json({
      error: 'Tên dịch vụ không hợp lệ!',
    });
  }
  await BillService.find({ idHouse: req.params.idHouse, name: req.params.name, year: req.params.year }, (err, docs) => {
    if (docs) {
      console.log('docs', docs);
      const newData = [
        {
          value:
            docs.filter((perfectitem) => 1 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 1 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 2 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 2 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 3 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 3 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 4 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 4 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 5 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 5 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 6 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 6 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0) -
            docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 9 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 9 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 10 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 10 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 11 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 11 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
        {
          value:
            docs.filter((perfectitem) => 12 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
            docs.filter((perfectitem) => 12 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        },
      ];

      return res.status(200).json({
        data: newData,
      });
    } else {
      return res.status(400).json({
        error: err,
      });
    }
  });
};
