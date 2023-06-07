const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const limiterSchema = new Schema({
    ip: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        default: Date.now()
    },
    hits: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = new mongoose.model('Limiter', limiterSchema)