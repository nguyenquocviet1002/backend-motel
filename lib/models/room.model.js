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
    listMember: [
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
    contract: {
      addressCT: {
        type: String,
      },
      timeCT: {
        type: String,
      },
      startTime: {
        type: String,
        require: true,
      },
      endTime: {
        type: String,
        require: true,
      },
      additional: {
        type: Array,
      },
      timeContract: {
        type: String,
        require,
      },
      fine: {
        type: Number,
      },
      infoTenant: {
        name: {
          type: String,
        },
        cardNumber: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        dataRange: {
          type: String,
        },
        issuedBy: {
          type: String,
        },
      },
      infoLandlord: {
        name: {
          type: String,
        },
        cardNumber: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        dataRange: {
          type: String,
        },
        issuedBy: {
          type: String,
        },
      },
      require: false,
    },
    price: {
      type: Number,
      require: true,
    },
    area: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Room', roomSchema);
