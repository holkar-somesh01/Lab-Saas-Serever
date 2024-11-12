const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const logoStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn)
    },

})
const customerAvtarStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn)
    }
})
const heroStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn)
    },

})

const labAvatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/lab"
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn);
    }
})

const doctorAvatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/doctor"
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn);
    }
})
const doctorSpecialityStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = "uploads/drSpeciality"
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn);
    }

})

const medicalImageStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname))
    },
    destination: (req, file, cb) => {
        if (!fs.existsSync("gallery")) {
            fs.mkdirSync("gallery")
        }
        cb(null, "gallery")
    },
})

const doctorphotoStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn);
    }
})
const categoryphotoStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fn = uuid() + ext
        cb(null, fn);
    }
})
const categoryphotoupload = multer({ storage: categoryphotoStorage }).single("photo")
const doctorphotoupload = multer({ storage: doctorphotoStorage }).single("photo")
const logoUpload = multer({ storage: logoStorage }).single("logo")
const heroUpload = multer({ storage: heroStorage }).single("hero")
const labAvatarUpload = multer({ storage: labAvatarStorage }).single("avatar")
const doctorAvatarUpload = multer({ storage: doctorAvatarStorage }).single("drImage")
const doctorSpecialityUpload = multer({ storage: doctorSpecialityStorage }).single("drSpecilaity")
// mutipleimages
const medicalImageUpload = multer({ storage: medicalImageStorage }).array("image", 5)

const customerAvatarUpload = multer({ storage: customerAvtarStorage }).single("avatar")

module.exports = {
    logoUpload,
    heroUpload,
    labAvatarUpload,
    doctorAvatarUpload,
    doctorSpecialityUpload,
    medicalImageUpload,
    customerAvatarUpload,
    doctorphotoupload,
    categoryphotoupload
} 