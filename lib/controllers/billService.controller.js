const House = require('../models/house.model');
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const Room = require('../models/room.model');
const _ = require('lodash');

export const checkAuth = async (req, res, next) => {};

export const checkRequire = async (req, res, next) => {
  const body = req.body;

  //check require
  const { idRoom, idHouse, name, month, year, inputValue, outputValue } = body;
  if (!idRoom || !idHouse || !name || !month || !year || !inputValue || !outputValue) {
    return res.status(400).json({
      message: 'Cần điền đầy đủ thông tin',
    });
  }

  await BillService.find({ idHouse, name, month, year }, async (err, docs) => {
    if (err) {
      return res.status(400).json({
        message: 'Có lỗi sảy ra',
      });
    }
    if (docs.length > 0) {
      return res.status(400).json({
        message: 'Bill đã tồn tại',
        docs: docs,
      });
    } else {
      await Service.findOne({ idHouse: idHouse, name: name }, (err, data) => {
        if (err || !data) {
          return res.status(400).json({
            message: 'Không tìm thấy dịch vụ ',
          });
        } else {
          req.price = data.price;
          req.unit = data.unit;
          req.idHouse = data.idHouse;
          next();
        }
      });
    }
  });
};

export const checkValue = (req, res, next) => {
  const body = req.body;

  if (!body.idHouse || !body.name || !body.price || !body.unit) {
    return res.status(400).json({
      error: 'Cần điền đầy đủ thông tin dịch vụ! Vui lòng kiểm tra lại',
    });
  }

  if (body.inputValue < 1 || body.outputValue < 1) {
    return res.status(400).json({
      error: 'Giá của đầy vào và ra ít nhất là 1',
    });
  }

  if (body.inputValue > body.outputValue) {
    return res.status(400).json({
      error: 'Giá trị đầu vào không thể lớn hơn giá trị đầu ra',
    });
  }

  if (body.idService) {
    Service.find({ id: body.idService, name: 'Nước' }, (err, data) => {
      if (err || !data) {
        return res.status(400).json({
          err,
          message: 'Không tìm thấy dịch vụ',
        });
      } else {
        console.log(data);
      }
    });
  }
  //   req.amou;
  //   next();
};

export const getServiceHouse = async (req, res, next) => {
  if (req.body.idHouse) {
    Service.findOne({ idHouse: req.body.idHouse, name: req.body.name }, (err, data) => {
      if (err || !data) {
        return res.status(400).json({
          err,
          message: 'Không tìm thấy dịch vụ',
        });
      } else {
        req.price = data.price;
        req.unit = data.unit;
        next();
      }
    });
  } else {
    return res.status(400).json({
      message: 'Không tìm thấy dịch vụ',
    });
  }
};

export const addBillService = async (req, res) => {
  const body = req.body;

  const { idRoom, idHouse, name, month, year, inputValue, outputValue } = body;

  const data = new BillService({
    idRoom,
    idHouse,
    name,
    month,
    year,
    inputValue,
    outputValue,
    price: req.price,
    unit: req.unit,
    idHouse: req.idHouse,
    amount: (outputValue - inputValue) * req.price,
  });

  try {
    const dataToSave = await data.save();
    return res.status(200).json({ message: 'Thêm hóa đơn thành công', dataToSave });
  } catch (error) {
    return res.status(400).json({ massage: 'Thêm hóa đơn không thành công' });
  }
};

export const editBillService = async (req, res) => {
  const { inputValue, outputValue, name } = req.body;

  if (req.params.idBillService) {
    await BillService.findById(req.params.idBillService, async (err, data) => {
      if (err || !data) {
        return res.status(400).json({
          message: 'Không tìm thấy dịch vụ',
        });
      }
      await BillService.findOneAndUpdate(
        { _id: req.params.idBillService, name },
        { inputValue, outputValue, amount: (outputValue - inputValue) * data.price },
        (err, docs) => {
          if (err || !docs) {
            return res.status(400).json({
              message: 'Không tìm thấy dịch vụ',
            });
          } else {
            return res.status(200).json({
              docs,
              message: 'Cập nhật bill dịch vụ thành công',
            });
          }
        },
      );
    });
  } else {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }
};

export const getListService = async (req, res) => {
  if (!req.params.idHouse || !req.params.type || !req.params.month || !req.params.year) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  } else {
    await BillService.find(
      { idHouse: req.params.idHouse, name: req.params.type, month: req.params.month, year: req.params.year },
      (err, docs) => {
        if (err) {
          return res.status(400).json({
            err,
          });
        } else {
          return res.status(200).json({
            data: docs,
          });
        }
      },
    );
  }
};

export const createAllBillForHouse = async (req, res) => {
  const { idHouse, name, month, year, data } = req.body;

  const formatMonthUp = (Dmonth) => {
    if (Dmonth == 12) {
      return 1;
    }
    if (Dmonth < 12) {
      return Dmonth + 1;
    }
  };

  const formatYearUp = (year) => {
    if (month == 12) {
      return year + 1;
    }
    if (month < 12) {
      return year;
    }
  };

  const checkDataNextMonth = await BillService.find({
    idHouse,
    name,
    month: formatMonthUp(month),
    year: formatYearUp(year),
  });

  if (!idHouse || !name || !month || !year || !data) {
    return res.status(400).json({
      error: 'Cần điền đầy đủ thông tin! Vui lòng kiểm tra lại',
    });
  }
  const { price, unit } = req;

  const newData = data.map((data) => {
    return { ...data, idHouse, name, month, year, price, unit, amount: (data.outputValue - data.inputValue) * price };
  });
  const dataNextMonth = data.map((data) => {
    return {
      idRoom: data.idRoom,
      inputValue: data.outputValue,
      outputValue: 0,
      idHouse,
      name,
      nameRoom: data.nameRoom,
      month: formatMonthUp(month),
      year: formatYearUp(year),
      price,
      unit,
      amount: 0,
    };
  });

  try {
    if (checkDataNextMonth.length === 0) {
      await BillService.deleteMany(
        { idHouse, name, month: formatMonthUp(month), year: formatYearUp(year) },
        async (err, docs) => {
          if (err) {
            return res.status(400).json({ err, message: 'Thêm hoá đơn không thành công' });
          } else {
            await BillService.insertMany(dataNextMonth);
          }
        },
      );
    }

    await BillService.deleteMany({ idHouse, name, month, year }, async (err, docs) => {
      if (err) {
        return res.status(400).json({ err, message: 'Thêm hoá đơn không thành công' });
      } else {
        const dataToSave = await BillService.insertMany(newData);
        return res.status(200).json(dataToSave);
      }
    });
  } catch (error) {
    return res.status(400).json({ massage: 'Thêm hợp đồng không thành công' });
  }
};

export const findHouse = (req, res, next, id) => {
  House.findById(id, (err, data) => {
    if (err || !data) {
      return res.status(400).json({
        message: 'Không tìm thấy dữ liệu',
      });
    }
    next();
  });
};

export const getAllBillByMonthYear = async (req, res) => {
  const { type, idHouse, month, year } = req.params;

  // const listHouse = await House.findById(idHouse);
  // const listBilll = await BillService.find({ idHouse, month, year, name: type });

  //lamf nốt trường hợp mới thêm nhà thì n sẽ tự thêm vào bill vói value 0
  console.log('idHouse', idHouse);
  if (!idHouse || !month || !year) {
    return res.status(404).json({
      error: 'Thiếu thông tin',
    });
  } else {
    await BillService.find({ idHouse, month, year, name: type }, async (err, docs) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      } else {
        await BillService.find({ name: type, idHouse, month, year }, (err, docs) => {
          if (err) {
            return res.status(400).json({
              err,
            });
          } else {
            return res.status(200).json({
              docs,
            });
          }
        });
      }
    });
  }
};
