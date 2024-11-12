const mongoose = require("mongoose")

const doctorAppointment = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "customer",
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: "customerPackage",
    },
    address: {
        type: String,
        ref: "test",
    },
    cancleReason: {
        type: String,
    },
    schedule: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.models.doctorAppointment || mongoose.model("doctorAppointment", doctorAppointment)

