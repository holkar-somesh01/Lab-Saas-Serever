const mongoose = require("mongoose")

const docotrSchma = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    degree: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        // required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "category",
        // required: true,
    },
    hospitalName: {
        type: String,
        // default: true
    },
    hospitalAddress: {
        type: String,
    },
    hospitalContact: {
        type: String,
    },
    experience: {
        type: String,
    },
    unavailable: {
        type: [String],
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String,
    },
    dayTiming: {
        monday: { type: String },
        tuesday: { type: String },
        wednesday: { type: String },
        thursday: { type: String },
        friday: { type: String },
        saturday: { type: String },
    }
}, { timestamps: true })

module.exports = mongoose.models.doctor || mongoose.model("doctor", docotrSchma)



















// name
// email
// degree
// photo
// category(id)
// hospital name
// hospital address
// hospital contact
// experience
// unavailable: []
// dayTiming: "monday 10-06 , tue:10-6 ... sat 10-02"


// doctor.controller.js
// registerDoctor
// getDectorDetails => with doctor id
// updateDeoctorProfile =>  with doctor id


// superAdmin.controller.js
// getAllDoctors
// getDoictorDetails
// blockDoctor
// unBlockDoctor



//  doctoar add by super admin
//  doctorar crud
//  main page doctoar apponitemnt componnedt
//  on doctoar apponitemnt componnedt => fetch all docotr
//  fetch all docotr=> add filter to seearch
//  book apponitemnt














































// const mongoose = require('mongoose')

// const doctorSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     mobile: {
//         type: String,
//         // required: true,
//     },
//     role: {
//         type: String,
//         default: "doctor",
//         enum: ["doctor"]
//     },
//     degree: {
//         type: String,
//         // required: true,
//     },
//     speciality: {
//         type: String,
//         // required: true,
//     },
//     hospitalName: {
//         type: [String],
//         // required: true,
//     },
//     hospitalContact: {
//         type: String,
//         // required: true,
//     },
//     hospitalAddress: {
//         type: String,
//         // required: true,
//     },
//     unavailable: {
//         type: String,
//         // required: true,
//     },
//     dayTime: {
//         type: String,
//         // required: true,
//     },
//     active: {
//         type: Boolean,
//         default: true,
//     },
//     blockReason: {
//         type: String,

//     },
//     verify: {
//         type: Boolean,
//         default: false,
//     }

// }, { timestamps: true })
// module.exports = mongoose.models.doctor || mongoose.model("doctor", doctorSchema)
