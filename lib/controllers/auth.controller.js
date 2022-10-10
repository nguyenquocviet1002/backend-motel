const User = require('../models/user.model');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorsHandler');
import formidable from 'formidable';

exports.signup = (req, res) => {
  // console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: 'có lỗi sảy ra',
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  });
};
exports.signin = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: 'con me n chu!',
      });
    }
    const { email, password } = fields;
    console.log('FIELDS', fields);
    User.findOne({ email }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          error: 'User with that email does not exist. Please signup',
        });
      }

      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: 'Email and password not match',
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // persist the token as 't' in cookie with
      res.cookie('t', token, { expire: new Date() + 9999 });

      console.log(token);

      const { _id, name, email, role } = user;
      console.log(user);
      return res.json({
        token,
        user: { _id, email, name, role },
      });
    });
  });
};
exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({
    message: 'Signout Success',
  });
};
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
});
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access Denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: 'Admin resource! Access Denined',
    });
  }
  next();
};