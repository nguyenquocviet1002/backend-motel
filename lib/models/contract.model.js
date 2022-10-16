const mongoose = require("mongoose");

const contractSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
}, { timestamps: false })

module.exports = mongoose.model('Contract', contractSchema)