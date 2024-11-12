const mongoose = require("mongoose")

const SuperAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "super-admin",
        enum: ["super-admin"]
    },
    email: {
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
    otpExpire: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.models.superAdmin || mongoose.model("superAdmin", SuperAdminSchema)

