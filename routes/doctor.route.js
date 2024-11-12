const router = require("express").Router()
const doctor = require("./../controllers/doctor.controller.js")

router
    .get("/fetch-doctor-details/:doctorId", doctor.fetchDoctorDetails)
    .get("/fetch-default-images", doctor.getDefaultImages)
    .put("/update-doctor-details", doctor.updateDoctor)
    .put("/update-doctor-details", doctor.updateProfile)
    .get("/fetch-fees", doctor.fetchAllFees)
    .post("/create-drFees", doctor.createDrFees)
    .put("/update-drFees/:drFeesId", doctor.updateFees)
    .delete("/delete-drFees/:drFeesId", doctor.deleteFees)

    .get("/fetch-doctors-city", doctor.fetchDoctorCity)

module.exports = router