const mongoose = require("mongoose")

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "lab",
        enum: ["lab"]
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
    avatar: {
        type: String,
        default: "lab-default.png"
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
    password: {
        type: String,
        required: true,
    },
    blockReason: {
        type: String,
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "cityAdmin"
    },
    lat: {
        type: String,
    },
    lon: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.models.lab || mongoose.model("lab", labSchema)

