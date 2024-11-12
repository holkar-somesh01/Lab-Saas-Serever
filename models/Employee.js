const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "employee",
        enum: ["employee"]
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
        defaule: "employee-default.png"
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String,
    },
    lab: {
        type: mongoose.Types.ObjectId,
        ref: "lab"
    }

}, { timestamps: true })

module.exports = mongoose.models.employee || mongoose.model("employee", employeeSchema)

