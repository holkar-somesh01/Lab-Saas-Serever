const mongoose = require("mongoose")

const orderHistorySchema = new mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: "order",
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "cityAdmin",
    },
    lab: {
        type: mongoose.Types.ObjectId,
        ref: "lab",
    },
    employee: {
        type: mongoose.Types.ObjectId,
        ref: "employee",
    },
    status: {
        type: String,
        enum: ["placed", "settle", "cancel"],
    },

}, { timestamps: true })

module.exports = mongoose.models.orderHistory || mongoose.model("orderHistory", orderHistorySchema)

