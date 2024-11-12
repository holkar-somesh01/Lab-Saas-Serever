const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/handleEmpty")
const Doctor = require("../models/Doctor")
const { heroUpload, doctorphotoupload } = require("../utils/upload")
const DrFees = require("../models/DrFees")
const City = require("../models/City")


// doctor.controller.js

// fetch doctor
// createFees
// updateFees
// getAllFees
// deleteFees
// getDoctorFeesDetails

exports.fetchDoctorDetails = asyncHandler(async (req, res) => {

    const result = await Doctor.findById(req.user)
    return res.json({ messsage: "Fetch Doctor Details Success", result })
})
// exports.fetchDoctorDetails = asyncHandler(async (req, res) => {
//     const { doctorId } = req.params
//     if (!validator.isMongoId(doctorId)) {
//         return res.status(400).json({ messsage: "Invalid Doctor Id", error: "Invalid Doctor Id" })
//     }
//     const result = await Doctor.findById(doctorId)
//     return res.json({ messsage: "Fetch Doctor Details Success", result })
// })

exports.updateProfile = asyncHandler(async (req, res) => {
    const { name, email, mobile, city, hospitalName, hospitalAddress, hospitalContact, speciality, degree } = req.body
    await Doctor.findByIdAndUpdate(req.user, { name, email, mobile, city, hospitalName, hospitalAddress, hospitalContact, speciality, degree })
    return res.json({ messsage: "Doctor Update Success" })
})

exports.updateDoctor = asyncHandler(async (req, res) => {
    doctorphotoupload(req, res, async err => {
        const { doctorId } = req.params
        const { name, email, mobile, degree, photo, category, hospitalName, hospitalAddress, hospitalContact, experience, dayTiming, unavailable, blockReason } = req.body

        const result = await Doctor.findById(doctorId)
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", "uploads", "doctorphoto", result.photo))
            await Doctor.findByIdAndUpdate(doctorId, { name, email, mobile, degree, category, hospitalName, hospitalAddress, hospitalContact, experience, dayTiming, unavailable, blockReason, photo: req.file.fieldname })
        } else {

            await Doctor.findByIdAndUpdate(doctorId, { name, email, mobile, degree, category, hospitalName, hospitalAddress, hospitalContact, experience, dayTiming, unavailable, blockReason })
        }
        return res.json({ messsage: "Company Update Success", result })
    })
})

exports.getDefaultImages = asyncHandler(async (req, res) => {

    return res.json({ messsage: "Default Images Fetch Success", result })
})

exports.fetchAllFees = asyncHandler(async (req, res) => {
    const result = await DrFees.find().populate("package")
    return res.json({ messsage: "Dr Fees Fetch Success", result })
})

exports.createDrFees = asyncHandler(async (req, res) => {
    console.log("create Dr Fees--------------------------", req.body);

    const { name, fees, desc, image } = req.body
    const { isError, error } = checkEmpty({ name, fees, image, desc })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(Doctor)) {
        return res.status(400).json({ messsage: "Invalid Doctor ID", error: "Invalid Doctor ID" })
    }
    await DrFees.create({ name, fees, desc, image })
    return res.json({ messsage: "Dr Fees Create Success" })


})

exports.updateFees = asyncHandler(async (req, res) => {
    const { drFeesId } = req.params
    const { name, fees, image, desc } = req.body
    await DrFees.findByIdAndUpdate(drFeesId, { name, fees, image, desc })
    return res.json({ messsage: "Dr Fees Update Success" })
})

exports.deleteFees = asyncHandler(async (req, res) => {
    const { drFeesId } = req.params
    await DrFees.findByIdAndDelete(drFeesId)
    return res.json({ messsage: "Dr Fees Delate Success" })
})

exports.fetchDoctorCity = asyncHandler(async (req, res) => {
    const result = await City.find()
    return res.json({ messsage: "Doctors City Fetch Successfully", result })
})
