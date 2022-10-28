import User from '../models/user.model';

export const checkIdUser = (req, res, next) => {
  if (!req.params.userId) {
    return res.status(400).json({
      error: 'Thiếu parameter',
    });
  }

  if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'id người dùng không đúng định dạng',
    });
  } else {
    next();
  }
};

exports.userById = (req, res, next, id) => {
  User.findById(id, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};
export const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};
export const update = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { ...req.body }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: 'Người dùng  không tồn tại',
      });
    } else {
      return res.status(200).json({
        message: 'Cập nhật thông tin người dùng thành công',
        docs,
      });
    }
  });
};
