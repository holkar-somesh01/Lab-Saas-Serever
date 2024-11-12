const mongoose = require("mongoose")

const categorySchma = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.models.category || mongoose.model("category", categorySchma)

