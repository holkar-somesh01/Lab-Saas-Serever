const router = require("express").Router()
const authController = require("./../controllers/auth.controller")

router
    .post("/super-admin/register", authController.registerSuperAdmin)
    .post("/customer/register", authController.registerCustomer)
    .post("/customer/login", authController.loginCustomer)
    .post("/super-admin/login", authController.loginSuperAdmin)
    .post("/super-admin/verify-otp", authController.verifySuperAdminOTP)
    .post("/city-admin/login", authController.loginCityAdmin)
    .post("/lab/login", authController.loginLab)
    .post("/employee/login", authController.loginEmployee)
    .post("/logout", authController.logout)
    .post("/doctor/login", authController.loginDoctor)
    .post("/customer/continue-with-google", authController.continueWithGoogle)
    .post("/medical/medicalContinueWithGoogle", authController.medicalContinueWithGoogle)
    .post("/doctor/continue-with-google-doctor", authController.continueWithGoogleDoctor)



module.exports = router