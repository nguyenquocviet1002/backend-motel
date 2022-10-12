import Room from '../models/room.model';
import { errorHandler } from '../helpers/dbErrorsHandler';
import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';
const House = require('../models/house');

export const listRoom = (req, res) => {
  return Room;
};

export const addRoom = async (req, res) => {
  console.log(req.body, 'body');
  const data = new Room({
    name: req.body.name,
    status: req.body.status,
    maxMember: req.body.maxMember,
    idAuth: req.body.idAuth,
    idHouse: req.body.idHouse,
    address: req.body.address,
  });

  // console.log('idHouse', dataBody.idHouse);

  // if (dataBody.idHouse) {
  //   House.findById(req.body.idHouse).exec((err, house) => {
  //     if (err || !house) {
  //       return res.status(400).json({
  //         error: 'House not found',
  //       });
  //     }
  //   });
  // }

  console.log('data', data);

  await data
    .save()
    .then()
    .catch((err) => res.status.json({ massage: err }))
    .finally(() => res.json({ data }));

  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;
  // form.parse(req, (err, fields, files) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: 'Error',
  //     });
  //   }
  //   // console.log('FIELDS', fields);
  //   const { name, address, status, idHouse, maxMember } = fields;
  //   if (!name || !maxMember || !status || !idHouse) {
  //     return res.status(400).json({
  //       error: 'All fields are required',
  //     });
  //   }

  //   let room = new Room(fields);
  //   console.log(room);

  //   room.save((err, result) => {
  //     console.log(err, '----', result);
  //     if (err) {
  //       return res.status(400).json({
  //         error: errorHandler(err),
  //       });
  //     }
  //     res.json(result);
  //   });
  // });
};

export const roomByID = (req, res, next, id) => {
  Room.findById(id).exec((err, room) => {
    if (err || !room) {
      res.status(400).json({
        error: 'Room not found',
      });
    }
    req.room = room;
    next();
  });
};

// export const read = (req, res) => {
//   req.product.photo = undefined;
//   return res.json(req.product);
// };
// export const remove = (req, res) => {
//   let product = req.product;
//   product.remove((err, deletedProduct) => {
//     if (err) {
//       res.status(400).json({
//         error: errorHandler(err),
//       });
//     }
//     res.json({
//       deletedProduct,
//       message: 'Product deleted successfully',
//     });
//   });
// };
// export const update = (req, res) => {
//   let form = new formidable.IncomingForm();

//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     console.log(fields);
//     if (err) {
//       return res.status(400).json({
//         error: 'Image could not be uploaded',
//       });
//     }
//     const { name, description, price, category } = fields;
//     if (!name || !description || !price || !category) {
//       return res.status(400).json({
//         error: 'All fields are required',
//       });
//     }
//     let product = req.product;
//     product = _.assignIn(product, fields);

//     // 1kb = 1000
//     // 1mb = 100000
//     if (files.photo) {
//       if (files.photo.size > 2000000) {
//         return res.status(400).json({
//           error: 'Image should be less than 1mb in size',
//         });
//       }
//       product.photo.data = fs.readFileSync(files.photo.path);
//       product.photo.contentType = files.photo.type;
//     }

//     product.save((err, result) => {
//       console.log(err, '----', result);
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       res.json(result);
//     });
//   });
// };
// /*
//  * Sell
//  * by sell = /products?sortBy=sold&order=desc&limit=4
//  * by arrival = /products?sortBy=createdAt&order=desc&limit=4
//  * Nếu không có tham số nào được nhận thì sẽ trả về tất cả sản phẩm
//  */
// export const list = (req, res) => {
//   let order = req.query.order ? req.query.order : 'asc';
//   let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
//   let limit = req.query.limit ? +req.query.limit : 30;

//   Product.find()
//     .select('-photo')
//     .limit(limit)
//     .exec((err, data) => {
//       if (err) {
//         res.status(400).json({
//           error: 'Product not found',
//         });
//       }
//       res.json(data);
//     });
// };
// export const listRelated = (req, res) => {
//   let limit = req.query.limit ? req.query.limit : 5;

//   Product.find({
//     _id: { $ne: req.product },
//     category: req.product.category,
//   }) // $ne: not include
//     .limit(limit)
//     .populate('category', '_id name')
//     .exec((err, products) => {
//       if (err) {
//         res.status(400).json({
//           error: 'Products not found',
//         });
//       }
//       res.json(products);
//     });
// };

// export const listCategories = () => {
//   Product.distinct('category', {}, (err, categories) => {
//     if (err) {
//       res.status(400).json({
//         error: 'Products not found',
//       });
//     }
//     res.json(categories);
//   });
// };
// /**
//  * Hiển thị danh sách sản phẩm khi tìm kiếm
//  * Được áp dụng khi tìm kiếm ở react hoặc js project
//  * Hiển thị các danh mục trong checkbox và khoảng giá trong radio buttons
//  * user click vào checkbox và radio buttons
//  * sẽ thiết kế api và hiển thị danh sách sản phẩm mà người dùng tìm kiếm
//  */
// export const listBySearch = () => {
//   let order = req.query.order ? req.query.order : 'asc';
//   let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
//   let limit = req.query.limit ? +req.query.limit : 6;
//   let skip = parseInt(req.body.skip);
//   let findArgs = {};

//   for (let key in req.body.filters) {
//     if (req.body.filters[key].length > 0) {
//       if (key === 'price') {
//         // gte - greater than price [0 - 10]
//         // lte - nhỏ hơn
//         findArgs[key] = {
//           $gte: req.body.filters[key][0],
//           $lte: req.body.filters[key][1],
//         };
//       } else {
//         findArgs[key] = req.body.filters[key];
//       }
//     }
//   }
//   Product.find(findArgs)
//     .select('-photo')
//     .populate('category')
//     .sort([[sortBy, order]])
//     .skip(skip)
//     .limit(limit)
//     .exec((err, data) => {
//       if (err) {
//         res.status(400).json({
//           error: 'Products not found',
//         });
//       }
//       res.json({
//         size: data.length,
//         data,
//       });
//     });
// };
