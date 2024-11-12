const mongoose = require("mongoose")

const customerAddressSchema = mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "customer",
    },
    location: {
        type: String,
        required: true,
    },
    city: {
        type: mongoose.Types.ObjectId,
        ref: "city",
        required: true,
    },
})
module.exports = mongoose.models.customerAddress || mongoose.model("customerAddress", customerAddressSchema)