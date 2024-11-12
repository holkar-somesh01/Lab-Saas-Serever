const mongoose = require("mongoose")

const orderRescheduleSchema = new mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: "order",
    },
    schedule: {
        type: Date,
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.models.orderReschedule || mongoose.model("orderReschedule", orderRescheduleSchema)

