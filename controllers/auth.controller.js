const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcrypt")
const { nanoid } = require("nanoid")
const jwt = require("jsonwebtoken")
const { checkEmpty } = require("../utils/handleEmpty")
const sendEmail = require("../utils/email")
const SuperAdmin = require("../models/SuperAdmin")
const cityAdmin = require("../models/CityAdmin")
const Lab = require("../models/Lab")
const Employee = require("../models/Employee")
const { OAuth2Client } = require("google-auth-library")
const Customer = require("../models/Customer")
const Doctor = require("../models/Doctor")
const Medical = require("../models/Medical")




exports.registerSuperAdmin = asyncHandler(async (req, res) => {
    const { name, mobile, email, password } = req.body
    const hashPass = await bcrypt.hash(password, 10)
    await SuperAdmin.create({ name, mobile, email, password: hashPass })
    return res.json({ messsage: "Super Admin Create Success" })

})
exports.loginSuperAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    const { isError, error } = checkEmpty({ userName, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(userName) && !validator.isMobilePhone(userName.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await SuperAdmin.findOne({
        $or: [
            { email: userName },
            { mobile: userName }
        ]
    })

    if (!isFound) {
        return res.status(400).json({
            messsage: " Email Or Mobile is not Found",
            error: " Email Or Mobile is not Found"
        })
    }

    const verify = await bcrypt.compare(password, isFound.password)
    if (!verify) {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: "Login Attempt Failed",
            message: 'Some one Tried to login'
        })
        return res.status(400).json({
            messsage: " Invalid Credentials",
            error: " Invalid Credentials"
        })
    }

    const OTP = nanoid(6)
    await SuperAdmin.findByIdAndUpdate(isFound._id, { otp: OTP, otpExpire: new Date(Date.now() + 1000 * 60 * 5) })

    await sendEmail({
        to: process.env.FROM_EMAIL,
        subject: "Login OTP",
        message: `Do not share This OTP with anyone :${OTP}`
    })
    res.json({ message: "OTP sent successfully" })

})
exports.verifySuperAdminOTP = asyncHandler(async (req, res) => {
    const { otp, userName } = req.body
    const { isError, error } = checkEmpty({ otp, userName })
    if (isError) {
        return res.status(400).json({ message: "Provide OTP and User Name", error: "Provide OTP and User Name" })
    }
    if (!validator.isEmail(userName) && !validator.isMobilePhone(userName.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await SuperAdmin.findOne({
        $or: [
            { email: userName },
            { mobile: userName }
        ]
    })

    if (!isFound) {
        return res.status(400).json({
            messsage: " Email Or Mobile is not Found",
            error: " Email Or Mobile is not Found"
        })
    }
    if (isFound.otpExpire < new Date(Date.now())) {
        await SuperAdmin.findByIdAndUpdate(isFound._id, { otp: "" })
        return res.json({ message: "OTP Expired, Login Again" })
    }
    if (isFound.otp !== otp) {
        return res.json({ message: "Invalid OTP, Retry" })
    }
    await SuperAdmin.findByIdAndUpdate(isFound._id, { otp: "" })

    const token = jwt.sign({ userId: isFound._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_EXPIRE })

    res.cookie("superAdmin", token, {
        httpOnly: true,
        maxAge: process.env.COOKIE_EXPIRE,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "Login Success", result: {
            _id: isFound._id,
            email: isFound.email,
            name: isFound.name,
            mobile: isFound.mobile,
            role: isFound.role,

        }
    })

})


//WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
exports.registerCustomer = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    const hashPass = await bcrypt.hash(password, 10)
    await Customer.create({ mobile, password: hashPass })
    return res.json({ messsage: "Customer Register Success" })

})
exports.loginCustomer = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    console.log(req.body);

    const { isError, error } = checkEmpty({ mobile, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await Customer.findOne({ mobile })
    console.log(isFound);

    if (!isFound) {

        return res.status(400).json({
            messsage: "  Mobile is not Found",
            error: "  Mobile is not Found"
        })
    }
    const verify = await bcrypt.compare(password, isFound.password)
    if (!verify) {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: "Login Attempt Failed",
            message: 'Some one Tried to login'
        })
        return res.status(400).json({
            messsage: " Invalid Credentials",
            error: " Invalid Credentials"
        })
    }
    const token = jwt.sign({ userId: isFound._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_CITY_ADMIN_EXPIRE })

    res.cookie("customer", token, {
        httpOnly: true,
        maxAge: process.env.CITY_ADMIN_COOKIE_EXPIRE,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "Login Success", result: {
            _id: isFound._id,
            mobile: isFound.mobile,
            role: isFound.role,

        }
    })
})


//WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
exports.loginCityAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    const { isError, error } = checkEmpty({ userName, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(userName) && !validator.isMobilePhone(userName.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await cityAdmin.findOne({
        $or: [
            { email: userName },
            { mobile: userName }
        ]
    })
    if (!isFound) {
        return res.status(400).json({
            messsage: " Email Or Mobile is not Found",
            error: " Email Or Mobile is not Found"
        })
    }
    const verify = await bcrypt.compare(password, isFound.password)
    if (!verify) {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: "Login Attempt Failed",
            message: 'Some one Tried to login'
        })
        return res.status(400).json({
            messsage: " Invalid Credentials",
            error: " Invalid Credentials"
        })
    }
    const token = jwt.sign({ userId: isFound._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_CITY_ADMIN_EXPIRE })

    res.cookie("cityAdmin", token, {
        httpOnly: true,
        maxAge: process.env.CITY_ADMIN_COOKIE_EXPIRE,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "Login Success", result: {
            _id: isFound._id,
            email: isFound.email,
            name: isFound.name,
            mobile: isFound.mobile,
            role: isFound.role,

        }
    })
})


//QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
exports.loginLab = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    const { isError, error } = checkEmpty({ userName, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(userName) && !validator.isMobilePhone(userName.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await Lab.findOne({
        $or: [
            { email: userName },
            { mobile: userName }
        ]
    })
    if (!isFound) {
        return res.status(400).json({
            messsage: " Email Or Mobile is not Found",
            error: " Email Or Mobile is not Found"
        })
    }
    const verify = await bcrypt.compare(password, isFound.password)
    if (!verify) {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: "Login Attempt Failed",
            message: 'Some one Tried to login'
        })
        return res.status(400).json({
            messsage: " Invalid Credentials",
            error: " Invalid Credentials"
        })
    }
    const token = jwt.sign({ userId: isFound._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_CITY_ADMIN_EXPIRE })

    res.cookie("lab", token, {
        httpOnly: true,
        maxAge: process.env.CITY_ADMIN_COOKIE_EXPIRE,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "Login Success", result: {
            _id: isFound._id,
            email: isFound.email,
            name: isFound.name,
            mobile: isFound.mobile,
            role: isFound.role,

        }
    })
})


//CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
exports.loginEmployee = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    const { isError, error } = checkEmpty({ userName, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(userName) && !validator.isMobilePhone(userName.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await Employee.findOne({
        $or: [
            { email: userName },
            { mobile: userName }
        ]
    })
    if (!isFound) {
        return res.status(400).json({
            messsage: " Email Or Mobile is not Found",
            error: " Email Or Mobile is not Found"
        })
    }
    const verify = await bcrypt.compare(password, isFound.password)
    if (!verify) {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: "Login Attempt Failed",
            message: 'Some one Tried to login'
        })
        return res.status(400).json({
            messsage: " Invalid Credentials",
            error: " Invalid Credentials"
        })
    }
    const token = jwt.sign({ userId: isFound._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_CITY_ADMIN_EXPIRE })

    res.cookie("employee", token, {
        httpOnly: true,
        maxAge: process.env.CITY_ADMIN_COOKIE_EXPIRE,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: "Login Success", result: {
            _id: isFound._id,
            email: isFound.email,
            name: isFound.name,
            mobile: isFound.mobile,
            role: isFound.role,

        }
    })
})
exports.logout = asyncHandler(async (req, res) => {
    const { user } = req.body
    res.clearCookie(user)

    res.json({ message: "User Logout Success", result: user })

})


//OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
exports.continueWithGoogle = asyncHandler(async (req, res) => {
    const { credential } = req.body
    console.log(req.body);

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const verify = await client.verifyIdToken({ idToken: credential })
    if (!verify) {
        return res.sendStatus(401).json({ message: "Unable to verify token" })
    }
    const { name, email, picture } = verify.payload
    const result = await Customer.findOne({ email })
    if (result) {
        //LOGIN
        const token = jwt.sign({ userId: result._id },
            process.env.JWT_KEY,
        )

        res.cookie("customer", token, {
            httpOnly: true,
            maxAge: process.env.CITY_ADMIN_COOKIE_EXPIRE,
            secure: process.env.NODE_ENV === "production"
        })
        res.json({
            message: "Customer Login Success",
            result: {
                _id: result._id,
                email: result.email,
                name: result.name,
                mobile: result.mobile,
                role: result.role,
            }

        })
    } else {
        //REGISTER
        const result = await Customer.create({ name, email, avtar: picture })

        res.json({
            message: "Customer Register Success",
            result: {
                _id: result._id,
                email: result.email,
                name: result.name,
                mobile: result.mobile,
                role: result.role,
            }

        })
    }
})
// doctor oauth
exports.continueWithGoogleDoctor = asyncHandler(async (req, res) => {
    const { credential } = req.body
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const verify = await client.verifyIdToken({ idToken: credential })
    if (!verify) {
        return res.sendStatus(401).json({ message: "Unable to verify token" })
    }
    const { name, email, image } = verify.payload
    const result = await Doctor.findOne({ email })
    if (result) {
        //LOGIN
        const token = jwt.sign({ userId: result._id },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        )

        res.cookie("doctor", token, {
            httpOnly: true,
            maxAge: 604800,
            secure: process.env.NODE_ENV === "production"
        })
        res.json({
            message: "Doctor Login Success",
            result: {
                _id: result._id,
                email: result.email,
                name: result.name,
                mobile: result.mobile,
                role: result.role,
            }

        })
    } else {
        //REGISTER
        const result = await Doctor.create({ name, email, drImage: image })

        res.json({
            message: "Doctor Register Success",
            result: {
                _id: result._id,
                email: result.email,
                name: result.name,
                mobile: result.mobile,
                role: result.role,
            }

        })
    }
})
//medical
exports.medicalContinueWithGoogle = asyncHandler(async (req, res) => {
    const { credential } = req.body
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const verify = await client.verifyIdToken({ idToken: credential })
    if (!verify) {
        return res.sendStatus(401).json({ message: "Unable to verify token" })
    }
    const { name, email, picture } = verify.payload
    const result = await Medical.findOne({ email })
    if (result) {
        //LOGIN
        const token = jwt.sign({ userId: result._id },
            process.env.JWT_KEY,
        )

        res.cookie("medical", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        res.json({
            message: "Medical Login Success",
            result: {
                _id: result._id,
                email: result.email,
                name: result.name,
                mobile: result.mobile,
                role: result.role,
            }

        })
    } else {
        //REGISTER
        const result = await Medical.create({ name, email, avtar: picture })

        res.json({
            message: "Medical Register Success",
            result: {
                _id: result._id,
                email: result.email,
                name: result.name,
                mobile: result.mobile,
                role: result.role,
            }

        })
    }
})

exports.loginDoctor = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    const { isError, error } = checkEmpty({ userName, password })
    if (isError) {
        return res.status(400).json({ messsage: "All Feilds Required", error })
    }
    if (!validator.isEmail(userName) && !validator.isMobilePhone(userName.toString(), "en-IN")) {
        return res.status(400).json({
            messsage: "Invalid Email Or Mobile",
            error: "Invalid Email Or Mobile"
        })
    }
    const isFound = await Doctor.findOne({
        $or: [
            { email: userName },
            { mobile: userName }
        ]
    })
    if (!isFound) {
        return res.status(400).json({
            messsage: " Email Or Mobile is not Found",
            error: " Email Or Mobile is not Found"
        })
    }
    const verify = await bcrypt.compare(password, isFound.password)
    if (!verify) {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: "Login Attempt Failed",
            message: 'Some one Tried to login'
        })
        return res.status(400).json({
            messsage: " Invalid Credentials",
            error: " Invalid Credentials"
        })
    }
    const token = jwt.sign({ userId: isFound._id },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_DOCTOR_EXPIRE })

    res.cookie("doctor", token, {
        httpOnly: true,
        maxAge: process.env.COOKIE_EXPIRE,
        secure: process.env.NODE_ENV === "production"
    })

    res.json({
        message: " Doctor Login Success", result: {
            _id: isFound._id,
            email: isFound.email,
            name: isFound.name,
            mobile: isFound.mobile,
            role: isFound.role,

        }
    })
})
