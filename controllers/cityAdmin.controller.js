const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/handleEmpty")
const Lab = require("../models/Lab")
const LabPackage = require("../models/LabPackage")
const bcrypt = require("bcrypt")
const sendEmail = require("../utils/email")
const Orders = require("../models/Orders")
const OrderHistory = require("../models/OrderHistory")


//TODO: Lab  CRUD Start

exports.registerLab = asyncHandler(async (req, res) => {
    const { name, email, mobile, location, city } = req.body
    const { isError, error } = checkEmpty({ name, email, mobile, location, city })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ messsage: "Invalid Email", error: "Invalid Email" })
    }
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ messsage: "Invalid Mobile", error: "Invalid Mobile" })
    }
    const result = await Lab.findOne({
        $or: [
            { email },
            { mobile }
        ]
    })
    if (result) {
        return res.json({
            messsage: "Email / Mobile Already Registered with Us",
            error: "Email / Mobile Already Registered with Us"
        })
    }

    const pass = email.slice(0, 4) + mobile.toString().slice(6, 10)
    const hashPass = await bcrypt.hash(pass, 10)
    await sendEmail({
        to: email, subject: "Welcome to Lab SAAS",
        message: `
    <h1>${name},Welcome to Lab SAAS</h1>
    <p>Use this password for Login ${pass}</p>
    `

    })
    await Lab.create({
        name,
        email,
        mobile,
        location,
        city,
        password: hashPass,
        admin: req.userId, // req.userId from protected
    })
    return res.json({ messsage: "Lab Create Success" })

})
// exports.getAllLabs = asyncHandler(async (req, res) => {
//     const result = await Lab.find({ admin: req.user })// userId from protected page
//     return res.json({ messsage: "Lab Fetch Success", result })

// })
exports.getAllLabs = asyncHandler(async (req, res) => {
    const result = await Lab.find({ admin: req.userId })// userId from protected page
    return res.json({ messsage: "Lab Fetch Success", result })

})
exports.getLabDetails = asyncHandler(async (req, res) => {
    const { labId } = req.params
    const result = await Lab.findById(labId)
    return res.json({ messsage: "Lab Details Fetch Success", result })

})
exports.updateLab = asyncHandler(async (req, res) => {
    const { labId } = req.params
    const { name, email, mobile, location, city, package } = req.body
    await Lab.findByIdAndUpdate(labId, { name, email, mobile, location, city, package })
    return res.json({ messsage: "Lab Update Success" })

})
exports.activateLab = asyncHandler(async (req, res) => {
    const { labId } = req.params
    const { isError, error } = checkEmpty({ labId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(labId)) {
        return res.status(400).json({ messsage: "Invalid Package ID", error: "Invalid Package ID" })
    }
    await Lab.findByIdAndUpdate(labId, { active: true })
    return res.json({ messsage: "Lab Activate Success" })
})
exports.deActivateLab = asyncHandler(async (req, res) => {
    const { labId } = req.params
    const { reason } = req.body
    const { isError, error } = checkEmpty({ labId, reason })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(labId)) {
        return res.status(400).json({ messsage: "Invalid Package ID", error: "Invalid Package ID" })
    }
    await Lab.findByIdAndUpdate(labId, { active: false, blockReason: reason })
    return res.json({ messsage: "Lab De-Activate Success" })
})

//TODO: Lab CRUD End



//TODO: ORDERS CRUD START

exports.getAllOrders = asyncHandler(async (req, res) => {
    console.log(req.user)
    const result = await OrderHistory.find({ admin: req.user }, { admin: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        .populate("employee", { name: 1, email: 1, mobile: 1 })
        .populate("lab", { name: 1, email: 1, mobile: 1 })
        .populate({
            path: "order",
            populate: [
                {
                    path: "package",
                    model: "customerPackage",
                    select: { name: 1, amount: 1, mrp: 1, desc: 1, hero: 1, company: 1 },
                    populate: {
                        path: "company",
                        model: "company",
                        select: { name: 1, desc: 1, logo: 1 }
                    }
                },
                {
                    path: "customer",
                    model: "customer",
                    select: { name: 1, email: 1, mobile: 1 }
                }
            ],
            select: { createdAt: 0, updatedAt: 0, __v: 0 }
        })

    return res.json({ messsage: "Orders Fetch Success", result })

})
exports.getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Orders.findById(orderId)
    return res.json({ messsage: "Order Details Fetch Success", result })

})

//TODO: ORDERS CRUD End

//TODO: ASSIGN TO LAB START

exports.assignOrderToLab = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { lab } = req.body
    console.log(req.body);
    console.log(req.params);
    // const result = await OrderHistory.findById(orderId)
    await OrderHistory.findByIdAndUpdate(orderId, { lab })

    return res.json({ messsage: "Lab Assign Success" })
})
exports.changeAssignOrderToLab = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { lab } = req.body
    await OrderHistory.findByIdAndUpdate(orderId, { lab })
    return res.json({ messsage: "Lab ChangeAssign Success" })
})

//TODO: ASSIGN TO LAB END