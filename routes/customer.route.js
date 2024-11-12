const router = require("express").Router()
const { customerProtected } = require("../middleware/protected")
const customerController = require("./../controllers/customer.controller")

router
    .get("/fetch-customer-profile", customerProtected, customerController.fetchCustomerDetails)
    .post("/update-profile", customerProtected, customerController.updateCustomerDetails)
    .post("/place-order", customerProtected, customerController.placeOrder)
    .get("/fetch-adress", customerController.fetchCustomerAddress)
    .get("/fetch-orders", customerController.fetchOrders)
    .put("/reschedule-order/:orderId", customerController.rescheduleOrder)
    .put("/cancle-order/:orderId", customerController.cancleOrder)

    // medical
    .post("/placeMedicalOrder", customerController.placeMedicalOrder)
    .get("/getMedical-Order-Details/:medicalId", customerController.getMedicalOrderDetails)
    .get("/get-Medical-Order", customerController.getAllMedicalOrders)
    .put("/cancel-Medical-Order/:medicalId", customerController.cancelMedicalOrder)
    .post("/add-Medical-Order", customerController.addMedicalOder)
    .post("/find-doctor", customerController.findDoctor)
    .get("/fetch-all-doctor", customerController.fetchAllDoctor)
    .post("/book-doctor-appointment", customerController.bookDoctorAppointment)
    .get("/fetch-category", customerController.FetchCategory)
    .get("/fetch-doctor-details/:doctorId", customerController.fetchDoctorDetails)

module.exports = router