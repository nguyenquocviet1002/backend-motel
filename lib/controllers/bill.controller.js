const Bill = require('../models/bill.model');
const Room = require('../models/room.model');
const House = require('../models/house.model');
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const _ = require('lodash');

const getBillRoom = async (req, res, next) => {
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
          const invoiceService = { serviceName: 'Tiền nhà', amount: price };
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
                    return { name: value.name, price: value.price };
                  });
                  _.assignIn(service, { item });
                  BillService.find({ idRoom: dataList.idRoom, idHouse: dataList.idHouse, month: req.body.month, year: req.body.year }).exec(
                    (err, data) => {
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
                          serviceName: `Tiền ${value.name} ${value.inputValue ? `(Số ${value.name} cũ ${value.inputValue}` : ''
                            } ${value.outputValue ? `, Số ${value.name} mới ${value.outputValue})` : ''} `,
                          amount: value.price * (amountUse !== undefined ? amountUse : 1),
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
                    },
                  );
                } catch (err) {
                  error: err;
                }
              });
            }
          });
        }
        else {
          billHa = []
        }
      }
    });
  }
  setTimeout(() => {
    if (billHa.length !== 0) {
      billHa.map(item => {
        const { idRoom, month, year } = item;
        Bill.find({ idRoom: idRoom, month: month, year: year }).exec((err, data) => {
          if (data.length == 0) {
            Bill.insertMany(item)
          }
          else {
            Bill.deleteMany({ "_id": data[0]._id }, (err, data) => {
            })
            Bill.insertMany(item)
          }
        })
      })
      return res.status(200).json({ data: billHa });
    }
    else {
      return res.status(200).json({ data: billHa });
    }
  }, 1000)
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

const read = (req, res) => {
  return res.json(req.dataBill);
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


const getBillHouse = async (req, res, next) => {
  let billHa = [];
  await Room.find({ idHouse: req.params.idHouse }).exec((err, data) => {
    if (data.length == 0) {
      return res.status(400).json({
        message: 'Không tìm thấy dữ liệu',
      });
    }
    else {
      let value = _.mapValues(data, '_id');
      for (let i = 0; i < Object.keys(value).length; i++) {
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
              const invoiceService = { serviceName: 'Tiền nhà', amount: price };
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
                        return { name: value.name, price: value.price };
                      });
                      _.assignIn(service, { item });
                      BillService.find({ idRoom: dataList.idRoom, idHouse: dataList.idHouse, month: req.body.month, year: req.body.year }).exec(
                        (err, data) => {
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
                              serviceName: `Tiền ${value.name} ${value.inputValue ? `(Số ${value.name} cũ ${value.inputValue}` : ''
                                } ${value.outputValue ? `, Số ${value.name} mới ${value.outputValue})` : ''} `,
                              amount: value.price * (amountUse !== undefined ? amountUse : 1),
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
                        },
                      );
                    } catch (err) {
                      error: err;
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  })
  setTimeout(() => {
    if (billHa.length !== 0) {
      billHa.map(item => {
        const { idRoom, month, year } = item;
        Bill.find({ idRoom: idRoom, month: month, year: year }).exec((err, data) => {
          if (data.length == 0) {
            Bill.insertMany(item)
          }
          else {
            Bill.deleteMany({ "_id": data[0]._id }, (err, data) => {
            })
            Bill.insertMany(item)
          }
        })
      })
      return res.status(200).json({ data: billHa });
    }
  }, 1000)
}

module.exports = { getBillRoom, getBillAll, getBillId, read, removeBill, getBillHouse };
