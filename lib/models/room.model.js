const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const roomSchema = mongoose.Schema(
  {
    idHouse: {
      type: ObjectId,
      require: true,
      ref: 'House',
    },
    idAuth: {
      type: ObjectId,
      require: true,
      ref: 'User',
    },
    name: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    address: {
      type: String,
    },
    status: {
      type: Boolean,
      //true la phong da duoc mo
      //false la phong chua hoat dong
      require: true,
    },
    maxMember: {
      type: Number,
      require: true,
    },
    listMember: {
      type: [
        {
          memberName: {
            type: String,
            require: true,
          },
          cardNumber: {
            type: String,
          },
          status: {
            type: Boolean,
            default: false,
          },
          phoneNumber: {
            type: String,
          },
        },
      ],
    },
    contract: {
      type: String,
    },
    imageContract: {
      title: {
        type: String,
      },
      listImages: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Room', roomSchema);
