const mongoose = require("mongoose");

const houseSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    address: {
        type: String,
        require: true,
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('House', houseSchema)