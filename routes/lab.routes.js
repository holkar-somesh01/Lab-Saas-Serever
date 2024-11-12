const router = require("express").Router()
const lab = require("./../controllers/lab.controller")

router
    .post("/register-employee", lab.registerEmployee)
    .get("/fetch-employee", lab.getAllEmployee)

    .get("/fetch-employee-details/:employeeId", lab.getEmployeeDetails)
    .put("/update-employee/:employeeId", lab.updateEmployee)
    .put("/activate-employee/:employeeId", lab.activateEmployee)
    .put("/deactivate-employee/:employeeId", lab.deActivateEmployee)

    // ORDERS
    .get("/fetch-orders", lab.getAllOrders)
    .get("/fetch-order-details/:orderId", lab.getOrderDetails)

    // ORDER ASSIGN
    .put("/assign-employee/:orderId", lab.assignOrderToEmployee)
    .put("/change-assign-employee/:orderId", lab.changeAssignOrderToEmployee)
//
module.exports = router