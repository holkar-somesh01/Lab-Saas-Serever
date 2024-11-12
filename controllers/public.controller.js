const asyncHandler = require("express-async-handler")
const CustomerPackages = require("../models/CustomerPackages")
const QnA = require("../models/QnA")
const City = require("../models/City")
const Company = require("../models/Company")

exports.getAllCustomerPackage = asyncHandler(async (req, res) => {
    const result = await CustomerPackages.find({ active: true }).populate("company")
    return res.json({ messsage: "Customer Package Activate Success", result })
})
exports.getCustomerPackageDetails = asyncHandler(async (req, res) => {
    const { packageId } = req.params
    const result = await CustomerPackages.findOne({ _id: packageId })
    const qnaResult = await QnA.find({ package: packageId }).populate("company")
    return res.json({
        messsage: "Customer Package Details Success",
        result,
        qna: qnaResult
    })
})
exports.getCities = asyncHandler(async (req, res) => {
    const result = await City.find()
    return res.json({
        messsage: "City Fetch Success",
        result,
    })
})

exports.getAllCompanyPackages = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const result = await CustomerPackages.find({ company: companyId, active: true }).populate("company")
    return res.json({ messsage: "CompanyPackages Fetch Successfully", result })
})
exports.getAllCompanies = asyncHandler(async (req, res) => {
    const result = await Company.find()
    return res.json({ messsage: "Company Fetch Successfully", result })
})
exports.handleSearch = asyncHandler(async (req, res) => {
    const result = await CustomerPackages.find({
        $or: [
            { name: { $regex: req.query.term, $options: "i" } },
            { test: { $regex: req.query.term, $options: "i" } },
        ]
    })
    return res.json({ messsage: "Company Fetch Successfully", result })
})

