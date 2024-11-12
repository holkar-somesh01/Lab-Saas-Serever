const mongoose = require("mongoose")

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    mrp: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true })

module.exports = mongoose.models.test || mongoose.model("test", testSchema)

