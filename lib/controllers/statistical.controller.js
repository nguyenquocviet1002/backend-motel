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
      const countRoomsNotUsing = rooms.filter((item) => !item.listMember.length).length;

      return res.status(200).json({
        roomNotReady: roomNotReady.length,
        roomReadyUsing: roomReadyUsing.length,
        roomReadyEmpty: roomReadyEmpty.length,
        numberMemberInHouse,
        countRoomsNotUsing,
      });
    }
    if (error || !rooms) {
      return res.status(400).json({
        message: 'Không có dữ liệu',
      });
    }
  });
};

export const getAllBillServiceByYear = async (req, res) => {
  if (!req.params.year || req.params.year < 1) {
    return res.status(400).json({
      message: 'Năm không hợp lệ!',
    });
  }
  if (!req.params.name) {
    return res.status(400).json({
      message: 'Tên dịch vụ không hợp lệ!',
    });
  }
  await BillService.find({ idHouse: req.params.idHouse, name: req.params.name, year: req.params.year }, (err, docs) => {
    if (docs) {
      function generateTestArray(data) {
        const result = [];
        for (let i = 1; i < 13; ++i) {
          result.push(
            data.filter((perfectitem) => i == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) -
              data.filter((perfectitem) => i == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0) >
              0
              ? data
                  .filter((perfectitem) => i == perfectitem.month)
                  .reduce((prev, curr) => prev + curr.outputValue, 0) -
                  data.filter((perfectitem) => i == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0)
              : 0,
          );
        }
        return result;
      }

      return res.status(200).json({
        data: generateTestArray(docs),
      });
    } else {
      return res.status(400).json({
        message: err,
      });
    }
  });
};

export const getBillServiceByYear = async (req, res) => {
  await BillService.find({ idRoom: req.params.idRoom, name: req.params.name, year: req.params.year }, (err, docs) => {
    if (docs) {
      function generateTestArray(data) {
        const result = [];

        for (let i = 1; i < 13; ++i) {
          result.push(
            data.filter((perfectitem) => i == perfectitem.month).reduce((prev, curr) => prev + curr.outputValue, 0) > 0
              ? data
                  .filter((perfectitem) => i == perfectitem.month)
                  .reduce((prev, curr) => prev + curr.outputValue, 0) -
                  data.filter((perfectitem) => i == perfectitem.month).reduce((prev, curr) => prev + curr.inputValue, 0)
              : 0,
          );
        }
        const SumValue = result.reduce((a, b) => a + b, 0);

        return { result: result, sum: SumValue };
      }

      return res.status(200).json({
        data: generateTestArray(docs),
      });
    } else {
      return res.status(400).json({
        message: err,
      });
    }
  });
};

export const getDetailBillServiceByMonthYear = async (req, res) => {
  await BillService.findOne(
    { idRoom: req.params.idRoom, name: req.params.name, month: req.params.month, year: req.params.year },
    (err, docs) => {
      if (err) {
        return res.status(400).json({
          message: 'Lỗi ',
        });
      }
      if (!docs) {
        return res.status(200).json({
          data: { inputValue: 0, outputValue: 0 },
        });
      } else {
        return res.status(200).json({
          data: { inputValue: docs.inputValue, outputValue: docs.outputValue },
        });
      }
    },
  );
};

export const getStatisHomePage = async (req, res) => {
  return res.status(200).json({
    data: {
      countRoom: req.countRoom,
      countHouse: req.countHouse,
      countUser: req.countUser,
    },
  });
};

export const StatisticalPayment = async (req, res) => {
  return res.status(200).json({
    data: {
      fullPayment: req.FullPayment,
      allPayment: req.AllPayment,
    },
  });
};
