const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const seviceSchema = mongoose.Schema(
  {
    nameService: {
      type: String,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    month: {
      type: String,
      require: true,
    },
    firstValue: {
      type: Number,
      require: true,
    },
    lastValue: {
      type: Number,
      require: true,
    },
    consumed: {
      type: String,
      require: true,
    },
    unit: {
      type: String,
      require: true,
    },
    priceService: {
      type: String,
      require: true,
    },
    toPrice: {
      type: String,
      require: true,
    },
    roomId: {
      type: ObjectId,
      require: true,
      ref: 'Room',
    },
    houseId: {
      type: ObjectId,
      require: true,
      ref: 'House',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Service', seviceSchema);
