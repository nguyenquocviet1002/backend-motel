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
