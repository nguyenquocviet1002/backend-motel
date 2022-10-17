const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  unit: {
    type: String,
    require: true,
  },
  Type: {
    type: Boolean,
    //   nếu trả theo tháng là true , k là false
    default: false,
    require: false,
  },
});

const houseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    address: {
      type: String,
      require: true,
      trim: true,
    },
    contract: {
      type: String,
    },
    service: [{ type: ObjectId, ref: 'Service' }],
    idAuth: {
      type: ObjectId,
      ref: 'User',
      require: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('House', houseSchema);
module.exports = mongoose.model('Service', serviceSchema);
