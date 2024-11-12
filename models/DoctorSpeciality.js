const mongoose = require('mongoose')

const doctorSpecialitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.models.doctorSpeciality || mongoose.model("doctorSpeciality", doctorSpecialitySchema)