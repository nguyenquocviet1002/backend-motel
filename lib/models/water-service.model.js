const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const serviceSchema = mongoose.Schema({
  idHouse: {
    type: ObjectId,
    ref: 'House',
    require: true,
  },
  idService: {
    type: ObjectId,
    ref: 'Service',
    require: true,
  },
  month: {
    type: Number,
    require: true.valueOf,
  },
  year: {
    type: Number,
    require: true,
  },
  inputValue: {
    type: Number,
    default: 0,
    require: true,
  },
  outputValue: {
    type: Number,
    default: 0,
    require: true,
  },
  unit: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  amount: {
    type: number,
    require: true,
  },
  typeService: {
    default: 'water',
  },
});

module.exports = mongoose.model('Service', serviceSchema);
