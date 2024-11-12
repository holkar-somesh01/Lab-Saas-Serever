

const mongoose = require("mongoose")

const medicalSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        // required: true,
    },
    city: {
        type: String,
        // required: true,
    },
    mobile: {
        type: String,
        // required: true,
    },
    blockReason: {
        type: String,
    },
    role: {
        type: String,
        default: "medical",
        enum: ["medical"]
    },

    email: {
        type: String,
        unique: [true, 'Email is already exists'],
        required: [true, 'Email is Required'],
    },

    image: {
        type: String,
    },

    active: {
        type: Boolean,
        default: true
    },
    verify: {
        type: Boolean,
        default: false
    },

})
module.exports = mongoose.models.medical || mongoose.model("medical", medicalSchema)





//   active: { type: Boolean, default: true }



//medical controller.js

//createMedical
//updateMedical
//getMedicalDeatils


//superAdmin.controller.js

//getAllMedical
//getSuperMedicalDetails
//blockMedical  //customer admin kele ahe
//unblockMediacal


// 