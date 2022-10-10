const { check, validationResult } = require('express-validator');

exports.userSignupValidator = (req, res, next) => {
  // console.log(req);
  check('name', 'Name is required').notEmpty();
  check('email', 'Email must be between 3 to 32')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contains @')
    .isLength({
      min: 4,
      max: 32,
    });
  check('password', 'Password is required').notEmpty();
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');

  const errors = validationResult(req);
  if (errors) {
    console.log(req);
    // const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: errors });
  }
  next();
};
