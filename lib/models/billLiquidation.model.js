const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const houseSchema = mongoose.Schema(
  {
    idRoom: {
      type: ObjectId,
      ref: 'Room',
    },
    idHouse: {
      type: ObjectId,
      ref: 'House',
    },
    idAuth: {
      type: ObjectId,
      ref: 'House',
    },
    payment: {
      paymentStatus: {
        type: Number,
        default: 0,
      },
      paidAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      debt: {
        type: Number,
        default: 0,
        min: 0,
      },
      invoiceService: [
        {
          amount: Number,
          serviceName: String,
        },
      ],
    },
    detailRoom: {},
  },
  { timestamps: true },
);

module.exports = mongoose.model('Bill', houseSchema);