const Room = require('../models/room.model');
const BillService = require('../models/billService.model');
const _ = require('lodash');

export const getAllStatusRoom = async (req, res) => {
  await Room.find({ idHouse: req.params.idHouse }, async (error, rooms) => {
    if (rooms) {
      const roomNotReady = rooms.filter((item) => item.status == false);
      const roomReadyUsing = rooms.filter((item) => item.status == true && item.listMember.length);
      const roomReadyEmpty = rooms.filter((item) => item.status == true && !item.listMember.length);
      const numberMemberInHouse = roomReadyUsing.reduce((prev, curr) => prev + curr.listMember.length, 0);

      return res.status(200).json({
        roomNotReady: roomNotReady.length,
        roomReadyUsing: roomReadyUsing.length,
        roomReadyEmpty: roomReadyEmpty.length,
        numberMemberInHouse,
      });
    }
    if (error || !rooms) {
      return res.status(400).json({
        error: 'Không có dữ liệu',
      });
    }
  });
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
        docs.filter((perfectitem) => 1 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 1 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 2 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 2 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 3 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 3 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 4 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 4 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 5 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 5 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 6 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 6 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0) -
          docs.filter((perfectitem) => 7 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 9 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 9 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 10 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 10 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 11 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 11 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
        docs.filter((perfectitem) => 12 == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
          docs.filter((perfectitem) => 12 == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0),
        ,
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

export const getBillServiceByYear = async (req, res) => {};
