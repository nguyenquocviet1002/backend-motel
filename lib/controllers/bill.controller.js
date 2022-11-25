const Bill = require('../models/bill.model');
const Room = require('../models/room.model');
const House = require('../models/house.model');
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const _ = require('lodash');

const createBillRoom = async (req, res, next) => {
  let billHa = [];
  let value = req.body.idRooms;
  for (let i = 0; i < value.length; i++) {
    let dataList = {};
    Room.findById(value[i]).exec((err, data) => {
      if (err || !data) {
        return res.status(400).json({
          message: 'Không tìm thấy dữ liệu',
        });
      } else {
        if (data.listMember.length !== 0) {
          const { name, idHouse, _id, price, listMember } = data;
          const customerIndex = _.findKey(listMember, ['status', true]);
          const customerName = customerIndex ? listMember[customerIndex].memberName : '';
          const invoiceService = { serviceName: 'Tiền Nhà', amount: price };
          _.assignIn(dataList, {
            idRoom: _id,
            roomName: name,
            month: req.body.month,
            year: req.body.year,
            memberName: customerName,
            invoiceService,
          });
          House.findById(idHouse).exec((err, data) => {
            if (err || !data) {
              return res.status(400).json({
                message: 'Không tìm thấy dữ liệu',
              });
            } else {
              const { name, address, _id, idAuth } = data;
              _.assignIn(dataList, { idHouse: _id, houseName: name, address: address, idAuth: idAuth });
              // ------------------------------------------------
              let service = {};
              let invoiceServices = {};
              Service.find({ idHouse: dataList.idHouse }).exec((err, docs) => {
                try {
                  const item = docs.map((value) => {
                    return { label: value.label, price: value.price, type: value.type, label: value.label };
                  });
                  _.assignIn(service, { item });
                  BillService.find({
                    idRoom: dataList.idRoom,
                    idHouse: dataList.idHouse,
                    month: req.body.month,
                    year: req.body.year,
                  }).exec((err, data) => {
                    const detail = data.map((detail) => {
                      return {
                        name: detail.name,
                        amount: detail.amount,
                        inputValue: detail.inputValue,
                        outputValue: detail.outputValue,
                      };
                    });
                    _.assignIn(service, { detail });

                    const result = _.merge(service.item, service.detail);
                    const invoiceService1 = result.map((value) => {
                      let amountUse;
                      if (value.inputValue || value.outputValue) {
                        amountUse = value.outputValue - value.inputValue;
                      }
                      console.log('amountUse', amountUse);

                      return {
                        serviceName: `Tiền ${value.label} `,
                        amount: !value.type ? value.price : value.price * (amountUse !== undefined ? amountUse : 0),
                      };
                    });

                    _.assignIn(invoiceServices, { invoiceService1 });
                    // ---------------------
                    const { invoiceService } = dataList;
                    const no = { invoiceService: [invoiceService] };
                    const other = _.concat(no.invoiceService, invoiceServices.invoiceService1);
                    const data2d = _.assignIn(dataList, { invoiceService: other });
                    const dataSave = new Bill(data2d);
                    billHa.push(dataSave);
                  });
                } catch (err) {
                  message: err;
                }
              });
            }
          });
        } else {
          billHa = [];
        }
      }
    });
  }
  setTimeout(() => {
    if (billHa.length !== 0) {
      billHa.map((item) => {
        const { idRoom, month, year } = item;

        Bill.findOne({
          idRoom: idRoom,
          month: month == 1 ? '12' : (Number(month) - 1).toString(),
          year: month == 1 ? (Number(year) - 1).toString() : year,
        }).exec((err, data1) => {
          if (data1 == null) {
            Bill.insertMany(item);
          } else {
            Bill.find({ idRoom: idRoom, month: month, year: year }).exec(async (err, data) => {
              const { invoiceService, paidAmount, debt } = data1;

              const newItem = {
                paymentStatus: item.paymentStatus,
                paidAmount: 0,
                debt: invoiceService.reduce((prev, curr) => prev + curr.amount, 0) + debt - paidAmount,
                idRoom: item.idRoom,
                roomName: item.roomName,
                month: item.month,
                year: item.year,
                memberName: item.memberName,
                invoiceService: item.invoiceService,
                idHouse: item.idHouse,
                houseName: item.houseName,
                address: item.address,
                idAuth: item.idAuth,
              };
              if (data.length != 0) {
                Bill.deleteMany({ _id: data[0]._id }, (err, data) => {});
                Bill.insertMany(newItem);
              } else {
                Bill.insertMany(newItem);
              }
            });
          }
        });
      });
      return res.status(200).json({ data: billHa });
    } else {
      return res.status(200).json({ data: billHa });
    }
  }, 1000);
};

const getBillAll = async (req, res) => {
  await Bill.find({ idAuth: req.params.idAuth, year: req.params.year, month: req.params.month }).exec((err, data) => {
    if (data.length == 0) {
      res.status(200).json({
        message: 'Không có dữ liệu',
      });
    } else {
      res.status(200).json({
        data: data,
      });
    }
  });
};

const getBillId = (req, res, next, id) => {
  Bill.findById(id).exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        message: 'Không tìm thấy dữ liệu',
      });
    }
    req.dataBill = data;
    next();
  });
};

const getBillIdRoom = (req, res) => {
  Bill.find({ idRoom: req.params.idRoom, year: req.params.year, month: req.params.month }).exec((err, data) => {
    if (data.length == 0) {
      return res.status(200).json({
        message: 'Không tìm thấy dữ liệu',
      });
    } else {
      return res.status(200).json({
        data: data,
      });
    }
  });
};

const read = async (req, res) => {
  await Bill.findById(req.params.id, (err, docs) => {
    if (docs) {
      return res.status(200).json(docs);
    } else {
      return res.status(400).json({
        message: 'Không tìm thấy thông tin hóa đơn',
      });
    }
  });
};

const removeBill = (req, res) => {
  let bill = req.dataBill;
  bill.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        message: 'Xóa không thành công',
      });
    }
    res.json({
      data,
      message: 'Xóa thành công',
    });
  });
};

const createBillHouse = async (req, res, next) => {
  let billHa = [];
  await Room.find({ idHouse: req.params.idHouse }).exec((err, data) => {
    if (data.length == 0) {
      return res.status(400).json({
        message: 'Không tìm thấy dữ liệu',
      });
    } else {
      let value = _.mapValues(data, '_id');
      for (let i = 0; i < Object.keys(value).length; i++) {
        let dataList = {};
        Room.findById(value[i]).exec(async (err, data) => {
          if (err || !data) {
            return res.status(400).json({
              message: 'Không tìm thấy dữ liệu',
            });
          } else {
            if (data.listMember.length !== 0) {
              const { name, idHouse, _id, price, listMember } = data;
              const customerIndex = _.findKey(listMember, ['status', true]);
              const customerName = customerIndex ? listMember[customerIndex].memberName : '';
              const invoiceService = { serviceName: 'Tiền Nhà', amount: price };
              _.assignIn(dataList, {
                idRoom: _id,
                roomName: name,
                month: req.body.month,
                year: req.body.year,
                memberName: customerName,
                invoiceService,
              });
              await House.findById(idHouse).exec(async (err, data) => {
                if (err || !data) {
                  return res.status(400).json({
                    message: 'Không tìm thấy dữ liệu',
                  });
                } else {
                  const { name, address, _id, idAuth } = data;
                  _.assignIn(dataList, { idHouse: _id, houseName: name, address: address, idAuth: idAuth });
                  // ------------------------------------------------
                  let service = {};
                  let invoiceServices = {};
                  await Service.find({ idHouse: dataList.idHouse }).exec((err, docs) => {
                    try {
                      const item = docs.map((value) => {
                        return { name: value.name, price: value.price, type: value.type, label: value.label };
                      });
                      _.assignIn(service, { item });
                      BillService.find({
                        idRoom: dataList.idRoom,
                        idHouse: dataList.idHouse,
                        month: req.body.month,
                        year: req.body.year,
                      }).exec((err, data) => {
                        const detail = data.map((detail) => {
                          return {
                            name: detail.name,
                            amount: detail.amount,
                            inputValue: detail.inputValue,
                            outputValue: detail.outputValue,
                          };
                        });
                        _.assignIn(service, { detail });
                        const result = _.merge(service.item, service.detail);
                        const invoiceService1 = result.map((value) => {
                          let amountUse;
                          if (value.inputValue || value.outputValue) {
                            amountUse = value.outputValue - value.inputValue;
                          }

                          return {
                            serviceName: `Tiền ${value.label} `,
                            amount: !value.type ? value.price : value.price * (amountUse !== undefined ? amountUse : 0),
                          };
                        });
                        _.assignIn(invoiceServices, { invoiceService1 });
                        // ---------------------
                        const { invoiceService } = dataList;
                        const no = { invoiceService: [invoiceService] };
                        const other = _.concat(no.invoiceService, invoiceServices.invoiceService1);
                        const data2d = _.assignIn(dataList, { invoiceService: other });
                        const dataSave = new Bill(data2d);
                        billHa.push(dataSave);
                      });
                    } catch (err) {
                      message: err;
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
  setTimeout(() => {
    if (billHa.length !== 0) {
      billHa.map((item) => {
        const { idRoom, month, year } = item;

        Bill.findOne({
          idRoom: idRoom,
          month: month == 1 ? '12' : (Number(month) - 1).toString(),
          year: month == 1 ? (Number(year) - 1).toString() : year,
        }).exec((err, data1) => {
          if (data1 == null) {
            Bill.insertMany(item);
          } else {
            Bill.find({ idRoom: idRoom, month: month, year: year }).exec(async (err, data) => {
              const { invoiceService, paidAmount, debt } = data1;

              const newItem = {
                paymentStatus: item.paymentStatus,
                paidAmount: 0,
                debt: invoiceService.reduce((prev, curr) => prev + curr.amount, 0) + debt - paidAmount,
                idRoom: item.idRoom,
                roomName: item.roomName,
                month: item.month,
                year: item.year,
                memberName: item.memberName,
                invoiceService: item.invoiceService,
                idHouse: item.idHouse,
                houseName: item.houseName,
                address: item.address,
                idAuth: item.idAuth,
              };
              if (data.length != 0) {
                Bill.deleteMany({ _id: data[0]._id }, (err, data) => {});
                Bill.insertMany(newItem);
              } else {
                Bill.insertMany(newItem);
              }
            });
          }
        });
      });
      return res.status(200).json({ data: billHa });
    }
  }, 1000);
};

const updateBill = async (req, res) => {
  // console.log('req.body', req.body);
  await Bill.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, async (err, data) => {
    const { idRoom, paidAmount, invoiceService, month, year } = req.body;
    const SumValue = invoiceService.reduce((prev, curr) => prev + curr.amount, 0);

    if (err || !data) {
      return res.status(400).json({ message: 'Không tìm thấy dữ liệu' });
    } else {
      await Bill.findOneAndUpdate(
        {
          idRoom: idRoom,
          month: month == 12 ? '1' : (Number(month) + 1).toString(),
          year: month == 12 ? (Number(year) + 1).toString() : year,
        },
        { debt: SumValue - paidAmount },
      );
      return res.status(200).json({ data: data });
    }
  });
};

module.exports = {
  createBillRoom,
  getBillAll,
  getBillId,
  read,
  removeBill,
  createBillHouse,
  updateBill,
  getBillIdRoom,
};
