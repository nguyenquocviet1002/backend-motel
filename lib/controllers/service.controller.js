const House = require('../models/house.model');
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const { toLowerCaseNonAccentVietnamese } = require('../validator');

const checkHouse = async (req, res, next) => {
  await House.findById(req.body.idHouse, (err, data) => {
    if (err || !data) {
      return res.status(400).json({
        message: 'Không tìm thấy nhà',
      });
    }
    next();
  });
};

const getOneService = async (req, res) => {
  if (!req.params.idHouse || !req.params.name) {
    return res.status(400).json({
      message: 'Cần điền đầy đủ thông tin dịch vụ! Vui lòng kiểm tra lại',
    });
  }

  try {
    await Service.findOne({ idHouse: req.params.idHouse, name: req.params.name }, (err, data) => {
      if (err || !data) {
        return res.status(400).json({ massage: ' Lấy thông tin dịch vụ không thành công' });
      } else {
        return res.status(200).json({ data });
      }
    });
  } catch (error) {
    return res.status(400).json({ massage: ' Lấy thông tin dịch vụ không thành công' });
  }
};

const addService = async (req, res) => {
  const body = req.body;
  if (!body.idHouse || !body.label || !body.price || !body.unit) {
    return res.status(400).json({
      message: 'Cần điền đầy đủ thông tin dịch vụ! Vui lòng kiểm tra lại',
    });
  }

  if (body.price < 1) {
    return res.status(400).json({
      message: 'Giá của dịch vụ ít nhất là 1',
    });
  }

  try {
    const service = new Service({ ...req.body, name: toLowerCaseNonAccentVietnamese(req.body.label) });
    const dataToSave = await service.save();
    return res.status(200).json({ massage: ' Tạo dịch vụ thành công', data: dataToSave });
  } catch (error) {
    return res.status(400).json({ massage: ' Tạo dịch vụ không thành công' });
  }
};

const getHouseByIdService = async (req, res, next) => {
  if (req.params.idService) {
    await Service.findById(req.params.idService, async (err, docs) => {
      if (err) {
        return res.status(400).json({
          message: 'Có lỗi sảy ra!',
        });
      }
      if (!docs) {
        return res.status(400).json({
          message: 'Không tìm thấy dịch vụ!',
        });
      }
      if (docs) {
        await BillService.find({ idHouse: docs.idHouse, name: docs.name }, (err, docs) => {
          if (err) {
            return res.status(400).json({
              message: 'Có lỗi sảy ra!',
            });
          }
          if (docs) {
            req.listBillServiceNeedToUpdate = docs;
            next();
          }
        });
      } else {
        return res.status(400).json({
          message: 'Có lỗi sảy ra!',
        });
      }
    });
  }
};

const editService = async (req, res) => {
  const body = req.body;
  if (body.price < 1) {
    return res.status(400).json({
      message: 'Giá của dịch vụ ít nhất là 1',
    });
  }

  if (req.params.idService) {
    await Service.findByIdAndUpdate(
      req.params.idService,
      { ...body, name: toLowerCaseNonAccentVietnamese(body.label) },
      (err, docs) => {
        if (err) {
          return res.status(400).json({
            message: err,
            message: 'Sửa dịch vụ không thành công',
          });
        } else {
          req.listBillServiceNeedToUpdate.map(async (item) => {
            await BillService.findByIdAndUpdate(item._id, { price: body.price }, (err) => {
              if (err) {
                return res.status(400).json({
                  message: 'Có lỗi sảy ra!',
                });
              }
            });
          });
          return res.status(200).json({
            oldData: docs,
            message: 'Sửa dịch vụ thành công',
          });
        }
      },
    );
  } else {
    return res.status(400).json({
      message: 'Parameter undefind',
    });
  }
};

const listServiceByIdHouse = async (req, res) => {
  if (req.params.idHouse) {
    await Service.find({ idHouse: req.params.idHouse }, (err, data) => {
      if (err || !data) {
        return res.status(400).json({
          message: 'Xem dịch vụ nhà không thành công ',
        });
      }
      return res.status(200).json({
        data,
      });
    });
  } else {
    return res.status(400).json({
      message: 'Thiếu id nhà',
    });
  }
};

const getServiceById = async (req, res) => {
  if (req.params.idService) {
    await Service.findById(req.params.idService, (err, data) => {
      if (data) {
        return res.status(200).json({
          data,
        });
      }
      if (err || !data) {
        return res.status(400).json({
          message: 'Không tìm thấy dữ liệu dịch vụ',
        });
      } else {
        return res.status(400).json({
          message: 'Không tìm thấy dữ liệu dịch vụ',
        });
      }
    });
  } else {
    return res.status(400).json({
      message: 'Thiếu id nhà',
    });
  }
};

const removeService = async (req, res) => {
  if (req.params.idService && req.params.idHouse) {
    await Service.findByIdAndRemove(req.params.idService, (err, docs) => {
      if (err) {
        return res.status(400).json({
          message: 'Xóa dịch vụ không thành công',
        });
      }
      return res.status(200).json({
        message: 'Xóa dịch vụ thành công',
        docs: docs,
      });
    });
  } else {
    return res.status(400).json({
      message: 'Thiếu id dịch vụ',
    });
  }
};

module.exports = {
  checkHouse,
  addService,
  removeService,
  listServiceByIdHouse,
  editService,
  getServiceById,
  getOneService,
  getHouseByIdService,
};
