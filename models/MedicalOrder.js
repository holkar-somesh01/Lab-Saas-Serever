// medical(id)
// customer(id)
// image multiple
// status[enum placed , disapatch, delivered, canceled, settled]
// mrp
// sellingPrice


const mongoose = require("mongoose")

const medicalOrderSchema = new mongoose.Schema({
    medical: {
        type: mongoose.Types.ObjectId,
        ref: "medical",
    },
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "customer",

    },

    city: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },

    cancleReason: {
        type: String,
        // required: true
    },
    image: {
        type: [String],
        required: true,
    },


    status: {
        type: String,
        enum: ["placed", "disapatch", "delivered", "cancel", "settled"],
    },
    mrp: {
        type: String,
        // required: true

    },
    sellingPrice: {
        type: String,
        // required: true
    },


}, { timestamps: true })

module.exports = mongoose.models.medicalorder || mongoose.model("medicalorder", medicalOrderSchema)


// customer.controller.js   ha modla cha code

//placeMedicalOrder    //image upload multer
//getAllMedicalOrders
// getMedicalOrderDetails => with customer id
//cancelMedicalOrder  =>with customer id

//medical.controller.js   =>with medical id
//getAllMedicalOrders  =>with medical id
//updateMedicalQuotation  =>With medicalORder id


