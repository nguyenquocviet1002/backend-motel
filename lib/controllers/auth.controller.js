const User = require('../models/user.model');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorsHandler');

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
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
  const data = {
    email: req.body.email,
    password: req.body.password
  };
  User.findOne({ email: data.email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Email không tồn tại. Vui lòng đăng ký" });
    }
    if (!user.authenticate(data.password)) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng. Xin thử lại" })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with
    res.cookie('t', token, { expire: new Date() + 30 * 24 * 60 * 60 });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, email, name, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({
    message: 'Đăng xuất thành công',
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

exports.isAuthHouse = (req, res, next) => {
  if (req.profile.id != req.idHouse) {
    return res.status(403).json({
      error: 'Access Denined',
    });
  }
  next();
};
