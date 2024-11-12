const jwt = require("jsonwebtoken")

exports.cityAdminProtected = (req, res, next) => {
    const cityAdmin = req.cookies.cityAdmin
    if (!cityAdmin) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(cityAdmin, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}
exports.superAdminProtected = (req, res, next) => {
    const superAdmin = req.cookies.superAdmin
    if (!superAdmin) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(superAdmin, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}
exports.labProtected = (req, res, next) => {
    const lab = req.cookies.lab
    if (!lab) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(lab, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}
exports.employeeProtected = (req, res, next) => {
    const employee = req.cookies.employee
    if (!employee) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(employee, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}
exports.customerProtected = (req, res, next) => {
    const customer = req.cookies.customer
    if (!customer) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(customer, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}
exports.doctorProtected = (req, res, next) => {
    const doctor = req.cookies.doctor
    if (!doctor) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(doctor, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}

exports.medicalProtected = (req, res, next) => {
    console.log(req.cookies)
    const medical = req.cookies.medical
    if (!medical) {
        return res.status(401).json({ message: "No cookie found" })
    }
    jwt.verify(medical, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            return res.status(500).json({ message: err.message || "Invalid Token" })
        }
        req.user = decode.userId
        next()
    })

}