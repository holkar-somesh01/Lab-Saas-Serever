const mongoose = require("mongoose")

const drFeesSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: "doctor"
    },
    name: {
        type: String,
        required: true
    },
    fees: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
}, { timestamps: true })
module.exports = mongoose.models.drFees || mongoose.model("drFees", drFeesSchema)


