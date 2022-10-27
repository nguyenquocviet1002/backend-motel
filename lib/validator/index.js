var check = require('express-validator');
var validationResult = require('express-validator');

exports.userSignupValidator = (req, res, next) => {
  // console.log(req);
  // req.check('name', 'Name is required').notEmpty();
  // req
  //   .check('email', 'Email must be between 3 to 32')
  //   .matches(/.+\@.+\..+/)
  //   .withMessage('Email must contains @')
  //   .isLength({
  //     min: 4,
  //     max: 32,
  //   });
  // req.check('password', 'Password is required').notEmpty();
  // req
  //   .check('password')
  //   .isLength({ min: 6 })
  //   .withMessage('Password must contain at least 6 characters')
  //   .matches(/\d/)
  //   .withMessage('Password must contain a number');

  // const errors = validationResult(req);
  console.log('req.body', req.body);

  // if (errors) {
  //   console.log(req);
  //   // const firstError = errors.map((error) => error.msg)[0];
  //   return res.status(400).json({ error: errors });
  // }
  next();
};

export const checkIdHouse = (req, res, next) => {
  if (!req.params.idHouse) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }

  if (!req.params.idHouse.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'id nhà không đúng định dạng',
    });
  } else {
    next();
  }
};

export const checkIdRoom = (req, res, next) => {
  if (!req.params.idRoom) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }

  if (!req.params.idRoom.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'id phòng không đúng định dạng',
    });
  } else {
    next();
  }
};

export const checkIdService = (req, res, next) => {
  if (!req.params.idService) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }

  if (!req.params.idService.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'id dịch vụ không đúng định dạng',
    });
  } else {
    next();
  }
};

export const checkIdUser = (req, res, next) => {
  if (!req.params.idAuth) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }

  if (!req.params.idAuth.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'id người dùng không đúng định dạng',
    });
  } else {
    next();
  }
};

export const checkIdBillService = (req, res, next) => {
  if (!req.params.idUser) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }

  if (!req.params.idUser.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'id hóa đơn dịch vụ không đúng định dạng',
    });
  } else {
    next();
  }
};
