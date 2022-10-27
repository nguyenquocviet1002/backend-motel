const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const houseSchema = mongoose.Schema(
    {
        idRoom: {
            type: ObjectId,
            ref: "Room",
        },
        idHouse: {
            type: ObjectId,
            ref: "House",
        },
        idAuth: {
            type: ObjectId,
            ref: "House"
        },
        address: {
            type: String,
        },
        houseName: {
            type: String,

        },
        roomName: {
            type: String,

        },
        // beginRent: {
        //     type: Date,

        // },
        memberName: {
            type: String,

        },
        // formDate: {
        //     type: Date,

        // },
        // toDate: {
        //     type: Date,

        // },
        year: {
            type: String,

        },
        month: {
            type: String,
        },
        // sumAmount: {
        //     type: Number,

        // },
        // mountYear: {
        //     type: String,

        // },
        invoiceService: [{
            amount: Number,
            serviceName: String,

        }]
    },
    { timestamps: true },
);

module.exports = mongoose.model('Bill', houseSchema);
