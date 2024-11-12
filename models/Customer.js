const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    role: {
        type: String,
        default: "customer",
        enum: ["customer"]
    },
    email: {
        type: String,
        // required: true,
    },
    mobile: {
        type: String,
        // required: true,
    },
    otp: {
        type: String,
    },
    avatar: {
        type: String,
    },
    // location: {
    //     type: String,
    // },
    // city: {
    //     type: String,
    // },
    active: {
        type: Boolean,
        default: true
    },
    blockResone: {
        type: String,
    },
    password: {
        type: String,
    }

}, { timestamps: true })

module.exports = mongoose.models.customer || mongoose.model("customer", customerSchema)

