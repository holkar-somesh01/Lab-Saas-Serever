const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/handleEmpty")
const CityAdmin = require("../models/CityAdmin")
const CustomerPackages = require("../models/CustomerPackages")
const Company = require("../models/Company")
const { logoUpload, heroUpload, labAvatarUpload, doctorSpecialityUpload, doctorphotoupload, categoryphotoupload } = require("../utils/upload")
const Test = require("../models/Test")
const bcrypt = require("bcrypt")
const sendEmail = require("../utils/email")
const fs = require("fs")
const path = require("path")
const Lab = require("../models/Lab")
const Employee = require("../models/Employee")
const LabLog = require("../models/LabLog")
const LabPackage = require("../models/LabPackage")
const Customer = require("../models/Customer")
const Orders = require("../models/Orders")
const QnA = require("../models/QnA")
const OrderHistory = require("../models/OrderHistory")
const DoctorSpeciality = require("../models/DoctorSpeciality")
const City = require("../models/City")
const Medical = require("../models/Medical")
const MedicalOrder = require("../models/MedicalOrder")

const cloudinary = require("./../utils/cloudinary.config")
const Doctor = require("../models/Doctor")
const Category = require("../models/Category")

//TODO: City Admin Start

exports.registerCityAdmin = asyncHandler(async (req, res) => {
    const { name, mobile, email, location, city } = req.body
    const { isError, error } = checkEmpty({ name, mobile, email, location, city })

    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ messsage: "Invalid Email", error: "Invalid Email" })
    }
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ messsage: "Invalid Mobile", error: "Invalid Mobile" })
    }
    const result = await CityAdmin.findOne({ email })
    if (result) {
        return res.status(400).json({ messsage: "Email Already Exist", error: "Email Already Exist" })
    }

    const pass = email.slice(0, 4) + mobile.toString().slice(6, 10)
    const hashPass = await bcrypt.hash(pass, 10)
    await sendEmail({
        to: email, subject: "Welcome to Lab SAAS", message: `
    <h1>${name},Welcome to Lab SAAS</h1>
    <p>Use this password for Login ${pass}</p>
    `

    })
    await CityAdmin.create({ name, mobile, email, location, city, password: hashPass })
    return res.json({ messsage: "Admin Create Success" })

})
exports.activateCityAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    const { isError, error } = checkEmpty({ adminId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(adminId)) {
        return res.status(400).json({ messsage: "Invalid Admin ID", error: "Invalid Package ID" })
    }
    await CityAdmin.findByIdAndUpdate(adminId, { active: true })
    return res.json({ messsage: "Admin Activate Success" })
})
exports.deActivateCityAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    const { reason } = req.body
    const { isError, error } = checkEmpty({ adminId, reason })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(adminId)) {
        return res.status(400).json({ messsage: "Invalid Admin ID", error: "Invalid Package ID" })
    }
    const result = await CityAdmin.findById(adminId)
    await sendEmail({
        to: result.email,
        subject: "⚠️ Lab SaaS Account Blocked",
        message: `Dear , ${result.name}, Your Account is blocked due to ${reason}.
        Get in Touch with Us to Activate Your Account.`
    })

    await CityAdmin.findByIdAndUpdate(adminId, { active: false, blockReason: reason })

    return res.json({ messsage: "Admin De-Activate Success" })
})
exports.updateCityAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    const { name, email, mobile, location, city, package } = req.body

    if (!validator.isMongoId(adminId)) {
        return res.status(400).json({ messsage: "Invalid Admin ID", error: "Invalid Package ID" })
    }
    await CityAdmin.findByIdAndUpdate(adminId, { name, email, mobile, location, city, package })
    return res.json({ messsage: "Admin Update Success" })
})
exports.dleteCityAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    const { isError, error } = checkEmpty({ adminId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(adminId)) {
        return res.status(400).json({ messsage: "Invalid Admin Id", error: "Invalid Admin Id" })
    }
    await CityAdmin.findByIdAndUpdate(adminId, { isDeleted: true })
    return res.json({ messsage: "Admin Acccount Delete Successful" })
})
exports.restoreCityAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    const { isError, error } = checkEmpty({ adminId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(adminId)) {
        return res.status(400).json({ messsage: "Invalid Admin Id", error: "Invalid Admin Id" })
    }
    await CityAdmin.findByIdAndUpdate(adminId, { isDeleted: false })
    return res.json({ messsage: "Admin Acccount Restore Successfully" })
})
exports.getAllCityAdmin = asyncHandler(async (req, res) => {
    const result = await CityAdmin.find()
    return res.json({ messsage: "Admin Fetch Successfully", result })
})
exports.getCityAdminDetails = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    if (!validator.isMongoId(adminId)) {
        return res.status(400).json({ messsage: "Invalid Admin Id", error: "Invalid Admin Id" })
    }
    const result = await CityAdmin.findById(adminId)
    return res.json({ messsage: "Fetch Admin Details Success", result })
})

//TODO: City Admin End



//TODO:  COMPANY CRUD START

exports.getAllCompany = asyncHandler(async (req, res) => {
    const result = await Company.find()
    return res.json({ messsage: "All Company Fetch Success", result })

})
exports.getCompanyDetails = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const result = await Company.findById(companyId)
    return res.json({ messsage: "Company Update Success", result })

})
exports.registerCompany = asyncHandler(async (req, res) => {

    logoUpload(req, res, async err => {
        if (err) {
            return res.status(400).json({ messsage: "Multr Error" + err.message })

        }
        const { name, desc } = req.body
        const { isError, error } = checkEmpty({ name, desc })
        if (isError) {
            return res.status(400).json({ messsage: "All Feilds Required", error })
        }
        const result = await Company.findOne({ name })
        if (result) {
            return res.json({
                messsage: "Company Already Registered with Us",
                error: "Company Already Registered with Us"
            })
        }
        if (!req.file) {
            return res.status(400).json({ messsage: "Logo Required" })
        }
        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        await Company.create({ name, desc, logo: secure_url })
        return res.json({ messsage: "Company Register Success" })

    })
})
exports.updateCompany = asyncHandler(async (req, res) => {
    logoUpload(req, res, async err => {
        const { companyId } = req.params
        const { name, desc } = req.body
        const result = await Company.findById(companyId)
        if (req.file) {
            // fs.unlinkSync(path.join(__dirname, "..", "uploads", "logo", result.logo))
            await cloudinary.uploader.destroy(path.basename(result.logo))
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await Company.findByIdAndUpdate(companyId, { name, desc, logo: secure_url })
        } else {

            await Company.findByIdAndUpdate(companyId, { name, desc })
        }
        return res.json({ messsage: "Company Update Success", result })
    })
})
exports.deleteCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    await Company.findByIdAndUpdate(companyId, { isDeleted: true })
    return res.json({ messsage: "Company Delete Success" })

})

//TODO:  COMPANY CRUD END

//TODO:  CUSTOMER PACKAGE CRUD START
exports.createCustomerPackage = asyncHandler(async (req, res) => {
    console.log("createCustomerPackage--------------------------", req.body);

    heroUpload(req, res, async err => {
        if (err) {

            return res.status(400).json({ messsage: "Multer Reeor" + err.message })
        }

        const { name, amount, mrp, desc, company, test, parameter, rating, tat } = req.body
        const { isError, error } = checkEmpty({ name, amount, mrp, desc, company, test })
        if (isError) {
            return res.status(400).json({ messsage: "All Feilds Required", error })
        }
        if (!validator.isMongoId(company)) {
            return res.status(400).json({ messsage: "Invalid Company ID", error: "Invalid Company ID" })
        }
        if (!req.file) {
            return res.status(400).json({ messsage: "Hero Image Required" })
        }
        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        await CustomerPackages.create({
            name,
            amount,
            mrp,
            desc,
            test,
            parameter,
            rating,
            tat,
            company,
            hero: secure_url
        })
        return res.json({ messsage: "Customer Package Create Success" })
    })

})

exports.getAllCustomerPackage = asyncHandler(async (req, res) => {
    const result = await CustomerPackages.find().populate("company")
    return res.json({ messsage: "Customer Package Activate Success", result })
})
exports.getCustomerPackageDetails = asyncHandler(async (req, res) => {
    const { packageId } = req.params
    const result = await CustomerPackages.findById(packageId)
    return res.json({ messsage: "Customer Package Details Success", result })
})
exports.activateCustomerPackage = asyncHandler(async (req, res) => {
    const { packageId } = req.params
    const { isError, error } = checkEmpty({ packageId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(packageId)) {
        return res.status(400).json({ messsage: "Invalid Package ID", error: "Invalid Package ID" })
    }
    await CustomerPackages.findByIdAndUpdate(packageId, { active: true })
    return res.json({ messsage: "Customer Package Activate Success" })
})
exports.updateCustomerPackage = asyncHandler(async (req, res) => {
    heroUpload(req, res, async err => {

        const { packageId } = req.params
        const { name, amount, mrp, desc, company } = req.body
        const result = await CustomerPackages.findById(packageId)
        if (req.file) {
            await cloudinary.uploader.destroy(path.basename(result.hero))
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await CustomerPackages.findByIdAndUpdate(packageId, { name, amount, mrp, desc, company, hero: secure_url })
        } else {
            await CustomerPackages.findByIdAndUpdate(packageId, { name, amount, mrp, desc, company })

        }
        return res.json({ messsage: "Customer Package Update Success" })
    })
})
exports.deActivateCustomerPackage = asyncHandler(async (req, res) => {
    const { packageId } = req.params
    const { isError, error } = checkEmpty({ packageId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(packageId)) {
        return res.status(400).json({ messsage: "Invalid Package ID", error: "Invalid Package ID" })
    }
    await CustomerPackages.findByIdAndUpdate(packageId, { active: false })
    return res.json({ messsage: "Customer Package De-Activate Success" })
})
//TODO:  CUSTOMER PACKAGE CRUD END


//TODO:  CUSTOMER TEST CRUD START

exports.getAllTests = asyncHandler(async (req, res) => {
    const result = await Test.find()
    return res.json({ messsage: "All Company Fetch Success", result })

})
exports.createTest = asyncHandler(async (req, res) => {
    const { name, amount, mrp, desc, } = req.body
    const { isError, error } = checkEmpty({ name, amount, mrp, desc, })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    const result = await Test.findOne({ name })
    if (result) {
        return res.status(400).json({ messsage: "Test Name Already Registered with us", error: "Test Name Already Registered with us" })
    }
    await Test.create({ name, amount, mrp, desc })
    return res.json({ messsage: "Test Create Success" })

})
exports.updateTest = asyncHandler(async (req, res) => {
    const { testId } = req.params
    const { name, amount, mrp, desc, } = req.body
    await Test.findByIdAndUpdate(testId, { name, amount, mrp, desc })
    return res.json({ messsage: "Test Update Success" })

})
exports.deleteTest = asyncHandler(async (req, res) => {
    const { testId } = req.params
    await Test.findByIdAndDelete(testId)
    return res.json({ messsage: "Test Delete Success" })

})
exports.activateTest = asyncHandler(async (req, res) => {
    const { testId } = req.params
    const { isError, error } = checkEmpty({ testId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(testId)) {
        return res.status(400).json({ messsage: "Invalid Test ID", error: "Invalid Test ID" })
    }
    await Test.findByIdAndUpdate(testId, { active: true })
    return res.json({ messsage: "Test Activate Success" })
})
exports.deActivateTest = asyncHandler(async (req, res) => {
    const { testId } = req.params
    const { isError, error } = checkEmpty({ testId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(testId)) {
        return res.status(400).json({ messsage: "Invalid Test ID", error: "Invalid Test ID" })
    }
    await Test.findByIdAndUpdate(testId, { active: false })
    return res.json({ messsage: "Test De-Activate Success" })
})

//TODO:  CUSTOMER TEST CRUD END

//TODO:  FETCH ALL LAB START

exports.getAllLabs = asyncHandler(async (req, res) => {
    const result = await Lab.find().populate("package").populate("admin")
    console.log(result);

    return res.json({ messsage: "Lab Fetch Success", result })

})
exports.getLabDetails = asyncHandler(async (req, res) => {
    const { labId } = req.params
    const result = await Lab.findById(labId)
    return res.json({ messsage: "Lab Details Fetch Success", result })

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
    await LabLog.create({ ...req.body, activateBy: req.user, actvateByModal: "superAdmin" })// "superAdmin" from enum of LabLog Modal
    return res.json({ messsage: "Lab Activate Success" })
})
exports.updateSuperLab = asyncHandler(async (req, res) => {
    labAvatarUpload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error processing file upload' });
        }
        const { labId } = req.params;
        const { name, desc } = req.body;
        console.log(req.file)
        try {
            const result = await Lab.findById(labId);
            if (!result) {
                return res.status(400).json({ message: 'Lab not found' });
            }
            if (req.file) {
                // Delete old file
                const oldLogoPath = path.join(__dirname, '..', 'uploads', 'lab', result.avatar);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                }

                await Lab.findByIdAndUpdate(labId, { name, desc, avatar: req.file.filename });
            } else {

                await Lab.findByIdAndUpdate(labId, { name, desc });
            }

            return res.json({ message: 'Customer update file successful' });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating company', error });
        }
    });
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
    await LabLog.create({ ...req.body, deactivateBy: req.user, deactvateByModal: "superAdmin" })// "superAdmin" from enum of LabLog Modal
    return res.json({ messsage: "Lab De-Activate Success" })
})
//TODO:  FETCH ALL LAB END



//TODO:  FETCH ALL LAB PACKAGE START
exports.fetchLabPackages = asyncHandler(async (req, res) => {
    const result = await LabPackage.find().populate("admin")
    return res.json({ messsage: "Lab Fetch Success", result })

})

//TODO:  FETCH ALL LAB PACKAGE END


//TODO:  FETCH ALL EMPLOYEE START

exports.getAllEmployee = asyncHandler(async (req, res) => {
    const result = await Employee.find().populate("lab")
    return res.json({ messsage: "Fetch All Employee Success", result })
})
exports.getEmployeeDetails = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findById(employeeId)
    return res.json({ messsage: "Fetch Employee Details Success Success", result })
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
exports.updateEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const { name, email, mobile } = req.body
    const { isError, error } = checkEmpty({ employeeId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(employeeId)) {
        return res.status(400).json({ messsage: "Invalid Employee ID", error: "Invalid Employee ID" })
    }
    await Employee.findByIdAndUpdate(employeeId, { name, email, mobile })
    return res.json({ messsage: "Employee Update Success" })
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
//TODO:  FETCH ALL EMPLOYEE END



//TODO:CUSTOMER START

exports.getAllCustomers = asyncHandler(async (req, res) => {
    const result = await Customer.find().populate("lab")
    return res.json({ messsage: "Fetch All Employee Success", result })
})
exports.getCustomerDetails = asyncHandler(async (req, res) => {
    const { customerId } = req.params
    const result = await Customer.findById(customerId)
    return res.json({ messsage: "Fetch Employee Details Success Success", result })
})
exports.activateCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params
    const { isError, error } = checkEmpty({ customerId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(customerId)) {
        return res.status(400).json({ messsage: "Invalid Employee ID", error: "Invalid Employee ID" })
    }
    await Customer.findByIdAndUpdate(customerId, { active: true })
    return res.json({ messsage: "Employee Activate Success" })
})
exports.updateCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params
    const { name, email, mobile } = req.body
    const { isError, error } = checkEmpty({ customerId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(customerId)) {
        return res.status(400).json({ messsage: "Invalid Employee ID", error: "Invalid Employee ID" })
    }
    await Customer.findByIdAndUpdate(customerId, { name, email, mobile })
    return res.json({ messsage: "Employee Update Success" })
})
exports.deactivateCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.params
    const { reason } = req.body
    const { isError, error } = checkEmpty({ customerId, reason })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(customerId)) {
        return res.status(400).json({ messsage: "Invalid Employee ID", error: "Invalid Employee ID" })
    }
    await Customer.findByIdAndUpdate(customerId, { active: false, blockReason: reason })
    return res.json({ messsage: "Employee De-Activate Success" })
})

//TODO:CUSTOMER END



//TODO: ORDERS START

exports.getAllOrders = asyncHandler(async (req, res) => {
    const result = await Orders.find()
    // .populate("package")
    // .populate("employee")
    // .populate("customer")
    // .populate("admin")
    return res.json({ messsage: "Orders Fetch Success", result })

})
exports.getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Orders.findById(orderId)
    return res.json({ messsage: "Order Details Fetch Success", result })

})


//TODO: ORDERS END

//TODO: QNA START

exports.fetchQna = asyncHandler(async (req, res) => {
    const result = await QnA.find().populate("package")
    return res.json({ messsage: "QNA Fetch Success", result })
})
exports.createQna = asyncHandler(async (req, res) => {
    const { question, answer, package } = req.body
    await QnA.create({ question, answer, package })
    return res.json({ messsage: "QNA Create Success" })
})

exports.updateQna = asyncHandler(async (req, res) => {
    const { qnaId } = req.params
    const { question, answer, package } = req.body
    await QnA.findByIdAndUpdate(qnaId, { question, answer, package })
    return res.json({ messsage: "QNA Update Success" })
})
exports.deleteQna = asyncHandler(async (req, res) => {
    const { qnaId } = req.params
    await QnA.findByIdAndDelete(qnaId)
    return res.json({ messsage: "QNA Delate Success" })
})

//TODO: QNA END


//TODO: ASSIGN TO ADMIN START

exports.assignOrderToAdmin = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { admin } = req.body
    console.log(req.body);
    console.log(req.params);
    await OrderHistory.create({ order: orderId, admin })
    return res.json({ messsage: "Admin Assign Success" })
})

//TODO: ASSIGN TO ADMIN END


//TODO: Doctor Start Harsh

exports.getAllDoctors = asyncHandler(async (req, res) => {
    const result = await Doctor.find()
    return res.json({ messsage: "Doctors Fetch Successfully", result })
})
exports.getDoctorDetails = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Doctor Id", error: "Invalid Doctor Id" })
    }
    const result = await Doctor.findById(doctorId)
    return res.json({ messsage: "Fetch Doctor Details Success", result })
})

// add Category
exports.addCategory = asyncHandler(async (req, res) => {
    categoryphotoupload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "multer error" })
        }
        const { name, desc } = req.body
        const { isError, error } = checkEmpty({ name, desc })
        if (isError) {
            return res.status(400).json({ messsage: "All Feilds Required", error })
        }
        let secure
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            secure = secure_url
        }

        await Category.create({ name, desc, photo: secure_url })
        return res.json({ messsage: "addCategory create success" })
    })
})
exports.UpdateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const { name, desc } = req.body
    const { isError, error } = checkEmpty({ name, desc, })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    await Category.findByIdAndUpdate(categoryId, { name, desc })
    return res.json({ messsage: "Category Update success" })
})
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    await Category.findByIdAndUpdate(categoryId, { isDeleted: true })
    return res.json({ messsage: "Category Delete success" })
})
exports.FetchCategory = asyncHandler(async (req, res) => {
    const result = await Category.find()
    return res.json({ message: "Categeory Fetch Success", result })
})
exports.restoreseDeleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const { isError, error } = checkEmpty({ categoryId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(categoryId)) {
        return res.status(400).json({ messsage: "Invalid Doctor Id", error: "Invalid Doctor Id" })
    }
    console.log(categoryId);

    await Category.findByIdAndUpdate(categoryId, { isDeleted: false })
    return res.json({ messsage: "Doctor Acccount Restore Successfully" })
})

// register doctor

// Doctor CRUD Start
exports.registerDoctor = asyncHandler(async (req, res) => {
    doctorphotoupload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Multer Error" })
        }
        const { name, email, degree, photo, mobile, category, experience, hospitalContact, hospitalAddress, hospitalName } = req.body
        const { isError, error } = checkEmpty({ name, email, degree, mobile })

        if (isError) {
            return res.status(400).json({ messsage: "All Feilds Required", error })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ messsage: "Invalid Email", error: "Invalid Email" })
        }
        if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
            return res.status(400).json({ messsage: "Invalid Mobile", error: "Invalid Mobile" })
        }
        const result = await Doctor.findOne({ email })
        if (result) {
            return res.status(400).json({ messsage: "Email Already Exist", error: "Email Already Exist" })
        }
        const pass = email.slice(0, 4) + mobile.toString().slice(6, 10)
        const hashPass = await bcrypt.hash(pass, 10)
        await sendEmail({
            to: email, subject: "Welcome to Lab SAAS", message: `
        <h1>${name},Welcome to Lab SAAS</h1>
        <p>Use this password for Login ${pass}</p>
        `
        })
        let secure
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            secure = secure_url
        }
        await Doctor.create({ name, email, degree, mobile, password: hashPass, photo: secure, category, experience, hospitalContact, hospitalAddress, hospitalName })
        return res.json({ messsage: "Doctor Register Success" })
    })
})
exports.deleteDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { isError, error } = checkEmpty({ doctorId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Doctor Id", error: "Invalid Doctor Id" })
    }
    await Doctor.findByIdAndUpdate(doctorId, { isDeleted: true })
    return res.json({ messsage: "Doctor Acccount Delete Successful." })
})
exports.restoredeleteDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { isError, error } = checkEmpty({ doctorId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Doctor Id", error: "Invalid Doctor Id" })
    }
    await Doctor.findByIdAndUpdate(doctorId, { isDeleted: false })
    return res.json({ messsage: "Doctor Acccount Restore Successfully" })
})

exports.activateDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { isError, error } = checkEmpty({ doctorId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Admin ID", error: "Invalid Doctor ID" })
    }
    await Doctor.findByIdAndUpdate(doctorId, { active: true })
    return res.json({ messsage: "Doctor Activate Success" })
})
exports.deactivateDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { reason } = req.body
    const { isError, error } = checkEmpty({ doctorId, reason })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Doctor ID", error: "Invalid Doctor ID" })
    }
    const result = await Doctor.findById(doctorId)
    await sendEmail({
        to: result.email,
        subject: "⚠️ Lab SaaS Account Blocked",
        message: `Dear , ${result.name}, Your Account is blocked due to ${reason}.
        Get in Touch with Us to Activate Your Account.`
    })

    await Doctor.findByIdAndUpdate(doctorId, { active: false, blockReason: reason })

    return res.json({ messsage: "Doctor De-Activate Success" })
})

exports.fetchAllDoctor = asyncHandler(async (req, res) => {
    const result = await Doctor.find()
    return res.json({ message: "Doctor Fetch Success", result })
})



// block doctor
exports.blockDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { reason } = req.body
    const { isError, error } = checkEmpty({ doctorId, reason })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Doctor ID", error: "Invalid Doctor ID" })
    }
    const result = await Doctor.findById(doctorId)
    await sendEmail({
        to: result.email,
        subject: "⚠️ Lab SaaS Account Blocked",
        message: `Dear , ${result.name}, Your Account is blocked due to ${reason}.
        Get in Touch with Us to Activate Your Account.`
    })

    await Doctor.findByIdAndUpdate(doctorId, { active: false, blockReason: reason })

    return res.json({ messsage: "Admin De-Activate Success" })
})
// unblock doctor
exports.unblockDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { isError, error } = checkEmpty({ doctorId })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(doctorId)) {
        return res.status(400).json({ messsage: "Invalid Doctor ID", error: "Invalid Doctor ID" })
    }
    await Doctor.findByIdAndUpdate(doctorId, { active: true })
    return res.json({ messsage: "Doctor Activate Success" })
})

exports.createDoctorSpeciality = asyncHandler(async (req, res) => {

    doctorSpecialityUpload(req, res, async err => {
        if (err) {
            return res.status(400).json({ messsage: "Multr Error" + err.message })
        }
        const { name } = req.body
        const { isError, error } = checkEmpty({ name })
        if (isError) {
            return res.status(400).json({ messsage: "All Feilds Required", error })
        }
        const result = await DoctorSpeciality.findOne({ name })
        console.log(result);
        if (result) {
            return res.json({
                messsage: "Speciality Already Registered with Us",
                error: "Speciality Already Registered with Us"
            })
        }
        await DoctorSpeciality.create({ name, image: req.file.filename || null })
        return res.json({ messsage: "Dr Speciality Create Success" })
    })
})
exports.fetchDoctorSpeciality = asyncHandler(async (req, res) => {
    const result = await DoctorSpeciality.find()
    return res.json({ messsage: "Doctors Speciality Fetch Successfully", result })
})
exports.createDoctorCity = asyncHandler(async (req, res) => {
    const { name } = req.body
    const result = await City.findOne({ name })
    if (result) {
        return res.status(400).json({ messsage: "City Already Registered", error: "City Already Registered" })
    }
    await City.create({ name })
    return res.json({ messsage: "Doctor City Create Success" })
})
exports.fetchDoctorCity = asyncHandler(async (req, res) => {
    const result = await City.find()
    return res.json({ messsage: "Doctors City Fetch Successfully", result })
})
//TODO: Doctor End

//TODO: Medical start KOMAL
exports.getAllSuperMedical = asyncHandler(async (req, res) => {
    const result = await Medical.find()

    return res.json({ messsage: "get All Super medical  Success", result })
})
exports.getAllSuperMedicalDeatils = asyncHandler(async (req, res) => {
    const { medicalId } = req.params
    const result = await Medical.findOne({ _id: medicalId })
    return res.json({ messsage: "Fetch All Super Medical Success", result })

})
exports.blockMedical = asyncHandler(async (req, res) => {
    const { medicalId } = req.params
    const { blockReason } = req.body
    const { isError, error } = checkEmpty(blockReason)
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMongoId(medicalId)) {
        return res.status(400).json({ messsage: "Invalid medical Id", error: "Invalid medical Id" })
    }
    await Medical.findByIdAndUpdate(medicalId, { active: false })
    return res.json({ messsage: "medialcal Update Success" })
})
exports.unblockMedical = asyncHandler(async (req, res) => {
    const { medicalId } = req.params;
    const medicalRecord = await Medical.findOne({ _id: medicalId });
    if (!medicalRecord) {
        return res.status(404).json({ message: 'Medical record not found' });
    }
    await Medical.findByIdAndUpdate(medicalId, { active: true })

    return res.json({ message: 'Medical record successfully unblocked', result });
});

// CRUD medical

//TODO: Medical end 