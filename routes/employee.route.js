const router = require("express").Router()
const employee = require("./../controllers/employee.controller")

router
    // ORDERS
    .get("/fetch-orders", employee.getAllOrders)
    .get("/fetch-order-details/:orderId", employee.getOrderDetails)
    .put("/sample-collection/:orderId", employee.sampleCollectedStatus)


//
module.exports = router