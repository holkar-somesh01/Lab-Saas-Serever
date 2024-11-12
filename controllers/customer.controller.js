const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/handleEmpty")
const sendEmail = require("../utils/email")
const bcrypt = require("bcrypt")
const Orders = require("../models/Orders")
const Customer = require("../models/Customer")
const CustomerAddress = require("../models/CustomerAddress")
const MedicalOrder = require("../models/MedicalOrder")
const Medical = require("../models/Medical")
const cloudinary = require("./../utils/cloudinary.config")
const { medicalImageUpload, customerAvatarUpload } = require("../utils/upload")
const DoctorAppointment = require("../models/DoctorAppointment")
const Doctor = require("../models/Doctor")
const Category = require("../models/Category")


exports.fetchCustomerDetails = asyncHandler(async (req, res) => {
    const result = await Customer.findById(req.user)
    console.log(req.user)
    console.log(result)

    return res.json({ messsage: "Fetch Customer Details Success", result })
})
exports.updateCustomerDetails = asyncHandler(async (req, res) => {
    customerAvatarUpload(req, res, async err => {

        const { name, email } = req.body
        const query = {}
        if (name) {
            query.name = name
        }
        if (email) {
            query.email = email
        }
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await Customer.findByIdAndUpdate(req.user, { ...query, avatar: secure_url })
        } else {
            await Customer.findByIdAndUpdate(req.user, query)
        }

        return res.json({ messsage: "Customer update Success" })
    })
})
exports.fetchOrders = asyncHandler(async (req, res) => {
    const result = await Orders.aggregate([
        {
            $match: {
                customer: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'customerPackages',
                localField: 'package',
                foreignField: '_id',
                as: 'packageDetails'
            }
        },
        {
            $unwind: {
                path: '$packageDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'tests',
                localField: 'test',
                foreignField: '_id',
                as: 'testDetails'
            }
        },
        {
            $unwind: {
                path: '$testDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'orderhistories',
                localField: '_id',
                foreignField: 'order',
                as: 'orderHistory'
            }
        },
        {
            $lookup: {
                from: 'cityAdmins',
                localField: 'orderHistory.admin',
                foreignField: '_id',
                as: 'orderHistory.adminDetails'
            }
        },
        {
            $lookup: {
                from: 'labs',
                localField: 'orderHistory.lab',
                foreignField: '_id',
                as: 'orderHistory.labDetails'
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: 'orderHistory.employee',
                foreignField: '_id',
                as: 'orderHistory.employeeDetails'
            }
        },
        {
            $project: {
                _id: 1,
                customer: 1,
                packageDetails: 1,
                testDetails: 1,
                status: 1,
                isSampleCollected: 1,
                location: 1,
                city: 1,
                cancleReason: 1,
                reports: 1,
                schedule: 1,
                'orderHistory._id': 1,
                'orderHistory.status': 1,
                'orderHistory.adminDetails': 1,
                'orderHistory.labDetails': 1,
                'orderHistory.employeeDetails': 1
            }
        }
    ]).exec()
    return res.json({ messsage: "Fetch Orders Success", result })
})
exports.placeOrder = asyncHandler(async (req, res) => {
    const { package, location, city, schedule, time, newAddress } = req.body
    // const { package } = req.body
    const customer = req.user
    const { isError, error } = checkEmpty({ customer, package, location, city, schedule, time })
    // const { isError, error } = checkEmpty({ customer, package })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(package)) {
        return res.status(400).json({ messsage: "Invalid Package Id", error: "Invalid Package Id" })
    }
    if (!validator.isMongoId(customer)) {
        return res.status(400).json({ messsage: "Invalid customer Id", error: "Invalid customer Id" })
    }
    if (newAddress) {
        await CustomerAddress.create({ customer: req.user, location, city })
    }
    const result = await Customer.findById(customer)
    if (result.email) {
        await sendEmail({
            to: result.email, subject: "Welcome to Lab SAAS", message: `
            <h1>${result.name},Welcome to Lab SAAS</h1>
            <p>Your Order Details are  ${package}</p>
            `})
    }
    await Orders.create({ customer, package, location, city, schedule, time })
    // await Orders.create({ customer, package })
    return res.json({ messsage: "Customer Orders Placed Successfully" })
})
exports.fetchCustomerAddress = asyncHandler(async (req, res) => {
    const result = await CustomerAddress
        .find({ customer: req.user })
        .populate("customer")
        .populate("city")
    return res.json({ messsage: "Fetch Orders Success", result })
})
exports.rescheduleOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { customer, package, location, city, schedule, } = req.body
    if (!validator.isMongoId(orderId)) {
        return res.status(400).json({ messsage: "Invalid Order Id", error: "Invalid Order Id" })
    }
    await Orders.findByIdAndUpdate(orderId, { customer, package, location, city, schedule, })
    return res.json({ messsage: "Orders Update Success" })
})
exports.cancleOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { customer, package, test, employee, location, city, schedule, } = req.body
    const { calcleReasone } = req.body
    const { isError, error } = checkEmpty(calcleReasone)
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(orderId)) {
        return res.status(400).json({ messsage: "Invalid Order Id", error: "Invalid Order Id" })
    }
    await Orders.findByIdAndUpdate(orderId, { customer, package, test, employee, location, city, schedule, })
    return res.json({ messsage: "Orders Update Success" })
})

// medical

exports.placeMedicalOrder = asyncHandler(async (req, res) => {
    const { customer, city, location, mrp, sellingPrice } = req.body;
    const { isError, error } = checkEmpty({ customer, city, location, mrp, sellingPrice });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }

    if (!validator.isMongoId(customer)) {
        return res.status(400).json({ message: "Invalid Customer Id", error: "Invalid Customer Id" });
    }
    const result = await Medical.findById(req.user);
    await sendEmail({
        to: result.email,
        subject: "Welcome to Medical Lab SAAS",
        message: `
            <h1>${result.name}, Welcome to Medical Lab SAAS</h1>
            <p>Your Medical Order Details are ${package}</p>
        `
    });

    await MedicalOrder.create({ medical: req.user, location, city, mrp, sellingPrice });

    return res.json({ message: "Medical Orders Placed Successfully" });
});
exports.getMedicalOrderDetails = asyncHandler(async (req, res) => {
    const { medicalId } = req.params
    const result = await MedicalOrder.findOne({ _id: medicalId })
    return res.json({ messsage: "Fetch All MedicalOrder Success", result })
})
exports.getAllMedicalOrders = asyncHandler(async (req, res) => {
    const result = await MedicalOrder.find()
    return res.json({ messsage: "get All MedicalOrder Success", result })
})
exports.cancelMedicalOrder = asyncHandler(async (req, res) => {
    const { medicalId } = req.params
    console.log(req.body);
    const { reason } = req.body
    const { isError, error } = checkEmpty(reason)
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }

    await MedicalOrder.findByIdAndUpdate(req.params.medicalId, { cancleReason: reason })
    return res.json({ messsage: "MedicalOrder Update Success" })
})
exports.addMedicalOder = asyncHandler(async (req, res) => {
    medicalImageUpload(req, res, async err => {
        if (err) {
            return res.status(400).json({ message: err.message || "unable to upload file" })
        }
        console.log(req.files)

        const arr = []
        for (const item of req.files) {
            arr.push(item.filename)
        }
        await MedicalOrder.create({ name: req.body.name, image: arr })
        res.status(201).json({ message: "add medcial precetion create success" })
    })
})

exports.bookDoctorAppointment = asyncHandler(async (req, res) => {
    const { doctorId, schedule, time, address } = req.body
    const customerId = req.user

    const appointment = await DoctorAppointment.create({
        customer: customerId,
        doctor: doctorId,
        address: address,
        schedule,
        time
    })

    res.status(201).json({ message: "Appointment booked successfully", appointment })
})



exports.findDoctor = asyncHandler(async (req, res) => {
    console.log("Search Value:", req.body.search); // Debugging search value

    const searchValue = req.body.search;

    const regex = new RegExp(searchValue, 'i');

    console.log("Regex:", regex);

    const numericSearchValue = isNaN(searchValue) ? searchValue : Number(searchValue);

    try {
        const result = await Doctor.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $match: {
                    $or: [
                        { hospitalName: { $regex: regex } },
                        { email: { $regex: regex } },
                        { mobile: { $regex: regex } },
                        { degree: { $regex: regex } },
                        { hospitalAddress: { $regex: regex } },
                        { hospitalContact: { $regex: regex } },
                        { name: { $regex: regex } },
                        { "category.name": { $regex: regex } },
                        { experience: { $eq: numericSearchValue } }
                    ]
                }
            }
        ]);

        if (result.length === 0) {
            console.log("No doctors found with the given search criteria.");
        } else {
            console.log("Doctors found:", result);
        }

        res.json({ message: "Find Success", result });

    } catch (error) {
        console.error("Error occurred while searching for doctors:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

exports.fetchAllDoctor = asyncHandler(async (req, res) => {
    const result = await Doctor.find()
    return res.json({ message: "Doctor Fetch Success", result })
})

exports.FetchCategory = asyncHandler(async (req, res) => {
    const result = await Category.find()
    return res.json({ message: "Categeory Fetch Success", result })
})
exports.fetchDoctorDetails = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const result = await Doctor.findById(doctorId)
    return res.json({ messsage: "Fetch Doctor Details Success", result })
})