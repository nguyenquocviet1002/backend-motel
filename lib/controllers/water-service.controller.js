const House = require('../models/house.model');
const Service = require('../models/service.model');

const checkAuth = async (req, res, next) => {};

const checkValue = (req, res, next) => {
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

const addWaterService = async (req, res) => {
  //   const body = req.body;
  //   try {
  //     const service = new Service(req.body);
  //     const dataToSave = await service.save();
  //     res.status(200).json({ massage: ' Tạo dịch vụ thành công', data: dataToSave });
  //   } catch (error) {
  //     res.status(400).json({ massage: ' Tạo dịch vụ không thành công' });
  //   }
};

// const editService = async (req, res) => {
//   const body = req.body;
//   if (body.price < 1) {
//     return res.status(400).json({
//       error: 'Giá của dịch vụ ít nhất là 1',
//     });
//   }
//   if (req.params.idService) {
//     await Service.findByIdAndUpdate(req.params.idService, body, (err, docs) => {
//       if (err) {
//         return res.status(400).json({
//           error: err,
//           message: 'Sửa dịch vụ không thành công',
//         });
//       } else {
//         return res.status(200).json({
//           oldData: docs,
//           message: 'Sửa dịch vụ thành công',
//         });
//       }
//     });
//   } else {
//     return res.status(400).json({
//       error: 'Parameter undefind',
//     });
//   }
// };

// const listServiceByIdHouse = async (req, res) => {
//   if (req.params.idHouse) {
//     await Service.find({ idHouse: req.params.idHouse }, (err, data) => {
//       if (err || !data) {
//         return res.status(400).json({
//           error: 'Xem dịch vụ nhà không thành công ',
//         });
//       }
//       return res.status(200).json({
//         data,
//       });
//     });
//   } else {
//     return res.status(400).json({
//       error: 'Thiếu id nhà',
//     });
//   }
// };

// const removeService = async (req, res) => {
//   if (req.params.idService) {
//     await Service.findByIdAndRemove(req.params.idService, (err, docs) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'Xóa dịch vụ không thành công',
//         });
//       }
//       return res.status(200).json({
//         message: 'Xóa dịch vụ thành công',
//         docs: docs,
//       });
//     });
//   } else {
//     return res.status(400).json({
//       error: 'Thiếu id dịch vụ',
//     });
//   }
// };

module.exports = { checkAuth, checkValue, addWaterService };
