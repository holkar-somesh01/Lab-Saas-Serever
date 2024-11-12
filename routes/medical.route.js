const router = require("express").Router()
const medicalController = require("./../controllers/medical.controller")
router
    .put("/update-medical/:medicalId", medicalController.updateMedical)
    .get("/getAll-medical-orders", medicalController.getAllMedicalOrders)
    .put("/update-medical-orders/:medicalId", medicalController.updateMedicalQuotation)

module.exports = router