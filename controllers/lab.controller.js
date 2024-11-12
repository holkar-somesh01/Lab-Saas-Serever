const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/handleEmpty")
const Lab = require("../models/Lab")
const Employee = require("../models/Employee")
const sendEmail = require("../utils/email")
const bcrypt = require("bcrypt")
const Orders = require("../models/Orders")
const OrderHistory = require("../models/OrderHistory")

exports.registerEmployee = asyncHandler(async (req, res) => {
    const { name, email, mobile } = req.body
    const { isError, error } = checkEmpty({ name, email, mobile, })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ messsage: "Invalid Email", error: "Invalid Email" })
    }
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ messsage: "Invalid Mobile", error: "Invalid Mobile" })
    }

    const result = await Employee.findOne({
        $or: [
            { email },
            { mobile }
        ]
    })
    if (result) {
        return res.status(400).json({
            messsage: "Email / Mobile Already Registered with Us",
            error: "Email / Mobile Already Registered with Us"
        })
    }

    const pass = email.slice(0, 4) + mobile.toString().slice(6, 10)
    const hashPass = await bcrypt.hash(pass, 10)
    await sendEmail({
        to: email, subject: "Welcome to Lab SAAS", message: `
    <h1>${name}, Welcome to Lab SAAS</h1>
    <p>Use this password for Login ${pass}</p>
    `

    })
    await Employee.create({ name, email, mobile, lab: req.userId, password: hashPass })
    return res.json({ messsage: "Employee Create Success" })

})
exports.activateEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const { isError, error } = checkEmpty({ employeeId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(employeeId)) {
        return res.status(400).json({ messsage: "Invalid Employee ID", error: "Invalid Employee ID" })
    }
    await Employee.findByIdAndUpdate(employeeId, { active: true })
    return res.json({ messsage: "Employee Activate Success" })
})
exports.deActivateEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const { reason } = req.body
    const { isError, error } = checkEmpty({ employeeId, reason })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(employeeId)) {
        return res.status(400).json({ messsage: "Invalid Employee ID", error: "Invalid Employee ID" })
    }
    await Employee.findByIdAndUpdate(employeeId, { active: false, blockReason: reason })
    return res.json({ messsage: "Employee De-Activate Success" })
})
exports.updateEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const { name, email, mobile } = req.body

    await Employee.findByIdAndUpdate(employeeId, { name, email, mobile })
    return res.json({ messsage: "Employee Update Success" })
})
exports.getAllEmployee = asyncHandler(async (req, res) => {
    const result = await Employee.find({ lab: req.userId })
    return res.json({ messsage: "Fetch All Employee Success", result })
})
exports.getEmployeeDetails = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findById(employeeId)
    return res.json({ messsage: "Fetch Employee Details Success Success", result })
})

//TODO: ORDERS CRUD START

exports.getAllOrders = asyncHandler(async (req, res) => {
    const result = await OrderHistory.find({ lab: req.user }, { lab: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        .populate("employee", { name: 1, email: 1, mobile: 1 })
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

exports.assignOrderToEmployee = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { employee } = req.body
    const result = await OrderHistory.findById(orderId)
    if (result && result.length === 0) {
        return res.json({ messsage: "No Data Found", result, orderId, employee })
    }
    const x = await Orders.findById(result.order)
    if (x.isSampleCollected) {
        return res.status(400).json({ messsage: "Sample Already Collected" })
    }
    await OrderHistory.findByIdAndUpdate(result._id, { employee })
    return res.json({ messsage: "Employee Assign Success", result, orderId, employee })
})
exports.changeAssignOrderToEmployee = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { employee } = req.body

    const result = await OrderHistory.findById(orderId)
    if (result) {
        const x = await Orders.findById(result.order)
        if (x.isSampleCollected) {
            return res.status(400).json({ messsage: "Sample Already Collected" })
        }
    }

    await OrderHistory.findByIdAndUpdate(orderId, { employee })
    return res.json({ messsage: "Employee ChangeAssign Success" })
})

//TODO: ASSIGN TO LAB END