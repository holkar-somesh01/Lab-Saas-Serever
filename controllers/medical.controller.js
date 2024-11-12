const asyncHandler = require("express-async-handler")
const Medical = require("../models/Medical")
const MedicalOrder = require("../models/MedicalOrder")

exports.updateMedical = asyncHandler(async (req, res) => {
    imgeUpload(req, res, async err => {

        const { medicalId } = req.params
        const { name, address, city, mobile, email, } = req.body
        const result = await Medical.findById(medicalId)
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", "uploads", result.image))
            await Medical.findByIdAndUpdate(medicalId, { name, address, city, mobile, email, image: req.file.filename })
        } else {
            await Medical.findByIdAndUpdate(medicalId, { name, email, mobile, address, city, })

        }
        await sendEmail({
            to: result.email, subject: "Welcome to Medical Lab SAAS", message: `
        <h1>${result.name},Welcome to Medical Lab SAAS</h1>
        `})
        return res.json({ messsage: "medical Update Success" })
    })
})
exports.addMedicalOder = async (req, res) => {
    try {
        medicalImageUpload(req, res, async err => {
            if (err) {
                return res.status(400).json({ message: err.message || "Unable to upload image" });
            }
            console.log(req.files)
            if (!req.files) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            console.log(req.body)
            await MedicalOrder.create({ ...req.body, image: req.files.filename });
            res.status(201).json({ message: "Customer added successfully" });
        });
    } catch (error) {
        res.status(400).json({ message: error.message || "Something went wrong" });
    }
}
exports.getAllMedicalOrders = asyncHandler(async (req, res) => {
    // const { medicalId } = req.params;
    const result = await MedicalOrder.find().populate("customer").sort({ createdAt: -1 })
    // const result = await MedicalOrder.find({ medicalId: medicalId }).populate("customer").sort({ createdAt: -1 })
    // if (result.length === 0) {
    //     return res.status(404).json({ message: "No Medical Orders found for the medicalId" });
    // }
    return res.json({ message: "Get All MedicalOrders Success", result })
})
exports.updateMedicalQuotation = asyncHandler(async (req, res) => {
    const { medicalId } = req.params
    const { medical, customer, city, location, cancleReason, status, mrp, sellingPrice } = req.body
    await MedicalOrder.findByIdAndUpdate(medicalId, { medical, customer, city, location, cancleReason, status, mrp, sellingPrice })
    return res.json({ messsage: "MedicalOrder update Medical Quotation Success" })

})




