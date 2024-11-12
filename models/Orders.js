const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "customer",
    },
    package: {
        type: mongoose.Types.ObjectId,
        ref: "customerPackage",
    },
    test: {
        type: mongoose.Types.ObjectId,
        ref: "test",
    },

    status: {
        type: String,
        enum: ["placed", "settle", "cancel"],
    },
    isSampleCollected: {
        type: Boolean,
        default: false,

    },
    location: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },
    cancleReason: {
        type: String,
    },
    reports: {
        type: [String],
    },
    schedule: {
        type: Date,
        // required: true
    },

}, { timestamps: true })

module.exports = mongoose.models.order || mongoose.model("order", orderSchema)

