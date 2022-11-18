const Room = require('../models/room.model');
const House = require('../models/house.model');
const User = require('../models/user.model');

export const getCountHouseAndRoom = async (req, res, next) => {
  try {
    await House.find({}, (err, docs) => {
      if (err) {
        req.countHouse = 0;
      } else {
        req.countHouse = docs.length;
      }
    });
  } catch (error) {
    req.countHouse = 0;
  }

  try {
    await Room.find({}, (err, docs) => {
      if (err) {
        req.countRoom = 0;
      } else {
        req.countRoom = docs.length;
      }
    });
  } catch (error) {
    req.countRoom = 0;
  }

  try {
    await User.find({}, (err, docs) => {
      if (err) {
        req.countUser = 0;
      } else {
        req.countUser = docs.length;
      }
    });
  } catch (error) {
    req.countUser = 0;
  }

  next();
};
