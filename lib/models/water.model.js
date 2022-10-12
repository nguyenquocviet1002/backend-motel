const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const waterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    waterPrice: [
      {
        year: {
          type: string,
          require: true,
        },
        month: {
          type: string,
          require: true,
        },
        consumed: {
          type: string,
          require: true,
        },
      },
    ],
    roomId: {
      type: ObjectId,
      require: true,
      ref: 'Room',
    },
    userId: {
      type: ObjectId,
      require: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Water', waterSchema);
