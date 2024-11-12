const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true })

module.exports = mongoose.models.company || mongoose.model("company", companySchema)

