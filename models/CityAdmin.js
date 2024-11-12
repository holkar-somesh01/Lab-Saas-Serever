const mongoose = require("mongoose")

const cityAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "city-admin",
        enum: ["city-admin"]
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    },
    avatar: {
        type: String,
    },
    location: {
        type: String,
    },
    city: {
        type: [String],
    },
    active: {
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.models.cityAdmin || mongoose.model("cityAdmin", cityAdminSchema)

